

var express = require('express');

var mongoose = require('mongoose');

var graphqlHTTP = require('express-graphql');

module.exports = function server(mongoUri, schema, rootValue, graphiql, port) {

  var app = express();

  mongoose.connect(mongoUri);

  app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql,
  }));

  app.listen(port);

}
