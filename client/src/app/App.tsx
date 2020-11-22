import React, { useEffect } from 'react'
import axios from 'axios'
import NavigationBar from '../components/NavigationBar'
import ProtectedRoute from '../components/ProtectedRoute'
import ActionTracker from '../components/ActionTracker'
import { routes } from './routes'
import { CssBaseline } from '@material-ui/core'
import { Switch, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../store'
import { userTokenSelector, loadCurrentUser, logoutUser } from '../store/user'

/**
 * Root component that manages routing and global scope functionality.
 */
const App = () => {
  const dispatch = useAppDispatch()
  const userToken = useSelector(userTokenSelector)

  /**
   * Logs in user if JWT token is present.
   */
  useEffect(() => {
    if (userToken) {
      dispatch(loadCurrentUser(userToken))
    }
  }, [userToken])

  /**
   * Logs out user when JWT token expires.
   */
  useEffect(() => {
    const tokenInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          dispatch(logoutUser())
        }
        return Promise.reject(error)
      }
    )
    return () => axios.interceptors.response.eject(tokenInterceptor)
  }, [])

  return (
    <>
      <CssBaseline />
      <NavigationBar />
      <Switch>
        {routes.map(route => (
          <ProtectedRoute
            key={route.Component.name}
            path={route.path}
            Component={route.Component}
            auth={route.auth}
            noAuth={route.noAuth}
            exact={route.exact}
          />
        ))}
        <Redirect from="*" to="/login" />
      </Switch>
      <ActionTracker />
    </>
  )
}

export default App
