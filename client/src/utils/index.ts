import config from '../app/config'
import i18n from '../plugins/i18n'
import DateFnsAdapter from '@date-io/date-fns'
import { locale } from '../plugins/locale'

export const isDevelopment = () => config.app.env === 'development'
export const isProduction = () => config.app.env === 'production'

export const getLocaleDateFormat = (date: Date) => {
  const dateAdapter = new DateFnsAdapter({ locale: locale[i18n.language] })
  return dateAdapter.format(date, 'yyyy-MM-dd hh:mm a')
}
