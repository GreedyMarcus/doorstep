import React from 'react'
import InfoIcon from '@material-ui/icons/Info'
import Typography from '@material-ui/core/Typography'
import useStyles from './useStyles'

type Props = {
  text: string
}

const InfoBox: React.FC<Props> = ({ text }) => {
  const classes = useStyles()

  return (
    <div className={classes.infoContainer}>
      <InfoIcon className={classes.infoIcon} />
      <Typography className={classes.infoText} variant="h1">
        {text}
      </Typography>
    </div>
  )
}

export default InfoBox
