// Workbox setup for image caching and lazy loading optimization
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Load Workbox from CDN
        const script = document.createElement('script');
        script.src = 'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js';
        script.onload = () => {
            if (workbox) {
                console.log('Workbox loaded successfully');

                // Configure Workbox
                workbox.setConfig({
                    debug: false
                });

                // Precache images strategy
                workbox.routing.registerRoute(
                    ({ request }) => request.destination === 'image',
                    new workbox.strategies.CacheFirst({
                        cacheName: 'images-cache',
                        plugins: [
                            {
                                cacheKeyWillBeUsed: async ({ request }) => {
                                    // Remove query parameters for better caching
                                    const url = new URL(request.url);
                                    url.search = '';
                                    return url.href;
                                }
                            },
                            {
                                cacheWillUpdate: async ({ response }) => {
                                    // Only cache successful responses
                                    return response.status === 200;
                                }
                            }
                        ],
                        matchOptions: {
                            ignoreVary: true
                        }
                    })
                );

                // Cache thumbnail images with different strategy
                workbox.routing.registerRoute(
                    ({ url }) => url.pathname.includes('_thumb.webp'),
                    new workbox.strategies.CacheFirst({
                        cacheName: 'thumbnails-cache',
                        plugins: [
                            {
                                cacheExpiration: {
                                    maxEntries: 200,
                                    maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
                                }
                            }
                        ]
                    })
                );

                // Preload critical images
                workbox.routing.registerRoute(
                    ({ url }) => url.pathname.includes('/cover/') || url.pathname.includes('/featured/'),
                    new workbox.strategies.NetworkFirst({
                        cacheName: 'critical-images',
                        plugins: [
                            {
                                cacheExpiration: {
                                    maxEntries: 50,
                                    maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                                }
                            }
                        ]
                    })
                );

                // Make workbox available globally for the lazy loading system
                window.workbox = workbox;

                console.log('Workbox configured for image optimization');
            }
        };
        script.onerror = () => {
            console.warn('Failed to load Workbox');
        };
        document.head.appendChild(script);
    });
}
