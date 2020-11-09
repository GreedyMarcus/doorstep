import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import store from './store'
import theme from './app/theme'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core'
import './plugins/i18n'
import './index.css'

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)
