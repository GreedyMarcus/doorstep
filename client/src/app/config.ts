export default {
  app: {
    env: process.env.NODE_ENV
  },
  auth: {
    tokenKey: 'doorstep-token'
  },
  tinyMCE: {
    apiKey: process.env.REACT_APP_TINYMCE_API_KEY
  }
}
