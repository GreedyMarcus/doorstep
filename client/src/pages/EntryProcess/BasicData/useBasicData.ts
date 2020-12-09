import useInput from '../../../components/hooks/useInput'
import REGEXP from '../../../utils/regexp'
import { useState, FormEvent } from 'react'
import { CompanyConfig } from '../../../data/types/Company'
import { VisitGuestDetails, GuestBasicFormData } from '../../../data/types/Visit'
import { identifierCardTypeStrings } from '../../../data/enums/IdentifierCardType'
import { useAppDispatch } from '../../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../../store/action'

interface BasicDataHookProps {
  config: CompanyConfig | undefined
  guestDetails: VisitGuestDetails | undefined
  onNextClick: (basicData: GuestBasicFormData) => void
}

/**
 * Custom React hook that spearates the Basic data component logic.
 */
const useBasicData = ({ config, guestDetails, onNextClick }: BasicDataHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [nationality, bindNationality] = useInput({
    initialValue: guestDetails?.nationality,
    required: !!config?.storeNationality
  })
  const [phoneNumber, bindPhoneNumber] = useInput({
    initialValue: guestDetails?.phoneNumber,
    required: !!config?.storePhoneNumber,
    validator: REGEXP.PHONE_NUMBER
  })
  const [birthplace, bindBirthplace] = useInput({
    initialValue: guestDetails?.birthplace,
    required: !!config?.storeBirthplace
  })
  const [birthDate, setBirthDate] = useState(guestDetails?.birthDate ? new Date(guestDetails.birthDate) : null)

  /**
   * Helper function to get identifier card type index for local state.
   */
  const getIdentifierCardTypeIndex = () => {
    if (guestDetails) {
      const index = identifierCardTypeStrings.indexOf(guestDetails.identifierCardType)
      return index === -1 ? 0 : index
    }
    return 0
  }

  const [motherName, bindMotherName] = useInput({
    initialValue: guestDetails?.motherName,
    required: !!config?.storeMotherName
  })
  const [identifierCardType, setIdentifierCardType] = useState(getIdentifierCardTypeIndex())
  const [identifierCardNumber, bindIdentifierCardNumber] = useInput({
    initialValue: guestDetails?.identifierCardNumber
  })

  const guestAddress = guestDetails?.address?.split(', ')

  const [country, bindCountry] = useInput({
    initialValue: guestAddress && guestAddress[0],
    required: !!config?.storeAddress
  })
  const [zipCode, bindZipCode] = useInput({
    initialValue: guestAddress && guestAddress[1],
    required: !!config?.storeAddress
  })
  const [city, bindCity] = useInput({
    initialValue: guestAddress && guestAddress[2],
    required: !!config?.storeAddress
  })
  const [streetAddress, bindStreetAddress] = useInput({
    initialValue: guestAddress && guestAddress[3],
    required: !!config?.storeAddress
  })

  /**
   * Validates the guest user data.
   */
  const isGuestProfileDataValid = (): boolean => {
    const inputFieldsValid = [nationality, phoneNumber, birthplace, motherName, country, zipCode, city, streetAddress].every(
      param => param.valid
    )

    return !!config?.storeBirthDate ? inputFieldsValid && !!birthDate : inputFieldsValid
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
   * Handles the next click request.
   */
  const handleNextClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isGuestProfileDataValid()) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.guest') }))
      return
    }

    // Only full guest address data approved
    if (!isGuestAddressApproved()) {
      dispatch(addNotification({ type: 'warning', message: t('notification.provideFullAddressData.warning') }))
      return
    }

    const guestData: GuestBasicFormData = {
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
      identifierCardNumber: !!identifierCardNumber.value ? identifierCardNumber.value : null
    }

    onNextClick(guestData)
  }

  return [
    bindNationality,
    bindPhoneNumber,
    bindBirthplace,
    birthDate,
    setBirthDate,
    bindMotherName,
    identifierCardType,
    setIdentifierCardType,
    bindIdentifierCardNumber,
    bindCountry,
    bindZipCode,
    bindCity,
    bindStreetAddress,
    handleNextClick
  ] as const
}

export default useBasicData
