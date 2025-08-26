import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Service Worker registreren voor PWA (alleen in productie)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} else if (import.meta.env.DEV) {
  console.log('Service Worker disabled in development mode');
} else {
  console.log('Service Worker not supported');
}

// Functie om service worker cache te legen
const clearServiceWorkerCache = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
      }
      console.log('Service Worker cache cleared');
    } catch (error) {
      console.error('Error clearing service worker cache:', error);
    }
  }
};

// Clear cache on development
if (import.meta.env.DEV) {
  clearServiceWorkerCache();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
