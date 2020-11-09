export interface UserLoginDTO {
  email: string
  password: string
}

export interface UserInfoDTO {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  buildingId?: number
  token?: string
}

export interface UserRegisterDTO {
  email: string
  password: string
  firstName: string
  lastName: string
}
