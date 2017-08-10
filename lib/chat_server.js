var socketio = require('socket.io');

var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server){
    io = socketio.listen(server);

    io.set('log level', 1);

    io.sockets.on('connection', function (socket) {
        guestNumber = '';

        joinRoom(socket, 'ZZRTIAN');
        
        handleMessageBroadcasting(socket, nickNames);
        handleNmaeChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);

        socket.on('rooms',function(){
            socket.emit('rooms', io.socket.manager.rooms);
        });

        handleClientDisconnection(socket, nickNames, namesUsed);
    
    });
};