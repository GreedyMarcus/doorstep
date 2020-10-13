import React from 'react'
import ReactDOM from 'react-dom'
import App from './app/App'
import theme from './app/theme'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
