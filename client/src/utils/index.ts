import config from '../app/config'

export const isDevelopment = () => config.app.env === 'development'
export const isProduction = () => config.app.env === 'production'
