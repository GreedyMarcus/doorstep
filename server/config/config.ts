import dotenv from 'dotenv'
dotenv.config()

export default {
  server: {
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5000,
    baseUrl: process.env.BASE_URL
  },
  database: {
    url: process.env.DB_URL,
    logging: process.env.DB_LOGGING === 'true',
    logger: process.env.DB_LOGGER || 'advanced-console'
  },
  auth: {
    tokenSecret: process.env.TOKEN_SECRET || 'secret',
    tokenExpiration: process.env.TOKEN_EXPIRATION || '3600s'
  },
  email: {
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    noreplyEmail: process.env.NOREPLY_EMAIL
  }
}
