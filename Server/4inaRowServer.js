/*
 * grrd's 4 in a Row
 * Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
 * Licensed under the MPL License
 *
 * Instructions:
 * - Install node (https://nodejs.org/en/)
 * - Install dependencies: npm install (in the path where package.json is)
 * - Start the application: node 4inaRowServer.js (in the path where 4inaRowServer.js is)
 * - Start in background (Linux): nohup node 4inaRowServer.js &
 *
 * Useful Commands:
 * - get Version of Node: node -v
 * - get Version of NPM: npm -v
 * - get installed Packages: npm ls --depth=0
 * - set debug level: set DEBUG=*
 * - list running processes: ps -ef
 * - see running node-apps: pm2 list
 *
 * App mit cron job persistent starten
 * /usr/bin/flock -n /tmp/4inarowlock.lock ${HOME}/nodejs/bin/node ${HOME}/4inarow/server/4inaRowServer.js
 * /usr/bin/flock -n /tmp/abkquizlock.lock ${HOME}/nodejs/bin/node ${HOME}/abkuerzungsquiz/server/server.js
 *
 * Useful Paths:
  * - /srv/4inarow/4inarow_server.js - Node-Script
 * - /etc/nginx/sites-available/default - WebServer-Config
 * - /var/www/html - WebServer Root-Verzeichnis
 * - /etc/letsencrypt/live/grrd.duckdns.org - letsencrypt-Zertifikate
 */

/*jslint browser:true, for:true */ /*global  require __dirname */

(function () {
    "use strict";

    var fs = require("fs");

    var options = {
        key: fs.readFileSync("/etc/letsencrypt/live/grrd.duckdns.org/privkey.pem"),
        cert: fs.readFileSync("/etc/letsencrypt/live/grrd.duckdns.org/fullchain.pem")
    };

    function handler(ignore, res) {
        fs.readFile(
            __dirname + "/index.html",
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading index.html");
                }

                res.writeHead(200);
                res.end(data);
            }
        );
    }

    var app = require("https").createServer(options, handler);
    var io = require("socket.io").listen(app);
    var Moniker = require("moniker");
    app.listen(5000);

    var users = [];

    var startgame = function () {
        var i;
        for (i = 0; i < users.length; i += 1) {
            if (i === users.length - 1) {
                // kein freier Gegner
                io.to(users[i].id).emit("connect", users[i]);
            } else {
                // Gegner vorhanden
                if (users[i].opponent === null) {
                    users[i].opponent = users[users.length - 1].id;
                    users[i].role = "0";
                    io.to(users[i].id).emit("startgame", users[i]);
                    users[users.length - 1].opponent = users[i].id;
                    users[users.length - 1].role = "1";
                    io.to(users[users.length - 1].id).emit("startgame", users[users.length - 1]);
                    break;
                }
            }
        }
    };

    var addUser = function (socket) {
        var user = {
            name: Moniker.choose(),
            id: socket.id,
            role: null,
            opponent: null
        };
        users.push(user);
        startgame();
        return user;
    };

    var removeUser = function (user) {
        var i;
        for (i = 0; i < users.length; i += 1) {
            if (user.name === users[i].name) {
                users.splice(i, 1);
                return;
            }
        }
    };

    io.on("connection", function (socket) {
        var user = addUser(socket);

        socket.on("disconnect", function () {
            if (user.opponent !== null) {
                io.to(user.opponent).emit("quit", user);
            }
            removeUser(user);
        });

        socket.on("playsend", function (data) {
            io.to(data.to).emit("playget", data);
        });

        socket.on("usersend", function (data) {
            io.to(data.to).emit("userget", data);
        });
    });

}());