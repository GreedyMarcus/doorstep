import React from 'react'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from '../components/ProtectedRoute'
import ActionTracker from '../components/ActionTracker'
import { CssBaseline } from '@material-ui/core'
import { Switch } from 'react-router-dom'

const App = () => (
  <React.Fragment>
    <CssBaseline />
    <Switch>
      <ProtectedRoute exact path="/" Component={Dashboard} />
      <ProtectedRoute exact path="/login" noAuth Component={Login} />
      <ProtectedRoute exact path="/register" noAuth Component={Register} />
    </Switch>
    <ActionTracker />
  </React.Fragment>
)

export default App
