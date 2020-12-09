import React from 'react'
import { Route, RouteComponentProps, Redirect } from 'react-router-dom'
import { ProtectedRouteProps, getDefaultRoutePath } from '../app/routes'
import { useSelector } from 'react-redux'
import { userRoleSelector, userTokenSelector } from '../store/user'

/**
 * Customized React route component that allows only authorized users to access the specified route.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ Component, path, noAuth, auth, exact }) => {
  const userToken = useSelector(userTokenSelector)
  const userRole = useSelector(userRoleSelector)

  const renderComponent = (routeProps: RouteComponentProps) => {
    const state = { from: routeProps.location }
    const hasAccess = auth ? userRole && auth.includes(userRole) : true

    if (!userToken && !noAuth) {
      return <Redirect to={{ pathname: '/login', state }} />
    }

    if (userToken && (noAuth || !hasAccess)) {
      // No rendering as long as the user role is undefined
      if (!userRole) {
        return null
      }
      return <Redirect to={{ pathname: getDefaultRoutePath(userRole), state }} />
    }

    return <Component {...routeProps} />
  }

  return <Route path={path} exact={exact} render={routeProps => renderComponent(routeProps)} />
}

export default ProtectedRoute
