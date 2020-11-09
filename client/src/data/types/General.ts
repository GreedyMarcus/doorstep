export type Notification = {
  type: 'error' | 'warning' | 'info' | 'success'
  message: string
  duration?: number
}

export type Address = {
  country: string
  zipCode: string
  city: string
  streetAddress: string
}
