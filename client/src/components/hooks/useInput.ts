import { useState, ChangeEvent } from 'react'

interface InputProps {
  initialValue?: string | null
  required?: boolean
  validator?: RegExp
}

interface InputState {
  value: string
  valid: boolean
  error: boolean
}

/**
 * Custom hook to store text input data. It also handles input changes and validation.
 *
 * @param initialValue - the initial value of the input
 * @param required - if the value of the input is required
 * @param validator - regular expression that validates the input value
 */
const useInput = ({ initialValue, required, validator }: InputProps) => {
  const [input, setInput] = useState<InputState>({
    value: initialValue || '',
    valid: !!initialValue || !required,
    error: false
  })

  /**
   * Changes the input state based on the validated input value.
   */
  const change = (value: string): void => {
    const isValid = validator ? validator.test(value) : true
    const hasError = required ? !value || !isValid : !!value && !isValid

    setInput({ value, valid: !hasError, error: hasError })
  }

  /**
   * Changes the input state based on the specified event.
   */
  const onChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    change(event.currentTarget.value)
  }

  /**
   * Resets the input value to the initial value.
   */
  const reset = () => {
    setInput({
      value: initialValue || '',
      valid: !!initialValue || !required,
      error: false
    })
  }

  const bind = {
    value: input.value,
    error: input.error,
    required,
    onChange
  }

  return [input, bind, change, reset] as const
}

export default useInput
