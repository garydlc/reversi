//Gary
/***********************************************/
/*            Set up the static file server */


var bSpecial = true;
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

        if (room !== 'lobby'){
            send_game_update(socket, room, 'initial update');
        }

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


    /* play_token command              */
    /* payload:
        {
            'row': 0-7 the row to play the token on
            'column': 0-7 the column to play the token on
            'color': white or black
        }

        if successful a success message will be followed by a game_update message
        play_token_response: 
        {
            'result'    : 'success',
        }
        or
        {
            'result': 'fail',
            'message': failure message
        }
    */
   socket.on('play_token', function(payload){
    log('play_token with ' + JSON.stringify(payload));

        if(  ('undefined' === typeof payload) || !payload){
            var error_message = 'play_token had no payload';
            log(error_message);
            socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if undefined

        //check that the player has previously registered
        var player = players[socket.id]; //look up player based of socket.id

        if(  ('undefined' === typeof player) || !player){
            var error_message = 'server doesnt recognize you try going back one screen, ABORTED';
            log(error_message);
            socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if player    

        var username = players[socket.id].username;

        if(  ('undefined' === typeof username) || !username){
            var error_message = 'play_token cant identify who sent the message, ABORTED';
            log(error_message);
            socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if username        

        var game_id = players[socket.id].room;
        if(  ('undefined' === typeof game_id) || !game_id){
            var error_message = 'play_token cant find your game board, ABORTED';
            log(error_message);
            socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if game_id                

        var row = payload.row;
        if(  ('undefined' === typeof row) || row<0 || row>7){
            var error_message = 'play_token didnt specify a valid row, ABORTED';
            log(error_message);
            socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if row    

        var column = payload.column;
        if(  ('undefined' === typeof column) || column<0 || column>7){
            var error_message = 'play_token didnt specify a valid col, ABORTED';
            log(error_message);
            socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if column   
        
        var color = payload.color;
        if(  ('undefined' === typeof color) || (color != 'white' && color != 'black') ){
            var error_message = 'play_token didnt specify a valid color, ABORTED';
            log(error_message);
            socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if color                        

        var game = games[game_id];
        if(  ('undefined' === typeof game) || !game ){
            var error_message = 'play_token couldnt find your game board , ABORTED';
            log(error_message);
            socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });
            return;
        } //end if game

        //check if color being played is correct
        //if the current attempt at playing a token is out of turn then error
        if (color !== game.whose_turn){
            var error_message = 'play_token , played out of turn, oh really? ABORTED';
            log(error_message);
			
			/*socket.emit('play_token_response', {
                                                result: 'fail',
                                                message: error_message
                                            });*/
            return;            
        } //end whose turn

        //if the wrong socket is playing the color
        if( ((game.whose_turn == 'white') && (game.player_white.socket != socket.id)) ||  
            ((game.whose_turn == 'black') && (game.player_black.socket != socket.id))){
                var error_message = 'play_token , turn played by wrong player, ABORTED';
                log(error_message);
                socket.emit('play_token_response', {
                                                    result: 'fail',
                                                    message: error_message
                                                });
                return;                            
        }

        var success_data = {
            result: 'success'
        };

        socket.emit('play_token_response', success_data);

        //Execute the move
        if (color == 'white'){
            game.board[row][column]     = 'w';
            //flip appropriate tokents
            flip_board('w', row, column, game.board);
            game.whose_turn             = 'black';
            game.legal_moves            = calculate_valid_moves('b', game.board);
        }
        else if (color == 'black'){
            game.board[row][column]     = 'b';
            flip_board('b', row, column, game.board);            
            game.whose_turn             = 'white';
            game.legal_moves            = calculate_valid_moves('w', game.board);
        }        

        var d = new Date();
        game.last_move_time = d.getTime();
        send_game_update(socket, game_id, 'played a token');
    }); // end play token

}); //end io socket connection

/******************************* */
/* This is code related to game state */
var games = [];

function create_new_game(){
    console.log('inside CREATE NEW GAME');
    var new_game = {};
    new_game.player_white = {};
    new_game.player_black = {};

    new_game.player_white.socket = '';
    new_game.player_white.username = '';

    new_game.player_black.socket = '';
    new_game.player_black.username = '';    

    var d                       = new Date();
    new_game.last_move_time     = d.getTime();

    new_game.whose_turn = 'black';
    new_game.board = [
                    [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '],   //0
                    [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '], 
                    [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '], 
                    [' ', ' ', ' ', 'w',   'b', ' ', ' ', ' '],   //3
                    [' ', ' ', ' ', 'b',   'w', ' ', ' ', ' '],   //4
                    [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '], 
                    [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '], 
                    [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' ']    //7
                    

                    ];

    new_game.legal_moves = calculate_valid_moves('b', new_game.board );

    return new_game;
}

//check if there is a color 'who' starting on the line (r, c) or
//away further by adding dr, and dc to (r,c)
function check_line_match(who, dr, dc, r, c, board){
//console.log(who + ', ' + dr + ', ' + dc + ', ' + r +  ', ' + c );

    if ( (r  < 0) || (r > 7 ) ) {
        return false;
    }
    if ( (c  < 0) || (c > 7 ) ) {
        return false;
    }    

    if (board[r][c].substr(0,1) === who){ //GARY PROBLEM HERE, undefined on substr
        return true;
    }
    if (board[r][c] === ' '){
        return false;
    }

    if ( (r + dr < 0) || (r + dr > 7 ) ) {
        return false;
    }
    if ( (c + dc < 0) || (c + dc > 7 ) ) {
        return false;
    }    

    return check_line_match(who, dr, dc, r+dr, c+dc, board);
}

//check if the position at r, c contains the opposite of 'who' on the board
//and if the line indicated by adding dr to r and dc to c eventually ends in the who color.
function valid_move(who, dr, dc, r, c, board){

    var oppsite;
    if (who === 'b'){
        oppsite = 'w';
    }
    else if (who === 'w'){
        oppsite = 'b';
    }
    else{
        log('We have a color problem in valid_move: who: ' + who);
        return false;
    }

    if ( (r + dr < 0) || (r + dr > 7 ) ) {
        return false;
    }
    if ( (c + dc < 0) || (c + dc > 7 ) ) {
        return false;
    }    

    //this pos must be opposite in order to continue
    if (board[r+dr][c+dc].substr(0,1) != oppsite){ 
        return false;
    }
    //move one away
    if ( (r + dr +dr< 0) || (r + dr+dr > 7 ) ) {
        return false;
    }
    if ( (c + dc+dr < 0) || (c + dc +dr> 7 ) ) {
        return false;
    }    
    
    //console.log('from valid move: ' + who + ', ' + dr + ', ' + dc + ', ' + r +  ', ' + c );

    //need at least one opposite to continue
    //use recursive function to check that we end up with my color 
    //to close the opposite colors in order to flip.
    return check_line_match(who, dr, dc, r+dr+dr, c+dc+dc, board);
}

function calculate_valid_moves(who, board){
    var valid = [
        [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '],   //0
        [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '], 
        [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '], 
        [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '],   //3
        [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '],   //4
        [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '], 
        [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' '], 
        [' ', ' ', ' ', ' ',   ' ', ' ', ' ', ' ']    //7        
        ];

		//go through each row and each column
		
		var numDir = 0;

        for(var row = 0; row < 8; row++){
            for (var column = 0; column < 8; column++){
                if (board[row][column] === ' '){
					numDir = 0;

                   // console.log('VM: nw');
                    nw = valid_move(who, -1, -1, row, column, board);   
                   // console.log('VM: nn');                    
                    nn = valid_move(who, -1,  0, row, column, board);   
                   // console.log('VM: ne');                    
                    ne = valid_move(who, -1,  1, row, column, board);   

                    //console.log('VM: ww');
                    ww = valid_move(who, 0, -1, row, column, board);   
                    //console.log('VM: ee');
                    ee = valid_move(who, 0, 1, row, column, board);                                           

                    //console.log('VM: sw');
                    sw = valid_move(who, 1, -1, row, column, board);   
                    //console.log('VM: ss');
                    ss = valid_move(who, 1,  0, row, column, board);   
                    //console.log('VM: se');
					se = valid_move(who, 1,  1, row, column, board);   
					
					if(nw){
						numDir++;
					}
					if(nn){
						numDir++;
					}
					if(ne){
						numDir++;
					}
					if(ww){
						numDir++;
					}
					if(ee){
						numDir++;
					}
					if(sw){
						numDir++;
					}
					if(ss){
						numDir++;
					}
					if(se){
						numDir++;
					}																																			


                    if (bSpecial){
                        if (nw || nn || ne || ww || ee || sw || ss || se){ //if any move valid
                            valid[row][column] = who + numDir;
                        }
                    }
                    else{
                        if (nw || nn || ne || ww || ee || sw || ss || se){ //if any move valid
                            valid[row][column] = who;
                        }
                    }
                }
            } //end for col
        } //end for row      

        console.log('ORIG BOARD: \n'    + JSON.stringify(board[0]) +
                                          '\n' + JSON.stringify(board[1]) +
                                          '\n' + JSON.stringify(board[2]) +
                                          '\n' + JSON.stringify(board[3]) +
                                          '\n' + JSON.stringify(board[4]) +
                                          '\n' + JSON.stringify(board[5]) +
                                          '\n' + JSON.stringify(board[6]) +
                                          '\n' + JSON.stringify(board[7]));

        console.log('CALCULATE VALID MOVE: \n' + JSON.stringify(valid[0]) +
                                          '\n' + JSON.stringify(valid[1]) +
                                          '\n' + JSON.stringify(valid[2]) +
                                          '\n' + JSON.stringify(valid[3]) +
                                          '\n' + JSON.stringify(valid[4]) +
                                          '\n' + JSON.stringify(valid[5]) +
                                          '\n' + JSON.stringify(valid[6]) +
                                          '\n' + JSON.stringify(valid[7]));
        
        return valid;

} //end calculate_valid_moves

function flip_line(who, dr, dc, r, c, board, direction){
    if ( (r + dr < 0) || (r + dr > 7 ) ) {
        return false;
    }
    if ( (c + dc < 0) || (c + dc > 7 ) ) {
        return false;
    }    

    if (board[r+dr][c+dc] === ' '){ 
        return false;
    }

    if (board[r+dr][c+dc].substr(0,1) === who){  //base case weve reached myself's color. 
        return true;
    }    
    else{
        if(flip_line(who, dr, dc, r+dr, c+dc, board, direction)){
            if(!bSpecial){
                board[r+dr][c+dc] = who; //flip to me
            }
            else{
                board[r+dr][c+dc] = who + direction; //flip to me
            }
            return true;
        }
        else{
            return false;
        }
    }
}


function flip_board(who, row, column, board){

    flip_line(who, -1, -1, row, column, board, 'nw'); //nw
    flip_line(who, -1,  0, row, column, board, 'nn');   //nn
    flip_line(who, -1,  1, row, column, board, 'ne');   //ne

    flip_line(who, 0, -1, row, column, board, 'ww');   //ww
    flip_line(who, 0, 1, row, column, board, 'ee');    //ee                                   

    flip_line(who, 1, -1, row, column, board, 'sw');   //sw
    flip_line(who, 1,  0, row, column, board, 'ss');   //ss
    flip_line(who, 1,  1, row, column, board, 'se');   //se                


}

function send_game_update(socket, game_id, message){

    //check to see if a game with game_id already exists
    if ('undefined' === typeof games[game_id] || !games[game_id] ){
        //no game exists so make one
        console.log('No game exists. Creating ' + game_id + ' for ' + socket.id);
        games[game_id] = create_new_game();
    }

    //make sure that only 2 people are in the game room
    var roomObject;
    var numClients;
    do{
        roomObject = io.sockets.adapter.rooms[game_id];
        numClients = roomObject.length;
        if (numClients > 2){
            console.log('too many clients in room: ' + game_id + '#: ' + numClients);
            if (games[game_id].player_white.socket == roomObject.sockets[0]){
                games[game_id].player_white.socket      = '';
                games[game_id].player_white.username    = '';                
            }
            if (games[game_id].player_black.socket == roomObject.sockets[0]){
                games[game_id].player_black.socket      = '';
                games[game_id].player_black.username    = '';                
            }            

            //kick one of the extra people out
            var sacrafice = Object.keys(roomObject.sockets)[0]; //get first socket
            io.of('/').connected[sacrafice].leave(game_id);

        }
    }
    while((numClients - 1) > 2)

    //assign this socket a color
    //if the current player isnt assigned a color
    if( (games[game_id].player_white.socket != socket.id) && (games[game_id].player_black.socket != socket.id)) {
        console.log('player isnt assigned a color: ' + socket.id);

        //and there isnt a color to give them
        if((games[game_id].player_black.socket != '') && (games[game_id].player_white.socket != '')){
            games[game_id].player_white.socket      = '';
            games[game_id].player_white.username    = '';            
                        
            games[game_id].player_black.socket      = '';
            games[game_id].player_black.username    = '';
        }
    }

    //assign colors to players if not already done
    if(games[game_id].player_white.socket == ''){
        if(games[game_id].player_black.socket != socket.id){
            games[game_id].player_white.socket      = socket.id;
            games[game_id].player_white.username    = players[socket.id].username;     
            
            console.log('player assigned white, ' + players[socket.id].username + ', ' + socket.id);
        }
    }
    if(games[game_id].player_black.socket == ''){
        if(games[game_id].player_white.socket != socket.id){
            games[game_id].player_black.socket      = socket.id;
            games[game_id].player_black.username    = players[socket.id].username;

            console.log('player assigned black, ' + players[socket.id].username + ', ' + socket.id);            
        }
    }    

    //send the game update
    var success_data = {
        result: 'success',
        game: games[game_id],
        message: message,
        game_id: game_id
    };


    io.in(game_id).emit('game_update', success_data);

    //check to see if the game is over
    //count to see if all tiles are full - temporary solution - game can be over before board is full. 

    var row, column;
    var count = 0; //num of legal moves left over
    var black = 0;  //state of the world for black
    var white = 0;  //state of the world for white

    for(row = 0; row < 8; row++){
        for (column = 0; column < 8; column++){
            if (games[game_id].legal_moves[row][column] != ' '){
                count++;    //indicates theres one more legal move
            }
            if (bSpecial){
                if (games[game_id].board[row][column].substr(0,1) === 'b'){
                    black++;
                }
                if (games[game_id].board[row][column].substr(0,1) === 'w'){
                    white++;
                }             
            }           
            else{
                if (games[game_id].board[row][column] === 'b'){
                    black++;
                }
                if (games[game_id].board[row][column] === 'w'){
                    white++;
                }             
            }
        } //end inner for columns
    } //end outer for rows

    //console.log('game update COUNTS for BLACK: ' +  )

    if (count == 0){    //if no legal moves then game over
        
        var winner = 'tie game'; //if black === white
        if (black > white){
            winner = 'black';
        }
        else if (white > black){
            winner = 'white'
        }


        //send a game over message
        var success_data = {
            result:         'success',
            game:           games[game_id],
            who_won:        winner,
            game_id:        game_id
        };
        io.in(game_id).emit('game_over', success_data);

        //delete old games after 1 hour
        setTimeout(function(id){
            return function(){
                delete games[id];
            }}(game_id),
            60*60*1000
        );
    } //end count 64
} //end send game update
