import React, { useState, useEffect, useCallback } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import Alert from '@material-ui/lab/Alert'
import useStyles from './useStyles'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { actionSelector, removeNotification } from '../../store/action'
import { TransitionProps } from '@material-ui/core/transitions/transition'

const ActionTracker: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const action = useSelector(actionSelector)
  const [openNotification, setOpenNotification] = useState(false)

  const handleNotificationClose = () => {
    setOpenNotification(false)
  }

  const handleNotificationRemoval = () => {
    dispatch(removeNotification())
  }

  useEffect(() => {
    if (action.notification) {
      setOpenNotification(true)
    }
  }, [action.notification])

  const SlideTransition = useCallback((props: TransitionProps) => {
    return <Slide {...props} direction="up" />
  }, [])

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={action.isLoading}>
        <CircularProgress color="inherit" size={60} />
      </Backdrop>
      <Snackbar
        open={openNotification}
        autoHideDuration={action.notification?.duration || 5000}
        TransitionComponent={SlideTransition}
        onClose={handleNotificationClose}
        onExited={handleNotificationRemoval}
        key={SlideTransition.name}
      >
        <Alert variant="filled" severity={action.notification?.type} onClose={handleNotificationClose}>
          {action.notification?.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  )
}

export default ActionTracker
