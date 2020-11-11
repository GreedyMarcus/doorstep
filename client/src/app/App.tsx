import React, { useEffect } from 'react'
import axios from 'axios'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Companies from '../pages/Companies'
import ConsentForms from '../pages/ConsentForms'
import ConsentFormDetails from '../pages/ConsentFormDetails'
import Visits from '../pages/Visits'
import BusinessHosts from '../pages/BusinessHosts'
import NavigationBar from '../components/NavigationBar'
import ProtectedRoute from '../components/ProtectedRoute'
import ActionTracker from '../components/ActionTracker'
import { routes } from './routes'
import { CssBaseline } from '@material-ui/core'
import { Switch, Redirect } from 'react-router-dom'
import { UserRole } from '../data/enums/UserRole'
import { useAppDispatch } from '../store'
import { logoutUser } from '../store/user'

const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Handling JWT token expiration
    const tokenInterceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response.status === 401) {
          dispatch(logoutUser())
        }
        return Promise.reject(err)
      }
    )
    return () => axios.interceptors.response.eject(tokenInterceptor)
  }, [])

  return (
    <React.Fragment>
      <CssBaseline />
      <NavigationBar />
      <Switch>
        <ProtectedRoute exact path={routes.LOGIN} noAuth Component={Login} />
        <ProtectedRoute exact path={routes.REGISTER} noAuth Component={Register} />
        <ProtectedRoute exact path={routes.FORGOT_PASSWORD} noAuth Component={ForgotPassword} />
        <ProtectedRoute exact path={routes.RESET_PASSWORD} noAuth Component={ResetPassword} />
        <ProtectedRoute exact path={routes.COMPANIES} auth={[UserRole.ADMIN]} Component={Companies} />
        <ProtectedRoute exact path={routes.CONSENT_FORMS} auth={[UserRole.ADMIN]} Component={ConsentForms} />
        <ProtectedRoute exact path={routes.CONSENT_FORM_DETAILS} auth={[UserRole.ADMIN]} Component={ConsentFormDetails} />
        <ProtectedRoute exact path={routes.VISITS} auth={[UserRole.COMPANY_ADMIN]} Component={Visits} />
        <ProtectedRoute exact path={routes.HOSTS} auth={[UserRole.COMPANY_ADMIN]} Component={BusinessHosts} />
        <Redirect from="*" to={routes.LOGIN} />
      </Switch>
      <ActionTracker />
    </React.Fragment>
  )
}

export default App
