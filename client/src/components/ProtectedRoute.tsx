import React, { useEffect } from 'react'
import { routes, getAuthRedirectRoute } from '../app/routes'
import { Route, RouteProps, RouteComponentProps, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../store'
import { userTokenSelector, userRoleSelector, loadCurrentUser } from '../store/user'

type Props = {
  /**
   * The component to render when the route match.
   */
  Component: React.ElementType

  /**
   * The user permissions needed to access the route.
   */
  auth?: string[]

  /**
   * Makes the route unreachable for authenticated users.
   */
  noAuth?: boolean
}

/**
 * Custom route component that allows only authorized users to access the specified route path.
 */
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

    if (userToken && (noAuth || !hasAccess)) {
      // Show empty screen for user as long as the user role is undefined
      if (!userRole) {
        return null
      }
      return <Redirect to={{ pathname: getAuthRedirectRoute(userRole), state }} />
    }

    return <Component {...routeProps} />
  }

  return <Route {...rest} render={routeProps => renderComponent(routeProps)} />
}

export default ProtectedRoute
