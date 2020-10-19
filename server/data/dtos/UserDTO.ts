export interface UserInfoDTO {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UserLoginDTO {
  email: string
  password: string
}

export interface UserLoginResultDTO {
  id: number
  firstName: string
  lastName: string
  email: string
  role: string
  token: string
}
