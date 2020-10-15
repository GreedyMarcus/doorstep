import React from 'react'
import { Route, RouteProps, Redirect } from 'react-router-dom'

type Props = {
  Component: React.ElementType
  auth?: string[]
}

const ProtectedRoute: React.FC<Props & RouteProps> = ({ Component, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps =>
        true ? (
          <Component {...routeProps} />
        ) : (
          <Redirect to={{ pathname: '', state: { from: routeProps.location } }} />
        )
      }
    />
  )
}

export default ProtectedRoute
