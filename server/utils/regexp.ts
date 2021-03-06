/**
 * Reusable regular expressions for input validatons.
 */
export default {
  EMAIL: /^[\w-\.\+]+@([\w-]+\.)+[\w-]{2,4}$/,
  PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  REGISTRATION_NUMBER: /^[\d-]+$/,
  PHONE_NUMBER: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
}
