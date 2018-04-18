
Object.assign(
  global,
  require('./models')
)

require('./Server')(
  'mongodb://localhost:27017/scheduler',
  require('./graphql/Schema'),
  require('./graphql/Root'),
  true,
  3001
)
