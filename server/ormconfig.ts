import config from './config'
import { ConnectionOptions } from 'typeorm'

const isProd = config.server.env === 'production'
const entitiesDir = 'server/models'
const migrationsDir = 'server/migrations'

const ormconfig: ConnectionOptions = {
  type: 'mysql',
  url: config.database.url,
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

export = ormconfig
