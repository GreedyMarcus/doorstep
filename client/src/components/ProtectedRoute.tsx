import React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userTokenSelector } from '../store/user'

type Props = {
  Component: React.ElementType
  auth?: string[]
  noAuth?: boolean
}

const ProtectedRoute: React.FC<Props & RouteProps> = ({ Component, auth, noAuth, ...rest }) => {
  const userToken = useSelector(userTokenSelector)
  const redirect = noAuth ? '/' : '/login'

  return (
    <Route
      {...rest}
      render={routeProps =>
        userToken && !noAuth ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to={{ pathname: redirect, state: { from: routeProps.location } }} />
        )
      }
    />
  )
}

export default ProtectedRoute
