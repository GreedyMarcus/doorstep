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

type Props = {
  onClose: () => void
}

const CompanyConfigDialog: React.FC<Props> = ({ onClose }) => {
  const classes = useStyles()
  const fullScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
  const dispatch = useAppDispatch()
  const config = useSelector(activeCompanyConfigSelector)
  const [isOpen, setOpen] = useState(true)
  const [t] = useTranslation()

  const [storeNationality, setStoreNationality] = useState(!!config?.storeNationality)
  const [storeAddress, setStoreAddress] = useState(!!config?.storeAddress)
  const [storePhoneNumber, setStorePhoneNumber] = useState(!!config?.storePhoneNumber)
  const [storeBirthplace, setStoreBirthplace] = useState(!!config?.storeBirthplace)
  const [storeBirthDate, setStoreBirthDate] = useState(!!config?.storeBirthDate)
  const [storeMotherName, setStoreMotherName] = useState(!!config?.storeMotherName)
  const [storeCompany, setStoreCompany] = useState(!!config?.storeCompany)
  const [registerGuestCard, setRegisterGuestCard] = useState(!!config?.registerGuestCard)
  const [trackActualExit, setTrackActualExit] = useState(!!config?.trackActualExit)

  const handleClose = () => {
    // This method provides smooth exit animation for the component
    setOpen(false)
    setTimeout(() => onClose(), 300)
  }

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
    { label: t('guest.nationality'), checked: storeNationality, onChange: () => setStoreNationality(!storeNationality) },
    { label: t('general.address'), checked: storeAddress, onChange: () => setStoreAddress(!storeAddress) },
    { label: t('guest.phoneNumber'), checked: storePhoneNumber, onChange: () => setStorePhoneNumber(!storePhoneNumber) },
    { label: t('guest.birthplace'), checked: storeBirthplace, onChange: () => setStoreBirthplace(!storeBirthplace) },
    { label: t('guest.birthDate'), checked: storeBirthDate, onChange: () => setStoreBirthDate(!storeBirthDate) },
    { label: t('guest.motherName'), checked: storeMotherName, onChange: () => setStoreMotherName(!storeMotherName) },
    { label: t('company.companyDetails'), checked: storeCompany, onChange: () => setStoreCompany(!storeCompany) }
  ]

  const otherSettings = [
    { label: t('guest.mustRegisterCard'), checked: registerGuestCard, onChange: () => setRegisterGuestCard(!registerGuestCard) },
    { label: t('guest.mustTrackActualExit'), checked: trackActualExit, onChange: () => setTrackActualExit(!trackActualExit) }
  ]

  useEffect(() => {
    if (!config) {
      dispatch(fetchCompanyConfig())
    } else {
      // Set initial state
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
      <DialogTitle className={classes.title}>{t('general.settings')}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Typography className={classes.sectionTitle} component="h1">
          {t('company.guestDataSettings')}
        </Typography>

        {guestDataSettings.map(({ label, checked, onChange }, index) => (
          <Grid className={classes.grid} container key={`guest-data-${index}`}>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.text} variant="h2">
                {label}
              </Typography>
            </Grid>
            <Grid item sm={2} xs={3} className={classes.switch}>
              <Switch checked={checked} onChange={onChange} color="primary" />
            </Grid>
          </Grid>
        ))}

        <Typography className={classes.sectionTitle} component="h1">
          {t('company.otherSettings')}
        </Typography>

        {otherSettings.map(({ label, checked, onChange }, index) => (
          <Grid className={classes.grid} container key={`other-${index}`}>
            <Grid item sm={10} xs={9}>
              <Typography className={classes.text} variant="h2">
                {label}
              </Typography>
            </Grid>
            <Grid item sm={2} xs={3} className={classes.switch}>
              <Switch checked={checked} onChange={onChange} color="primary" />
            </Grid>
          </Grid>
        ))}
      </DialogContent>
      <DefaultDialogActions onSave={handleSave} onClose={handleClose} />
    </Dialog>
  )
}

export default CompanyConfigDialog
