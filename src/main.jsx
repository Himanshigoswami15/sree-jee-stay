import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

function parseJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
  } catch (e) {
    try {
      let base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      return JSON.parse(atob(base64));
    } catch (err) {
      return null;
    }
  }
}

function purgeTokenIfMismatchOnBoot() {
  if (typeof window === 'undefined') return;
  const token = localStorage.getItem('jj_access_token');
  if (!token) return;

  const currentSlug = window.location.pathname.split('/')[1]?.toLowerCase();
  if (!currentSlug || currentSlug === 'r' || currentSlug === 'api') return;

  const payload = parseJwtPayload(token);
  if (!payload) {
    localStorage.removeItem('jj_access_token');
    return;
  }

  const tokenHotel = (payload.hotelSlug || payload.hotelId || '').toLowerCase();
  if (tokenHotel && tokenHotel !== currentSlug) {
    localStorage.removeItem('jj_access_token');
  }
}

purgeTokenIfMismatchOnBoot();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
