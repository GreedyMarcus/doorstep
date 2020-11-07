import config from '../config'

export const isDevelopment = () => config.server.env === 'development'
