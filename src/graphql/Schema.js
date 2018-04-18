
var { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Schedule {
  id: ID!
  title: String!
  description: String
  entries: [Entry]
}

input ScheduleInput {
  title: String!
  description: String
}

input ScheduleQuery {
  id: String
  title: String
}

enum EntryType {
  DAILY
  WEEKLY
  MONTHLY
}

type Entry {
  schedule: Schedule!
  id: ID!
  type: EntryType!
  title: String!
  description: String
  startDate: Int!
  endDate: Int
  tags: [Tag]
}

input EntryInput {
  scheduleId: String!
  type: EntryType!
  title: String!
  description: String
  startDate: Int!
  endDate: Int
}

input EntryQuery {
  scheduleId: String
  type: EntryType
  title: String
  description: String
  startDate: Int
  endDate: Int
}

type Tag {
  entry: Entry
  id: ID!
  title: String!
}

input TagInput {
  scheduleEntryId: String!
  title: String!
}

type Mutation {

  createSchedule(input: ScheduleInput!): Schedule
  updateSchedule(where: ScheduleQuery!, update: ScheduleQuery!): Boolean
  removeSchedule(where: ScheduleQuery!): Boolean

  createEntry(input: EntryInput!): Entry
  updateEntry(where: EntryQuery!, update: EntryQuery!): Boolean
  removeEntry(where: EntryQuery!): Boolean

  createTag(input: TagInput!): Tag
  removeTag(id: String!): Boolean
}

type Query {
  schedules: [Schedule]
  getSchedule(where: ScheduleQuery!): Schedule
  getEntry(where: EntryQuery!): Entry
  getTag(id: String!): Tag
  entries: [Entry]
  tags: [Tag]
}

`)
