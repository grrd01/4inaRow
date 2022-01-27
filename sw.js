/**
 * grrd's 4 in a Row
 * Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
 * @license MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
const CACHE_NAME="grrds-4inarow-cache",CACHE_VERSION="v2.5",CACHE=CACHE_NAME+"-v2.5",urlsToCache=["index.html","Images/2online.svg","Images/2player.svg","Images/41.svg","Images/42.svg","Images/43.svg","Images/44.svg","Images/back.svg","Images/blue_off.png","Images/blue_on.png","Images/computer.svg","Images/dice.svg","Images/down.svg","Images/easy.svg","Images/hard.svg","Images/info.svg","Images/mail.svg","Images/medium.svg","Images/memo.svg","Images/ok.svg","Images/online.svg","Images/player.svg","Images/puzzle.svg","Images/red_off.png","Images/red_on.png","Images/settings.svg","Images/stats.svg","Images/tictactoe.svg","Images/title1.png","Images/title2eng.png","Scripts/4inaRow.css","Scripts/4inaRow.js","Scripts/exif.js","Scripts/flags32.css","Scripts/l10n.js","Scripts/images/flags32.png","Locales/bn/4inaow.properties","Locales/cs/4inaow.properties","Locales/de/4inaow.properties","Locales/en/4inaow.properties","Locales/eo/4inaow.properties","Locales/es/4inaow.properties","Locales/fa/4inaow.properties","Locales/fr/4inaow.properties","Locales/hr/4inaow.properties","Locales/it/4inaow.properties","Locales/nl/4inaow.properties","Locales/pl/4inaow.properties","Locales/pt_BR/4inaow.properties","Locales/pt_PT/4inaow.properties","Locales/rm/4inaow.properties","Locales/ru/4inaow.properties","Locales/sv/4inaow.properties","Locales/ta/4inaow.properties","Locales/tr/4inaow.properties","Locales/locales.ini","Sounds/click.mp3","Sounds/click.ogg","Sounds/ding.mp3","Sounds/ding.ogg"];self.addEventListener("install",(function(e){e.waitUntil(caches.open(CACHE).then((function(e){return console.log("Opened cache"),e.addAll(urlsToCache)})))})),self.addEventListener("fetch",(function(e){e.respondWith(caches.match(e.request).then((function(s){if(s)return s;let a=e.request.clone();return fetch(a).then((function(s){if(!s||200!==s.status||"basic"!==s.type)return s;let a=s.clone();return caches.open(CACHE).then((function(s){s.put(e.request,a)})),s}))})))})),self.addEventListener("activate",(function(e){e.waitUntil(caches.keys().then((function(e){return Promise.all(e.map((function(e){if(0===e.indexOf(CACHE_NAME)&&-1===e.indexOf("v2.5"))return console.log(e+" deleted"),caches.delete(e)})))})))}));