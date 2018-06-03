//Gary
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

    console.log('The Server is running v8.0');
    console.log('The port '         + port);
    console.log('The directory'     + directory );

/***********************************************/
/*            Set up the web socket server */
/* A registry of socket_ids and player information */
var players = [];


var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket){
    
    log('Client connection by ' + socket.id);
        
    function log(){
        var array = ['*** Server log message: '];

        for (var i = 0; i < arguments.length;i++) {
            array.push(arguments[i]);
            console.log(arguments[i]);
        }

        socket.emit('log', array);
        socket.broadcast.emit('log', array);
    } //close log
    

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
            'socket_id' : the socket id of the person that, 
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
        //log('Server received command', 'C_CMD: join_room', 'C_PAYLOAD: ' , payload);
        log('Server received \'join_room\' command' + JSON.stringify(payload));

        /* Check that the client sent a payload */
        if(  ('undefined' === typeof payload) || !payload){
            var error_message = 'join room had no payload';
            log(error_message);
            socket.emit('join_room_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if undefined

        /* Check that the payload has a room to join */
        var room = payload.room;
        if(  ('undefined' === typeof room) || !room){
            var error_message = 'join_room didn\'t specify a room, ABORTED';
            log(error_message);
            socket.emit('join_room_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if room 

        /*  Check that a username has been provided */
        var username = payload.username;
        if(  ('undefined' === typeof username) || !username){
            var error_message = 'join_room didn\'t specify a username, ABORTED';
            log(error_message);
            socket.emit('join_room_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if username

        /* Store information about this new player */
        players[socket.id] = {};
        players[socket.id].username = username;
        players[socket.id].room     = room;


        /* Actually have the user join the room */
        socket.join(room);   // JOIN ROOM JOIN ROOM JOIN ROOM

        /* Get the room object */
        var roomObject = io.sockets.adapter.rooms[room];

        /* DELETE THIS CODE - we will have a roomObject
        if(  ('undefined' === typeof roomObject) || !roomObject){
            var error_message = 'join_room couldn\'nt create a room (internal error),  ABORTED';
            log(error_message);
            socket.emit('join_room_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if roomObject ???
        */

        /* Tell everyone that is already in the room that someone just joined */
        var numClients = roomObject.length;
        var success_data = {
                result:     'success',
                room:       room,
                username:   username,
                socket_id:  socket.id,
                membership: numClients
        };

        //broadcast to everyone
        io.in(room).emit('join_room_response', success_data);

        /* Notify the user of people already in the room - get him up to speed */
        for(var socket_in_room in roomObject.sockets){
            var success_data = {
                result:     'success',
                room:       room,
                username:   players[socket_in_room].username,
                socket_id:  socket_in_room,
                membership: numClients                
            };
            socket.emit('join_room_response', success_data); //send to every user in room
        } //end for

        log('join_room success - Room: ' + room + ' was just joined by  ' + username);

    }); //end socket join_room   

    socket.on('disconnect', function(){

        log('Client disconnected ' + JSON.stringify(players[socket.id]) + 'A website disconnected from server');

        if ('undefined' !== typeof players[socket.id] && players[socket.id] ){
            var username = players[socket.id].username;
            var room     = players[socket.id].room;
            
            var payload = {
                username: username,
                socket_id: socket.id
            };

            delete players[socket.id];
            //broadcast to everyone
            io.in(room).emit('player_disconnected', payload);

            /*if (FALSE){
                for(var socket_in_room in roomObject.sockets){
                    var success_data2 = {
                        socket_id:  socket_in_room,
                    };
                    io.in(room).emit('invited_response', success_data2); //send to every user in room
                }
            }*/
        }

    }); //end socket disconnect    


    /*  send_message command              */
    /* payload:
        {
            'room': room to join,
            'message': the message to send

        }

        send_message_response:
        {
            'result'    : 'success',
            'username'  : username of person that spoke,
            'message': the msg spoken
        }
        or
        {
            'result': 'fail',
            'message': failure message
        }
    */
   socket.on('send_message', function(payload){
    //log('received join_room command!!');
    log('Server received command', 'C_CMD: send_message', 'C_PAYLOAD: ' , payload);

    if(  ('undefined' === typeof payload) || !payload){
        var error_message = 'send_message had no payload';
        log(error_message);
        socket.emit('send_message_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if undefined

    var room = payload.room;
    if(  ('undefined' === typeof room) || !room){
        var error_message = 'send_message didn\'t specify a room, ABORTED';
        log(error_message);
        socket.emit('send_message_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if room ???

    var username = players[socket.id].username;

    if(  ('undefined' === typeof username) || !username){
        var error_message = 'send_message didn\'t specify a username, ABORTED';
        log(error_message);
        socket.emit('send_message_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if username ???

    var message = payload.message;
    if(  ('undefined' === typeof message) || !message){
        var error_message = 'send_message didn\'t specify a message, ABORTED';
        log(error_message);
        socket.emit('send_message_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if message ???  
    
    var success_data = {
            result: 'success',
            room: room,
            username: username,
            message: message
    };
    //io.sockets.in(room).emit('send_message_response', success_data); GARY what does this do? whats the difference
    io.in(room).emit('send_message_response', success_data);    
    log('Message ['+message+'] sent to room ' + room + ' by  ' + username);


}); //end socket send_message 


    /*  invite command              */
    /* payload:
        {
            'requested_user': socket id of the person to be invited
        }

        invite_response: //to source
        {
            'result'    : 'success',
            'socket_id': the socket id of the person being invited
        }
        or
        {
            'result': 'fail',
            'message': failure message
        }

        invite:         //to target
        {
            'result'    : 'success',
            'socket_id': the socket id of the person being invited - or is it person doing the invite
        }
        or
        {
            'result': 'fail',
            'message': failure message
        }        
    */
   socket.on('invite', function(payload){
    //log('received join_room command!!');
    log('invite with ' + JSON.stringify(payload));

    if(  ('undefined' === typeof payload) || !payload){
        var error_message = 'invite had no payload';
        log(error_message);
        socket.emit('invite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if undefined

    var username = players[socket.id].username; //username of requestor

    if(  ('undefined' === typeof username) || !username){
        var error_message = 'invite cant identify who sent the invite request, ABORTED';
        log(error_message);
        socket.emit('invite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if username

    var requested_user = payload.requested_user;
    if(  ('undefined' === typeof requested_user) || !requested_user){
        var error_message = 'invite didn\'t specify a requested_user, ABORTED';
        log(error_message);
        socket.emit('invite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if requested_user  

    var room            = players[socket.id].room;
    var roomObject      = io.sockets.adapter.rooms[room];
    // Make sure the user being invited is in the room
    if ( !roomObject.sockets.hasOwnProperty(requested_user) ){
        var error_message = 'invite requested a user that wasnt in the room, ABORTED, ' + requested_user;
        log(error_message);
        socket.emit('invite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    }
    
    //If everything is ok, respond to the inviter that it was successful
    var success_data = {
            result: 'success',
            socket_id: requested_user
    };
    socket.emit('invite_response', success_data); //back to requestor

    //tell the invitee that they have been invited
    var success_data = {
            result: 'success',
            socket_id: socket.id
    };
    socket.to(requested_user).emit('invited', success_data); //send to target
    log('invite successful');
}); //end invite command

    /*  uninvite command              */
    /* payload:
        {
            'requested_user': socket id of the person to be uninvited
        }

        invite_response: //to source
        {
            'result'    : 'success',
            'socket_id': the socket id of the person being uninvited
        }
        or
        {
            'result': 'fail',
            'message': failure message
        }

        uninvite:         //to target
        {
            'result'    : 'success',
            'socket_id': the socket id of the person doing the uninvited
        }
        or
        {
            'result': 'fail',
            'message': failure message
        }        
    */
   socket.on('uninvite', function(payload){
    log('uninvite with ' + JSON.stringify(payload));

    if(  ('undefined' === typeof payload) || !payload){
        var error_message = 'uninvite had no payload';
        log(error_message);
        socket.emit('uninvite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if undefined

    var username = players[socket.id].username; //username of requestor

    if(  ('undefined' === typeof username) || !username){
        var error_message = 'uninvite cant identify who sent the invite request, ABORTED';
        log(error_message);
        socket.emit('uninvite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if username

    var requested_user = payload.requested_user;
    if(  ('undefined' === typeof requested_user) || !requested_user){
        var error_message = 'uninvite didn\'t specify a requested_user, ABORTED';
        log(error_message);
        socket.emit('uninvite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if requested_user  

    var room            = players[socket.id].room;
    var roomObject      = io.sockets.adapter.rooms[room];
    // Make sure the user being uninvited is in the room
    if ( !roomObject.sockets.hasOwnProperty(requested_user) ){
        var error_message = 'uninvite requested a user that wasnt in the room, ABORTED, ' + requested_user;
        log(error_message);
        socket.emit('uninvite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    }
    
    //If everything is ok, respond to the uninviter that it was successful
    var success_data = {
            result: 'success',
            socket_id: requested_user
    };
    socket.emit('uninvite_response', success_data); //back to requestor

    //tell the invitee that they have been uninvited
    var success_data = {
            result: 'success',
            socket_id: socket.id
    };
    socket.to(requested_user).emit('uninvited', success_data); //send to target
    log('uninvite successful');
}); //end uninvite command

    /*  game_start command              */
    /* payload:
        {
            'requested_user': socket id of the person to play with
        }

        game_start_response: //to both parties
        {
            'result'    : 'success',
            'socket_id': the socket id of the person you are playing with
            'game_id': id of the same session
        }
        or
        {
            'result': 'fail',
            'message': failure message
        }
    */
   socket.on('game_start', function(payload){
    log('game_start with ' + JSON.stringify(payload));

    if(  ('undefined' === typeof payload) || !payload){
        var error_message = 'game_start had no payload';
        log(error_message);
        socket.emit('game_start_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if undefined

    var username = players[socket.id].username; //username of requestor

    if(  ('undefined' === typeof username) || !username){
        var error_message = 'game_start cant identify who sent the invite request, ABORTED';
        log(error_message);
        socket.emit('game_start_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if username

    var requested_user = payload.requested_user;
    if(  ('undefined' === typeof requested_user) || !requested_user){
        var error_message = 'game_start didn\'t specify a requested_user, ABORTED';
        log(error_message);
        socket.emit('uninvite_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    } //end if requested_user  

    var room            = players[socket.id].room;
    var roomObject      = io.sockets.adapter.rooms[room];
    if ( !roomObject.sockets.hasOwnProperty(requested_user) ){
        var error_message = 'game_start requested a user that wasnt in the room, ABORTED, ' + requested_user;
        log(error_message);
        socket.emit('game_start_response', {
                                            result: 'fail',
                                            message: error_message
                                        });
        return;
    }
    
    //If everything is ok, respond to the game starter that it was successful
    var game_id = Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    var success_data = {
            result: 'success',
            socket_id: requested_user,
            game_id: game_id
    };
    socket.emit('game_start_response', success_data); //back to game starter

    //tell the other player to play
    var success_data = {
            result: 'success',
            socket_id: socket.id,
            game_id: game_id
    };
    socket.to(requested_user).emit('game_start_response', success_data); //send to target
    log('game_start successful');
}); //end game_start command

}); //end io socket connection
