import indigo from '@material-ui/core/colors/indigo'
import green from '@material-ui/core/colors/green'
import { createMuiTheme } from '@material-ui/core/styles'

export default createMuiTheme({
  palette: {
    primary: {
      main: indigo[600]
    },
    secondary: {
      main: green[700]
    }
  }
})
