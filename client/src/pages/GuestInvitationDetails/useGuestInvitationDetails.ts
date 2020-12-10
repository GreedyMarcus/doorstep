import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { useState } from 'react'
import { identifierCardTypeStrings } from '../../data/enums/IdentifierCardType'
import { GuestInvitationDetails, GuestUpdateByUser } from '../../data/types/Visit'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { updateGuestInvitationProfile } from '../../store/visit'
import { addNotification } from '../../store/action'
import { getLocaleDateFormat } from '../../utils'

interface GuestInvitationDetailsHookProps {
  visitId: number
  guestProfile: GuestInvitationDetails | null
}

/**
 * Custom React hook that spearates the Guest invitation details page logic.
 */
const useGuestInvitationDetails = ({ visitId, guestProfile }: GuestInvitationDetailsHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  /**
   * Helper function to get identifier card type index for local state.
   */
  const getIdentifierCardTypeIndex = () => {
    if (guestProfile) {
      const index = identifierCardTypeStrings.indexOf(guestProfile.guestDetails.identifierCardType)
      return index === -1 ? 0 : index
    }
    return 0
  }

  const registerConfig = guestProfile?.companyRegisterConfig

  const [nationality, bindNationality] = useInput({
    initialValue: guestProfile?.guestDetails.nationality,
    required: !!registerConfig?.storeNationality
  })
  const [phoneNumber, bindPhoneNumber] = useInput({
    initialValue: guestProfile?.guestDetails.phoneNumber,
    required: !!registerConfig?.storePhoneNumber,
    validator: REGEXP.PHONE_NUMBER
  })
  const [birthplace, bindBirthplace] = useInput({
    initialValue: guestProfile?.guestDetails.birthplace,
    required: !!registerConfig?.storeBirthplace
  })
  const [birthDate, setBirthDate] = useState(
    guestProfile?.guestDetails?.birthDate ? new Date(guestProfile.guestDetails.birthDate) : null
  )

  const [motherName, bindMotherName] = useInput({
    initialValue: guestProfile?.guestDetails.motherName,
    required: !!registerConfig?.storeMotherName
  })
  const [identifierCardType, setIdentifierCardType] = useState(getIdentifierCardTypeIndex())
  const [identifierCardNumber, bindIdentifierCardNumber] = useInput({
    initialValue: guestProfile?.guestDetails.identifierCardNumber
  })

  const guestAddress = guestProfile?.guestDetails.address?.split(', ')

  const [country, bindCountry] = useInput({
    initialValue: guestAddress && guestAddress[0],
    required: !!registerConfig?.storeAddress
  })
  const [zipCode, bindZipCode] = useInput({
    initialValue: guestAddress && guestAddress[1],
    required: !!registerConfig?.storeAddress
  })
  const [city, bindCity] = useInput({
    initialValue: guestAddress && guestAddress[2],
    required: !!registerConfig?.storeAddress
  })
  const [streetAddress, bindStreetAddress] = useInput({
    initialValue: guestAddress && guestAddress[3],
    required: !!registerConfig?.storeAddress
  })

  const [companyName, bindCompanyName] = useInput({
    initialValue: guestProfile?.guestDetails.company?.name,
    required: !!registerConfig?.storeCompany
  })
  const [regNumber, bindRegNumber] = useInput({
    initialValue: guestProfile?.guestDetails.company?.registrationNumber,
    required: !!registerConfig?.storeCompany,
    validator: REGEXP.REGISTRATION_NUMBER
  })

  const companyAddress = guestProfile?.guestDetails.company?.address?.split(', ')

  const [companyCountry, bindCompanyCountry] = useInput({
    initialValue: companyAddress && companyAddress[0],
    required: !!registerConfig?.storeCompany
  })
  const [companyZipCode, bindCompanyZipCode] = useInput({
    initialValue: companyAddress && companyAddress[1],
    required: !!registerConfig?.storeCompany
  })
  const [companyCity, bindCompanyCity] = useInput({
    initialValue: companyAddress && companyAddress[2],
    required: !!registerConfig?.storeCompany
  })
  const [companyStreetAddress, bindCompanyStreetAddress] = useInput({
    initialValue: companyAddress && companyAddress[4],
    required: !!registerConfig?.storeCompany
  })

  const [checked, setChecked] = useState(guestProfile?.consentFormVersionsAccepted || ([] as number[]))

  /**
   * Switches the state of the checkbox
   */
  const toggle = (value: number) => {
    const newChecked = [...checked]
    const currentIndex = checked.indexOf(value)

    currentIndex === -1 ? newChecked.push(value) : newChecked.splice(currentIndex, 1)
    setChecked(newChecked)
  }

  /**
   * Validates the guest user data.
   */
  const isGuestProfileDataValid = (): boolean => {
    const inputFieldsValid = [
      nationality,
      phoneNumber,
      birthplace,
      motherName,
      country,
      zipCode,
      city,
      streetAddress,
      companyName,
      regNumber,
      companyCountry,
      companyZipCode,
      companyCity,
      companyStreetAddress
    ].every(param => param.valid)

    return !!guestProfile?.companyRegisterConfig.storeBirthDate ? inputFieldsValid && !!birthDate : inputFieldsValid
  }

  /**
   * Validates if guest provided all of the address properties.
   */
  const isGuestAddressApproved = (): boolean => {
    const addressInputs = [country, zipCode, city, streetAddress]
    if (addressInputs.some(input => !!input.value)) {
      return addressInputs.every(input => !!input.value)
    }
    return true
  }

  /**
   * Validates if guest provided all of the company properties.
   */
  const isCompanyDataApproved = (): boolean => {
    const companyInputs = [companyName, regNumber, companyCountry, companyZipCode, companyCity, companyStreetAddress]
    if (companyInputs.some(input => !!input.value)) {
      return companyInputs.every(input => !!input.value)
    }
    return true
  }

  /**
   * Saves guest profile data.
   */
  const handleSave = () => {
    if (!isGuestProfileDataValid()) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalidGuestProfileData') }))
      return
    }

    // Only full guest address data approved
    if (!isGuestAddressApproved()) {
      dispatch(addNotification({ type: 'warning', message: t('notification.provideFullAddressDataWarning') }))
      return
    }

    // Only full company data approved
    if (!isCompanyDataApproved()) {
      dispatch(addNotification({ type: 'warning', message: t('notification.provideFullCompanyDataWarning') }))
      return
    }

    const profileData: GuestUpdateByUser = {
      nationality: !!nationality.value ? nationality.value : null,
      phoneNumber: !!phoneNumber.value ? phoneNumber.value : null,
      birthplace: !!birthplace.value ? birthplace.value : null,
      birthDate: birthDate ? birthDate.toISOString() : null,
      motherName: !!motherName.value ? motherName.value : null,
      address: !country.value
        ? null
        : {
            // we already know if all of the address data is provided
            country: country.value,
            zipCode: zipCode.value,
            city: city.value,
            streetAddress: streetAddress.value
          },
      identifierCardType: identifierCardTypeStrings[identifierCardType],
      identifierCardNumber: !!identifierCardNumber.value ? identifierCardNumber.value : null,
      company: !companyName.value
        ? null
        : {
            // we already know if all of the company data is provided
            name: companyName.value,
            registrationNumber: regNumber.value,
            address: {
              country: companyCountry.value,
              zipCode: companyZipCode.value,
              city: companyCity.value,
              streetAddress: companyStreetAddress.value
            }
          },
      imageUrl: null,
      signature: null,
      consentFormVersionsAccepted: checked
    }

    dispatch(updateGuestInvitationProfile(visitId, profileData))
  }

  const invitationInfo = guestProfile?.invitationInfo
  const invitationData = [
    { labelLanguageKey: 'page.guestInvitations.organizingCompany', value: invitationInfo?.companyName || '' },
    { labelLanguageKey: 'page.guestInvitations.location', value: invitationInfo?.buildingAddress || '' },
    { labelLanguageKey: 'page.guestInvitations.purpose', value: invitationInfo?.purpose || '' },
    { labelLanguageKey: 'page.guestInvitations.businessHostName', value: invitationInfo?.businessHost.fullName || '' },
    { labelLanguageKey: 'page.guestInvitations.businessHostEmail', value: invitationInfo?.businessHost.email || '' },
    {
      labelLanguageKey: 'page.guestInvitations.plannedEntry',
      value: invitationInfo ? getLocaleDateFormat(new Date(invitationInfo.plannedEntry)) : ''
    },
    { labelLanguageKey: 'common.room', value: invitationInfo?.room || '' }
  ]

  const basicData = [
    { labelLanguageKey: 'common.nationality', binding: bindNationality },
    { labelLanguageKey: 'common.phoneNumber', binding: bindPhoneNumber },
    { labelLanguageKey: 'common.birthplace', binding: bindBirthplace }
  ]

  const addressData = [
    { labelLanguageKey: 'common.country', binding: bindCountry },
    { labelLanguageKey: 'common.zipCode', binding: bindZipCode },
    { labelLanguageKey: 'common.city', binding: bindCity },
    { labelLanguageKey: 'common.streetAddress', binding: bindStreetAddress }
  ]

  const companyData = [
    { labelLanguageKey: 'page.guestInvitations.companyName', binding: bindCompanyName },
    { labelLanguageKey: 'page.guestInvitations.companyRegistrationNumber', binding: bindRegNumber }
  ]

  const companyAddressData = [
    { labelLanguageKey: 'common.country', binding: bindCompanyCountry },
    { labelLanguageKey: 'common.zipCode', binding: bindCompanyZipCode },
    { labelLanguageKey: 'common.city', binding: bindCompanyCity },
    { labelLanguageKey: 'common.streetAddress', binding: bindCompanyStreetAddress }
  ]

  return [
    invitationData,
    basicData,
    birthDate,
    setBirthDate,
    bindMotherName,
    identifierCardType,
    setIdentifierCardType,
    bindIdentifierCardNumber,
    addressData,
    companyData,
    companyAddressData,
    toggle,
    checked,
    handleSave
  ] as const
}

export default useGuestInvitationDetails
