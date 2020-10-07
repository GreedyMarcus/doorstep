import dotenv from 'dotenv'
dotenv.config()

export default {
  server: {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000
  },
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    logging: process.env.DB_LOGGING,
    logger: process.env.DB_LOGGER || 'advanced-console'
  },
  auth: {
    tokenSecret: process.env.TOKEN_SECRET || 'secret',
    tokenExpiration: process.env.TOKEN_EXPIRATION || '3600s'
  }
}
