export interface UserLogin {
  email: string
  password: string
}

export interface UserInfo {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  buildingId?: number
  companyId?: number
  token?: string
}

export interface UserRegister {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface GuestUserRegister {
  email: string
  firstName: string
  lastName: string
}

export interface UserShortInfo {
  email: string
  fullName: string
}

export interface UserUpdate {
  id: number
  firstName: string
  lastName: string
}

export interface UserCredentials {
  firstName: string
  lastName: string
  password?: string
}
export interface UserCredentialsUpdate {
  firstName: string
  lastName: string
  password: string
}
