import config from './config'

const isProd = config.server.env === 'production'
const entitiesDir = 'server/models'
const migrationsDir = 'server/migrations'

export = {
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.pass,
  database: config.database.name,
  synchronize: false,
  logging: config.database.logging,
  entities: [isProd ? `build/${entitiesDir}/**/*.js` : `${entitiesDir}/**/*.ts`],
  migrations: [isProd ? `build/${migrationsDir}/**/*.js` : `${migrationsDir}/**/*.ts`],
  subscribers: [],
  cli: {
    entitiesDir,
    migrationsDir
  }
}
