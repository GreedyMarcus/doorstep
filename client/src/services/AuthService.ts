import axios from 'axios'

class AuthService {
  public login(email: string, password: string) {
    // return axios.post('/auth/login', {
    //   email,
    //   password
    // })
  }

  public logout() {
    // localStorage.removeItem('token')
  }

  public register() {
    //
  }

  public getJwtToken() {
    // return JSON.parse(localStorage.getItem('token'))
  }
}

export default AuthService
