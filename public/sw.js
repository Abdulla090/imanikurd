// This service worker immediately unregisters itself
// It exists to clean up stale service workers from previous builds
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', () => {
    self.registration.unregister().then(() => {
        console.log('Old service worker unregistered successfully');
    });
});
