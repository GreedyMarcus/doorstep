import config from './config'
import { ConnectionOptions } from 'typeorm'
import { isProduction } from './utils'

const entitiesDir = 'server/models'
const migrationsDir = 'server/migrations'

/**
 * TypeORM configuration object.
 */
const ormconfig: ConnectionOptions = {
  type: 'mysql',
  url: config.database.url,
  synchronize: false,
  logging: config.database.logging,
  entities: [isProduction() ? `build/${entitiesDir}/**/*.js` : `${entitiesDir}/**/*.ts`],
  migrations: [isProduction() ? `build/${migrationsDir}/**/*.js` : `${migrationsDir}/**/*.ts`],
  subscribers: [],
  cli: {
    entitiesDir,
    migrationsDir
  }
}

export = ormconfig
