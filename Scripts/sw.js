var CACHE_NAME = 'grrds-4inarow-cache-v1.0';
var urlsToCache = [
    '../index.html',
    '../images/2online.svg',
    '../images/2online_black.svg',
    '../images/2player.svg',
    '../images/41.svg',
    '../images/42.svg',
    '../images/43.svg',
    '../images/44.svg',
    '../images/blue_off.png',
    '../images/blue_on.png',
    '../images/computer.svg',
    '../images/dice.svg',
    '../images/easy.svg',
    '../images/easy_black.svg',
    '../images/hard.svg',
    '../images/hard_black.svg',
    '../images/mail.svg',
    '../images/medium.svg',
    '../images/medium_black.svg',
    '../images/online.svg',
    '../images/player.svg',
    '../images/puzzle.svg',
    '../images/puzzle_min.svg',
    '../images/red_off.png',
    '../images/red_on.png',
    '../images/settings.png',
    '../images/stats.png',
    '../images/title1.png',
    '../images/title2eng.png',
    '4inaRow.css',
    '4inaRow.js',
    'binaryajax.js',
    'exif.js',
    'flags32.css',
    'jquery.mobile-1.3.2.min.css',
    'jquery.mobile-1.3.2.min.js',
    'jquery-1.9.1.min.js',
    'l10n.js',
    'sw.js',
    'images/ajax-loader.gif',
    'images/ajax-loader.png',
    'images/flags32.png',
    'images/icons-18-black.png',
    'images/icons-18-white.png',
    'images/icons-36-black.png',
    'images/icons-36-white.png',
    '../Locales/bn/4inaow.properties',
    '../Locales/cs/4inaow.properties',
    '../Locales/de/4inaow.properties',
    '../Locales/en/4inaow.properties',
    '../Locales/eo/4inaow.properties',
    '../Locales/es/4inaow.properties',
    '../Locales/fa/4inaow.properties',
    '../Locales/fr/4inaow.properties',
    '../Locales/hr/4inaow.properties',
    '../Locales/it/4inaow.properties',
    '../Locales/nl/4inaow.properties',
    '../Locales/pl/4inaow.properties',
    '../Locales/pt_BR/4inaow.properties',
    '../Locales/pt_PT/4inaow.properties',
    '../Locales/rm/4inaow.properties',
    '../Locales/ru/4inaow.properties',
    '../Locales/sv/4inaow.properties',
    '../Locales/ta/4inaow.properties',
    '../Locales/tr/4inaow.properties',
    '../Locales/it/4inaow.properties',
    '../Locales/locales.ini',
    '../Sounds/click.mp3',
    '../Sounds/click.ogg',
    '../Sounds/ding.mp3',
    '../Sounds/ding.ogg'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                var fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});