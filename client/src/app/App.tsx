import React, { useEffect } from 'react'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Companies from '../pages/Companies'
import ConsentForms from '../pages/ConsentForms'
import NavigationBar from '../components/NavigationBar'
import ProtectedRoute from '../components/ProtectedRoute'
import ActionTracker from '../components/ActionTracker'
import { CssBaseline } from '@material-ui/core'
import { Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { UserRole } from '../data/enums/UserRole'
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
      <NavigationBar />
      <Switch>
        <ProtectedRoute exact path="/login" noAuth Component={Login} />
        <ProtectedRoute exact path="/register" noAuth Component={Register} />
        <ProtectedRoute exact path="/forgot-password" noAuth Component={ForgotPassword} />
        <ProtectedRoute exact path="/reset-password/:token" noAuth Component={ResetPassword} />
        <ProtectedRoute exact path="/companies" auth={[UserRole.ADMIN]} Component={Companies} />
        <ProtectedRoute exact path="/consent-forms" auth={[UserRole.ADMIN]} Component={ConsentForms} />
      </Switch>
      <ActionTracker />
    </React.Fragment>
  )
}

export default App
