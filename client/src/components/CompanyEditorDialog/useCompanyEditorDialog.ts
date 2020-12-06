import useInput from '../../components/hooks/useInput'
import REGEXP from '../../utils/regexp'
import { useState } from 'react'
import { CompanyInfo } from '../../data/types/Company'
import { useAppDispatch } from '../../store'
import { useTranslation } from 'react-i18next'
import { addNotification } from '../../store/action'
import { registerCompany, updateCompany } from '../../store/company'

interface CompanyEditorDialogHookProps {
  company?: CompanyInfo
  isEditing?: boolean
  onClose: () => void
}

/**
 * Custom React hook that spearates the Company editor dialog component logic.
 */
const useCompanyEditorDialog = ({ company, isEditing, onClose }: CompanyEditorDialogHookProps) => {
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(true)
  const [adminEditingChecked, setAdminEditingChecked] = useState(false)

  const [name, bindName] = useInput({ initialValue: company?.name, required: true })
  const [registrationNumber, bindRegistrationNumber] = useInput({
    initialValue: company?.registrationNumber,
    required: true,
    validator: REGEXP.REGISTRATION_NUMBER
  })

  const address = company?.address.split(', ')

  const [country, bindCountry] = useInput({ initialValue: address && address[0], required: true })
  const [zipCode, bindZipCode] = useInput({ initialValue: address && address[1], required: true })
  const [city, bindCity] = useInput({ initialValue: address && address[2], required: true })
  const [streetAddress, bindStreetAddress] = useInput({ initialValue: address && address[3], required: true })

  const adminName = company?.adminName.split(' ')

  const [firstName, bindFirstName] = useInput({ initialValue: adminName && adminName[0], required: true })
  const [lastName, bindLastName] = useInput({ initialValue: adminName && adminName[1], required: true })
  const [email, bindEmail] = useInput({ initialValue: company?.adminEmail, required: true, validator: REGEXP.EMAIL })
  const [password, bindPassword] = useInput({ required: true, validator: REGEXP.PASSWORD })

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component.
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Toggles admin editing.
   */
  const handleAdminEditingCheck = () => {
    setAdminEditingChecked(!adminEditingChecked)
  }

  /**
   * Validates the company data and optionally the admin data as well.
   */
  const validateCompanyData = (): boolean => {
    const companyInputs = [name, registrationNumber, country, zipCode, city, streetAddress]
    const adminInputs = [firstName, lastName, email, password]

    const inputsToValidate = isEditing && !adminEditingChecked ? companyInputs : [...companyInputs, ...adminInputs]
    return inputsToValidate.every(param => param.valid)
  }

  /**
   * Saves the new or modified company and optionalliy the company admin as well.
   */
  const handleSave = () => {
    const isCompanyDataValid = validateCompanyData()
    if (!isCompanyDataValid) {
      dispatch(addNotification({ type: 'error', message: t('notification.invalid.company') }))
      return
    }

    const companyData = {
      name: name.value,
      registrationNumber: registrationNumber.value,
      address: {
        country: country.value,
        zipCode: zipCode.value,
        city: city.value,
        streetAddress: streetAddress.value
      }
    }

    const adminData = {
      email: email.value,
      password: password.value,
      firstName: firstName.value,
      lastName: lastName.value
    }

    if (isEditing) {
      const updateCompanyData = {
        ...companyData,
        id: company?.id || -1,
        admin: adminEditingChecked ? adminData : undefined
      }

      dispatch(updateCompany(updateCompanyData))
    } else {
      dispatch(registerCompany({ ...companyData, admin: adminData }))
    }

    handleClose()
  }

  return [
    isOpen,
    adminEditingChecked,
    bindName,
    bindRegistrationNumber,
    bindCountry,
    bindZipCode,
    bindCity,
    bindStreetAddress,
    bindFirstName,
    bindLastName,
    bindEmail,
    bindPassword,
    handleAdminEditingCheck,
    handleSave,
    handleClose
  ] as const
}

export default useCompanyEditorDialog
