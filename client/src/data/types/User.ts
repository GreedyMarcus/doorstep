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
  companyId?: number
  token: string
}

export type UserShortInfo = {
  email: string
  fullName: string
}

export type UserRegister = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type GuestUserRegister = {
  email: string
  firstName: string
  lastName: string
}

export type UserUpdate = {
  id: number
  firstName: string
  lastName: string
}

export type UserCredentials = {
  firstName: string
  lastName: string
  password?: string
}

export type BusinessHostInfo = {
  id: number
  firstName: string
  lastName: string
  email: string
  createdAt: Date
}
