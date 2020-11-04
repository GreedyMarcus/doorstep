import React, { useEffect } from 'react'
import { routes, getAuthRedirectRoute } from '../app/routes'
import { Route, RouteProps, RouteComponentProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../store'
import { userTokenSelector, userRoleSelector, loadCurrentUser } from '../store/user'

type Props = {
  Component: React.ElementType
  auth?: string[]
  noAuth?: boolean
}

const ProtectedRoute: React.FC<Props & RouteProps> = ({ Component, auth, noAuth, ...rest }) => {
  const dispatch = useAppDispatch()
  const userToken = useSelector(userTokenSelector)
  const userRole = useSelector(userRoleSelector)

  useEffect(() => {
    if (userToken) {
      dispatch(loadCurrentUser(userToken))
    }
  }, [userToken])

  const renderComponent = (routeProps: RouteComponentProps) => {
    const state = { from: routeProps.location }
    const hasAccess = auth ? userRole && auth.includes(userRole) : true

    if (!userToken && !noAuth) {
      return <Redirect to={{ pathname: routes.LOGIN, state }} />
    }

    if (userToken && userRole && (noAuth || !hasAccess)) {
      return <Redirect to={{ pathname: getAuthRedirectRoute(userRole), state }} />
    }

    return <Component {...routeProps} />
  }

  return <Route {...rest} render={routeProps => renderComponent(routeProps)} />
}

export default ProtectedRoute
