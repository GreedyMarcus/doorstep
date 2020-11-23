import React, { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import DefaultDialogActions from '../shared/DefaultDialogActions'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useStyles from './useStyles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { activeCompanyConfigSelector, fetchCompanyConfig, updateCompanyConfig } from '../../store/company'

interface CompanyConfigDialogProps {
  onClose: () => void
}

/**
 * Custom dialog component to edit company configs.
 */
const CompanyConfigDialog: React.FC<CompanyConfigDialogProps> = ({ onClose }) => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const [t] = useTranslation()

  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const config = useSelector(activeCompanyConfigSelector)
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

  return (
    <Dialog fullScreen={fullScreen} maxWidth="md" open={isOpen} onClose={handleClose}>
      <DialogTitle className={classes.title}>{t('page.companies.companySettings')}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('page.companies.storedGuestData')}
        </Typography>

        {guestDataSettings.map(({ labelLanguageKey, checked, onChange }) => (
          <Grid className={classes.grid} container key={labelLanguageKey}>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.text} variant="h2">
                {t(labelLanguageKey)}
              </Typography>
            </Grid>

            <Grid item sm={2} xs={3} className={classes.switch}>
              <Switch checked={checked} onChange={onChange} color="secondary" />
            </Grid>
          </Grid>
        ))}

        <Typography className={classes.sectionTitle} component="h1">
          {t('company.otherSettings')}
        </Typography>

        {otherSettings.map(({ labelLanguageKey, checked, onChange }) => (
          <Grid className={classes.grid} container key={labelLanguageKey}>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.text} variant="h2">
                {t(labelLanguageKey)}
              </Typography>
            </Grid>

            <Grid item sm={2} xs={3} className={classes.switch}>
              <Switch checked={checked} onChange={onChange} color="secondary" />
            </Grid>
          </Grid>
        ))}
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default CompanyConfigDialog
