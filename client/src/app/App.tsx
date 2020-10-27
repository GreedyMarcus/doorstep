import React, { useEffect } from 'react'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ProtectedRoute from '../components/ProtectedRoute'
import ActionTracker from '../components/ActionTracker'
import { CssBaseline } from '@material-ui/core'
import { Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../store'
import { userTokenSelector, loadCurrentUser } from '../store/user'

const App = () => {
  const dispatch = useAppDispatch()
  const userToken = useSelector(userTokenSelector)

  useEffect(() => {
    if (userToken) {
      dispatch(loadCurrentUser(userToken))
    }
  }, [userToken])

  return (
    <React.Fragment>
      <CssBaseline />
      <Switch>
        <ProtectedRoute exact path="/" Component={Dashboard} />
        <ProtectedRoute exact path="/login" noAuth Component={Login} />
        <ProtectedRoute exact path="/register" noAuth Component={Register} />
        <ProtectedRoute exact path="/forgot-password" noAuth Component={ForgotPassword} />
      </Switch>
      <ActionTracker />
    </React.Fragment>
  )
}

export default App
