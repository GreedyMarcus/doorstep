import React from 'react'
import { Route, RouteProps, RouteComponentProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { userTokenSelector } from '../store/user'

type Props = {
  Component: React.ElementType
  auth?: string[]
  noAuth?: boolean
}

const ProtectedRoute: React.FC<Props & RouteProps> = ({ Component, auth, noAuth, ...rest }) => {
  const userToken = useSelector(userTokenSelector)

  const renderComponent = (routeProps: RouteComponentProps) => {
    const state = { from: routeProps.location }

    if (!userToken && !noAuth) return <Redirect to={{ pathname: '/login', state }} />
    if (userToken && noAuth) return <Redirect to={{ pathname: '/', state }} />

    return <Component {...routeProps} />
  }

  return <Route {...rest} render={routeProps => renderComponent(routeProps)} />
}

export default ProtectedRoute
