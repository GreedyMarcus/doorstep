import React from 'react'
import Container from '@material-ui/core/Container'
import LoginForm from '../../components/LoginForm'

const Login: React.FC = () => {
  const handleLogin = () => {
    console.log('HANDLING LOGIN...')
  }

  return (
    <Container component="main" maxWidth="xs">
      <LoginForm onLogin={handleLogin} />
    </Container>
  )
}

export default Login
