/*
 * grrd's 4 in a Row
 * Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
 * Licensed under the MPL License
 *
 * Instructions:
 * - Install node (https://nodejs.org/en/)
 * - Install dependencies: npm install (in the path where package.json is)
 * - Start the application: node 4inaRowServer.js (in the path where 4inaRowServer.js is)
 *
 * Useful Commands:
 * - get Version of Node: node -v
 * - get Version of NPM: npm -v
 * - get installed Packages: npm ls --depth=0
 * - set debug level: set DEBUG=*
 */

/*jslint browser:true, for:true */ /*global  require __dirname */

(function () {
    "use strict";

    var fs = require("fs");

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

    var app = require("http").createServer(handler);
    var io = require("socket.io").listen(app);
    var Moniker = require("moniker");
    app.listen(3250);

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