import { useState, useCallback, ChangeEvent } from 'react'

export type InputChangeEvent = ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
export type InputBinding = {
  value: string
  error: boolean
  required: boolean
  onChange: (event: InputChangeEvent) => void
}

const useInput = (value: string, required: boolean, validator?: RegExp) => {
  const [input, setInput] = useState({ value, error: false })

  const onChange = useCallback(
    (event: InputChangeEvent): void => {
      const newValue = event.target.value
      const isValid = validator ? validator.test(newValue) : true
      const hasError = required ? newValue === '' || !isValid : false

      setInput({ value: newValue, error: hasError })
    },
    [required, validator]
  )

  const reset = () => setInput({ value, error: false })

  const bind = {
    value: input.value,
    error: input.error,
    required,
    onChange
  }

  return [input, bind, reset] as const
}

export default useInput
