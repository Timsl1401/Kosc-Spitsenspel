const CACHE_NAME = 'kosc-spitsenspel-v7';
const NAVIGATION_FALLBACK_URL = '/index.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Applogo.png',
  '/foto-bw-2000.jpg',
  '/foto-bw-1200.jpg',
  '/foto-bw-800.jpg',
  '/foto-bw-480.jpg'
];

// Development mode check
const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// PWA context check
const isStandalone = self.matchMedia('(display-mode: standalone)').matches || 
                     self.navigator.standalone === true;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Skip caching for development
  if (isDevelopment) {
    return;
  }

  // Handle navigation requests with network-first and offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(NAVIGATION_FALLBACK_URL))
    );
    return;
  }

  // For PWA standalone mode, be more careful with caching
  if (isStandalone) {
    // Always fetch fresh content for critical resources in PWA mode
    if (event.request.url.includes('index.html') || 
        event.request.url.includes('main') ||
        event.request.url.includes('app')) {
      return fetch(event.request);
    }
  }

  // Skip caching for API calls and dynamic content
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('vite') ||
      event.request.url.includes('@vite')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});
