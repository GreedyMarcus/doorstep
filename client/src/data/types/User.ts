export type UserLoginResult = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  token: string
}

export type RegisterUserDetails = {
  email: string
  password: string
  firstName: string
  lastName: string
  country: string
  zipCode: string
  city: string
  streetAddress: string
}
