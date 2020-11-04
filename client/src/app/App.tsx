import React from 'react'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import Companies from '../pages/Companies'
import ConsentForms from '../pages/ConsentForms'
import NavigationBar from '../components/NavigationBar'
import ProtectedRoute from '../components/ProtectedRoute'
import ActionTracker from '../components/ActionTracker'
import { routes } from './routes'
import { CssBaseline } from '@material-ui/core'
import { Switch } from 'react-router-dom'
import { UserRole } from '../data/enums/UserRole'

const App = () => (
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
    </Switch>
    <ActionTracker />
  </React.Fragment>
)

export default App
