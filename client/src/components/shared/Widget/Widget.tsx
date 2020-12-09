import React from 'react'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InfoRoundedIcon from '@material-ui/icons/InfoRounded'
import useStyles from './useStyles'

interface WidgetProps {
  title?: string
  titleComponent?: JSX.Element
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showContent: boolean
  hasContent: boolean
  infoText: string
}

/**
 * Custom wrapper component that provides basic container behaviour for contents.
 * It can hide the provided component or show info message if does not exist.
 */
const Widget: React.FC<WidgetProps> = ({ title, titleComponent, maxWidth, showContent, hasContent, infoText, children }) => {
  const classes = useStyles()

  return (
    <Container className={classes.container} component="main" maxWidth={maxWidth}>
      <Paper elevation={3}>
        {!!titleComponent && titleComponent}
        {!!title && (
          <Typography className={classes.title} variant="h1">
            {title}
          </Typography>
        )}

        {showContent && (
          <>
            {!hasContent ? (
              <div className={classes.info}>
                <InfoRoundedIcon className={classes.infoIcon} />
                <Typography className={classes.infoText} variant="h1">
                  {infoText}
                </Typography>
              </div>
            ) : (
              children
            )}
          </>
        )}
      </Paper>
    </Container>
  )
}

Widget.defaultProps = {
  maxWidth: 'lg'
}

export default Widget
