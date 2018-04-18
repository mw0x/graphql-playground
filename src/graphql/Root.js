
var {
  mixin,
  find,
  findOne,
  update,
  remove,
  resource,
  resources,
} = require('../utils');

mixin(Schedule, {
  entries: Schedule.hasMany(Entry)
})

mixin(Entry, {
  schedule: Entry.belongsTo(Schedule),
  tags: Entry.hasMany(Tag),
})

mixin(Tag, {
  entry: Tag.belongsTo(Entry),
})

module.exports = {

  ...resources(
    Schedule,
    Entry,
    Tag,
  ),

  schedules: find(Schedule),
  entries: find(Entry),
  tags: find(Tag),

}
