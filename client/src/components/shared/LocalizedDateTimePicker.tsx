import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import EventRoundedIcon from '@material-ui/icons/EventRounded'
import { DateTimePicker, DateTimePickerProps } from '@material-ui/pickers'
import { useTranslation } from 'react-i18next'

interface LocalizedDateTimePickerProps extends DateTimePickerProps {
  label: string
  value: Date | null
  onChange: (date: Date | null) => void
}

/**
 * Wrapper component for date time picker that has default values,
 * and handles localization using translation hook.
 */
const LocalizedDateTimePicker: React.FC<LocalizedDateTimePickerProps> = ({ label, value, onChange, ...rest }) => {
  const [t] = useTranslation()

  return (
    <DateTimePicker
      {...rest}
      style={{ width: '100%' }}
      label={label}
      value={value}
      ampm={false}
      clearable
      format="yyyy-MM-dd hh:mm a"
      cancelLabel={t('action.cancel')}
      okLabel={t('action.ok')}
      clearLabel={t('action.clear')}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <EventRoundedIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}

export default LocalizedDateTimePicker
