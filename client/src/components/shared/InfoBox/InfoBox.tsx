import React from 'react'
import InfoRoundedIcon from '@material-ui/icons/InfoRounded'
import ErrorOutlineRoundedIcon from '@material-ui/icons/ErrorOutlineRounded'
import Typography from '@material-ui/core/Typography'
import useStyles from './useStyles'

type Props = {
  text: string
  type: 'error' | 'info'
}

/**
 * Custom component that displays information.
 */
const InfoBox: React.FC<Props> = ({ text, type }) => {
  const classes = useStyles({ iconType: type })

  return (
    <div className={classes.container}>
      {type === 'error' ? <ErrorOutlineRoundedIcon className={classes.icon} /> : <InfoRoundedIcon className={classes.icon} />}
      <Typography className={classes.text} variant="h1">
        {text}
      </Typography>
    </div>
  )
}

export default InfoBox
