import React from 'react'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from '../components/ProtectedRoute'
import { CssBaseline } from '@material-ui/core'
import { Switch } from 'react-router-dom'

const App = () => (
  <React.Fragment>
    <CssBaseline />
    <Switch>
      <ProtectedRoute exact path="/login" Component={Login} />
      <ProtectedRoute exact path="/register" Component={Register} />
    </Switch>
  </React.Fragment>
)

export default App
