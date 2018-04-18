
var mongoose = require('mongoose');

function makeSchema(def) {

  return new mongoose.Schema(def);

}

function model(name, collection, def) {

  const model = mongoose.model(name, makeSchema(def), collection);

  model.belongsTo = function(model) {

    const idName = model.modelName.replace(/^(.{1})/, (a) => a.toLowerCase()) + 'Id';

    return function() {

      return findOne(model)({where: {id: this[idName]}});

    }

  }

  model.hasMany = function(model) {

    const idName = name.replace(/^(.{1})/, (a) => a.toLowerCase()) + 'Id';

    return function() {

      return find(model)({where: {[idName]: this._id}});

    }

  }

  return model;

}

function models(schemas, collections) {

  const models = {};

  for (let name in schemas) {

    const schema = schemas[name];

    const collection = collections[name];

    models[name] = model(name, collection, schema);

  }

  return models;

}

function mixin(model, props) {

  Object.assign(model, {_mixin: props})

}

function makeQuery(query, args) {

  let q = Object.assign({}, args, query);
  q['id'] && (q['_id'] = q['id']);
  delete q['id'];
  return q;

}

function applyMixin(model, items, args) {

  if (model._mixin) {

    const fun = typeof model._mixin === 'function';

    for (let item of items) {

      const mixin = fun ? model._mixin(args, item) : model._mixin;

      for (let i in mixin) {

        item[i] = typeof mixin[i] === 'function'
          ? mixin[i].bind(item, item, args)
          : mixin[i];

      }

    }

  }

}

function find(model) {

  return async function (args) {

    const items = await model.find(makeQuery({}, args.where));

    applyMixin(model, items, args);

    return items;

  }

}

function findOne(model) {

  return async function (args) {

    const item = await model.findOne(makeQuery({}, args.where));

    applyMixin(model, [item], args);

    return item;

  }

}

function update(model) {

  return async function(args) {

    const res = await model.update(makeQuery({}, args.where), args.update);

    if (!res.ok) {

      throw Error('Update operation failed on ' + model.modelName)

    }

    return !!res.n;

  }

}

function remove(model) {

  return async function(args) {

    const res = await model.remove(makeQuery({}, args.where));

    if (!res.ok) {

      throw Error('Remove operation failed on ' + model.modelName)

    }

    return !!res.n;

  }

}

function resource(model) {

  const { modelName } = model;

  return {
    ['create' + modelName]: ({input}) => new model(input).save(),
    ['get' + modelName]: findOne(model),
    ['update' + modelName]: update(model),
    ['remove' + modelName]: remove(model),
  }

}

function resources(...models) {

  let res = {};

  for (let model of models) {

    res = {
      ...res,
      ...resource(model),
    }

  }

  return res;

}

module.exports = {
  makeSchema,
  model,
  models,
  mixin,
  find,
  findOne,
  update,
  remove,
  resource,
  resources,
}
