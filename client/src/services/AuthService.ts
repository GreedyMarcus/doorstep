import axios from 'axios'
import config from '../app/config'
import i18n from '../plugins/i18n'
import { UserLogin, UserInfo } from '../data/types/User'

class AuthService {
  public static getUserToken(): string | null {
    const token = localStorage.getItem(config.app.tokenKeyName)
    return token ? JSON.parse(token) : null
  }

  public static getAuthHeader() {
    const token = AuthService.getUserToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  public static getClientLanguageHeader() {
    // Custom header to provide localization for the server
    return { 'client-language': i18n.language }
  }

  public static async loginUser(data: UserLogin): Promise<UserInfo> {
    const result = await axios.post<UserLogin, UserInfo>('/api/auth/login', data)

    localStorage.setItem(config.app.tokenKeyName, result.token)
    return result
  }

  public static logoutUser() {
    localStorage.removeItem(config.app.tokenKeyName)
  }

  public static async getCurrentUser(): Promise<UserInfo> {
    const authHeader = AuthService.getAuthHeader()
    return axios.get<any, UserInfo>('/api/auth/whoami', { headers: authHeader })
  }

  public static async sendForgotPassword(email: string) {
    await axios.post('/api/auth/forgot-password', { email })
  }

  public static async resetPassword(token: string, password: string): Promise<UserInfo> {
    const result = await axios.post<UserPasswordReset, UserInfo>('/api/auth/reset-password', { token, password })

    localStorage.setItem(config.app.tokenKeyName, result.token)
    return result
  }
}

export default AuthService
