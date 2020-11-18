import { useState, useCallback } from 'react'
import { InputChangeEvent } from '../../data/types/Event'

export type InputBinding = {
  value: string
  error: boolean
  required: boolean
  onChange: (event: InputChangeEvent) => void
}

/**
 * Custom hook to store input data. It also handles input changes and validation.
 *
 * @param value - the text value of the input
 * @param required - if the value of the input is required
 * @param validator - regular expression that validates the input value
 */
const useInput = (value: string, required: boolean, validator?: RegExp) => {
  const [input, setInput] = useState({ value, isValid: !!value || !required, error: false })

  const onChange = useCallback(
    (event: InputChangeEvent): void => {
      const newValue = event.target.value
      const isValid = validator ? validator.test(newValue) : true
      const hasError = required ? newValue === '' || !isValid : false

      setInput({ value: newValue, isValid: !hasError, error: hasError })
    },
    [required, validator]
  )

  const reset = () => setInput({ value, isValid: !required, error: false })

  const bind = {
    value: input.value,
    error: input.error,
    required,
    onChange
  }

  return [input, bind, reset] as const
}

export default useInput
