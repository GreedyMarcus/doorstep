import React from 'react'
import Widget from '../../components/shared/Widget'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import BasicData from './BasicData'
import CompanyDetails from './CompanyDetails'
import ConsentFormsToAccept from './ConsentFormsToAccept'
import Signature from './Signature'
import useStyles from './useStyles'
import useEntryProcess from './useEntryProcess'
import { GuestInvitationDetails } from '../../data/types/Visit'
import { useTranslation } from 'react-i18next'

interface EntryProcessProps {
  visitId: number
  guestId: number
  activeGuest: GuestInvitationDetails | null
}

/**
 * The Entry process page where receptionists enter guests.
 */
const EntryProcess: React.FC<EntryProcessProps> = ({ visitId, guestId, activeGuest }) => {
  const classes = useStyles()
  const [t] = useTranslation()
  const [
    activeStep,
    handleBasicDataNextClick,
    handleCompanyDetailsNextClick,
    handleConsentFormsToAcceptNextClick,
    handleEntryProcessFinish,
    handleBackClick
  ] = useEntryProcess({ visitId, guestId })

  const steps = [
    'common.basicData',
    'page.entryProcess.companyDetails',
    'page.entryProcess.consentFormsToAccept',
    'page.entryProcess.signature'
  ]

  return (
    <Widget
      title={t('page.entryProcess.pageTitle')}
      showContent={!!activeGuest}
      hasContent={!!activeGuest}
      infoText={t('page.guestInvitations.notFound')}
    >
      <>
        <Stepper className={classes.stepper} activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{t(step)}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <BasicData
          visible={activeStep === 0}
          config={activeGuest?.companyRegisterConfig}
          guestDetails={activeGuest?.guestDetails}
          onNextClick={basicData => handleBasicDataNextClick(basicData)}
        />
        <CompanyDetails
          visible={activeStep === 1}
          config={activeGuest?.companyRegisterConfig}
          guestDetails={activeGuest?.guestDetails}
          onBackClick={handleBackClick}
          onNextClick={companyData => handleCompanyDetailsNextClick(companyData)}
        />
        <ConsentFormsToAccept
          visible={activeStep === 2}
          forms={activeGuest?.consentFormVersionsToAccept}
          acceptedForms={activeGuest?.consentFormVersionsAccepted}
          onBackClick={handleBackClick}
          onNextClick={acceptedFormIds => handleConsentFormsToAcceptNextClick(acceptedFormIds)}
        />
        <Signature
          visible={activeStep === 3}
          onBackClick={handleBackClick}
          onNextClick={signature => handleEntryProcessFinish(signature)}
        />
      </>
    </Widget>
  )
}

export default EntryProcess
