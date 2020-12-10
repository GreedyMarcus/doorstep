import React, { useEffect } from 'react'
import GuestInvitationDetails from './GuestInvitationDetails'
import { RouteComponentProps } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { activeGuestProfileSelector, fetchGuestInvitationProfile } from '../../store/visit'

/**
 * Container component for guest invitation details to load guest profile data properly for hooks.
 */
const GuestInvitationDetailsContainer: React.FC<RouteComponentProps> = ({ match: { params: routeParams } }) => {
  const dispatch = useAppDispatch()
  const guestProfile = useSelector(activeGuestProfileSelector)

  /**
   * Loads the guest invitation profile for the guest user when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchGuestInvitationProfile(routeParams['visitId']))
  }, [])

  // Do not show page until profile loaded.
  if (guestProfile !== null && !Object.values(guestProfile).length) {
    return null
  }

  return <GuestInvitationDetails visitId={routeParams['visitId']} guestProfile={guestProfile} />
}

export default GuestInvitationDetailsContainer
