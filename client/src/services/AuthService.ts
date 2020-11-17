import axios from 'axios'
import config from '../app/config'
import i18n from '../plugins/i18n'
import { UserLogin, UserInfo } from '../data/types/User'

/**
 * Wrapper class that manages API calls to the authentication,
 * and authorization related endpoints.
 */
class AuthService {
  public static API_BASE = '/api/auth'

  /**
   * Returns the JWT token that is stored in local storage.
   */
  public static getUserToken(): string | null {
    const token = localStorage.getItem(config.app.tokenKeyName)
    return token ? JSON.parse(token) : null
  }

  /**
   * Generates authorization header for HTTP requests.
   */
  public static getAuthHeader() {
    const token = AuthService.getUserToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  /**
   * Returns the current language of the user.
   */
  public static getClientLanguageHeader() {
    return { 'client-language': i18n.language }
  }

  public static async loginUser(data: UserLogin): Promise<UserInfo> {
    const url = `${AuthService.API_BASE}/login`

    const result = await axios.post(url, data)
    const user = result.data as UserInfo

    localStorage.setItem(config.app.tokenKeyName, JSON.stringify(user.token))
    return user
  }

  public static logoutUser() {
    localStorage.removeItem(config.app.tokenKeyName)
  }

  public static async getCurrentUser(): Promise<UserInfo> {
    const authHeader = AuthService.getAuthHeader()

    const url = `${AuthService.API_BASE}/whoami`
    const config = { headers: authHeader }

    const result = await axios.get(url, config)
    return result.data as UserInfo
  }

  public static async sendForgotPassword(email: string) {
    const languageHeader = AuthService.getClientLanguageHeader()

    const url = `${AuthService.API_BASE}/forgot-password`
    const data = { email }
    const config = { headers: languageHeader }

    await axios.post(url, data, config)
  }

  public static async resetPassword(token: string, password: string): Promise<UserInfo> {
    const url = `${AuthService.API_BASE}/reset-password`
    const data = { token, password }

    const result = await axios.post(url, data)
    const user = result.data as UserInfo

    localStorage.setItem(config.app.tokenKeyName, JSON.stringify(user.token))
    return user
  }
}

export default AuthService
