import axios from 'axios'

class AuthService {
  public static loginUser(email: string, password: string) {
    return axios.post('/api/auth/login', { email, password }).then(response => {
      if (response.data) {
        localStorage.setItem('token', JSON.stringify(response.data))
      }
      return response.data
    })
  }

  public static logoutUser() {
    localStorage.removeItem('token')
  }

  public static registerBuilding(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    country: string,
    zipCode: string,
    city: string,
    streetAddress: string
  ) {
    return axios.post('/api/auth/register', {
      buildingAdmin: { email, password, firstName, lastName },
      buildingAddress: { country, zipCode, city, streetAddress }
    })
  }

  public static getToken(): string | null {
    const token = localStorage.getItem('token')
    return token ? JSON.parse(token) : null
  }
}

export default AuthService
