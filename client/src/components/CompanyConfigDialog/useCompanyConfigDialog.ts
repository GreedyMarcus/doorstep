import { useState, useEffect } from 'react'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { activeCompanyConfigSelector, fetchCompanyConfig, updateCompanyConfig } from '../../store/company'

interface CompanyConfigDialogHookProps {
  onClose: () => void
}

/**
 * Custom React hook that spearates the Company config dialog component logic.
 */
const useCompanyConfigDialog = ({ onClose }: CompanyConfigDialogHookProps) => {
  const dispatch = useAppDispatch()
  const config = useSelector(activeCompanyConfigSelector)
  const [t] = useTranslation()

  const [isOpen, setOpen] = useState(true)

  const [storeNationality, setStoreNationality] = useState(!!config?.storeNationality)
  const [storeAddress, setStoreAddress] = useState(!!config?.storeAddress)
  const [storePhoneNumber, setStorePhoneNumber] = useState(!!config?.storePhoneNumber)
  const [storeBirthplace, setStoreBirthplace] = useState(!!config?.storeBirthplace)
  const [storeBirthDate, setStoreBirthDate] = useState(!!config?.storeBirthDate)
  const [storeMotherName, setStoreMotherName] = useState(!!config?.storeMotherName)
  const [storeCompany, setStoreCompany] = useState(!!config?.storeCompany)
  const [registerGuestCard, setRegisterGuestCard] = useState(!!config?.registerGuestCard)
  const [trackActualExit, setTrackActualExit] = useState(!!config?.trackActualExit)

  const guestDataSettings = [
    {
      labelLanguageKey: 'common.nationality',
      checked: storeNationality,
      onChange: () => setStoreNationality(!storeNationality)
    },
    {
      labelLanguageKey: 'common.address',
      checked: storeAddress,
      onChange: () => setStoreAddress(!storeAddress)
    },
    {
      labelLanguageKey: 'common.phoneNumber',
      checked: storePhoneNumber,
      onChange: () => setStorePhoneNumber(!storePhoneNumber)
    },
    {
      labelLanguageKey: 'common.birthplace',
      checked: storeBirthplace,
      onChange: () => setStoreBirthplace(!storeBirthplace)
    },
    {
      labelLanguageKey: 'common.birthDate',
      checked: storeBirthDate,
      onChange: () => setStoreBirthDate(!storeBirthDate)
    },
    {
      labelLanguageKey: 'common.motherName',
      checked: storeMotherName,
      onChange: () => setStoreMotherName(!storeMotherName)
    },
    {
      labelLanguageKey: 'page.companies.companyDetails',
      checked: storeCompany,
      onChange: () => setStoreCompany(!storeCompany)
    }
  ]

  const otherSettings = [
    {
      labelLanguageKey: 'page.companies.mustRegisterCard',
      checked: registerGuestCard,
      onChange: () => setRegisterGuestCard(!registerGuestCard)
    },
    {
      labelLanguageKey: 'page.companies.mustTrackActualExit',
      checked: trackActualExit,
      onChange: () => setTrackActualExit(!trackActualExit)
    }
  ]

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    // This method provides smooth exit animation for the component.
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

  /**
   * Saves the modified company config.
   */
  const handleSave = () => {
    const configData = {
      storeNationality,
      storeAddress,
      storePhoneNumber,
      storeBirthplace,
      storeBirthDate,
      storeMotherName,
      storeCompany,
      registerGuestCard,
      trackActualExit
    }

    dispatch(updateCompanyConfig(configData))
    handleClose()
  }

  /**
   * Loads company config data if not loaded already.
   */
  useEffect(() => {
    if (!config) {
      dispatch(fetchCompanyConfig())
    } else {
      // Set initial config states
      setStoreNationality(config.storeNationality)
      setStoreAddress(config.storeAddress)
      setStorePhoneNumber(config.storePhoneNumber)
      setStoreBirthplace(config.storeBirthplace)
      setStoreBirthDate(config.storeBirthDate)
      setStoreMotherName(config.storeMotherName)
      setStoreCompany(config.storeCompany)
      setRegisterGuestCard(config.registerGuestCard)
      setTrackActualExit(config.trackActualExit)
    }
  }, [config])

  return [isOpen, guestDataSettings, otherSettings, handleSave, handleClose] as const
}

export default useCompanyConfigDialog
