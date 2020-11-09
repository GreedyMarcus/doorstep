import config from '../app/config'

export const isDevelopment = () => config.app.env === 'development'
