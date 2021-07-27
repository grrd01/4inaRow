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

    function getNewestFile(dir, regexp) {
        var path = require("path");
        var newest = null;
        var files = fs.readdirSync(dir);
        var i;
        var f_time;
        var newest_time;

        for (i = 0; i < files.length; i += 1) {
            if (regexp.test(files[i])) {
                if (newest === null) {
                    newest = files[i];
                    newest_time = fs.statSync(path.join(dir, newest)).mtime.getTime();
                } else {
                    f_time = fs.statSync(path.join(dir, files[i])).mtime.getTime();
                    if (f_time > newest_time) {
                        newest = files[i];
                        newest_time = f_time;
                    }
                }
            }
        }

        if (newest !== null) {
            return (path.join(dir, newest));
        }
        return null;
    }

    var cert = getNewestFile("/home/grrdahos/ssl/certs", new RegExp("^grrd_a2hosted_com_.*.crt$"));
    var key = getNewestFile("/home/grrdahos/ssl/keys", new RegExp("^" + cert.substring(43, 54) + ".*.key$"));

    //var cert = getNewestFile("/home/grrdahos/ssl/certs", new RegExp("^autodiscover_grrd_a2hosted_com_.*.crt$"));
    //var key = getNewestFile("/home/grrdahos/ssl/keys", new RegExp("^" + cert.substring(56, 67) + ".*.key$"));

    //var cert = getNewestFile("/home/grrdahos/ssl/certs", new RegExp("^www_grrd_a2hosted_com_.*.crt$"));
    //var key = getNewestFile("/home/grrdahos/ssl/keys", new RegExp("^" + cert.substring(47, 59) + ".*.key$"));

    var options = {
        // key: fs.readFileSync(getNewestFile("/home/grrdahos/ssl/keys", new RegExp(".*.key$"))),
        // cert: fs.readFileSync(getNewestFile("/home/grrdahos/ssl/certs", new RegExp(".*.crt$")))

        //key: fs.readFileSync('/home/grrdahos/ssl/keys/ccb66_a7ac7_6ddcf89d8981573b079f89c8b8daf887.key'),
        //cert: fs.readFileSync('/home/grrdahos/ssl/certs/autodiscover_grrd_a2hosted_com_ccb66_a7ac7_1595537626_eb95d98d4f2242d4da63ed4627e27fe5.crt')

        //key: fs.readFileSync('/home/grrdahos/ssl/keys/a7afe_0a07b_357de3eb01043d7b248bf3c4da4bf1c4.key'),
        //cert: fs.readFileSync('/home/grrdahos/ssl/certs/mail_grrd_a2hosted_com_a7afe_0a07b_1606084124_98e2622cbd2de7af5e3614fa8105f1c8.crt')

        //key: fs.readFileSync('/home/grrdahos/ssl/keys/be176_24b4d_54152aa0e81acb89dac0e59cd80846d7.key'),
        //cert: fs.readFileSync('/home/grrdahos/ssl/certs/www_grrd_a2hosted_com_be176_24b4d_1616628656_4a3291f8218a8b0189235d7df82495a9.crt')

        //key: fs.readFileSync('/home/grrdahos/ssl/keys/b3168_a7153_77cf72e3fea7bbf85c089cf9d812b144.key'),
        //cert: fs.readFileSync('/home/grrdahos/ssl/certs/grrd_a2hosted_com_b3168_a7153_1633823999_4cc33737183503270c3856382a0a54df.crt')

        key: fs.readFileSync(key),
        cert: fs.readFileSync(cert)
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
    app.listen(49152);

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