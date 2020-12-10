import React, { useEffect } from 'react'
import EntryProcess from './EntryProcess'
import { RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { activeGuestProfileSelector, fetchVisitGuest } from '../../store/visit'

/**
 * Container component for entry process to load guest profile data properly for hooks.
 */
const EntryProcessContainer: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const dispatch = useAppDispatch()
  const activeGuest = useSelector(activeGuestProfileSelector)

  useEffect(() => {
    dispatch(fetchVisitGuest(routeParams['visitId'], routeParams['guestId']))
  }, [])

  if (activeGuest !== null && !Object.values(activeGuest).length) {
    return null
  }

  return <EntryProcess visitId={routeParams['visitId']} guestId={routeParams['guestId']} activeGuest={activeGuest} />
}

export default EntryProcessContainer
