import axios from 'axios'

const api = axios.create({
  baseURL: '/'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwtGoogle')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default api