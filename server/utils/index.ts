import config from '../config'

export const isDevelopment = () => config.server.env === 'development'
export const isProduction = () => config.server.env === 'production'

export const getTimestampFormat = (date: Date) => {
  return date
    .toISOString()
    .replace('T', ' ')
    .replace(/[^.]+$/, '000000')
}
