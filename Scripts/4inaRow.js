/*
* grrd's 4 in a Row
* Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
* Licensed under the MPL License
*/

/*jslint browser:true, for:true, devel: true, this: true */ /*global  $, window, io, jQuery, EXIF, FileReader, BinaryFile, atob */

(function () {
    "use strict";
    //navigator.mozL10n.language.code = "ta";
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    }());

    var ii;
    var animate = false;
    var spalte = ["spalte0", "spalte1", "spalte2", "spalte3", "spalte4", "spalte5", "spalte6"];
    var spalte_canvas = [];
    var spalte_context = [];
    var feld = [];
    for (ii = 0; ii < 6; ii += 1) {
        feld[ii] = [];
        feld[ii][6] = undefined;
    }
    var winrow = [];
    var wincol = [];
    var moeglichanz, steinetotal, steinebest, steinecount;
    var modus = null;
    var gSound = true;
    var gOwnImage = false;
    var gOwnName = false;
    var gSendImage;
    var p1_name;
    var p2_name;
    var $inputImage = $("#inputImage");
    var $inputName = $('#inputName');
    var $img_title = $('#img_title');
    var $b_sound = $('#b_sound');
    var url_param;

    var wertung = [];
    var bestwertung = [];
    var color = ["#ff0080", "#6969EE"];
    var bColor = ["#D6016B", "#5A5ACE"];
    var zColor = ["#FD6BB4", "#9393EF"];
    var player = 0;
    var P1LightImg = ["Images/lightredon.png", "Images/lightredoff.png"];
    var P2LightImg = ["Images/lightblueon.png", "Images/lightblueoff.png"];
    var spiele = 0;
    var siege = [0, 0];
    var spaltenr, zeile, compiSpalte, compiZeile;
    var viergewinnt, plaz, zeigenflag, moeglichflag = Boolean(false);
    var topBis, topAkt;
    var colWidth, colHeight;

    var onlineStart, onlineWin, onlineLoose,onlineDraw, onlineLeft;
    var easyStart, easyWin, easyLoose, easyDraw;
    var mediumStart, mediumWin, mediumLoose, mediumDraw;
    var hardStart, hardWin, hardLoose, hardDraw;

    var socket;
    var user;
    var connection = false;
    var lastStart;
    var lastQuit;
    var lastRound = null;
    var countRound = 0;
    var onExit = false;
    var fromOnline = false;

    function drawCircle(topAkt, spaltenr, color, bColor) {
        spalte_context[spaltenr].beginPath();
        spalte_context[spaltenr].arc(colWidth / 2, topAkt, colWidth / 2 * 0.85, 0, 2 * Math.PI, false);
        spalte_context[spaltenr].fillStyle = color;
        spalte_context[spaltenr].fill();
        spalte_context[spaltenr].lineWidth = colWidth / 20;
        spalte_context[spaltenr].strokeStyle = bColor;
        spalte_context[spaltenr].stroke();
    }

    function contentFormatting() {
        var i, j;
        var height = $(window).height();
        var width = $(window).width();
        if (height > width) {
            // Spaltenbreite
            colWidth = Math.min((width - 50) / 7, (height - 140) / 6);
            colHeight = Math.max(6 * colWidth * 0.85, height - 190);
            $img_title.attr("style", "width:100%;");
            $(".li_port").attr("style", "height:" + ($(window).height() - $(window).width() / 3 - 130) / 7 + "px;");
            $(".li_padd").attr("style", "padding-top:" + ($(window).height() - $(window).width() / 3 - 270) / 14 + "px;");
            $("#page_landscape").attr("style", "display:none;");
            $("#page_portrait").attr("style", "display:inline;");
            $("#indicator_landscape_l").attr("style", "display:none;");
            $("#indicator_landscape_r").attr("style", "display:none;");
            $("#indicator_portrait").attr("style", "display:block;");
            $("#popupDialog_landscape").attr("style", "display:none;");
            $("#popupDialog_portrait").attr("style", "display:block;");
            $("#popupSettings_portrait").attr("style", "display:block;");
            $("#popupSettings_landscape").attr("style", "display:none;");
            $("#popupSettings_col_b").appendTo("#popupSettings_portrait");
            $("#printMessage").attr("style", "display:block;");
        } else {
            // Spaltenbreite
            colWidth = Math.min((width - 140 - 40) / 7, (height - 20) / 6);
            colHeight = Math.max(6 * colWidth * 0.85, height - 95);
            $img_title.attr("style", "width:" + ($(window).width() * 0.6) + "px;");
            $("#blankspace").attr("style", "height:" + ($(window).height() / 4 - $(window).width() / 20) + "px;");
            $("#page_landscape").attr("style", "display:inline;");
            $("#page_portrait").attr("style", "display:none;");
            $("#indicator_landscape_l").attr("style", "display:inline;");
            $("#indicator_landscape_r").attr("style", "display:inline;");
            $("#indicator_portrait").attr("style", "display:none;");
            $("#popupDialog_landscape").attr("style", "display:block;");
            $("#popupDialog_portrait").attr("style", "display:none;");
            $("#popupSettings_portrait").attr("style", "display:none;");
            $("#popupSettings_landscape").attr("style", "display:block;");
            $("#popupSettings_col_b").appendTo("#popupSettings_landscape_b");
            $("#printMessage").attr("style", "display:inline;");
        }

        var imgPad = Math.max((height - width / 3) / 7, 0);

        $(".a_land").attr("style", "width:" + (width / 5 - 8) + "px;padding-bottom:" + imgPad / 2 + "px;");
        $(".img_land").attr("style", "padding-top:" + imgPad + "px;padding-bottom:" + imgPad / 2 + "px;width: 100%;min-width: 40px;max-width: 108px;");

        for (i = 0; i < spalte.length; i += 1) {
            document.getElementById(spalte[i]).width = colWidth;
            document.getElementById(spalte[i]).height = colHeight;
        }

        for (j = 0; j < feld[0].length; j += 1) {
            if (spalte_context[j] === undefined) {
                break;
            }
            for (i = 0; i < feld.length; i += 1) {
                spalte_context[j].beginPath();
                spalte_context[j].arc(colWidth / 2, (feld.length - i - 0.5) * colWidth * 0.85, colWidth / 2 * 0.7, 0, 2 * Math.PI, false);
                spalte_context[j].lineWidth = colWidth / 10;
                spalte_context[j].strokeStyle = "#212121";
                spalte_context[j].stroke();

                spalte_context[j].beginPath();
                spalte_context[j].arc(colWidth / 2, (feld.length - i - 0.5) * colWidth * 0.85, colWidth / 2 * 0.7, 1.8 * Math.PI, 0.8 * Math.PI, false);
                spalte_context[j].lineWidth = spalte_canvas[j].width / 10;
                spalte_context[j].strokeStyle = "grey";
                spalte_context[j].stroke();
            }
        }


        for (j = 0; j < feld[0].length; j += 1) {
            if (spalte_context[j] === undefined) {
                break;
            }
            spalte_context[j].save();
            spalte_context[j].beginPath();
            for (i = 0; i < feld.length; i += 1) {
                spalte_context[j].arc(colWidth / 2, (feld.length - i - 0.5) * colWidth * 0.85, colWidth / 2 * 0.7, 0, 2 * Math.PI, false);
            }
            spalte_context[j].clip();
            spalte_context[j].clearRect(0, 0, colWidth, colHeight);
        }

        for (i = 0; i < feld.length; i += 1) {
            for (j = 0; j < feld[i].length; j += 1) {
                if (feld[i][j] !== undefined) {
                    drawCircle((feld.length - i - 0.5) * colWidth * 0.85, j, color[feld[i][j]], bColor[feld[i][j]]);
                }
            }
        }
        if (animate) {
            topAkt = topAkt / topBis * ((feld.length - zeile - 0.5) * colWidth * 0.85);
            topBis = (feld.length - zeile - 0.5) * colWidth * 0.85;
        }
    }

    function leeren() {
        var i, j;
        countRound = 0;
        lastRound = null;
        for (i = 0; i < feld.length; i += 1) {
            for (j = 0; j < feld[i].length; j += 1) {
                feld[i][j] = undefined;
                if (i === 0) {
                    spalte_context[j].clearRect(0, 0, colWidth, colHeight);
                }
            }
        }
        contentFormatting();
    }

    function setLights() {
        $("#P1light").attr("src", P1LightImg[player]);
        $("#P2light").attr("src", P2LightImg[1 - player]);
        $("#P1light2").attr("src", P1LightImg[player]);
        $("#P2light2").attr("src", P2LightImg[1 - player]);
    }

    function updateStats(statEvent) {
        var storageItem, storageValue, maxValue;

        if (modus && statEvent) {
            storageItem = modus + "_" + statEvent;
            storageValue = parseInt(localStorage.getItem(storageItem) || 0) + 1;
            localStorage.setItem(storageItem, storageValue);
        }

        easyStart = localStorage.getItem('easy_start') || 0;
        easyWin = localStorage.getItem('easy_win') || 0;
        easyLoose = localStorage.getItem('easy_loose') || 0;
        easyDraw = localStorage.getItem('easy_draw') || 0;
        mediumStart = localStorage.getItem('medium_start') || 0;
        mediumWin = localStorage.getItem('medium_win') || 0;
        mediumLoose = localStorage.getItem('medium_loose') || 0;
        mediumDraw = localStorage.getItem('medium_draw') || 0;
        hardStart = localStorage.getItem('hard_start') || 0;
        hardWin = localStorage.getItem('hard_win') || 0;
        hardLoose = localStorage.getItem('hard_loose') || 0;
        hardDraw = localStorage.getItem('hard_draw') || 0;
        onlineStart = localStorage.getItem('online_Start') || 0;
        onlineWin = localStorage.getItem('online_win') || 0;
        onlineLoose = localStorage.getItem('online_loose') || 0;
        onlineDraw = localStorage.getItem('online_draw') || 0;
        onlineLeft = localStorage.getItem('online_left') || 0;

        maxValue = Math.max(easyWin, easyLoose, mediumWin, mediumLoose, hardWin, hardLoose, onlineWin, onlineLoose, 1);

        document.getElementById("easy_win").innerHTML = navigator.mozL10n.get("lbwon") + " " + easyWin;
        document.getElementById("easy_loose").innerHTML = navigator.mozL10n.get("lblost") + " " + easyLoose;
        document.getElementById("medium_win").innerHTML = navigator.mozL10n.get("lbwon") + " " + mediumWin;
        document.getElementById("medium_loose").innerHTML = navigator.mozL10n.get("lblost") + " " + mediumLoose;
        document.getElementById("hard_win").innerHTML = navigator.mozL10n.get("lbwon") + " " + hardWin;
        document.getElementById("hard_loose").innerHTML = navigator.mozL10n.get("lblost") + " " + hardLoose;
        document.getElementById("online_win").innerHTML = navigator.mozL10n.get("lbwon") + " " + onlineWin;
        document.getElementById("online_loose").innerHTML = navigator.mozL10n.get("lblost") + " " + onlineLoose;

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
        localStorage.removeItem('easy_start');
        localStorage.removeItem('easy_win');
        localStorage.removeItem('easy_loose');
        localStorage.removeItem('easy_draw');
        localStorage.removeItem('medium_start');
        localStorage.removeItem('medium_win');
        localStorage.removeItem('medium_loose');
        localStorage.removeItem('medium_draw');
        localStorage.removeItem('hard_start');
        localStorage.removeItem('hard_win');
        localStorage.removeItem('hard_loose');
        localStorage.removeItem('hard_draw');
        localStorage.removeItem('online_Start');
        localStorage.removeItem('online_win');
        localStorage.removeItem('online_loose');
        localStorage.removeItem('online_draw');
        localStorage.removeItem('online_left');

        updateStats();
    }

    function playerClick() {
        modus = "2player";
        if (gOwnImage) {
            $("#P1icon").attr("src", $inputImage.attr('src'));
            $("#P1icon2").attr("src", $inputImage.attr('src'));
        } else {
            $("#P1icon").attr("src", "Images/player.png");
            $("#P1icon2").attr("src", "Images/player.png");
        }
        if (gOwnName) {
            p1_name = $inputName.val();
        } else {
            p1_name = navigator.mozL10n.get("lbplayer1");
        }
        p2_name = navigator.mozL10n.get("lbplayer2");
        $("#P1name").html(p1_name);
        $("#P1name2").html(p1_name);
        $("#P2name").html(p2_name);
        $("#P2name2").html(p2_name);
        $("#P2icon").attr("src", "Images/player.png");
        $("#P2icon2").attr("src", "Images/player.png");
        setLights();
        onExit = false;
        $.mobile.changePage('#game', {transition: 'slide'});
    }

    function meldung(meldungtext, wait) {
        if (onExit) {
            return;
        }
        if (wait + 2000 > new Date().getTime() && animate) {
            window.requestAnimFrame(function () {
                meldung(meldungtext, wait);
            });
        } else {
            spiele = spiele + 1;
            $('#printMessage').html(meldungtext);
            if (spiele === 1) {
                $('#printSpiele').html(spiele + " " + navigator.mozL10n.get("lbgame"));
            } else {
                $('#printSpiele').html(spiele + " " + navigator.mozL10n.get("lbgames"));
            }
            $('#printScore1a').html(p1_name);
            $('#printScore2a').html(p2_name);
            $('#printScore1b').html(siege[0]);
            $('#printScore2b').html(siege[1]);
            $.mobile.changePage('#popupDialog', {transition: 'pop', role: 'dialog'});
            leeren();
            if (spiele % 2 !== 0) {
                player = 1;
            } else {
                player = 0;
            }
            setLights();
            animate = false;
        }
    }

    function zeigenAnimate(mywinrow, mywincol, myzeigencount, zwait) {
        var i;
        if (onExit) {
            return;
        }
        if (myzeigencount < 6 && zwait + 250 < new Date().getTime() && animate) {
            myzeigencount += 1;
            zwait = new Date().getTime();
            for (i = 0; i < 4; i += 1) {
                if (myzeigencount % 2 !== 0) {
                    drawCircle((feld.length - mywinrow[i] - 0.5) * colWidth * 0.85, mywincol[i], zColor[player], "white");
                } else {
                    drawCircle((feld.length - mywinrow[i] - 0.5) * colWidth * 0.85, mywincol[i], color[player], "white");
                }
            }
            window.requestAnimFrame(function () {
                zeigenAnimate(mywinrow, mywincol, myzeigencount, zwait);
            });
        } else if (myzeigencount < 6 && animate) {
            window.requestAnimFrame(function () {
                zeigenAnimate(mywinrow, mywincol, myzeigencount, zwait);
            });
        }
    }

    function zeigen() {
        animate = true;
        var zwinrow = winrow.slice();
        var zwincol = wincol.slice();
        zeigenAnimate(zwinrow, zwincol, 0, new Date().getTime());
    }

    function kontrolle_det(zeile, spaltenr, zeilenfaktor, spaltenfaktor, player, zeigenflag) {
        var i;
        if (zeile + 3 * zeilenfaktor < feld.length && spaltenr + 3 * spaltenfaktor < feld[zeile].length && (zeile + 3 * zeilenfaktor) >= 0 && (spaltenr + 3 * spaltenfaktor) >= 0) {
            for (i = 0; i < 4; i += 1) {
                if (feld[zeile + i * zeilenfaktor][spaltenr + i * spaltenfaktor] === player) {
                    winrow[i] = zeile + i * zeilenfaktor;
                    wincol[i] = spaltenr + i * spaltenfaktor;
                    if (i === 3) {
                        viergewinnt = true;
                        if (zeigenflag) {
                            zeigen();
                        }
                        i = 5;
                    }
                } else {
                    i = 5;
                }
            }
        }
    }

    function kontrolle(player, zeigenflag) {
        // **************************************************************
        // viergewinnt?
        // **************************************************************
        viergewinnt = false;
        for (zeile = 0; zeile < feld.length; zeile += 1) {
            for (spaltenr = 0; spaltenr < feld[zeile].length; spaltenr += 1) {
                kontrolle_det(zeile, spaltenr, 1, 0, player, zeigenflag);
                kontrolle_det(zeile, spaltenr, 0, 1, player, zeigenflag);
                kontrolle_det(zeile, spaltenr, 1, 1, player, zeigenflag);
                kontrolle_det(zeile, spaltenr, 1, -1, player, zeigenflag);
            }
        }
        // **************************************************************
        // haz no plaz?
        // **************************************************************
        plaz = false;
        for (spaltenr = 0; spaltenr < feld[0].length; spaltenr += 1) {
            if (feld[feld.length - 1][spaltenr] === undefined) {
                plaz = true;
            }
        }
    }

    function spielzugAnimate(lastTime, topAkt, spaltenr) {
        var date, time, timeDiff;
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
                spalte_context[spaltenr].clearRect(0, 0, colWidth, topBis + colWidth / 2 * 0.85);
                // draw
                drawCircle(topAkt, spaltenr, color[player], bColor[player]);
                // request new frame
                window.requestAnimFrame(function () {
                    spielzugAnimate(lastTime, topAkt, spaltenr);
                });
            } else {
                if (gSound) {
                    document.getElementById('click_sound').play();
                }
                animate = false;
                kontrolle(player, true);

                if (viergewinnt) {
                    siege[player] = siege[player] + 1;
                    if (modus === "easy" || modus === "medium" || modus === "hard") {
                        if (player === 0) {
                            updateStats("win");
                        } else {
                            updateStats("loose");
                        }
                    }
                    if (modus === "online") {
                        if ((player === 0 && user.role === "0") || (player === 1 && user.role === "1")) {
                            updateStats("win");
                        } else {
                            updateStats("loose");
                        }
                    }
                    if (gSound) {
                        document.getElementById('ding_sound').play();
                    }
                    //if (modus !== "2player" && player == 1) {
                    //    meldung(navigator.mozL10n.get("lbcomputer") + " " + navigator.mozL10n.get("lbwin"), new Date().getTime());
                    //} else {
                    //    meldung(navigator.mozL10n.get("lbplayer") + " " + (player + 1) + " " + navigator.mozL10n.get("lbwin"), new Date().getTime());
                    //}
                    if (player === 0) {
                        meldung(p1_name + " " + navigator.mozL10n.get("lbwin"), new Date().getTime());
                    } else {
                        meldung(p2_name + " " + navigator.mozL10n.get("lbwin"), new Date().getTime());
                    }
                } else {
                    if (!plaz) {
                        updateStats("draw");
                        meldung(navigator.mozL10n.get("lbdraw"), new Date().getTime());
                    } else {
                        player = 1 - player;
                        setLights();
                        if (modus !== "2player" && modus !== "online" && player === 1) {
                            ai();
                        }
                    }
                }
            }
        }
    }

    function spielzug(spaltenr) {
        var date, time;
        if (fromOnline) {
            fromOnline = false;
            if (modus === "online") {
                if ((player === 0 && user.role === "0") || (player === 1 && user.role === "1")) {
                    return;
                }
            }
        }
        if (!animate) {
            countRound = countRound + 1;
            zeile = 0;
            topBis = 0;
            while (zeile < feld.length && topBis === 0) {
                if (feld[zeile][spaltenr] === undefined) {
                    animate = true;
                    feld[zeile][spaltenr] = player;
                    topBis = (feld.length - zeile - 0.5) * colWidth * 0.85;
                    date = new Date();
                    time = date.getTime();
                    topAkt = -30;
                    spielzugAnimate(time, topAkt, spaltenr);
                    break;
                }
                zeile = zeile + 1;
            }
        }
    }

    function online_click() {
        $.mobile.changePage('#popupOnline', {transition: 'pop', role: 'dialog'});
        $("#btonline").addClass('ui-disabled');
        $("#btonline2").addClass('ui-disabled');
        if (!connection) {
            //socket = io.connect('http://localhost:3250');
            socket = io.connect('http://grrds4inarow.nodejitsu.com:80');
            //socket = io.connect('http://4inarow-grrd.rhcloud.com:8000');
            connection = true;
        } else {
            socket.socket.reconnect();
        }

        socket.on('connect', function () {
            //$.mobile.showPageLoadingMsg("a", navigator.mozL10n.get("lbwait"), false);
        });

        socket.on('startgame', function (data) {
            user = data;
            if (user.id !== lastStart) {
                if (gOwnImage) {
                    gSendImage = $inputImage.attr('src');
                } else {
                    gSendImage = null;
                }
                socket.emit('usersend', {
                    to: user.opponent,
                    name: $inputName.val(),
                    pic: gSendImage,
                    country: 0,
                    points: 0,
                    rank: 0
                });
                lastStart = user.id;
                onExit = false;
                if (modus !== null) {
                    $.mobile.changePage('#title', {transition: 'slide', reverse: true});
                }
                animate = false;
                leeren();
                spiele = 0;
                player = 0;
                siege = [0, 0];
                setLights();
                modus = "online";
                if (user.role === "0") {
                    if (gOwnImage) {
                        $("#P1icon").attr("src", $inputImage.attr('src'));
                        $("#P1icon2").attr("src", $inputImage.attr('src'));
                    } else {
                        $("#P1icon").attr("src", "Images/player.png");
                        $("#P1icon2").attr("src", "Images/player.png");
                    }
                    if (gOwnName) {
                        p1_name = $inputName.val();
                    } else {
                        p1_name = navigator.mozL10n.get("lbplayer1");
                    }
                    $("#P2icon").attr("src", "Images/online.png");
                    $("#P2icon2").attr("src", "Images/online.png");
                    p2_name = navigator.mozL10n.get("btonline");
                } else {
                    $("#P1icon").attr("src", "Images/online.png");
                    $("#P1icon2").attr("src", "Images/online.png");
                    p1_name = navigator.mozL10n.get("btonline");
                    if (gOwnImage) {
                        $("#P2icon").attr("src", $inputImage.attr('src'));
                        $("#P2icon2").attr("src", $inputImage.attr('src'));
                    } else {
                        $("#P2icon").attr("src", "Images/player.png");
                        $("#P2icon2").attr("src", "Images/player.png");
                    }
                    if (gOwnName) {
                        p2_name = $inputName.val();
                    } else {
                        p2_name = navigator.mozL10n.get("lbplayer1");
                    }
                }
                $("#P1name").html(p1_name);
                $("#P1name2").html(p1_name);
                $("#P2name").html(p2_name);
                $("#P2name2").html(p2_name);
                $.mobile.changePage('#game', {transition: 'slide'});
            }
        });

        socket.on('playget', function (data) {
            if (countRound === data.round && lastRound !== data.round) {
                lastRound = data.round;
                fromOnline = true;
                spielzug(data.col);
            }
        });

        socket.on('userget', function (data) {
            if (user.role === "0") {
                if (data.pic !== null) {
                    $("#P2icon").attr("src", data.pic);
                    $("#P2icon2").attr("src", data.pic);
                }
                if (data.name.length > 0) {
                    p2_name = data.name;
                    $("#P2name").html(p2_name);
                    $("#P2name2").html(p2_name);
                }
            } else {
                if (data.pic !== null) {
                    $("#P1icon").attr("src", data.pic);
                    $("#P1icon2").attr("src", data.pic);
                }
                if (data.name.length > 0) {
                    p1_name = data.name;
                    $("#P1name").html(p1_name);
                    $("#P1name2").html(p1_name);
                }
            }
        });

        socket.on('quit', function () {
            if (user.id !== lastQuit) {
                lastQuit = user.id;
                onExit = true;
                $.mobile.changePage('#popupLeft', {transition: 'pop', role: 'dialog'});
            }
        });
    }

    function p_computer() {
        if (gOwnImage) {
            $("#P1icon").attr("src", $inputImage.attr('src'));
            $("#P1icon2").attr("src", $inputImage.attr('src'));
        } else {
            $("#P1icon").attr("src", "Images/player.png");
            $("#P1icon2").attr("src", "Images/player.png");
        }
        if (gOwnName) {
            p1_name = $inputName.val();
        } else {
            p1_name = navigator.mozL10n.get("lbplayer");
        }
        p2_name = navigator.mozL10n.get("lbcomputer");
        $("#P1name").html(p1_name);
        $("#P1name2").html(p1_name);
        $("#P2name").html(p2_name);
        $("#P2name2").html(p2_name);
        $("#P2icon").attr("src", "Images/computer.png");
        $("#P2icon2").attr("src", "Images/computer.png");
        setLights();
        onExit = false;
        $.mobile.changePage('#game', {transition: 'slide'});
    }

    function easy_click() {
        modus = "easy";
        p_computer();
    }

    function medium_click() {
        modus = "medium";
        p_computer();
    }

    function hard_click() {
        modus = "hard";
        p_computer();
    }

    function back() {
        //window.location = "#title";
        if (modus === "online") {
            socket.disconnect();
            $('#btonline').removeClass('ui-disabled');
            $('#btonline2').removeClass('ui-disabled');

        }
        onExit = true;
        contentFormatting();
        $.mobile.changePage('#title', {transition: 'slide', reverse: true});
        animate = false;
        leeren();
        spiele = 0;
        player = 0;
        siege = [0, 0];
        modus = null;
    }

    function closePop() {
        gSound = $b_sound.val() === "on";
        localStorage.setItem('s_sound', $b_sound.val());
        contentFormatting();
        $.mobile.changePage('#title', {transition: 'pop', reverse: true});
    }

    function spielzugCheck(spaltenr) {
        if (modus === "online") {
            if ((player === 1 && user.role === "0") || (player === 0 && user.role === "1")) {
            } else {
                socket.emit('playsend', {to: user.opponent, col: spaltenr, round: countRound});
                spielzug(spaltenr);
            }
        } else {
            spielzug(spaltenr);
        }
    }

    function rating(player, compiZeile, compiSpalte) {
        var a, b;
        moeglichanz = 0;
        steinetotal = 0;
        steinebest = 0;
        // **************************************************************
        // horizontal
        // **************************************************************
        for (a = compiSpalte - 3; a <= compiSpalte; a += 1) {
            if (a >= 0 && a + 3 < feld[0].length) {
                moeglichflag = true;
                steinecount = 0;
                for (b = 0; b <= 3; b += 1) {
                    if (feld[compiZeile][a + b] !== undefined) {
                        if (feld[compiZeile][a + b] === player) {
                            //eins von meinen
                            steinecount = steinecount + 1;
                        } else {
                            //4 unmöglich
                            moeglichflag = false;
                        }
                    }
                }
                if (moeglichflag) {
                    moeglichanz = moeglichanz + 1;
                    steinetotal = steinetotal + steinecount;
                    if (steinecount > steinebest) {
                        steinebest = steinecount;
                    }
                }
            }
        }
        // **************************************************************
        // vertikal for (a = compiZeile + 3; a == compiZeile; a -= 1) {
        // **************************************************************
        for (a = compiZeile + 3; a >= compiZeile; a -= 1) {
            if (a - 3 >= 0 && a < feld.length) {
                moeglichflag = true;
                steinecount = 0;
                for (b = 0; b <= 3; b += 1) {
                    if (feld[a - b][compiSpalte] !== undefined) {
                        if (feld[a - b][compiSpalte] === player) {
                            //eins von meinen
                            steinecount = steinecount + 1;
                        } else {
                            //4 unmöglich
                            moeglichflag = false;
                        }
                    }
                }
                if (moeglichflag) {
                    moeglichanz = moeglichanz + 1;
                    steinetotal = steinetotal + steinecount;
                    if (steinecount > steinebest) {
                        steinebest = steinecount;
                    }
                }
            }
        }

        // **************************************************************
        // schräg /
        // **************************************************************
        for (a = 3; a >= 0; a -= 1) {
            if (compiSpalte - a >= 0 && compiSpalte - a + 3 < feld[0].length && compiZeile - a >= 0 && compiZeile - a + 3 < feld.length) {
                moeglichflag = true;
                steinecount = 0;
                for (b = 0; b <= 3; b += 1) {
                    if (feld[compiZeile - a + b][compiSpalte - a + b] !== undefined) {
                        if (feld[compiZeile - a + b][compiSpalte - a + b] === player) {
                            //eins von meinen
                            steinecount = steinecount + 1;
                        } else {
                            //4 unmöglich
                            moeglichflag = false;
                        }
                    }
                }
                if (moeglichflag) {
                    moeglichanz = moeglichanz + 1;
                    steinetotal = steinetotal + steinecount;
                    if (steinecount > steinebest) {
                        steinebest = steinecount;
                    }
                }
            }
        }

        // **************************************************************
        // schräg \
        // **************************************************************
        for (a = 3; a >= 0; a -= 1) {
            if (compiSpalte - a >= 0 && compiSpalte - a + 3 < feld[0].length && compiZeile + a < feld.length && compiZeile + a - 3 >= 0) {
                moeglichflag = true;
                steinecount = 0;
                for (b = 0; b <= 3; b += 1) {
                    if (feld[compiZeile + a - b][compiSpalte - a + b] !== undefined) {
                        if (feld[compiZeile + a - b][compiSpalte - a + b] === player) {
                            //eins von meinen
                            steinecount = steinecount + 1;
                        } else {
                            //4 unmöglich
                            moeglichflag = false;
                        }
                    }
                }
                if (moeglichflag) {
                    moeglichanz = moeglichanz + 1;
                    steinetotal = steinetotal + steinecount;
                    if (steinecount > steinebest) {
                        steinebest = steinecount;
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
        wertung = [];
        zeigenflag = false;
        // **************************************************************
        // wertung: xyyzz
        //    - x: maximal vorhanden
        //    - yy: möglichkeiten, 4 zu machen
        //    - zz: total vorhanden
        //
        //    - 0: spalte nicht spielbar (schon voll)
        //    - 1: spalte spielbar, lässt aber gegner gewinnen
        //    - 2: spalte spielbar
        //    - 50000: viergewinnt verhindern
        //    - 60000: viergewinnt
        //
        // **************************************************************
        //    punktewertung pro spalte:
        //    - wieviele möglichkeiten, 4 zu machen (alle richtungen, positionen) gibt es hier
        //        (felder noch leer oder meine)
        //    - wieviele steine sind dazu schon vorhanden (gesamthaft alle varianten, höchste variante)
        //    - wieviele steine sind dazu noch nötig (auffüllen)?
        // **************************************************************
        for (compiSpalte = 0; compiSpalte < feld[0].length; compiSpalte += 1) {
            wertung[compiSpalte] = 0;
            for (compiZeile = 0; compiZeile < feld.length; compiZeile += 1) {
                if (feld[compiZeile][compiSpalte] === undefined) {
                    feld[compiZeile][compiSpalte] = player;
                    rating(player, compiZeile, compiSpalte);
                    wertung[compiSpalte] = 10000 * steinebest + 100 * moeglichanz + steinetotal + 2;
                    feld[compiZeile][compiSpalte] = undefined;
                    break;
                }
            }
        }

        // **************************************************************
        //    wert der spalte für gegner ermitteln
        //    dort spielen, falls höher als bester eigener wert
        // **************************************************************
        bestwertung[0] = 0;
        for (a = 0; a < wertung.length; a += 1) {
            if (wertung[a] > bestwertung[0]) {
                bestwertung[0] = wertung[a];
            }
        }

        player = 1 - player;
        for (compiSpalte = 0; compiSpalte < feld[0].length; compiSpalte += 1) {
            for (compiZeile = 0; compiZeile < feld.length; compiZeile += 1) {
                if (feld[compiZeile][compiSpalte] === undefined) {
                    feld[compiZeile][compiSpalte] = player;
                    rating(player, compiZeile, compiSpalte);
                    if (10000 * steinebest + 100 * moeglichanz + steinetotal + 2 > bestwertung[0]) {
                        wertung[compiSpalte] = 10000 * steinebest + 100 * moeglichanz + steinetotal + 2;
                    }
                    feld[compiZeile][compiSpalte] = undefined;
                    break;
                }
            }
        }
        player = 1 - player;

        // **************************************************************
        //    kann gegner über mir 4 machen? diese spalte tabu setzen
        // **************************************************************
        player = 1 - player;
        for (compiSpalte = 0; compiSpalte < feld[0].length; compiSpalte += 1) {
            for (compiZeile = 0; compiZeile < feld.length - 1; compiZeile += 1) {
                if (feld[compiZeile][compiSpalte] === undefined) {
                    feld[compiZeile + 1][compiSpalte] = player;
                    kontrolle(player, zeigenflag);
                    feld[compiZeile + 1][compiSpalte] = undefined;
                    break;
                }
            }
            if (viergewinnt) {
                //alert ("Aber ganz sicher nicht in spalte " + compiSpalte + " spielen!");
                wertung[compiSpalte] = 1;
                viergewinnt = false;
            }
        }
        player = 1 - player;

        // **************************************************************
        //    kann gegner 4 machen? dort spielen
        // **************************************************************
        player = 1 - player;
        for (compiSpalte = 0; compiSpalte < feld[0].length; compiSpalte += 1) {
            for (compiZeile = 0; compiZeile < feld.length; compiZeile += 1) {
                if (feld[compiZeile][compiSpalte] === undefined) {
                    feld[compiZeile][compiSpalte] = player;
                    kontrolle(player, zeigenflag);
                    feld[compiZeile][compiSpalte] = undefined;
                    break;
                }
            }
            if (viergewinnt) {
                //alert ("Zum nicht Verlieren: In spalte " + compiSpalte + " spielen!");
                wertung[compiSpalte] = 50000;
                viergewinnt = false;
            }
        }
        player = 1 - player;

        // **************************************************************
        //    kann ich 4 machen? dort spielen
        // **************************************************************
        for (compiSpalte = 0; compiSpalte < feld[0].length; compiSpalte += 1) {
            for (compiZeile = 0; compiZeile < feld.length; compiZeile += 1) {
                if (feld[compiZeile][compiSpalte] === undefined) {
                    feld[compiZeile][compiSpalte] = player;
                    kontrolle(player, zeigenflag);
                    feld[compiZeile][compiSpalte] = undefined;
                    break;
                }
            }
            if (viergewinnt) {
                //alert ("Zum Gewinnen: In spalte " + compiSpalte + " spielen!");
                wertung[compiSpalte] = 60000;
                viergewinnt = false;
            }
        }

        // **************************************************************
        //    beste spalte wählen, dort spielen
        // **************************************************************
        bestwertung = wertung.slice();
        bestwertung.sort(numSort);
        bestwertung.reverse();

        spaltenr = Math.round(Math.random() * 6); //Zufallszahl im Bereich von 0 bis 6

        if (modus === "hard") {
            while (wertung[spaltenr] !== bestwertung[0]) {
                spaltenr = Math.round(Math.random() * 6); //Zufallszahl im Bereich von 0 bis 6
            }
        }
        if (modus === "medium") {
            while (wertung[spaltenr] < bestwertung[1] || wertung[spaltenr] === 0) {
                spaltenr = Math.round(Math.random() * 6); //Zufallszahl im Bereich von 0 bis 6
            }
        }
        if (modus === "easy") {
            while (wertung[spaltenr] < bestwertung[2] || wertung[spaltenr] === 0) {
                spaltenr = Math.round(Math.random() * 6); //Zufallszahl im Bereich von 0 bis 6
            }
        }
        spielzug(spaltenr);
    }

    function playAgain() {
        //ios7-bug: $('#popupDialog').dialog('close');
        $.mobile.changePage('#game', {transition: 'pop', reverse: true});
        if (modus !== "2player" && modus !== "online" && player === 1) {
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
        var fileLoader = new FileReader(),
            canvas = document.createElement('canvas'),
            context = null,
            imageObj = new Image();
        var max_width = 67;
        var max_height = 71;
        var g_exif;

        //create a hidden canvas object we can use to create the new resized image data
        canvas.id = "hiddenCanvas";
        canvas.width = max_width;
        canvas.height = max_height;
        canvas.style.visibility = "hidden";
        document.body.appendChild(canvas);

        //get the context to use
        context = canvas.getContext('2d');

        // check for an image then
        //trigger the file loader to get the data from the image
        if (file.target.files[0].type.match('image.*')) {
            fileLoader.readAsDataURL(file.target.files[0]);
        } else {
            alert('File is not an image');
        }

        // setup the file loader onload function
        // once the file loader has the data it passes it to the
        // image object which, once the image has loaded,
        // triggers the images onload function
        fileLoader.onload = function () {
            var data = this.result;
            g_exif = EXIF.readFromBinaryFile(new BinaryFile(atob(data.split(',')[1])));
            imageObj.src = data;
            //$inputImage.attr("src", data);
        };

        // set up the images onload function which clears the hidden canvas context,
        // draws the new image then gets the blob data from it
        imageObj.onload = function () {
            var myTop = 0;
            var myLeft = 0;
            // Check for empty images
            if (this.width === 0 || this.height === 0) {
                alert('Image is empty');
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
                $inputImage.attr('src', canvas.toDataURL("image/jpeg"));
                $("#inputImage_l").attr('src', canvas.toDataURL("image/jpeg"));
                localStorage.setItem('s_image', canvas.toDataURL("image/jpeg"));
                gOwnImage = true;
            }
        };
    }

    function inputName_change(inpName) {
        if (inpName.replace(/\s+/g, "") !== "") {
            localStorage.setItem('s_name', inpName);
            gOwnName = true;
        } else {
            localStorage.removeItem('s_name');
            gOwnName = false;
        }
    }

    function image_click() {
        $('#b_imageinput').click();
    }

    window.onload = function () {
        var i;
        if (localStorage.getItem('s_sound') === null) {
            $b_sound.val("on");
        } else {
            $b_sound.val(localStorage.getItem('s_sound'));
        }
        gSound = $b_sound.val() === "on";
        if (localStorage.getItem('s_image') !== null) {
            $inputImage.attr('src', localStorage.getItem('s_image'));
            $("#inputImage_l").attr('src', localStorage.getItem('s_image'));
            gOwnImage = true;
        }
        if (localStorage.getItem('s_name') !== null) {
            $inputName.val(localStorage.getItem('s_name'));
            if (localStorage.getItem('s_name').replace(/\s+/g, "") !== "") {
                gOwnName = true;
            }
        }

        url_param = url_query('theme');
        if (url_param) {
            if (url_param === 'mi') {
                $img_title.attr("src", "Images/title1_mi.png");
                $('#popupDialog_t1').attr("src", "Images/title1_mi.png");
                $('#popupDialog_t2').attr("src", "Images/title2_mi.png");
                $('#popupInfo_t1').attr("src", "Images/title1_mi.png");
                $('#popupInfo_t2').attr("src", "Images/title2_mi.png");
                $('#popupSettings_t1').attr("src", "Images/title1_mi.png");
                $('#popupSettings_t2').attr("src", "Images/title2_mi.png");
            }
        }

        $('[id^= "btplay"]').click(function (e) {
            playerClick();
            e.preventDefault();
        });
        $('[id^= "btonline"]').click(function (e) {
            online_click();
            e.preventDefault();
        });
        $('[id^= "bteasy"]').click(function (e) {
            easy_click();
            e.preventDefault();
        });
        $('[id^= "btmed"]').click(function (e) {
            medium_click();
            e.preventDefault();
        });
        $('[id^= "bthard"]').click(function (e) {
            hard_click();
            e.preventDefault();
        });

        $('.back').click(function (e) {
            back();
            e.preventDefault();
        });
        $('.again').click(function (e) {
            playAgain();
            e.preventDefault();
        });
        $('.btimg').click(function (e) {
            image_click();
            e.preventDefault();
        });
        $('.btclose').click(function (e) {
            closePop();
            e.preventDefault();
        });
        $('#btreset').click(function (e) {
            resetStats();
            e.preventDefault();
        });
        $('#inputName').change(function () {
            inputName_change(this.value);
        });

        for (i = 0; i < spalte.length; i += 1) {
            //document.getElementById(spalte[i]).addEventListener("click", function () {spielzug(i)});
            spalte_canvas[i] = document.getElementById(spalte[i]);
            spalte_context[i] = spalte_canvas[i].getContext("2d");
        }

        document.getElementById("spalte0").addEventListener("click", function () {
            spielzugCheck(0);
        });
        document.getElementById("spalte1").addEventListener("click", function () {
            spielzugCheck(1);
        });
        document.getElementById("spalte2").addEventListener("click", function () {
            spielzugCheck(2);
        });
        document.getElementById("spalte3").addEventListener("click", function () {
            spielzugCheck(3);
        });
        document.getElementById("spalte4").addEventListener("click", function () {
            spielzugCheck(4);
        });
        document.getElementById("spalte5").addEventListener("click", function () {
            spielzugCheck(5);
        });
        document.getElementById("spalte6").addEventListener("click", function () {
            spielzugCheck(6);
        });

        jQuery.preLoadImages(["Images/lightredon.png", "Images/lightredoff.png", "Images/lightblueon.png", "Images/lightblueoff.png", "Images/title2eng.png"]);
        document.getElementById('b_imageinput').addEventListener('change', resize_image, false);
        $("#popupSettings_col_b").find("label").attr("style", "display:inline;");

        contentFormatting();

        $img_title.delay(1500);
        $img_title.fadeOut(1000);
        $img_title.queue(function () {
            url_param = url_query('theme');
            if (url_param && url_param === 'mi') {
                $img_title.attr("src", "Images/title2_mi.png");
            } else {
                $img_title.attr("src", "Images/title2eng.png");
            }
            $(this).fadeIn(1000);
            $(this).dequeue();
        });
    };

    $(window).resize(function () {
        contentFormatting();
    });

    (function ($) {
        var cacheImage;
        var cache = [];
        var i;
        // Arguments are image paths relative to the current page.
        $.preLoadImages = function (imgs) {
            var imgs_len = imgs.length - 1;
            for (i = imgs_len; i >= 0; i -= 1) {
                cacheImage = document.createElement('img');
                cacheImage.src = imgs[i];
                cache.push(cacheImage);
            }
        };
    }(jQuery));

    navigator.mozL10n.ready(function () {
        // Example usage - http://homepage.hispeed.ch/grrds_games/4inaRow/?lang=ru
        url_param = url_query('lang');
        if (url_param) {
            if (url_param !== navigator.mozL10n.language.code) {
                navigator.mozL10n.language.code = url_param;
            }
        }
        updateStats();
        //$("#inputName").attr("placeholder",navigator.mozL10n.get("lbname"));
    });
}());