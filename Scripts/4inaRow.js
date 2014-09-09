/*
* grrd's 4 in a Row
* Copyright (c) 2012 Gerard Tyedmers, grrd@gmx.net
* Licensed under the MPL License
*/

//navigator.mozL10n.language.code = "ta";

window.requestAnimFrame = (function (callback) {
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();

var animate = false;
var spalte = new Array("spalte0", "spalte1", "spalte2", "spalte3", "spalte4", "spalte5", "spalte6");
var spalte_canvas = new Array(6);
var spalte_context = new Array(6);
var feld = new Array(6); // Spielfeld-Array: 6 Zeilen, 7 Spalten
for (var i = 0; i < feld.length; ++i)
{feld[i] = new Array(7);}
var winrow = new Array(4);
var wincol = new Array(4);
var winplayer = new Array(4);
var moeglichanz, steinetotal, steinebest, steinecount;
var modus=null;
var g_sound = true;
var g_ownimage = false;
var g_ownname = false;
var g_sendimage;
var p1_name;
var p2_name;

var wertung= new Array(7);
var bestwertung= new Array(3);
var color = new Array("#ff0080","#6969EE");
var bcolor = new Array("#D6016B","#5A5ACE");
var zcolor = new Array("#FD6BB4","#9393EF");
var player =0;
var P1lightimg = new Array("Images/lightredon.png","Images/lightredoff.png");
var P2lightimg = new Array("Images/lightblueon.png","Images/lightblueoff.png");
var spiele = 0;
var siege = new Array(0,0);
var spaltenr, zeile, compispalte, compizeile;
var viergewinnt, plaz, zeigenflag, demo, moeglichflag = new Boolean(false);
var topbis, topakt;
var colwidth,colheight;

var socket;
var user;
var connection = false;
var lastconnect;
var laststart;
var lastquit;
var lastround = null;
var countround = 0;
var onexit = false;
var fromonline = false;


function drawCircle(topakt,spaltenr,color,bcolor) {
	spalte_context[spaltenr].beginPath();
	spalte_context[spaltenr].arc(colwidth/2, topakt, colwidth/2*0.85, 0, 2 * Math.PI, false);
	spalte_context[spaltenr].fillStyle = color;
	spalte_context[spaltenr].fill();
	spalte_context[spaltenr].lineWidth = colwidth/20;
	spalte_context[spaltenr].strokeStyle = bcolor;
	spalte_context[spaltenr].stroke();
}

function player_click() {
	modus="2player";
	if (g_ownimage) {
		$("#P1icon").attr("src",$("#inputImage").attr('src'));
		$("#P1icon2").attr("src",$("#inputImage").attr('src'));
	} else {
		$("#P1icon").attr("src","Images/player.png");
		$("#P1icon2").attr("src","Images/player.png");
	}
	if (g_ownname) {
		p1_name = $('#inputName').val();
	} else {
		p1_name = navigator.mozL10n.get("lbplayer1");
	}
	p2_name = navigator.mozL10n.get("lbplayer2");
	$("#P1name").html(p1_name);
	$("#P1name2").html(p1_name);
	$("#P2name").html(p2_name);
	$("#P2name2").html(p2_name);
	$("#P2icon").attr("src","Images/player.png");
	$("#P2icon2").attr("src","Images/player.png");
	set_lights();
	onexit = false;
	$.mobile.changePage('#game', {transition: 'slide'});
}

function online_click() {
	$.mobile.changePage('#popupOnline', {transition: 'pop', role: 'dialog'});
	$("#btonline").addClass('ui-disabled');
	$("#btonline2").addClass('ui-disabled');
	if(!connection) {
		//socket = io.connect('http://localhost:3250');
		socket = io.connect('http://grrds4inarow.nodejitsu.com:80');
		connection = true;
	} else {socket.socket.reconnect();}
	
	socket.on('connect', function (data) {
		//$.mobile.showPageLoadingMsg("a", navigator.mozL10n.get("lbwait"), false);
	});
	
	socket.on('startgame', function (data) {
		user = data;
		if (user.id != laststart) {
			if (g_ownimage) {g_sendimage = $("#inputImage").attr('src');} else {g_sendimage = null;}
			socket.emit('usersend', {
				to: user.opponent,name: $('#inputName').val(), 
				pic: g_sendimage, 
				country: 0, points: 0, rank: 0
			});
			laststart = user.id;
			onexit = false;
			if (modus !== null) {$.mobile.changePage('#title', {transition: 'slide', reverse: true});}
			animate = false;
			leeren();
			spiele = 0;
			player = 0;
			siege = [0,0];
			set_lights();
			modus="online";
			if (user.role == 0) {
				if (g_ownimage) {
					$("#P1icon").attr("src",$("#inputImage").attr('src'));
					$("#P1icon2").attr("src",$("#inputImage").attr('src'));
				} else {
					$("#P1icon").attr("src","Images/player.png");
					$("#P1icon2").attr("src","Images/player.png");
				}
				if (g_ownname) {
					p1_name = $('#inputName').val();
				} else {
					p1_name = navigator.mozL10n.get("lbplayer1");
				}
				$("#P2icon").attr("src","Images/online.png");
				$("#P2icon2").attr("src","Images/online.png");
				p2_name = navigator.mozL10n.get("btonline");
			} else {
				$("#P1icon").attr("src","Images/online.png");
				$("#P1icon2").attr("src","Images/online.png");
				p1_name = navigator.mozL10n.get("btonline");
				if (g_ownimage) {
					$("#P2icon").attr("src",$("#inputImage").attr('src'));
					$("#P2icon2").attr("src",$("#inputImage").attr('src'));
				} else {
					$("#P2icon").attr("src","Images/player.png");
					$("#P2icon2").attr("src","Images/player.png");
				}
				if (g_ownname) {
					p2_name = $('#inputName').val();
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
		if (countround == data.round && lastround != data.round) {
			lastround = data.round;
			fromonline = true;
			spielzug(data.col);
		}
	});

	socket.on('userget', function (data) {
		if (user.role == 0) {
			if (data.pic !== null) {
				$("#P2icon").attr("src",data.pic);
				$("#P2icon2").attr("src",data.pic);
			}
			if (data.name.length > 0) {
				p2_name = data.name;
				$("#P2name").html(p2_name);
				$("#P2name2").html(p2_name);
			}
		} else {
			if (data.pic !== null) {
				$("#P1icon").attr("src",data.pic);
				$("#P1icon2").attr("src",data.pic);
			}
			if (data.name.length > 0) {
				p1_name = data.name;
				$("#P1name").html(p1_name);
				$("#P1name2").html(p1_name);
			}
		}
	});

	socket.on('quit', function (data) {
		if (user.id != lastquit) {
			lastquit = user.id;
			onexit = true;
			$.mobile.changePage('#popupLeft', {transition: 'pop', role: 'dialog'});
		}
	});
}

function easy_click() {
	modus="easy";
	p_computer();
}

function medium_click() {
	modus="medium";
	p_computer();
}

function hard_click() {
	modus="hard";
	p_computer();
}

function p_computer() {
	if (g_ownimage) {
		$("#P1icon").attr("src",$("#inputImage").attr('src'));
		$("#P1icon2").attr("src",$("#inputImage").attr('src'));
	} else {
		$("#P1icon").attr("src","Images/player.png");
		$("#P1icon2").attr("src","Images/player.png");
	}
	if (g_ownname) {
		p1_name = $('#inputName').val();
	} else {
		p1_name = navigator.mozL10n.get("lbplayer");
	}
	p2_name = navigator.mozL10n.get("lbcomputer");
	$("#P1name").html(p1_name);
	$("#P1name2").html(p1_name);
	$("#P2name").html(p2_name);
	$("#P2name2").html(p2_name);
	$("#P2icon").attr("src","Images/computer.png");
	$("#P2icon2").attr("src","Images/computer.png");
	set_lights();
	onexit = false;
	$.mobile.changePage('#game', {transition: 'slide'});
}

function back() {
	//window.location = "#title";
	if (modus == "online") {
		socket.disconnect();
		$('#btonline').removeClass('ui-disabled');
		$('#btonline2').removeClass('ui-disabled');

	}
	onexit = true;
	content_formatting();
	$.mobile.changePage('#title', {transition: 'slide', reverse: true});
	animate = false;
	leeren();
	spiele = 0;
	player = 0;
	siege = [0,0];
	modus = null;
}

function closepop() {
	if ($('#b_sound').val()==="on") {g_sound=true;} else {g_sound=false;}
	localStorage.setItem('s_sound', $('#b_sound').val());
	content_formatting();
	$.mobile.changePage('#title', {transition: 'pop', reverse: true});
}

function set_lights() {
	$("#P1light").attr("src",P1lightimg[player]);
	$("#P2light").attr("src",P2lightimg[1-player]);
	$("#P1light2").attr("src",P1lightimg[player]);
	$("#P2light2").attr("src",P2lightimg[1-player]);
}

function spielzug_animate(lastTime, topakt, spaltenr) {
	if (animate) {
		// update
		var date = new Date();
		var time = date.getTime();
		var timeDiff = time - lastTime;
		var linearSpeed = colheight;
		// pixels / second
		var linearDistEachFrame = linearSpeed * timeDiff / 1000;

		if (topakt < topbis) {
			topakt = Math.min(topbis, topakt + linearDistEachFrame);
			lastTime = time;
			// clear
			spalte_context[spaltenr].clearRect(0, 0, colwidth, topbis + colwidth/2*0.85);
			// draw
			drawCircle(topakt,spaltenr,color[player],bcolor[player]);
			// request new frame
			requestAnimFrame(function() {
				spielzug_animate(lastTime, topakt, spaltenr);
			});
		} else {
			if (g_sound) {document.getElementById('click_sound').play();}
			animate = false;
			kontrolle(player, true);

			if (viergewinnt) {
				siege[player] = siege[player] + 1;
				if (g_sound) {document.getElementById('ding_sound').play();}
				//if (modus != "2player" && player == 1) {
				//	meldung(navigator.mozL10n.get("lbcomputer") + " " + navigator.mozL10n.get("lbwin"),new Date().getTime());
				//} else {
				//	meldung(navigator.mozL10n.get("lbplayer") + " " + (player + 1) + " " + navigator.mozL10n.get("lbwin"),new Date().getTime());
				//}
				if (player == 0) {
					meldung(p1_name + " " + navigator.mozL10n.get("lbwin"),new Date().getTime());
				} else {
					meldung(p2_name + " " + navigator.mozL10n.get("lbwin"),new Date().getTime());
				}
			} else {
				if (!plaz) {
					meldung(navigator.mozL10n.get("lbdraw"),new Date().getTime());
				} else {
					player = 1 - player;
					set_lights();
					if (modus != "2player" && modus != "online" && player == 1) {
						ai();
					}
				}
			}
		}
	}
}

function spielzug_check(spaltenr) {
	if (modus == "online") {
		if ((player == 1 && user.role == 0) || (player == 0 && user.role == 1)) {
			return;
		} else {
			socket.emit('playsend', {to: user.opponent,col: spaltenr, round: countround});
			spielzug(spaltenr);
		}
	} else {
		spielzug(spaltenr);
	}
}

function spielzug(spaltenr) {
	if (fromonline) {
		fromonline = false;
		if (modus == "online") {
			if ((player == 0 && user.role == 0) || (player == 1 && user.role == 1)) {
				return;
			}
		}
	}
	if (!animate) {
		countround = countround +1;
		zeile = 0;
		topbis = 0;
		while (zeile < feld.length && topbis === 0) {
			if (feld[zeile][spaltenr] == undefined) {
				animate = true;
				feld[zeile][spaltenr] = player;
				topbis = (feld.length - zeile - 0.5) * colwidth * 0.85;
				var date = new Date();
				var time = date.getTime();
				topakt = -30;
				spielzug_animate(time, topakt, spaltenr);
				break;
			}
			zeile = zeile + 1;
		}
	}
}

function kontrolle(player, zeigenflag) {
	// **************************************************************
	// viergewinnt?
	// **************************************************************
	viergewinnt = false;
	for (zeile = 0; zeile < feld.length; ++zeile) {
		for (spaltenr = 0; spaltenr < feld[zeile].length; ++spaltenr) {
			kontrolle_det(zeile, spaltenr, 1, 0,player,zeigenflag);
			kontrolle_det(zeile, spaltenr, 0, 1,player,zeigenflag);
			kontrolle_det(zeile, spaltenr, 1, 1,player,zeigenflag);
			kontrolle_det(zeile, spaltenr, 1, -1,player,zeigenflag);
		}
	}
	// **************************************************************
	// haz no plaz?
	// **************************************************************
	plaz = false;
	for (spaltenr = 0; spaltenr < feld[0].length; ++spaltenr) {
		if (feld[feld.length-1][spaltenr] ==undefined) {
			plaz = true;
		}
	}
}

function kontrolle_det(zeile, spaltenr, zeilenfaktor, spaltenfaktor,player,zeigenflag) {
	if (zeile + 3 * zeilenfaktor < feld.length && spaltenr + 3 * spaltenfaktor< feld[zeile].length && (zeile + 3 * zeilenfaktor) >= 0 && (spaltenr + 3 * spaltenfaktor)>= 0) {
		for (var i = 0; i < 4; ++i) {
			if (feld[zeile + i * zeilenfaktor][ spaltenr + i * spaltenfaktor] == player) {
				winrow[i]=zeile + i * zeilenfaktor;
				wincol[i]=spaltenr + i * spaltenfaktor;
				winplayer[i]=player;
				if (i==3) {
					viergewinnt=true;
					if (zeigenflag) {zeigen();}
					i=5;
				}
			}
			else {i=5;}
			}
		}
	}

function ai() {
	wertung= [];
	zeigenflag=false;
	// **************************************************************
	// wertung: xyyzz
	//	- x: maximal vorhanden
	//	- yy: möglichkeiten, 4 zu machen
	//	- zz: total vorhanden
	//
	//	- 0: spalte nicht spielbar (schon voll)
	//	- 1: spalte spielbar, lässt aber gegner gewinnen
	//	- 2: spalte spielbar
	//	- 50000: viergewinnt verhindern
	//	- 60000: viergewinnt
	//
	// **************************************************************
	//	punktewertung pro spalte:
	//	- wieviele möglichkeiten, 4 zu machen (alle richtungen, positionen) gibt es hier
	//		(felder noch leer oder meine)
	//	- wieviele steine sind dazu schon vorhanden (gesamthaft alle varianten, höchste variante)
	//	- wieviele steine sind dazu noch nötig (auffüllen)?
	// **************************************************************
	for (compispalte = 0; compispalte < feld[0].length; ++compispalte) {
		wertung[compispalte] =0;
		for (compizeile = 0; compizeile < feld.length; ++compizeile) {
			if (feld[compizeile][compispalte] == undefined) {
				feld[compizeile][compispalte] = player;
				rating(player, compizeile, compispalte);
				wertung[compispalte] = 10000 * steinebest + 100 * moeglichanz + steinetotal + 2;
				feld[compizeile][compispalte] = undefined;
				break;
			}
		}
	}

	// **************************************************************
	//	wert der spalte für gegner ermitteln
	//	dort spielen, falls höher als bester eigener wert
	// **************************************************************
	bestwertung[0]=0;
	for (var a = 0; a < wertung.length; ++a) {
		if (wertung[a] > bestwertung[0]) {
			bestwertung[0] = wertung[a];
		}
	}

	player = 1 - player;
	for (compispalte = 0; compispalte < feld[0].length; ++compispalte) {
		for (compizeile = 0; compizeile < feld.length; ++compizeile) {
			if (feld[compizeile][compispalte] == undefined) {
				feld[compizeile][compispalte] = player;
				rating(player, compizeile, compispalte);
				if (10000 * steinebest + 100 * moeglichanz + steinetotal + 2 > bestwertung[0]) {
					wertung[compispalte] = 10000 * steinebest + 100 * moeglichanz + steinetotal + 2;
				}
				feld[compizeile][compispalte] = undefined;
				break;
			}
		}
	}
	player = 1 - player;


	// **************************************************************
	//	kann gegner über mir 4 machen? diese spalte tabu setzen
	// **************************************************************
	player = 1 - player;
	for (compispalte = 0; compispalte < feld[0].length; ++compispalte) {
		for (compizeile = 0; compizeile < feld.length - 1; ++compizeile) {
			if (feld[compizeile][compispalte] == undefined) {
				feld[compizeile + 1][compispalte] = player;
				kontrolle(player, zeigenflag);
				feld[compizeile + 1][compispalte] = undefined;
				break;
			}
		}
		if (viergewinnt) {
			//alert ("Aber ganz sicher nicht in spalte " + compispalte + " spielen!");
			wertung[compispalte] = 1;
			viergewinnt = false;
		}
	}
	player = 1 - player;

	// **************************************************************
	//	kann gegner 4 machen? dort spielen
	// **************************************************************
	player = 1 - player;
	for (compispalte = 0; compispalte < feld[0].length; ++compispalte) {
		for (compizeile = 0; compizeile < feld.length; ++compizeile) {
			if (feld[compizeile][compispalte] == undefined) {
				feld[compizeile][compispalte] = player;
				kontrolle(player, zeigenflag);
				feld[compizeile][compispalte] = undefined;
				break;
			}
		}
		if (viergewinnt) {
			//alert ("Zum nicht Verlieren: In spalte " + compispalte + " spielen!");
			wertung[compispalte] = 50000;
			viergewinnt = false;
		}
	}
	player = 1 - player;

	// **************************************************************
	//	kann ich 4 machen? dort spielen
	// **************************************************************
	for (compispalte = 0; compispalte < feld[0].length; ++compispalte) {
		for (compizeile = 0; compizeile < feld.length; ++compizeile) {
			if (feld[compizeile][compispalte] == undefined) {
				feld[compizeile][compispalte] = player;
				kontrolle(player, zeigenflag);
				feld[compizeile][compispalte] = undefined;
				break;
			}
		}
		if (viergewinnt) {
			//alert ("Zum Gewinnen: In spalte " + compispalte + " spielen!");
			wertung[compispalte] = 60000;
			viergewinnt = false;
		}
	}

	// **************************************************************
	//	beste spalte wählen, dort spielen
	// **************************************************************
	bestwertung = wertung.slice();
	bestwertung.sort(Numsort);
	bestwertung.reverse();

	spaltenr = Math.round(Math.random() * 6); //Zufallszahl im Bereich von 0 bis 6

	if (modus == "hard") {
		while (wertung[spaltenr] != bestwertung[0]) {
			spaltenr = Math.round(Math.random() * 6); //Zufallszahl im Bereich von 0 bis 6
		}
	}
	if (modus == "medium") {
		while (wertung[spaltenr] <	bestwertung[1] || wertung[spaltenr] === 0) {
			spaltenr = Math.round(Math.random() * 6); //Zufallszahl im Bereich von 0 bis 6
		}
	}
	if (modus == "easy") {
		while (wertung[spaltenr] <	bestwertung[2] || wertung[spaltenr] === 0) {
			spaltenr = Math.round(Math.random() * 6); //Zufallszahl im Bereich von 0 bis 6
		}
	}
	spielzug(spaltenr);
}

function Numsort (a, b) {
	return a - b;
}

function rating(player, compizeile, compispalte) {
	moeglichanz = 0;
	steinetotal = 0;
	steinebest = 0;
	// **************************************************************
	// horizontal
	// **************************************************************
	for (var a = compispalte - 3; a <= compispalte; ++a) {
		if (a >= 0 && a + 3 < feld[0].length) {
			moeglichflag = true;
			steinecount = 0;
			for (var b = 0; b <= 3; ++b) {
				if (feld[compizeile][a + b] !== undefined) {
					if (feld[compizeile][a + b] ==	player) {
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
	// vertikal for (var a = compizeile + 3; a == compizeile; --a) {
	// **************************************************************
	for (a = compizeile + 3; a >= compizeile; --a) {
		if (a - 3 >= 0 && a < feld.length) {
			moeglichflag = true;
			steinecount = 0;
			for (b = 0; b <= 3; ++b) {
				if (feld[a - b][compispalte] !== undefined){
					if (feld[a - b][compispalte] ==	player) {
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
	for (a = 3; a >= 0 ; --a) {
		if (compispalte - a >= 0 && compispalte - a + 3 < feld[0].length && compizeile - a >= 0 && compizeile - a + 3 < feld.length) {
			moeglichflag = true;
			steinecount = 0;
			for (b = 0; b <= 3; ++b) {
				if (feld[compizeile - a + b][compispalte - a + b] !== undefined) {
					if (feld[compizeile - a + b][compispalte - a + b] == player) {
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
	for (a = 3; a >= 0 ; --a) {
		if (compispalte - a >= 0 && compispalte - a + 3 < feld[0].length && compizeile + a < feld.length && compizeile + a - 3 >= 0) {
			moeglichflag = true;
			steinecount = 0;
			for (b = 0; b <= 3; ++b) {
				if (feld[compizeile + a - b][compispalte - a + b] !== undefined) {
					if (feld[compizeile + a - b][compispalte - a + b] == player) {
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

function zeigen() {
	animate=true;
	zwinrow = winrow.slice();
	zwincol = wincol.slice();
	zeigen_animate(zwinrow,zwincol,0,new Date().getTime());
	//while (animate){};
}

function zeigen_animate(mywinrow,mywincol,myzeigencount,zwait) {
	if (onexit) {return;}
	if (myzeigencount < 6 && zwait + 250 < new Date().getTime() && animate) {
		++myzeigencount;
		zwait = new Date().getTime();
		for (var i = 0; i < 4; ++i) {
			if(myzeigencount % 2 !== 0) {
				drawCircle((feld.length - mywinrow[i]- 0.5) * colwidth * 0.85,mywincol[i],zcolor[player],"white");//zcolor[player]
			} else {
				drawCircle((feld.length - mywinrow[i]- 0.5) * colwidth * 0.85,mywincol[i],color[player],"white");
			}
		}
		requestAnimFrame(function() {
			zeigen_animate(mywinrow,mywincol,myzeigencount,zwait);
		});
	} else if (myzeigencount < 6 && animate) {
		requestAnimFrame(function() {
			zeigen_animate(mywinrow,mywincol,myzeigencount,zwait);
		});
	}
}

function meldung(meldungtext,wait) {
	if (onexit) {return;}
	if (wait + 2000 > new Date().getTime() && animate) {
		requestAnimFrame(function() {
			meldung(meldungtext,wait);
		});
	} else {
		spiele = spiele + 1;
		$('#printMessage').html(meldungtext);
		if (spiele == 1) {
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
		if(spiele % 2 !== 0) {
			player = 1;
		} else {
			player = 0;
		}
		set_lights();
		animate=false;
	}
}

function playagain() {
	//ios7-bug: $('#popupDialog').dialog('close');
	$.mobile.changePage('#game', {transition: 'pop', reverse: true});
	if (modus != "2player" && modus != "online" && player == 1) {
		ai();
	}
}

function leeren() {
	countround = 0;
	lastround = null;
	for (var i = 0; i < feld.length; ++i) {
		for (var j = 0; j < feld[i].length; ++j) {
			feld[i][j] = undefined;
			if (i=== 0) {
				spalte_context[j].clearRect(0, 0, colwidth, colheight);
			}
		}
	}
	content_formatting();
}

function content_formatting() {
	var height = $(window).height();
	var width = $(window).width();
	if (height > width) {
		// Spaltenbreite
		colwidth = Math.min((width - 50)/7,(height - 140)/6);
		colheight = Math.max(6 * colwidth * 0.85,height - 190);
		$("#img_title").attr("style","width:100%;");
		$("#listheight1").attr("style","height:" + ($(window).height() - $(window).width()/3 -130)/7 + "px;");
		$("#listheight2").attr("style","height:" + ($(window).height() - $(window).width()/3 -130)/7 + "px;");
		$("#listheight3").attr("style","height:" + ($(window).height() - $(window).width()/3 -130)/7 + "px;");
		$("#listheight4").attr("style","height:" + ($(window).height() - $(window).width()/3 -130)/7 + "px;");
		$("#listheight5").attr("style","height:" + ($(window).height() - $(window).width()/3 -130)/7 + "px;");
		$("#listpadd1").attr("style","padding-top:" + ($(window).height() - $(window).width()/3 -270)/14 + "px;");
		$("#listpadd2").attr("style","padding-top:" + ($(window).height() - $(window).width()/3 -270)/14 + "px;");
		$("#listpadd3").attr("style","padding-top:" + ($(window).height() - $(window).width()/3 -270)/14 + "px;");
		$("#listpadd4").attr("style","padding-top:" + ($(window).height() - $(window).width()/3 -270)/14 + "px;");
		$("#listpadd5").attr("style","padding-top:" + ($(window).height() - $(window).width()/3 -270)/14 + "px;");
		$("#page_landscape").attr("style","display:none;");
		$("#page_portrait").attr("style","display:inline;");
		$("#indicator_landscape_l").attr("style","display:none;");
		$("#indicator_landscape_r").attr("style","display:none;");
		$("#indicator_portrait").attr("style","display:block;");
		$("#popupDialog_landscape").attr("style","display:none;");
		$("#popupDialog_portrait").attr("style","display:block;");
		$("#popupSettings_portrait").attr("style","display:block;");
		$("#popupSettings_landscape").attr("style","display:none;");
		$("#popupSettings_col_b").appendTo("#popupSettings_portrait");
		$("#printMessage").attr("style","display:block;");
	} else {
		// Spaltenbreite	
		colwidth = Math.min((width - 140 - 40)/7,(height - 20)/6);
		colheight = Math.max(6 * colwidth * 0.85,height - 95);
		$("#img_title").attr("style","width:" + ($(window).width()*0.6) + "px;");
		$("#blankspace").attr("style","height:" + ($(window).height()/4 - $(window).width()/20) + "px;");
		$("#page_landscape").attr("style","display:inline;");
		$("#page_portrait").attr("style","display:none;");
		$("#indicator_landscape_l").attr("style","display:inline;");
		$("#indicator_landscape_r").attr("style","display:inline;");
		$("#indicator_portrait").attr("style","display:none;");
		$("#popupDialog_landscape").attr("style","display:block;");
		$("#popupDialog_portrait").attr("style","display:none;");
		$("#popupSettings_portrait").attr("style","display:none;");
		$("#popupSettings_landscape").attr("style","display:block;");
		$("#popupSettings_col_b").appendTo("#popupSettings_landscape_b");
		$("#printMessage").attr("style","display:inline;");
	}

	$("#btplay").attr("style","width:" + (width/5-8) + "px;");
	$("#btonline").attr("style","width:" + (width/5-8) + "px;");
	$("#bteasy").attr("style","width:" + (width/5-8) + "px;");
	$("#btmed").attr("style","width:" + (width/5-8) + "px;");
	$("#bthard").attr("style","width:" + (width/5-8) + "px;");


	for (var i = 0; i < spalte.length; ++i) {
		document.getElementById(spalte[i]).width = colwidth;
		document.getElementById(spalte[i]).height = colheight;
	}

	for (var j = 0; j < feld[0].length; ++j) {
		for (i = 0; i < feld.length; ++i) {
			spalte_context[j].beginPath();
			spalte_context[j].arc(colwidth/2, (feld.length - i - 0.5) * colwidth*0.85,
			colwidth/2*0.7, 0, 2 * Math.PI, false);
			spalte_context[j].lineWidth = colwidth/10;
			spalte_context[j].strokeStyle = "#212121";
			spalte_context[j].stroke();

			spalte_context[j].beginPath();
			spalte_context[j].arc(colwidth/2, (feld.length - i - 0.5) * colwidth*0.85,
			colwidth/2*0.7, 1.8 * Math.PI, 0.8 * Math.PI, false);
			spalte_context[j].lineWidth = spalte_canvas[j].width/10;
			spalte_context[j].strokeStyle = "grey";
			spalte_context[j].stroke();
		}
	}


	for (j = 0; j < feld[0].length; ++j) {
		spalte_context[j].save();
		spalte_context[j].beginPath();
		for (i = 0; i < feld.length; ++i) {
			spalte_context[j].arc(colwidth/2, (feld.length - i - 0.5) * colwidth*0.85,
			colwidth/2*0.7, 0, 2 * Math.PI, false);
		}
		spalte_context[j].clip();
		spalte_context[j].clearRect(0, 0, colwidth, colheight);
	}

	for (i = 0; i < feld.length; ++i) {
		for (j = 0; j < feld[i].length; ++j) {
			if (feld[i][j]!= undefined) {
				drawCircle((feld.length - i - 0.5) * colwidth*0.85,j,color[feld[i][j]],bcolor[feld[i][j]]);
			}
		}
	}
	if (animate) {
		topakt = topakt / topbis * ((feld.length - zeile - 0.5) * colwidth*0.85);
		topbis = (feld.length - zeile - 0.5) * colwidth*0.85;
	}
}

window.onload = function() {

	if (localStorage.getItem('s_sound') === null) {
		$('#b_sound').val("on");} else {$('#b_sound').val(localStorage.getItem('s_sound'));
	}
	if ($('#b_sound').val()==="on") {g_sound=true;} else {g_sound=false;}
	if (localStorage.getItem('s_image') !== null) {
		$("#inputImage").attr('src', localStorage.getItem('s_image'));
		$("#inputImage_l").attr('src', localStorage.getItem('s_image'));
		g_ownimage = true;
	}
	if (localStorage.getItem('s_name') !== null) {
		$('#inputName').val(localStorage.getItem('s_name'));
		if (localStorage.getItem('s_name').replace(/\s+/g,"") !== "") {g_ownname = true;}
	}

	// add click listener to canvas
	for (var i = 0; i < spalte.length; ++i) {
		//document.getElementById(spalte[i]).addEventListener("click", function() {spielzug(i)});
		spalte_canvas[i] = document.getElementById(spalte[i]);
		spalte_context[i] = spalte_canvas[i].getContext("2d");
	}

	document.getElementById("spalte0").addEventListener("click", function() {
		spielzug_check(0);
	});
	document.getElementById("spalte1").addEventListener("click", function() {
		spielzug_check(1);
	});
	document.getElementById("spalte2").addEventListener("click", function() {
		spielzug_check(2);
	});
	document.getElementById("spalte3").addEventListener("click", function() {
		spielzug_check(3);
	});
	document.getElementById("spalte4").addEventListener("click", function() {
		spielzug_check(4);
	});
	document.getElementById("spalte5").addEventListener("click", function() {
		spielzug_check(5);
	});
	document.getElementById("spalte6").addEventListener("click", function() {
		spielzug_check(6);
	});

	jQuery.preLoadImages("Images/lightredon.png","Images/lightredoff.png","Images/lightblueon.png","Images/lightblueoff.png","Images/title2eng.png");
	document.getElementById('b_imageinput').addEventListener('change', resize_image, false);

	content_formatting();

	$('#img_title').delay(1500);
	$('#img_title').fadeOut(1000);
	$('#img_title').queue( function() {
		$(this).attr("src","Images/title2eng.png");
		$(this).fadeIn(1000);
		$(this).dequeue();
	} );
};

$(window).resize( function() {
	content_formatting();
});

(function($) {
	var cache = [];
	// Arguments are image paths relative to the current page.
	$.preLoadImages = function() {
		var args_len = arguments.length;
		for (var i = args_len; i--;) {
			var cacheImage = document.createElement('img');
			cacheImage.src = arguments[i];
			cache.push(cacheImage);
		}
	};
})(jQuery);

navigator.mozL10n.ready( function() {
	// Example usage - http://homepage.hispeed.ch/grrds_games/4inaRow/?lang=ru
	url_param = url_query('lang');
	if ( url_param ) {
		if (url_param !== navigator.mozL10n.language.code) {navigator.mozL10n.language.code = url_param;}
	}
	//$("#inputName").attr("placeholder",navigator.mozL10n.get("lbname"));
});

// Parse URL Queries
function url_query( query ) {
	query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var expr = "[\\?&]"+query+"=([^&#]*)";
	var regex = new RegExp( expr );
	var results = regex.exec( window.location.href );
	if ( results !== null ) {
		return results[1];
	} else {
		return false;
	}
}

function inputName_change(inpname) {
	if ( inpname.replace(/\s+/g,"") !== "") {
		localStorage.setItem('s_name', inpname);
		g_ownname = true;
	} else {
		localStorage.removeItem('s_name');
		g_ownname = false;
	}
}

function image_click(){
	b_imageinput.click();
}

function resize_image(file){
	var fileLoader = new FileReader(),
	canvas = document.createElement('canvas'),
	context = null,
	imageObj = new Image(),
	blob = null;
	var max_width = 67;
	var max_height = 71;
	var g_exif;


	//create a hidden canvas object we can use to create the new resized image data
	canvas.id = "hiddenCanvas";
	canvas.width = max_width;
	canvas.height = max_height;
	canvas.style.visibility	 = "hidden"; 
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
	fileLoader.onload = function() {
		var data = this.result; 
		g_exif = EXIF.readFromBinaryFile(new BinaryFile(atob(data.split(',')[1])));
		imageObj.src = data;
		//$("#inputImage").attr("src",data);
	};

	// set up the images onload function which clears the hidden canvas context, 
	// draws the new image then gets the blob data from it
	imageObj.onload = function() {	
		var mytop = 0;
		var myleft = 0;
		// Check for empty images
		if(this.width === 0 || this.height === 0){
			alert('Image is empty');
		} else {
			if (g_exif.Orientation === 5 || g_exif.Orientation === 6) {
				context.rotate(90*Math.PI/180);
				myleft = -1*max_width;
				max_width = 71;
				max_height = 67;
			}
			if (g_exif.Orientation === 3 || g_exif.Orientation === 4) {
				context.rotate(180*Math.PI/180);
				myleft = -1*max_width -4;
				mytop = -1*max_height +4;
			}
			if (g_exif.Orientation === 7 || g_exif.Orientation === 8) {
				context.rotate(270*Math.PI/180);
				mytop = -1*max_height;
				max_width = 71;
				max_height = 67;
			}
			context.clearRect(0,0,max_width,max_height);
			context.drawImage(imageObj, 0, 0, this.width, this.height, mytop, myleft, max_width, max_height);
			$("#inputImage").attr('src', canvas.toDataURL("image/jpeg"));
			$("#inputImage_l").attr('src', canvas.toDataURL("image/jpeg"));
			localStorage.setItem('s_image', canvas.toDataURL("image/jpeg"));
			g_ownimage = true;
		}
	};
}