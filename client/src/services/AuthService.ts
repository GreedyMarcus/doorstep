import axios from 'axios'
import config from '../app/config'
import { RegisterUserDetails, UserLoginResult } from '../data/types/User'

class AuthService {
  public static async loginUser(email: string, password: string) {
    const result = await axios.post('/api/auth/login', { email, password })

    if (result.data) {
      localStorage.setItem(config.auth.tokenKey, JSON.stringify(result.data.token))
    }
    return result.data
  }

  public static logoutUser() {
    localStorage.removeItem(config.auth.tokenKey)
  }

  public static async registerBuilding(userDetails: RegisterUserDetails) {
    const { email, password, firstName, lastName, country, zipCode, city, streetAddress } = userDetails

    const result = await axios.post('/api/auth/register', {
      buildingAdmin: { email, password, firstName, lastName },
      buildingAddress: { country, zipCode, city, streetAddress }
    })

    return result.status === 200
  }

  public static async getCurrentUser(): Promise<UserLoginResult> {
    const user = await axios.get('/api/auth/whoami', { headers: AuthService.getAuthHeader() })
    return user.data
  }

  public static getToken(): string | null {
    const token = localStorage.getItem(config.auth.tokenKey)
    return token ? JSON.parse(token) : null
  }

  public static getAuthHeader() {
    const token = AuthService.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  public static async sendForgotPassword(email: string): Promise<boolean> {
    const result = await axios.post('/api/auth/forgot-password', { email })
    return result.status === 200
  }
}

export default AuthService
