import React, { useState } from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

/**
 * Customized TextField component for passwords with visibility toggle.
 */
const PasswordField: React.FC<TextFieldProps> = props => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  )
}

export default PasswordField
