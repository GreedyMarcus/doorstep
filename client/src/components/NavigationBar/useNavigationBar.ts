import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import { userRoleSelector, userNameSelector, logoutUser } from '../../store/user'
import { getNavigations, getActions } from './navigations'

/**
 * Custom React hook that spearates the Navigation bar component logic.
 */
const useNavigationBar = () => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const userRole = useSelector(userRoleSelector)
  const userName = useSelector(userNameSelector)

  const [activeAction, setActiveAction] = useState(-1)
  const [activeMobileNav, setActiveMobileNav] = useState(0)

  const navigations = getNavigations(userRole)
  const actions = getActions(userRole)

  /**
   * Logs out the current user.
   */
  const handleLogout = () => {
    dispatch(logoutUser())
    history.push('/login')
  }

  /**
   * Handles the navigation events of the mobile view navigation bar.
   */
  const handleMobileNavChange = (_e: any, value: number) => {
    setActiveMobileNav(value)
    history.push(navigations[value].routePath)
  }

  /**
   * Renders the action component if action fired and component is present.
   */
  const renderActionComponent = () => {
    const foundAction = actions[activeAction]
    if (foundAction && foundAction.renderComponent) {
      return foundAction.renderComponent(() => setActiveAction(-1))
    }
    return null
  }

  /**
   * Synchronizes the mobile navigation view with the history location.
   */
  useEffect(() => {
    const currentNavIndex = navigations.findIndex(nav => nav.routePath === history.location.pathname)
    setActiveMobileNav(currentNavIndex === -1 ? 0 : currentNavIndex)
  }, [history.location])

  return [
    userRole,
    userName,
    navigations,
    actions,
    activeMobileNav,
    setActiveAction,
    renderActionComponent,
    handleMobileNavChange,
    handleLogout
  ] as const
}

export default useNavigationBar
