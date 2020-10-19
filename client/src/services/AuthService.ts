import axios from 'axios'

class AuthService {
  public static async loginUser(email: string, password: string) {
    const result = await axios.post('/api/auth/login', { email, password })

    if (result.data) {
      localStorage.setItem('doorstep-token', JSON.stringify(result.data.token))
    }
    return result.data
  }

  public static logoutUser() {
    localStorage.removeItem('token')
  }

  public static async registerBuilding(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    country: string,
    zipCode: string,
    city: string,
    streetAddress: string
  ) {
    const result = await axios.post('/api/auth/register', {
      buildingAdmin: { email, password, firstName, lastName },
      buildingAddress: { country, zipCode, city, streetAddress }
    })

    return result.status === 200
  }

  public static getToken(): string | null {
    const token = localStorage.getItem('doorstep-token')
    return token ? JSON.parse(token) : null
  }
}

export default AuthService
