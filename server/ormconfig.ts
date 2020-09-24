import config from './config'

const isProd = process.env.NODE_ENV === 'production'
const entitiesDir = 'server/models'
const migrationsDir = 'server/migrations'

export = {
  type: 'mysql',
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASS,
  database: config.DB_NAME,
  synchronize: false,
  logging: config.DB_LOGGING,
  entities: [isProd ? `build/${entitiesDir}/**/*.js` : `${entitiesDir}/**/*.ts`],
  migrations: [isProd ? `build/${migrationsDir}/**/*.js` : `${migrationsDir}/**/*.ts`],
  subscribers: [],
  cli: {
    entitiesDir,
    migrationsDir
  }
}
