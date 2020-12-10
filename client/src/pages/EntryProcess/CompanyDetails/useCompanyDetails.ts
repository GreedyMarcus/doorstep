import useInput from '../../../components/hooks/useInput'
import REGEXP from '../../../utils/regexp'
import { FormEvent } from 'react'
import { CompanyConfig } from '../../../data/types/Company'
import { VisitGuestDetails } from '../../../data/types/Visit'
import { CompanyShortUpdate } from '../../../data/types/Company'
import { useAppDispatch } from '../../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../../store/action'

interface CompanyDetailsHookProps {
  config: CompanyConfig | undefined
  guestDetails: VisitGuestDetails | undefined
  onNextClick: (companyDetails: CompanyShortUpdate | null) => void
}

/**
 * Custom React hook that spearates the Company details component logic.
 */
const useCompanyDetails = ({ config, guestDetails, onNextClick }: CompanyDetailsHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [companyName, bindCompanyName] = useInput({
    initialValue: guestDetails?.company?.name,
    required: !!config?.storeCompany
  })
  const [regNumber, bindRegNumber] = useInput({
    initialValue: guestDetails?.company?.registrationNumber,
    required: !!config?.storeCompany,
    validator: REGEXP.REGISTRATION_NUMBER
  })

  const companyAddress = guestDetails?.company?.address?.split(', ')

  const [companyCountry, bindCompanyCountry] = useInput({
    initialValue: companyAddress && companyAddress[0],
    required: !!config?.storeCompany
  })
  const [companyZipCode, bindCompanyZipCode] = useInput({
    initialValue: companyAddress && companyAddress[1],
    required: !!config?.storeCompany
  })
  const [companyCity, bindCompanyCity] = useInput({
    initialValue: companyAddress && companyAddress[2],
    required: !!config?.storeCompany
  })
  const [companyStreetAddress, bindCompanyStreetAddress] = useInput({
    initialValue: companyAddress && companyAddress[4],
    required: !!config?.storeCompany
  })

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
   * Handles the next click request.
   */
  const handleNextClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Only full company data approved
    if (!isCompanyDataApproved()) {
      dispatch(addNotification({ type: 'warning', message: t('notification.provideFullCompanyData.warning') }))
      return
    }

    const companyData: CompanyShortUpdate | null = !companyName.value
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
        }

    onNextClick(companyData)
  }

  return [
    bindCompanyName,
    bindRegNumber,
    bindCompanyCountry,
    bindCompanyZipCode,
    bindCompanyCity,
    bindCompanyStreetAddress,
    handleNextClick
  ] as const
}

export default useCompanyDetails
