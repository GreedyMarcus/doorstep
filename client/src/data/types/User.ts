export type UserLogin = {
  email: string
  password: string
}

export type UserInfo = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  buildingId?: number
  token: string
}

export type UserRegister = {
  email: string
  password: string
  firstName: string
  lastName: string
}
