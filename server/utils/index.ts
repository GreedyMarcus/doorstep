import config from '../config'

export const isDevelopment = () => config.server.env === 'development'
export const isProduction = () => config.server.env === 'production'
