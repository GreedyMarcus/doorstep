import React, { useState, useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import useStyles from '../useStyles'
import useSignature from './useSignature'
import { useTranslation } from 'react-i18next'

interface CompanyDetailsProps {
  visible: boolean
  onBackClick: () => void
  onNextClick: (signature: string) => void
}

/**
 * Sub-component of the multi-step entry process form.
 * It handles the signature belongs to the guest user, including validation.
 */
const CompanyDetails: React.FC<CompanyDetailsProps> = ({ visible, onBackClick, onNextClick }) => {
  const classes = useStyles()
  const signatureCanvasId = 'signatureCanvas'
  const signatureCanvasContainerId = 'signatureCanvasContainer'

  const [t] = useTranslation()
  const [handleSignatureClear, handleNextClick] = useSignature({
    signatureCanvasId,
    signatureCanvasContainerId,
    visible,
    onNextClick
  })

  return (
    <div style={{ display: visible ? 'block' : 'none' }}>
      <form onSubmit={handleNextClick} noValidate autoComplete="off">
        <Grid container spacing={2} className={classes.grid} id={signatureCanvasContainerId}>
          <Grid item xs={12}>
            <Typography className={classes.sectionTitle} component="h3">
              {t('page.entryProcess.signature')}
            </Typography>
          </Grid>

          <canvas id={signatureCanvasId} className={classes.signature} />

          <Grid className={classes.buttons} container justify="space-between">
            <Button variant="contained" color="secondary" onClick={handleSignatureClear}>
              {t('action.clear')}
            </Button>
            <div>
              <Button className={classes.button} onClick={onBackClick}>
                {t('action.back')}
              </Button>
              <Button className={classes.button} variant="contained" color="primary" type="submit">
                {t('action.next')}
              </Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default CompanyDetails
