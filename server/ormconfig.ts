import config from './config'
import { ConnectionOptions } from 'typeorm'
import { isDevelopment } from './utils'

const entitiesDir = 'server/models'
const migrationsDir = 'server/migrations'

const ormconfig: ConnectionOptions = {
  type: 'mysql',
  url: config.database.url,
  synchronize: false,
  logging: config.database.logging,
  entities: [isDevelopment() ? `${entitiesDir}/**/*.ts` : `build/${entitiesDir}/**/*.js`],
  migrations: [isDevelopment() ? `${migrationsDir}/**/*.ts` : `build/${migrationsDir}/**/*.js`],
  subscribers: [],
  cli: {
    entitiesDir,
    migrationsDir
  }
}

export = ormconfig
