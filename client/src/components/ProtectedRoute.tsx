import React from 'react'
import { Route, RouteProps, RouteComponentProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userTokenSelector, userRoleSelector } from '../store/user'

type Props = {
  Component: React.ElementType
  auth?: string[]
  noAuth?: boolean
}

const ProtectedRoute: React.FC<Props & RouteProps> = ({ Component, auth, noAuth, ...rest }) => {
  const userToken = useSelector(userTokenSelector)
  const userRole = useSelector(userRoleSelector)

  const renderComponent = (routeProps: RouteComponentProps) => {
    const state = { from: routeProps.location }
    const userHasAccess = auth && auth.length ? userRole && auth.includes(userRole) : true

    // If user not authenticated and component needs authorization
    if (!userToken && !noAuth) {
      return <Redirect to={{ pathname: '/login', state }} />
    }

    // If user authenticated and component does not need authorization or user has no access
    if (userToken && (noAuth || !userHasAccess)) {
      return <Redirect to={{ pathname: '/', state }} />
    }

    return <Component {...routeProps} />
  }

  return <Route {...rest} render={routeProps => renderComponent(routeProps)} />
}

export default ProtectedRoute
