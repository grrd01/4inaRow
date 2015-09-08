var app = require('http').createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');
var Moniker = require('moniker');
var port = 3250;

var users = [];

app.listen(port);

// socket.io
io.sockets.on('connection', function (socket) {
	var user = addUser(socket);
	//socket.emit("connect", user);

	socket.on('disconnect', function () {
		if (user.opponent != null) {
			io.sockets.socket(user.opponent).emit("quit", user);
		}
		removeUser(user);
	});

	socket.on("playsend", function (data) {
		io.sockets.socket(data.to).emit("playget", data);
	});

	socket.on("usersend", function (data) {
		io.sockets.socket(data.to).emit("userget", data);
	});


});

var addUser = function(socket) {
	var user = {
		name: Moniker.choose(),
		id: socket.id,
		role: null,
		opponent: null
	};
	users.push(user);
	updateUsers();
	startgame(user);
	return user;
};

var removeUser = function(user) {
	for(var i=0; i<users.length; i++) {
	if(user.name === users[i].name) {
	users.splice(i, 1);
	updateUsers();
	return;
	}
	}
};

var updateUsers = function() {
	var str = '';
	for(var i=0; i<users.length; i++) {
	var user = users[i];
	str += user.name + ' <br />';
	}
	//io.sockets.emit("users", { users: str });
};

var startgame = function(user) {
	for(var i=0; i<users.length; i++) {
		if (i == users.length-1) {
			// kein freier Gegner
			io.sockets.socket(users[i].id).emit("connect", users[i]);
		} else {
			// Gegner vorhanden
			if (users[i].opponent == null) {
				users[i].opponent = users[users.length-1].id;
				users[i].role = "0";
				io.sockets.socket(users[i].id).emit("startgame", users[i]);
				users[users.length-1].opponent = users[i].id;
				users[users.length-1].role = "1";
				io.sockets.socket(users[users.length-1].id).emit("startgame", users[users.length-1]);
				break;
			}
		}
	}
};