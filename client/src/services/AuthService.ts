import axios from 'axios'
import { RegisterUserDetails } from '../data/types/User'

const TOKEN_KEY = 'doorstep-token'

class AuthService {
  public static async loginUser(email: string, password: string) {
    const result = await axios.post('/api/auth/login', { email, password })

    if (result.data) {
      localStorage.setItem(TOKEN_KEY, JSON.stringify(result.data.token))
    }
    return result.data
  }

  public static logoutUser() {
    localStorage.removeItem(TOKEN_KEY)
  }

  public static async registerBuilding(userDetails: RegisterUserDetails) {
    const { email, password, firstName, lastName, country, zipCode, city, streetAddress } = userDetails

    const result = await axios.post('/api/auth/register', {
      buildingAdmin: { email, password, firstName, lastName },
      buildingAddress: { country, zipCode, city, streetAddress }
    })

    return result.status === 200
  }

  public static getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY)
    return token ? JSON.parse(token) : null
  }
}

export default AuthService
