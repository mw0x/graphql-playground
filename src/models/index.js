
var { models } = require('../utils');

module.exports = models({

  Schedule: {
    title: String,
    description: String,
  },

  Entry: {
    scheduleId: String,
    type: String,
    title: String,
    description: String,
    startDate: Number,
    endDate: Number,
  },

  Tag: {
    scheduleEntryId: String,
    title: String,
  },

},{

  Schedule: 'schedules',

  Entry: 'entries',

  Tag: 'tags',

},
global);
