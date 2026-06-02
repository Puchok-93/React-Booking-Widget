import axios from 'axios'

export const apiClient = axios.create({
  timeout: 30000,

  auth: {
    username:
      import.meta.env.VITE_API_LOGIN,

    password:
      import.meta.env.VITE_API_PASSWORD,
  },

  headers: {
    'Content-Type': 'application/json',

    Accept: 'application/json',
  },
})