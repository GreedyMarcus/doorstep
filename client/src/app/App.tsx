import React from 'react'
import Login from '../pages/Login'
import ProtectedRoute from '../components/ProtectedRoute'
import useAppStyles from './useAppStyles'
import { CssBaseline } from '@material-ui/core'
import { Switch } from 'react-router-dom'

const App = () => {
  const classes = useAppStyles()

  return (
    <div className={classes.app}>
      <CssBaseline />
      <Switch>
        <ProtectedRoute exact path="/login" Component={Login} />
      </Switch>
    </div>
  )
}

export default App
