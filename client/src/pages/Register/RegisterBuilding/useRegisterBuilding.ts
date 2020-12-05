import useInput from '../../../components/hooks/useInput'
import { FormEvent } from 'react'
import { Address } from '../../../data/types/Address'
import { useAppDispatch } from '../../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../../store/action'

interface RegisterBuildingHookProps {
  onNextClick: (buildingAddressData: Address) => void
}

/**
 * Custom React hook that spearates the Register Building component logic.
 */
const useRegisterBuilding = ({ onNextClick }: RegisterBuildingHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [country, bindCountry] = useInput({ required: true })
  const [zipCode, bindZipCode] = useInput({ required: true })
  const [city, bindCity] = useInput({ required: true })
  const [streetAddress, bindStreetAddress] = useInput({ required: true })

  /**
   * Handles the next click request.
   */
  const handleNextClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isBuildingAddressDataValid = [country, zipCode, city, streetAddress].every(param => param.valid)
    if (!isBuildingAddressDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.building') }))
      return
    }

    const buildingAddressData = {
      country: country.value,
      zipCode: zipCode.value,
      city: city.value,
      streetAddress: streetAddress.value
    }

    onNextClick(buildingAddressData)
  }

  return [bindCountry, bindZipCode, bindCity, bindStreetAddress, handleNextClick] as const
}

export default useRegisterBuilding
