import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echo-mini-social-media-app.onrender.com'
axios.defaults.baseURL = API_BASE_URL

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
