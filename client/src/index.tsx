import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import store from './store'
import theme from './app/theme'
import DateFnsUtils from '@date-io/date-fns'
import i18n from './plugins/i18n'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { locale } from './plugins/locale'
import './plugins/i18n'
import './index.css'

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale[i18n.language]}>
          <App />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)
