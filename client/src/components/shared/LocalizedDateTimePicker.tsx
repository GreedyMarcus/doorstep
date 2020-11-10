import React from 'react'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import EventRoundedIcon from '@material-ui/icons/EventRounded'
import { DateTimePicker, DateTimePickerProps } from '@material-ui/pickers'
import { useTranslation } from 'react-i18next'

type Props = {
  label: string
  value: Date | null
  onChange: (dateString: string) => void
}

const LocalizedDateTimePicker: React.FC<Props & DateTimePickerProps> = ({ label, value, onChange, ...rest }) => {
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
      cancelLabel={t('general.cancel')}
      okLabel={t('general.ok')}
      clearLabel={t('general.clear')}
      onChange={value => onChange(value?.toDateString() || '')}
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
