const CACHE_NAME = 'mis-servicios-v1';
const URLS_TO_CACHE = [
    '/mis-servicios',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle mis-servicios requests or static assets
    if (!event.request.url.includes('/mis-servicios') && !event.request.url.includes('/icons/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                return fetch(event.request).then(
                    (response) => {
                        // Check if we received a valid response
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
                    }
                );
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// PUSH NOTIFICATIONS
self.addEventListener('push', function (event) {
    if (event.data) {
        const payload = event.data.json();
        const title = payload.title || 'Nueva Notificación';
        const isUrgent = payload.urgent === true;

        const options = {
            body: payload.body || 'Tienes un nuevo mensaje.',
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            data: { url: '/mis-servicios' },

            // Urgent vs Silent logic
            silent: !isUrgent, // Default silent (true) unless urgent
            vibrate: isUrgent ? [200, 100, 200] : undefined, // Vibrate only if urgent
            renotify: isUrgent, // Alert again if urgent
            tag: isUrgent ? 'urgent-notification' : 'normal-notification'
        };

        event.waitUntil(self.registration.showNotification(title, options));
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url.includes('/mis-servicios') && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, open a new window
            if (clients.openWindow) {
                return clients.openWindow('/mis-servicios');
            }
        })
    );
});
