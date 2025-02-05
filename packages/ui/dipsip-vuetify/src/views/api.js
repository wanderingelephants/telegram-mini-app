import axios from 'axios'

const api = axios.create({
  baseURL: '/'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('AUTH_TOKEN')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// api.js
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get current Firebase user
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          // Force refresh token
          const newToken = await user.getIdToken(true);
          localStorage.setItem('AUTH_TOKEN', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        // Handle refresh failure
        localStorage.removeItem('AUTH_TOKEN');
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default api