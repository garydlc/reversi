/* functions for general use*/

function GetURLParameters(whichParam){
    var pageURL = window.location.search.substring(1);
    var pageURLVariables = pageURL.split('&');

    for(var i = 0; i < pageURLVariables.length; i++){
        var paramName = pageURLVariables[i].split('=');

        if (paramName[0] == whichParam){
            return paramName[1];
        } //end if
    } //end for
}// end GetURL

var username = GetURLParameters('username');
if ('undefined' == typeof username || !username){
    username = 'Anonymous_' + Math.random();
}



//console.log( username ) ;
//Dont need I guess
$('#nameId').append('<h4>' + username + '</h4>');


var chatRoom = 'TheFirstRoom';


/* Connect to the socket server*/
var socket = io.connect();

socket.on( 'log', function(array){
    console.log.apply(console, array);
});

socket.on('join_room_response', function(payload){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }
    
    $('#messages').append('<p> *(From server)New user joined the room: ' + payload.username + '</p>');
}); //end socket join_room response

socket.on('send_message_response', function(payload){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }
    
    $('#messages').append('<p> *(From server) User ' + payload.username + ' says: <b>' + payload.message + '</b></p>');
}); //end socket send_message response

function send_message(){
    var payload={};
    payload.room        = chatRoom;
    payload.username    = username;
    payload.message     = $('#send_message_holder').val();
    console.log('*** Client Log Message: \' send message \' payload: '+ JSON.stringify(payload));
    socket.emit('send_message', payload);
}


//jquery command to run when webpage has COMPLETELY loaded. 
$(function(){
    
    var payload = {}; //payload of msg to send to server
    payload.room        = chatRoom;     //set some elements in payload
    payload.username    = username;

    console.log('*** Client Log Msg: \' join room\' payload: ' + JSON.stringify(payload));
            //send payload to server with command join_room
    socket.emit('join_room', payload);
});