import axios from 'axios';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

const setupAxiosInterceptors = () => {
  // Request interceptor to add token to headers
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Skip interceptor logic for login requests
      if (originalRequest.skipAuthInterceptor) {
        return Promise.reject(error);
      }

      // Check if error is 401 and we haven't already tried to refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axios(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        const token = localStorage.getItem('token');

        if (refreshToken && token) {
          try {
            const response = await axios.post('https://api.agrivisionlabs.tech/Auth/refresh', {
              token: token,
              refreshToken: refreshToken,
            });

            const { data } = response;
            
            // Calculate new expiration time
            const newExpirationTime = new Date(Date.now() + (data.expiresIn * 60 * 1000));
            
            // Update localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('expiresIn', data.expiresIn);
            localStorage.setItem('tokenExpiration', newExpirationTime.toISOString());
            localStorage.setItem('refreshTokenExpiration', data.refreshTokenExpiration);

            // Update axios default headers
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            
            // Process queued requests
            processQueue(null, data.token);
            
            // Retry original request
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return axios(originalRequest);
            
          } catch (refreshError) {
            // Refresh failed, redirect to login
            processQueue(refreshError, null);
            
            // Clear all tokens
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('expiresIn');
            localStorage.removeItem('tokenExpiration');
            localStorage.removeItem('refreshTokenExpiration');
            localStorage.removeItem('userId');
            
            // Redirect to login
            window.location.href = '/login';
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          // No refresh token available, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('expiresIn');
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('refreshTokenExpiration');
          localStorage.removeItem('userId');
          
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors; 