import { useEffect } from 'react'
import { VisitGuestInfo } from '../../data/types/Visit'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { activeVisitSelector, fetchVisitById } from '../../store/visit'
import { getLocaleDateFormat } from '../../utils'

interface VisitDetailsHookProps {
  visitId: number
}

/**
 * Custom React hook that spearates the Visit details page logic.
 */
const useVisitDetails = ({ visitId }: VisitDetailsHookProps) => {
  const dispatch = useAppDispatch()
  const activeVisit = useSelector(activeVisitSelector)
  const [t] = useTranslation()

  const visitData = [
    { labelLanguageKey: 'page.visitDetails.companyName', value: activeVisit?.companyName || '' },
    { labelLanguageKey: 'page.visitDetails.businessHostName', value: activeVisit?.businessHost.fullName || '' },
    { labelLanguageKey: 'page.visitDetails.businessHostEmail', value: activeVisit?.businessHost.email || '' },
    { labelLanguageKey: 'page.visitDetails.purpose', value: activeVisit ? t(`enum.visitPurpose.${activeVisit.purpose}`) : '' },
    { labelLanguageKey: 'common.room', value: activeVisit?.room || '' },
    {
      labelLanguageKey: 'page.visitDetails.plannedEntry',
      value: activeVisit ? getLocaleDateFormat(new Date(activeVisit.plannedEntry)) : ''
    }
  ]

  const getGuestLabels = (guest: VisitGuestInfo) => {
    const unknownText = t('common.unknownData')

    return [
      guest.user.fullName,
      guest.actualEntry ? getLocaleDateFormat(new Date(guest.actualEntry)) : unknownText,
      guest.actualExit ? getLocaleDateFormat(new Date(guest.actualExit)) : unknownText,
      guest.receptionistName ?? unknownText,
      t(`enum.guestParticipationStatus.${guest.participationStatus}`)
    ]
  }

  const getBasicData = (guest: VisitGuestInfo) => {
    const [, actualEntryDate, actualExitDate, receptionistName, participationStatus] = getGuestLabels(guest)

    return [
      { labelLanguageKey: 'page.visitDetails.guestName', value: guest.user.fullName },
      { labelLanguageKey: 'common.email', value: guest.user.email },
      { labelLanguageKey: 'page.visitDetails.actualEntry', value: actualEntryDate },
      { labelLanguageKey: 'page.visitDetails.actualExit', value: actualExitDate },
      { labelLanguageKey: 'page.visitDetails.receptionistName', value: receptionistName },
      { labelLanguageKey: 'page.visitDetails.participationStatus', value: participationStatus }
    ]
  }

  const getAdditionalData = (guest: VisitGuestInfo) => {
    const unknownText = t('common.unknownData')
    return [
      { labelLanguageKey: 'common.nationality', value: guest.nationality || unknownText },
      { labelLanguageKey: 'common.phoneNumber', value: guest.phoneNumber || unknownText },
      { labelLanguageKey: 'common.birthplace', value: guest.birthplace || unknownText },
      { labelLanguageKey: 'common.birthDate', value: guest.birthDate || unknownText },
      { labelLanguageKey: 'common.motherName', value: guest.motherName || unknownText },
      { labelLanguageKey: 'page.visitDetails.companyName', value: guest.company?.name || unknownText },
      {
        labelLanguageKey: 'page.visitDetails.companyRegistrationNumber',
        value: guest.company?.registrationNumber || unknownText
      },
      { labelLanguageKey: 'page.visitDetails.companyAddress', value: guest.company?.address || unknownText }
    ]
  }

  /**
   * Loads the visits when the component mounted.
   */
  useEffect(() => {
    dispatch(fetchVisitById(visitId))
  }, [])

  return [activeVisit, visitData, getGuestLabels, getBasicData, getAdditionalData] as const
}

export default useVisitDetails
