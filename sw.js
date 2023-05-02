/**
 * grrd's 4 in a Row
 * Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
 * @license MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/*jslint devel: true, browser: true */ /*global  self  */

const CACHE_NAME = "grrds-4inarow-cache";
const CACHE_VERSION = "v2.7";
const CACHE = CACHE_NAME + "-" + CACHE_VERSION;

const urlsToCache = [
    "index.html",
    "Images/2online.svg",
    "Images/2player.svg",
    "Images/41.svg",
    "Images/42.svg",
    "Images/43.svg",
    "Images/44.svg",
    "Images/back.svg",
    "Images/blue_off.png",
    "Images/blue_on.png",
    "Images/computer.svg",
    "Images/dice.svg",
    "Images/down.svg",
    "Images/easy.svg",
    "Images/hard.svg",
    "Images/info.svg",
    "Images/mail.svg",
    "Images/medium.svg",
    "Images/memo.svg",
    "Images/ok.svg",
    "Images/online.svg",
    "Images/player.svg",
    "Images/puzzle.svg",
    "Images/red_off.png",
    "Images/red_on.png",
    "Images/reversi.svg",
    "Images/search.svg",
    "Images/settings.svg",
    "Images/stats.svg",
    "Images/tictactoe.svg",
    "Images/title1.png",
    "Images/title2eng.png",
    "Scripts/4inaRow.css",
    "Scripts/4inaRow.js",
    "Scripts/exif.js",
    "Scripts/flags32.css",
    "Scripts/l10n.js",
    "Scripts/images/flags32.png",
    "Locales/bn/4inaow.properties",
    "Locales/cs/4inaow.properties",
    "Locales/de/4inaow.properties",
    "Locales/en/4inaow.properties",
    "Locales/eo/4inaow.properties",
    "Locales/es/4inaow.properties",
    "Locales/fa/4inaow.properties",
    "Locales/fr/4inaow.properties",
    "Locales/hr/4inaow.properties",
    "Locales/it/4inaow.properties",
    "Locales/nl/4inaow.properties",
    "Locales/pl/4inaow.properties",
    "Locales/pt_BR/4inaow.properties",
    "Locales/pt_PT/4inaow.properties",
    "Locales/rm/4inaow.properties",
    "Locales/ru/4inaow.properties",
    "Locales/sv/4inaow.properties",
    "Locales/ta/4inaow.properties",
    "Locales/tr/4inaow.properties",
    "Locales/locales.ini",
    "Sounds/click.mp3",
    "Sounds/click.ogg",
    "Sounds/ding.mp3",
    "Sounds/ding.ogg"
];

self.addEventListener("install", function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE)
            .then(function (cache) {
                console.log("Opened cache");
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                let fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    function (response) {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== "basic") {
                            return response;
                        }

                        let responseToCache = response.clone();

                        caches.open(CACHE)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (cacheName) {
                if (cacheName.indexOf(CACHE_NAME) === 0 && cacheName.indexOf(CACHE_VERSION) === -1) {
                    console.log(cacheName + " deleted");
                    return caches.delete(cacheName);
                }
            }));
        })
    );
});
