/***********************************************/
/*            Set up the static file server */


/* include the static file webserver library */

var static = require('node-static');

/* Include the http server library*/
var http = require ('http');

/* assume that we are running on Heroku */
var port = process.env.PORT;
var directory = __dirname + '/public';

/* if we aren't on heroku, then we need to re adjust the port and directory. We this because the port won't be set */
if (typeof port == 'undefined' || !port){
    directory = './public';
    port = 8080;
}

/* Set up a static web-server that will deliver files from the filesystem */
var file = new static.Server(directory);

/* Construct an http server that gets files from the file server */
var app = http.createServer(
        function(request, response){
            request.addListener('end',
                function(){
                    file.serve(request, response);
                }
            ).resume();
        }
    ).listen(port);

    console.log('The Server is running v10');
    console.log('The port '         + port);
    console.log('The directory'     + directory );

/***********************************************/
/*            Set up the web socket server */

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket){
    function log(){
        var array = ['*** Server log message: '];

        for (var i = 0; i < arguments.length;i++) {
            array.push(arguments[i]);
            console.log(arguments[i]);
        }

        socket.emit('log', array);
        socket.broadcast.emit('log', array);
    } //close log

    
    log('A website connected to server');

    socket.on('disconnect', function(socket){
        log('A website disconnected from server');
    }); //end socket disconnect
    

    /*  join_room command              */
    /* payload:
        {
            'room': room to join,
            'username': username of person joining
        }

        join_room_response:
        {
            'result'    : 'success',
            'room'      : room joined,
            'username'  : username that joined,
            'membership': num of ppl in the room, including new one
        }
        or
        {
            'result': 'fail',
            'message': failure message
        }
    */
    socket.on('join_room', function(payload){
        //log('received join_room command!!');
        log('Server received command', '____join_room', payload);

        if(  ('undefined' === typeof payload) || !payload){
            var error_message = 'join room had no payload';
            log(error_message);
            socket.emit('join_room_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if undefined

        var room = payload.room;
        if(  ('undefined' === typeof room) || !room){
            var error_message = 'join_room didn\'t specify a room, ABORTED';
            log(error_message);
            socket.emit('join_room_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if room ???

        var username = payload.username;
        if(  ('undefined' === typeof username) || !username){
            var error_message = 'join_room didn\'t specify a username, ABORTED';
            log(error_message);
            socket.emit('join_room_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if username ???

        socket.join(room);   // JOIN ROOM JOIN ROOM JOIN ROOM

        var roomObject = io.sockets.adapter.rooms[room];

        if(  ('undefined' === typeof roomObject) || !roomObject){
            var error_message = 'join_room couldn\'nt create a room (internal error),  ABORTED';
            log(error_message);
            socket.emit('join_room_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if roomObject ???

        var numClients = roomObject.length;
        var success_data = {
                result: 'success',
                room: room,
                username: username,
                membership: (numClients + 1) //plus 1 for person that just joined
        };

        io.sockets.in(room).emit('join_room_response', success_data);
        log('Room: ' + room + ' was just joined by  ' + username);

    }); //end socket join_room     
}); //end io socket connection
