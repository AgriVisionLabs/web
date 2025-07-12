import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fortawesome/fontawesome-free/css/all.min.css"
import '@fontsource-variable/manrope';
import './index.css'
import App from './App.jsx'
import setupAxiosInterceptors from './utils/axios.js'

// Setup axios interceptors for automatic token refresh
setupAxiosInterceptors();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
