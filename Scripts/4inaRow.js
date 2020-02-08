/**
 * grrd's 4 in a Row
 * Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
 * @license MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

/*jslint browser:true, for:true, devel: true, this: true, long: true */ /*global  window, io, EXIF, FileReader  */

(function () {
    "use strict";
    //document.webL10n.setLanguage("ta");
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());

    var $ = function (id) {
        return document.getElementById(id);
    };

    var langReady = false;
    var ii;
    var animate = false;
    var gHeight;
    var gWidth;
    var col = ["col0", "col1", "col2", "col3", "col4", "col5", "col6"];
    var col_canvas = [];
    var col_context = [];
    var field = [];
    for (ii = 0; ii < 6; ii += 1) {
        field[ii] = [];
        field[ii][6] = undefined;
    }
    var winRow = [];
    var winCol = [];
    var numPossible;
    var stoneTotal;
    var stoneBest;
    var stoneCount;
    var mode = null;
    var gSound = true;
    var gCountry;
    var gOwnImage = false;
    var gOwnName = false;
    var gSendImage;
    var p1_name;
    var p2_name;
    var $game = $("game");
    var $title = $("title");
    var $popupInfo = $("popupInfo");
    var $popupStats = $("popupStats");
    var $popupSettings = $("popupSettings");
    var $inputImage = $("inputImage");
    var $inputName = $("inputName");
    var $b_sound = $("b_sound");
    var $l_country = $("l_country");
    var $txt_search = $("txt_search");
    var $bt_country = $("bt_country");
    var $P1country = $("P1country");
    var $P2country = $("P2country");
    var url_param;

    var rating = [];
    var bestRating = [];
    var color = ["#ff0080", "#6969EE"];
    var bColor = ["#D6016B", "#5A5ACE"];
    var zColor = ["#FD6BB4", "#9393EF"];
    var player = 0;
    var P1LightImg = ["Images/red_on.png", "Images/red_off.png"];
    var P2LightImg = ["Images/blue_on.png", "Images/blue_off.png"];
    var games = 0;
    var siege = [0, 0];
    var colNr;
    var row;
    var computerCol;
    var computerRow;
    var fourInARow;
    var space;
    var showFlag;
    var possibleFlag = Boolean(false);
    var topBis;
    var topAkt;
    var colWidth;
    var colHeight;

    var maxValue;
    var onlineWin;
    var onlineLoose;
    var easyWin;
    var easyLoose;
    var mediumWin;
    var mediumLoose;
    var hardWin;
    var hardLoose;
    var onlineOpponentWin;
    var onlineOpponentLoose;

    var socket;
    var user;
    var lastStart;
    var lastQuit;
    var lastRound = null;
    var countRound = 0;
    var onExit = false;
    var fromOnline = false;

    var localStorageOK = (function () {
        var mod = "modernizr";
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch (ignore) {
            return false;
        }
    }());

    function fShowPopup(e) {
        e.classList.remove("popup-init");
        e.classList.remove("popup-hide");
        e.classList.add("popup-show");
    }
    function fHidePopup(e) {
        e.classList.remove("popup-show");
        e.classList.add("popup-hide");
        setTimeout(function(){
            e.scrollTop = 0;
        }, 1050);
    }

    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("sw.js").then(function (registration) {
                console.log("ServiceWorker registration successful with scope: ", registration.scope);
            }, function (err) {
                console.log("ServiceWorker registration failed: ", err);
            });
        });
    }

    if (!navigator.onLine || typeof io === "undefined") {
        // offline :(
        $("bt_online").classList.add("ui-disabled");
    }

    function drawCircle(topAkt, colNr, color, bColor) {
        col_context[colNr].beginPath();
        col_context[colNr].arc(colWidth / 2, topAkt, colWidth / 2 * 0.85, 0, 2 * Math.PI, false);
        col_context[colNr].fillStyle = color;
        col_context[colNr].fill();
        col_context[colNr].lineWidth = colWidth / 20;
        col_context[colNr].strokeStyle = bColor;
        col_context[colNr].stroke();
    }

    function contentFormatting() {
        var i;
        var j;
        var gradient;

        gHeight = document.documentElement.clientHeight;
        gWidth = document.documentElement.clientWidth;
        if (gHeight > gWidth) {
            // column width
            colWidth = Math.min((gWidth - 50) / 7, (gHeight - 140) / 6);
            colHeight = Math.max(6 * colWidth * 0.85, gHeight - 190);
        } else {
            // column width
            colWidth = Math.min((gWidth - 140 - 60) / 7, (gHeight - 20) / 6);
            colHeight = Math.max(6 * colWidth * 0.85, gHeight - 95);
        }
        for (i = 0; i < col.length; i += 1) {
            document.getElementById(col[i]).width = colWidth;
            document.getElementById(col[i]).height = colHeight;
        }

        for (j = 0; j < field[0].length; j += 1) {
            if (col_context[j] === undefined) {
                break;
            }
            for (i = 0; i < field.length; i += 1) {
                gradient = col_context[j].createLinearGradient(
                    0,
                    (field.length - i - 1) * 0.9 * colWidth,
                    colWidth * 0.7,
                    (field.length - i - 1) * 0.9 * colWidth + colWidth * 0.7
                );
                gradient.addColorStop(0, "black");
                gradient.addColorStop(1, "grey");

                col_context[j].beginPath();
                col_context[j].arc(colWidth / 2, (field.length - i - 0.5) * colWidth * 0.85, colWidth / 2 * 0.7, 0, 2 * Math.PI, false);
                col_context[j].lineWidth = colWidth / 10;
                col_context[j].strokeStyle = gradient;
                col_context[j].stroke();
                //break;
            }
        }


        for (j = 0; j < field[0].length; j += 1) {
            if (col_context[j] === undefined) {
                break;
            }
            col_context[j].save();
            col_context[j].beginPath();
            for (i = 0; i < field.length; i += 1) {
                col_context[j].arc(colWidth / 2, (field.length - i - 0.5) * colWidth * 0.85, colWidth / 2 * 0.7, 0, 2 * Math.PI, false);
            }
            col_context[j].clip();
            col_context[j].clearRect(0, 0, colWidth, colHeight);
        }

        for (i = 0; i < field.length; i += 1) {
            for (j = 0; j < field[i].length; j += 1) {
                if (field[i][j] !== undefined) {
                    drawCircle((field.length - i - 0.5) * colWidth * 0.85, j, color[field[i][j]], bColor[field[i][j]]);
                }
            }
        }
        if (animate) {
            topAkt = topAkt / topBis * ((field.length - row - 0.5) * colWidth * 0.85);
            topBis = (field.length - row - 0.5) * colWidth * 0.85;
        }
    }

    function clearBoard() {
        var i;
        var j;
        countRound = 0;
        lastRound = null;
        for (i = 0; i < field.length; i += 1) {
            for (j = 0; j < field[i].length; j += 1) {
                field[i][j] = undefined;
                if (i === 0) {
                    col_context[j].clearRect(0, 0, colWidth, colHeight);
                }
            }
        }
        contentFormatting();
    }

    function setLights() {
        $("P1light").src = P1LightImg[player];
        $("P2light").src = P2LightImg[1 - player];
    }

    function setStats() {
        var valWin;
        var valLoose;
        if (localStorageOK) {
            valWin = parseInt(localStorage.getItem(mode + "_win") || 0);
            valLoose = parseInt(localStorage.getItem(mode + "_loose") || 0);
        } else {
            valWin = 0;
            valLoose = 0;
        }
        if (mode === "online") {
            maxValue = Math.max(valWin + valLoose, onlineOpponentWin + onlineOpponentLoose, 1);
            $("P" + (1 + parseInt(user.role)) + "win").style.width = (100 / maxValue * valWin) + "%";
            $("P" + (1 + parseInt(user.role)) + "loose").style.width = (100 / maxValue * valLoose) + "%";
            $("P" + (2 - parseInt(user.role)) + "win").style.width = (100 / maxValue * onlineOpponentWin) + "%";
            $("P" + (2 - parseInt(user.role)) + "loose").style.width = (100 / maxValue * onlineOpponentLoose) + "%";
        } else {
            if (mode === "2player") {
                valWin = siege[0];
                valLoose = siege[1];
            }
            maxValue = Math.max(valWin + valLoose, 1);
            $("P1win").style.width = (100 / maxValue * valWin) + "%";
            $("P1loose").style.width = (100 / maxValue * valLoose) + "%";
            $("P2win").style.width = (100 / maxValue * valLoose) + "%";
            $("P2loose").style.width = (100 / maxValue * valWin) + "%";
        }
    }

    function updateStats(statEvent) {
        var storageItem;
        var storageValue;
        if (!localStorageOK) {
            return;
        }
        if (mode && statEvent) {
            storageItem = mode + "_" + statEvent;
            storageValue = parseInt(localStorage.getItem(storageItem) || 0) + 1;
            localStorage.setItem(storageItem, storageValue);
        }
        easyWin = localStorage.getItem("easy_win") || 0;
        easyLoose = localStorage.getItem("easy_loose") || 0;
        mediumWin = localStorage.getItem("medium_win") || 0;
        mediumLoose = localStorage.getItem("medium_loose") || 0;
        hardWin = localStorage.getItem("hard_win") || 0;
        hardLoose = localStorage.getItem("hard_loose") || 0;
        onlineWin = localStorage.getItem("online_win") || 0;
        onlineLoose = localStorage.getItem("online_loose") || 0;

        maxValue = Math.max(easyWin, easyLoose, mediumWin, mediumLoose, hardWin, hardLoose, onlineWin, onlineLoose, 1);

        document.getElementById("easy_win").innerHTML = document.webL10n.get("lb_won") + " " + easyWin;
        document.getElementById("easy_loose").innerHTML = document.webL10n.get("lb_lost") + " " + easyLoose;
        document.getElementById("medium_win").innerHTML = document.webL10n.get("lb_won") + " " + mediumWin;
        document.getElementById("medium_loose").innerHTML = document.webL10n.get("lb_lost") + " " + mediumLoose;
        document.getElementById("hard_win").innerHTML = document.webL10n.get("lb_won") + " " + hardWin;
        document.getElementById("hard_loose").innerHTML = document.webL10n.get("lb_lost") + " " + hardLoose;
        document.getElementById("online_win").innerHTML = document.webL10n.get("lb_won") + " " + onlineWin;
        document.getElementById("online_loose").innerHTML = document.webL10n.get("lb_lost") + " " + onlineLoose;

        document.getElementById("easy_win").style.width = (100 / maxValue * easyWin) + "%";
        document.getElementById("easy_loose").style.width = (100 / maxValue * easyLoose) + "%";
        document.getElementById("medium_win").style.width = (100 / maxValue * mediumWin) + "%";
        document.getElementById("medium_loose").style.width = (100 / maxValue * mediumLoose) + "%";
        document.getElementById("hard_win").style.width = (100 / maxValue * hardWin) + "%";
        document.getElementById("hard_loose").style.width = (100 / maxValue * hardLoose) + "%";
        document.getElementById("online_win").style.width = (100 / maxValue * onlineWin) + "%";
        document.getElementById("online_loose").style.width = (100 / maxValue * onlineLoose) + "%";
    }

    function resetStats() {
        if (!localStorageOK) {
            return;
        }
        localStorage.removeItem("easy_start");
        localStorage.removeItem("easy_win");
        localStorage.removeItem("easy_loose");
        localStorage.removeItem("easy_draw");
        localStorage.removeItem("medium_start");
        localStorage.removeItem("medium_win");
        localStorage.removeItem("medium_loose");
        localStorage.removeItem("medium_draw");
        localStorage.removeItem("hard_start");
        localStorage.removeItem("hard_win");
        localStorage.removeItem("hard_loose");
        localStorage.removeItem("hard_draw");
        localStorage.removeItem("online_Start");
        localStorage.removeItem("online_win");
        localStorage.removeItem("online_loose");
        localStorage.removeItem("online_draw");
        localStorage.removeItem("online_left");

        updateStats();
    }

    function removeCountry (el) {
        el.classList.remove("_African_Union", "_Arab_League", "_ASEAN", "_CARICOM", "_CIS", "_Commonwealth", "_England", "_European_Union", "_Islamic_Conference", "_Kosovo", "_NATO", "_Northern_Cyprus", "_Northern_Ireland", "_Olimpic_Movement", "_OPEC", "_Red_Cross", "_Scotland", "_Somaliland", "_Tibet", "_United_Nations", "_Wales", "ad", "ae", "af", "ag", "ai", "al", "am", "an", "ao", "aq", "ar", "as", "at", "au", "aw", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bw", "by", "bz", "ca", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "cr", "cu", "cv", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "ee", "eg", "eh", "er", "es", "et", "fi", "fj", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gg", "gh", "gi", "gl", "gm", "gn", "gp", "gq", "gr", "gt", "gu", "gw", "gy", "hk", "hn", "hr", "ht", "hu", "id", "mc", "ie", "il", "im", "in", "iq", "ir", "is", "it", "je", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "md", "me", "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mq", "mr", "ms", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na", "nc", "ne", "ng", "ni", "nl", "no", "np", "nr", "nz", "om", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "si", "sk", "sl", "sm", "sn", "so", "sr", "st", "sv", "sy", "sz", "tc", "td", "tg", "th", "tj", "tl", "tm", "tn", "to", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "ws", "ye", "za", "zm", "zw");
    }

    function playerClick() {
        mode = "2player";
        if (gOwnImage) {
            $("P1icon").src = $inputImage.src;
        } else {
            $("P1icon").src = "Images/player.svg";
        }
        if (gOwnName) {
            p1_name = $inputName.value;
        } else {
            p1_name = document.webL10n.get("lb_player1");
        }
        removeCountry($P1country);
        if (gCountry) {
            $P1country.classList.add( gCountry.split(" ")[1]);
        }
        removeCountry($P2country);
        p2_name = document.webL10n.get("lb_player2");
        $("P1name").innerHTML = p1_name;
        $("P2name").innerHTML = p2_name;
        $("P2icon").src = "Images/player.svg";
        setLights();
        setStats();
        onExit = false;
        $title.classList.remove("swipe-out-right");
        $game.classList.remove("swipe-in-left");
        $title.classList.add("swipe-out");
        $game.classList.add("swipe-in");
    }

    function message(messageTxt, wait) {
        if (onExit) {
            return;
        }
        if (wait + 2000 > Date.now() && animate) {
            window.requestAnimFrame(function () {
                message(messageTxt, wait);
            });
        } else {
            games = games + 1;
            $("printMessage").innerHTML = messageTxt;
            if (games === 1) {
                $("printGames").innerHTML = games + " " + document.webL10n.get("lb_game");
            } else {
                $("printGames").innerHTML = games + " " + document.webL10n.get("lb_games");
            }
            $("printScore1a").innerHTML = p1_name;
            $("printScore2a").innerHTML = p2_name;
            $("printScore1b").innerHTML = siege[0];
            $("printScore2b").innerHTML = siege[1];
            fShowPopup($("popupDialog"));
            animate = false;
        }
    }

    function showAnimate(myWinRow, myWinCol, showCount, zWait) {
        var i;
        if (onExit) {
            return;
        }
        if (showCount < 6 && zWait + 250 < Date.now() && animate) {
            showCount += 1;
            zWait = Date.now();
            for (i = 0; i < 4; i += 1) {
                if (showCount % 2 !== 0) {
                    drawCircle((field.length - myWinRow[i] - 0.5) * colWidth * 0.85, myWinCol[i], zColor[player], "white");
                } else {
                    drawCircle((field.length - myWinRow[i] - 0.5) * colWidth * 0.85, myWinCol[i], color[player], "white");
                }
            }
            window.requestAnimFrame(function () {
                showAnimate(myWinRow, myWinCol, showCount, zWait);
            });
        } else if (showCount < 6 && animate) {
            window.requestAnimFrame(function () {
                showAnimate(myWinRow, myWinCol, showCount, zWait);
            });
        }
    }

    function show4() {
        animate = true;
        var zWinRow = winRow.slice();
        var zWinCol = winCol.slice();
        showAnimate(zWinRow, zWinCol, 0, Date.now());
    }

    function checkDet(row, colNr, rowFactor, colFactor, player, showFlag) {
        var i;
        if (row + 3 * rowFactor < field.length && colNr + 3 * colFactor < field[row].length && (row + 3 * rowFactor) >= 0 && (colNr + 3 * colFactor) >= 0) {
            for (i = 0; i < 4; i += 1) {
                if (field[row + i * rowFactor][colNr + i * colFactor] === player) {
                    winRow[i] = row + i * rowFactor;
                    winCol[i] = colNr + i * colFactor;
                    if (i === 3) {
                        fourInARow = true;
                        if (showFlag) {
                            show4();
                        }
                        i = 5;
                    }
                } else {
                    i = 5;
                }
            }
        }
    }

    function check(player, showFlag) {
        // **************************************************************
        // 4 in a row?
        // **************************************************************
        fourInARow = false;
        for (row = 0; row < field.length; row += 1) {
            for (colNr = 0; colNr < field[row].length; colNr += 1) {
                checkDet(row, colNr, 1, 0, player, showFlag);
                checkDet(row, colNr, 0, 1, player, showFlag);
                checkDet(row, colNr, 1, 1, player, showFlag);
                checkDet(row, colNr, 1, -1, player, showFlag);
            }
        }
        // **************************************************************
        // still space available?
        // **************************************************************
        space = false;
        for (colNr = 0; colNr < field[0].length; colNr += 1) {
            if (field[field.length - 1][colNr] === undefined) {
                space = true;
            }
        }
    }

    function playAnimate(lastTime, topAkt, colNr) {
        var date;
        var time;
        var timeDiff;
        var linearDistEachFrame;
        if (animate) {
            // update
            date = new Date();
            time = date.getTime();
            timeDiff = time - lastTime;
            // pixels / second
            linearDistEachFrame = colHeight * timeDiff / 1000;

            if (topAkt < topBis) {
                topAkt = Math.min(topBis, topAkt + linearDistEachFrame);
                lastTime = time;
                // clear
                col_context[colNr].clearRect(0, 0, colWidth, topBis + colWidth / 2 * 0.85);
                // draw
                drawCircle(topAkt, colNr, color[player], bColor[player]);
                // request new frame
                window.requestAnimFrame(function () {
                    playAnimate(lastTime, topAkt, colNr);
                });
            } else {
                if (gSound) {
                    document.getElementById("click_sound").play();
                }
                animate = false;
                check(player, true);

                if (fourInARow) {
                    siege[player] = siege[player] + 1;
                    if (mode === "easy" || mode === "medium" || mode === "hard") {
                        if (player === 0) {
                            updateStats("win");
                        } else {
                            updateStats("loose");
                        }
                    }
                    if (mode === "online") {
                        if ((player === 0 && user.role === "0") || (player === 1 && user.role === "1")) {
                            onlineOpponentLoose += 1;
                            updateStats("win");
                        } else {
                            onlineOpponentWin += 1;
                            updateStats("loose");
                        }
                    }
                    setStats();
                    if (gSound) {
                        document.getElementById("ding_sound").play();
                    }
                    if (player === 0) {
                        message(p1_name + " " + document.webL10n.get("lb_win"), Date.now());
                    } else {
                        message(p2_name + " " + document.webL10n.get("lb_win"), Date.now());
                    }
                } else {
                    if (!space) {
                        updateStats("draw");
                        message(document.webL10n.get("lb_draw"), Date.now());
                    } else {
                        player = 1 - player;
                        setLights();
                        if (mode !== "2player" && mode !== "online" && player === 1) {
                            ai();
                        }
                    }
                }
            }
        }
    }

    function play(colNr) {
        var date;
        var time;
        if (fromOnline) {
            fromOnline = false;
            if (mode === "online") {
                if ((player === 0 && user.role === "0") || (player === 1 && user.role === "1")) {
                    return;
                }
            }
        }
        if (!animate) {
            countRound = countRound + 1;
            row = 0;
            topBis = 0;
            while (row < field.length && topBis === 0) {
                if (field[row][colNr] === undefined) {
                    animate = true;
                    field[row][colNr] = player;
                    topBis = (field.length - row - 0.5) * colWidth * 0.85;
                    date = new Date();
                    time = date.getTime();
                    topAkt = -30;
                    playAnimate(time, topAkt, colNr);
                    break;
                }
                row = row + 1;
            }
        }
    }

    function online_click() {
        fShowPopup($("popupOnline"));
        $("bt_online").classList.add("ui-disabled");
        // socket = io.connect("https://localhost:49152", {"forceNew": true});
        socket = io.connect("https://grrd.a2hosted.com:49152", {"forceNew": true});
        socket.heartbeatTimeout = 20000;

        socket.on("connect", function () {
            //$.mobile.showPageLoadingMsg("a", document.webL10n.get("lb_wait"), false);
        });

        socket.on("startgame", function (data) {
            user = data;
            onlineOpponentWin = 0;
            onlineOpponentLoose = 0;
            if (user.id !== lastStart) {
                if (gOwnImage) {
                    gSendImage = $inputImage.src;
                } else {
                    gSendImage = null;
                }
                socket.emit("usersend", {
                    to: user.opponent,
                    name: $inputName.value,
                    pic: gSendImage,
                    country: gCountry,
                    win: onlineWin,
                    loose: onlineLoose
                });
                lastStart = user.id;
                onExit = false;
                if (mode !== null) {
                    // todo: was ist das? macht das sinn?
                    $title.classList.remove("swipe-out");
                    $game.classList.remove("swipe-in");
                    $title.classList.add("swipe-out-right");
                    $game.classList.add("swipe-in-left");
                }
                animate = false;
                clearBoard();
                games = 0;
                player = 0;
                siege = [0, 0];
                mode = "online";
                setLights();
                setStats();
                if (user.role === "0") {
                    if (gOwnImage) {
                        $("P1icon").src = $inputImage.src;
                    } else {
                        $("P1icon").src = "Images/player.svg";
                    }
                    if (gOwnName) {
                        p1_name = $inputName.value;
                    } else {
                        p1_name = document.webL10n.get("lb_player1");
                    }
                    removeCountry($P1country);
                    if (gCountry) {
                        $P1country.classList.add( gCountry.split(" ")[1]);
                    }
                    removeCountry($P2country);
                    $("P2icon").src = "Images/online.svg";
                    p2_name = document.webL10n.get("bt_online");
                } else {
                    removeCountry($P1country);
                    $("P1icon").src = "Images/online.svg";
                    p1_name = document.webL10n.get("bt_online");
                    if (gOwnImage) {
                        $("P2icon").src = $inputImage.src;
                    } else {
                        $("P2icon").src = "Images/player.svg";
                    }
                    if (gOwnName) {
                        p2_name = $inputName.value;
                    } else {
                        p2_name = document.webL10n.get("lb_player1");
                    }
                    removeCountry($P2country);
                    if (gCountry) {
                        $P2country.classList.add( gCountry.split(" ")[1]);
                    }
                }
                $("P1name").innerHTML = p1_name;
                $("P2name").innerHTML = p2_name;
                $title.classList.remove("swipe-out-right");
                $game.classList.remove("swipe-in-left");
                $title.classList.add("swipe-out");
                $game.classList.add("swipe-in");
                fHidePopup($("popupOnline"));
            }
        });

        socket.on("playget", function (data) {
            if (countRound === data.round && lastRound !== data.round) {
                lastRound = data.round;
                fromOnline = true;
                play(data.col);
            }
        });

        socket.on("userget", function (data) {
            onlineOpponentWin = parseInt(data.win);
            onlineOpponentLoose = parseInt(data.loose);
            maxValue = Math.max(onlineWin, onlineLoose, onlineOpponentWin, onlineOpponentLoose, 1);
            if (user.role === "0") {
                if (data.pic !== null) {
                    $("P2icon").src = data.pic;
                }
                if (data.name.length > 0) {
                    p2_name = data.name;
                    $("P2name").innerHTML = p2_name;
                }
                removeCountry($P2country);
                if (data.country) {
                    $P2country.classList.add( data.country.split(" ")[1]);
                }
            } else {
                if (data.pic !== null) {
                    $("P1icon").src = data.pic;
                }
                if (data.name.length > 0) {
                    p1_name = data.name;
                    $("P1name").innerHTML = p1_name;
                }
                removeCountry($P1country);
                if (data.country) {
                    $P1country.classList.add( data.country.split(" ")[1]);
                }
            }
            setStats();
        });

        socket.on("quit", function () {
            if (user.id !== lastQuit) {
                lastQuit = user.id;
                onExit = true;
                fShowPopup($("popupLeft"));
            }
        });
    }

    function p_computer() {
        if (gOwnImage) {
            $("P1icon").src = $inputImage.src;
        } else {
            $("P1icon").src = "Images/player.svg";
        }
        if (gOwnName) {
            p1_name = $inputName.value;
        } else {
            p1_name = document.webL10n.get("lb_player");
        }
        removeCountry($P1country);
        if (gCountry) {
            $P1country.classList.add( gCountry.split(" ")[1]);
        }
        p2_name = document.webL10n.get("lb_computer");
        $("P1name").innerHTML = p1_name;
        $("P2name").innerHTML = p2_name;
        $("P2icon").src = "Images/computer.svg";
        removeCountry($P2country);
        setStats();
        setLights();
        onExit = false;
        $title.classList.remove("swipe-out-right");
        $game.classList.remove("swipe-in-left");
        $title.classList.add("swipe-out");
        $game.classList.add("swipe-in");
    }

    function easy_click() {
        mode = "easy";
        p_computer();
    }

    function medium_click() {
        mode = "medium";
        p_computer();
    }

    function hard_click() {
        mode = "hard";
        p_computer();
    }

    function back() {
        if (mode === "online") {
            socket.disconnect();
            $("bt_online").classList.remove("ui-disabled");
        }
        onExit = true;
        contentFormatting();
        animate = false;
        clearBoard();
        games = 0;
        player = 0;
        siege = [0, 0];
        mode = null;
        $title.classList.remove("swipe-out");
        $game.classList.remove("swipe-in");
        $title.classList.add("swipe-out-right");
        $game.classList.add("swipe-in-left");

        fHidePopup($("popupDialog"));
        fHidePopup($("popupLeft"));
    }

    function playCheck(colNr) {
        if (mode === "online") {
            if ((player === 1 && user.role === "0") || (player === 0 && user.role === "1")) {
            } else {
                socket.emit("playsend", {to: user.opponent, col: colNr, round: countRound});
                play(colNr);
            }
        } else {
            play(colNr);
        }
    }

    function ratingDet(player, computerRow, computerCol) {
        var a;
        var b;
        numPossible = 0;
        stoneTotal = 0;
        stoneBest = 0;
        // **************************************************************
        // horizontal
        // **************************************************************
        for (a = computerCol - 3; a <= computerCol; a += 1) {
            if (a >= 0 && a + 3 < field[0].length) {
                possibleFlag = true;
                stoneCount = 0;
                for (b = 0; b <= 3; b += 1) {
                    if (field[computerRow][a + b] !== undefined) {
                        if (field[computerRow][a + b] === player) {
                            //my stone
                            stoneCount = stoneCount + 1;
                        } else {
                            //4 impossible
                            possibleFlag = false;
                        }
                    }
                }
                if (possibleFlag) {
                    numPossible = numPossible + 1;
                    stoneTotal = stoneTotal + stoneCount;
                    if (stoneCount > stoneBest) {
                        stoneBest = stoneCount;
                    }
                }
            }
        }
        // **************************************************************
        // vertical for (a = computerRow + 3; a == computerRow; a -= 1) {
        // **************************************************************
        for (a = computerRow + 3; a >= computerRow; a -= 1) {
            if (a - 3 >= 0 && a < field.length) {
                possibleFlag = true;
                stoneCount = 0;
                for (b = 0; b <= 3; b += 1) {
                    if (field[a - b][computerCol] !== undefined) {
                        if (field[a - b][computerCol] === player) {
                            //my stone
                            stoneCount = stoneCount + 1;
                        } else {
                            //4 impossible
                            possibleFlag = false;
                        }
                    }
                }
                if (possibleFlag) {
                    numPossible = numPossible + 1;
                    stoneTotal = stoneTotal + stoneCount;
                    if (stoneCount > stoneBest) {
                        stoneBest = stoneCount;
                    }
                }
            }
        }

        // **************************************************************
        // diagonal /
        // **************************************************************
        for (a = 3; a >= 0; a -= 1) {
            if (computerCol - a >= 0 && computerCol - a + 3 < field[0].length && computerRow - a >= 0 && computerRow - a + 3 < field.length) {
                possibleFlag = true;
                stoneCount = 0;
                for (b = 0; b <= 3; b += 1) {
                    if (field[computerRow - a + b][computerCol - a + b] !== undefined) {
                        if (field[computerRow - a + b][computerCol - a + b] === player) {
                            //my stone
                            stoneCount = stoneCount + 1;
                        } else {
                            //4 impossible
                            possibleFlag = false;
                        }
                    }
                }
                if (possibleFlag) {
                    numPossible = numPossible + 1;
                    stoneTotal = stoneTotal + stoneCount;
                    if (stoneCount > stoneBest) {
                        stoneBest = stoneCount;
                    }
                }
            }
        }

        // **************************************************************
        // diagonal \
        // **************************************************************
        for (a = 3; a >= 0; a -= 1) {
            if (computerCol - a >= 0 && computerCol - a + 3 < field[0].length && computerRow + a < field.length && computerRow + a - 3 >= 0) {
                possibleFlag = true;
                stoneCount = 0;
                for (b = 0; b <= 3; b += 1) {
                    if (field[computerRow + a - b][computerCol - a + b] !== undefined) {
                        if (field[computerRow + a - b][computerCol - a + b] === player) {
                            //my stone
                            stoneCount = stoneCount + 1;
                        } else {
                            //4 impossible
                            possibleFlag = false;
                        }
                    }
                }
                if (possibleFlag) {
                    numPossible = numPossible + 1;
                    stoneTotal = stoneTotal + stoneCount;
                    if (stoneCount > stoneBest) {
                        stoneBest = stoneCount;
                    }
                }
            }
        }
    }

    /**
     * @return {number}
     */
    function numSort(a, b) {
        return a - b;
    }

    function ai() {
        var a;
        rating = [];
        showFlag = false;
        // **************************************************************
        // rating: xyyzz
        //    - x: longest stone chain
        //    - yy: possibilities to make 4
        //    - zz: total stones around
        //
        //    - 0: column not available (full)
        //    - 1: column available, but opponent will win
        //    - 2: column available
        //    - 50000: prevent 4 in a row
        //    - 60000: 4 in a row
        //
        // **************************************************************
        //    rating per column:
        //    - number of possibilities to make 4 (all directions, all positions) from here
        //        (fields still empty or mine)
        //    - how many stones are already there (total for all possibilities, longest chain)
        //    - how many stones are still needed (fill up)?
        // **************************************************************
        for (computerCol = 0; computerCol < field[0].length; computerCol += 1) {
            rating[computerCol] = 0;
            for (computerRow = 0; computerRow < field.length; computerRow += 1) {
                if (field[computerRow][computerCol] === undefined) {
                    field[computerRow][computerCol] = player;
                    ratingDet(player, computerRow, computerCol);
                    rating[computerCol] = 10000 * stoneBest + 100 * numPossible + stoneTotal + 2;
                    field[computerRow][computerCol] = undefined;
                    break;
                }
            }
        }

        // **************************************************************
        //    get rating for the column for the opponent
        //    play there if the value is higher than highest of my values
        // **************************************************************
        bestRating[0] = 0;
        for (a = 0; a < rating.length; a += 1) {
            if (rating[a] > bestRating[0]) {
                bestRating[0] = rating[a];
            }
        }

        player = 1 - player;
        for (computerCol = 0; computerCol < field[0].length; computerCol += 1) {
            for (computerRow = 0; computerRow < field.length; computerRow += 1) {
                if (field[computerRow][computerCol] === undefined) {
                    field[computerRow][computerCol] = player;
                    ratingDet(player, computerRow, computerCol);
                    if (10000 * stoneBest + 100 * numPossible + stoneTotal + 2 > bestRating[0]) {
                        rating[computerCol] = 10000 * stoneBest + 100 * numPossible + stoneTotal + 2;
                    }
                    field[computerRow][computerCol] = undefined;
                    break;
                }
            }
        }
        player = 1 - player;

        // **************************************************************
        //    can opponent win above me? ignore this column
        // **************************************************************
        player = 1 - player;
        for (computerCol = 0; computerCol < field[0].length; computerCol += 1) {
            for (computerRow = 0; computerRow < field.length - 1; computerRow += 1) {
                if (field[computerRow][computerCol] === undefined) {
                    field[computerRow + 1][computerCol] = player;
                    check(player, showFlag);
                    field[computerRow + 1][computerCol] = undefined;
                    break;
                }
            }
            if (fourInARow) {
                //alert ("But do not play in column " + computerCol);
                rating[computerCol] = 1;
                fourInARow = false;
            }
        }
        player = 1 - player;

        // **************************************************************
        //    can opponent make 4? play there
        // **************************************************************
        player = 1 - player;
        for (computerCol = 0; computerCol < field[0].length; computerCol += 1) {
            for (computerRow = 0; computerRow < field.length; computerRow += 1) {
                if (field[computerRow][computerCol] === undefined) {
                    field[computerRow][computerCol] = player;
                    check(player, showFlag);
                    field[computerRow][computerCol] = undefined;
                    break;
                }
            }
            if (fourInARow) {
                //alert ("Play in column " + computerCol + " not to loose!");
                rating[computerCol] = 50000;
                fourInARow = false;
            }
        }
        player = 1 - player;

        // **************************************************************
        //    can I make 4? play there
        // **************************************************************
        for (computerCol = 0; computerCol < field[0].length; computerCol += 1) {
            for (computerRow = 0; computerRow < field.length; computerRow += 1) {
                if (field[computerRow][computerCol] === undefined) {
                    field[computerRow][computerCol] = player;
                    check(player, showFlag);
                    field[computerRow][computerCol] = undefined;
                    break;
                }
            }
            if (fourInARow) {
                //alert ("Play in column " + computerCol + " to win!");
                rating[computerCol] = 60000;
                fourInARow = false;
            }
        }

        // **************************************************************
        //    choose best column, play there
        // **************************************************************
        bestRating = rating.slice();
        bestRating.sort(numSort);
        bestRating.reverse();

        colNr = Math.round(Math.random() * 6); //random number between 0 and 6

        if (mode === "hard") {
            while (rating[colNr] !== bestRating[0]) {
                colNr = Math.round(Math.random() * 6); //random number between 0 and 6
            }
        }
        if (mode === "medium") {
            while (rating[colNr] < bestRating[1] || rating[colNr] === 0) {
                colNr = Math.round(Math.random() * 6); //random number between 0 and 6
            }
        }
        if (mode === "easy") {
            while (rating[colNr] < bestRating[2] || rating[colNr] === 0) {
                colNr = Math.round(Math.random() * 6); //random number between 0 and 6
            }
        }
        play(colNr);
    }

    function playAgain() {
        clearBoard();
        if (games % 2 !== 0) {
            player = 1;
        } else {
            player = 0;
        }
        setLights();
        fHidePopup($("popupDialog"));
        if (mode !== "2player" && mode !== "online" && player === 1) {
            ai();
        }
    }

    function url_query(query) {
        query = query.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var expr = "[\\?&]" + query + "=([^&#]*)";
        var regex = new RegExp(expr);
        var results = regex.exec(window.location.href);
        if (results !== null) {
            return results[1];
        } else {
            return false;
        }
    }

    function resize_image(file) {
        var fileLoader = new FileReader();
        var canvas = document.createElement("canvas");
        var context = null;
        var imageObj = new Image();
        var max_width = 67;
        var max_height = 71;
        var g_exif = {Orientation: undefined};

        //create a hidden canvas object we can use to create the new re-sized image data
        canvas.id = "hiddenCanvas";
        canvas.width = max_width;
        canvas.height = max_height;
        canvas.style.visibility = "hidden";
        document.body.appendChild(canvas);

        //get the context to use
        context = canvas.getContext("2d");

        // check for an image then
        //trigger the file loader to get the data from the image
        if (file.target.files[0].type.match("image.*")) {
            fileLoader.readAsDataURL(file.target.files[0]);
        } else {
            alert("File is not an image");
        }

        // setup the file loader onload function
        // once the file loader has the data it passes it to the
        // image object which, once the image has loaded,
        // triggers the images onload function
        fileLoader.onload = function () {
            var data = this.result;
            EXIF.getData(file.target.files[0], function () {
                g_exif.Orientation = EXIF.getTag(this, "Orientation");
                imageObj.src = data;
            });

        };

        // set up the images onload function which clears the hidden canvas context,
        // draws the new image then gets the blob data from it
        imageObj.onload = function () {
            var myTop = 0;
            var myLeft = 0;
            // Check for empty images
            if (this.width === 0 || this.height === 0) {
                alert("Image is empty");
            } else {
                if (g_exif.Orientation === 5 || g_exif.Orientation === 6) {
                    context.rotate(90 * Math.PI / 180);
                    myLeft = -1 * max_width;
                    max_width = 71;
                    max_height = 67;
                }
                if (g_exif.Orientation === 3 || g_exif.Orientation === 4) {
                    context.rotate(180 * Math.PI / 180);
                    myLeft = -1 * max_width - 4;
                    myTop = -1 * max_height + 4;
                }
                if (g_exif.Orientation === 7 || g_exif.Orientation === 8) {
                    context.rotate(270 * Math.PI / 180);
                    myTop = -1 * max_height;
                    max_width = 71;
                    max_height = 67;
                }
                context.clearRect(0, 0, max_width, max_height);
                context.drawImage(imageObj, 0, 0, this.width, this.height, myTop, myLeft, max_width, max_height);
                $inputImage.src = canvas.toDataURL("image/jpeg");
                if (localStorageOK) {
                    localStorage.setItem("s_image", canvas.toDataURL("image/jpeg"));
                }
                gOwnImage = true;
            }
        };
    }

    function inputNameChange(inpName) {
        if (inpName.replace(/\s+/g, "") !== "") {
            if (localStorageOK) {
                localStorage.setItem("s_name", inpName);
            }
            gOwnName = true;
        } else {
            if (localStorageOK) {
                localStorage.removeItem("s_name");
            }
            gOwnName = false;
        }
    }

    function countrySearch(search) {
        Array.from($l_country.getElementsByTagName("LI"))
            .forEach(function(li){
                if (li.innerHTML.toLowerCase().indexOf(search) > -1 || search.length === 0) {
                    li.style.display = "block";
                } else {
                    li.style.display = "none";
                }
            });
    }

    window.onload = function () {
        var i;
        if (!localStorageOK || localStorage.getItem("s_sound") === null) {
            $b_sound.checked = true;
        } else {
            $b_sound.checked = (localStorage.getItem("s_sound") === "on");
        }
        gSound = $b_sound.checked;
        if (localStorageOK && localStorage.getItem("s_image") !== null) {
            $inputImage.src = localStorage.getItem("s_image");
            gOwnImage = true;
        }
        if (localStorageOK && localStorage.getItem("s_name") !== null) {
            $inputName.value = localStorage.getItem("s_name");
            if (localStorage.getItem("s_name").replace(/\s+/g, "") !== "") {
                gOwnName = true;
            }
        }
        if (localStorageOK && localStorage.getItem("s_country") !== null) {
            while ($bt_country.firstChild) {
                $bt_country.removeChild($bt_country.firstChild);
            }
            gCountry = localStorage.getItem("s_country");
            var countryLi = document.getElementsByClassName(gCountry);
            $bt_country.appendChild(countryLi[0].cloneNode(true));
        }

        $("iInfo").addEventListener("click", function () {
            fShowPopup($popupInfo);
        });
        $("iInfoClose").addEventListener("click", function () {
            fHidePopup($popupInfo);
        });
        $("iStats").addEventListener("click", function () {
            fShowPopup($popupStats);
        });
        $("iStatsClose").addEventListener("click", function () {
            fHidePopup($popupStats);
        });
        $("iSettings").addEventListener("click", function () {
            fShowPopup($popupSettings);
        });
        $("iSettingsClose").addEventListener("click", function () {
            gSound = $b_sound.checked;
            if (localStorageOK) {
                localStorage.setItem("s_sound", ($b_sound.checked? "on" : "off"));
            }
            fHidePopup($popupSettings);
        });
        $("iOnlineClose").addEventListener("click", function () {
            fHidePopup($("popupOnline"));
        });
        $("bt_country_popup").addEventListener("click", function () {
            fShowPopup($("popupCountry"));
        });

        $("bt_play").addEventListener("click", function () {
            playerClick();
        });
        $("bt_online").addEventListener("click", function () {
            online_click();
        });
        $("bt_easy").addEventListener("click", function () {
            easy_click();
        });
        $("bt_med").addEventListener("click", function () {
            medium_click();
        });
        $("bt_hard").addEventListener("click", function () {
            hard_click();
        });

        Array.from(document.getElementsByClassName("back")).forEach(function(element) {
            element.addEventListener("click", function () {
                back();
            });
        });
        $("again").addEventListener("click", function () {
            playAgain();
        });
        $("bt_img").addEventListener("click", function () {
            $("b_image_input").click();
        });
        $("bt_reset").addEventListener("click", function () {
            resetStats();
        });
        $inputName.onchange = function() {
            inputNameChange(this.value);
        };
        $txt_search.onchange = function() {
            countrySearch(this.value.toLowerCase());
        };
        $txt_search.addEventListener ("keyup", function (ignore) {
            countrySearch(this.value.toLowerCase());
        });

        for (i = 0; i < col.length; i += 1) {
            col_canvas[i] = document.getElementById(col[i]);
            col_context[i] = col_canvas[i].getContext("2d");
            (function (i) {
                col_canvas[i].addEventListener("click", function () {
                    playCheck(i);
                });
            }(i));
        }

        $l_country.childNodes.forEach(function(element) {
            element.addEventListener("click", function () {
                gCountry = this.className;
                localStorage.setItem("s_country", this.className);

                while ($bt_country.firstChild) {
                    $bt_country.removeChild($bt_country.firstChild);
                }
                $bt_country.appendChild(this.cloneNode(true));

                fHidePopup($("popupCountry"));
                $txt_search.value = "";
                countrySearch("");
            });
        });

        document.getElementById("b_image_input").addEventListener("change", resize_image, false);

        contentFormatting();
    };

    window.addEventListener("resize", function () {
        contentFormatting();
    });

    document.webL10n.ready(function () {
        // Example usage - https://grrd01.github.io/4inaRow/?lang=ru
        url_param = url_query("lang");
        langReady = true;
        if (url_param && url_param !== document.webL10n.getLanguage()) {
            document.webL10n.setLanguage(url_param);
            langReady = false;
        }
    });

    document.addEventListener("localized", function () {
        if (langReady) {
            document.documentElement.lang = document.webL10n.getLanguage().substr(0, 2);
            document.querySelector("meta[name='description']").setAttribute("content", document.webL10n.get("lb_desc"));
            document.querySelector("link[rel='manifest']").href = "Manifest/appmanifest_" + document.webL10n.getLanguage().substr(0, 2) + ".json";
            document.querySelector("link[rel='canonical']").href = "https://grrd01.github.io/4inaRow/?lang=" + document.webL10n.getLanguage().substr(0, 2);
            updateStats();
            //$("#inputName").attr("placeholder",document.webL10n.get("lb_name"));


            Array.from($l_country.getElementsByTagName("LI"))
                .sort((a, b) => a.textContent.localeCompare(b.textContent))
                .forEach((li) => $l_country.appendChild(li));
        }
        langReady = true;
    });
}());