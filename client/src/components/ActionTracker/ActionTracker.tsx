import React, { useState, useEffect, useCallback } from 'react'
import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import Slide from '@material-ui/core/Slide'
import Alert from '@material-ui/lab/Alert'
import useStyles from './useStyles'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store'
import { actionSelector, removeNotification } from '../../store/action'

/**
 * Custom component that displays event results.
 */
const ActionTracker: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const action = useSelector(actionSelector)
  const [openNotification, setOpenNotification] = useState(false)

  const SlideTransition = useCallback((props: TransitionProps) => <Slide {...props} direction="up" />, [])

  const handleNotificationClose = () => setOpenNotification(false)
  const handleNotificationRemoval = () => dispatch(removeNotification())

  /**
   * Displays notification if value in the action store changed.
   */
  useEffect(() => {
    if (action.notification) {
      setOpenNotification(true)
    }
  }, [action.notification])

  return (
    <>
      <Backdrop className={classes.backdrop} open={action.isLoading}>
        <CircularProgress color="inherit" size={60} />
      </Backdrop>

      <Snackbar
        key={SlideTransition.name}
        open={openNotification}
        autoHideDuration={action.notification?.duration || 5000}
        TransitionComponent={SlideTransition}
        onClose={handleNotificationClose}
        onExited={handleNotificationRemoval}
      >
        <Alert variant="filled" severity={action.notification?.type} onClose={handleNotificationClose}>
          {action.notification?.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ActionTracker
