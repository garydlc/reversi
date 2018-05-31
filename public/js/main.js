//GARY
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
$('#lobbyId').append('<h2>' + username + '\'s Lobby</h2>');


//chat room will come from URL?
var chat_room =   GetURLParameters('game_id');
if ('undefined' == typeof chat_room || !chat_room){
    chat_room = 'lobby';
}

/* Connect to the socket server*/
var socket = io.connect();


//Handle server response messages
//Server originated messages
/*
join_room_response
invite_response
invited
uninvited_response
uninvited
game_start_response
send_message_response
log
disconnect
*/

//response 1 - What do do when server sends me a lot message
socket.on( 'log', function(array){
    console.log.apply(console, array);
});

//response 2 - What to do when server responds that someone joined a room
socket.on('join_room_response', function(payload){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }
    
    /*If we are being notified that we joined the room, then IGNORE it. */
    if (payload.socket_id == socket.id){
        return; //just ignore
    }

    /* If someone has joined, then add a new ROW to the lobby table */
    var dom_elements = $('.socket_' + payload.socket_id);

    /* If we don't already have entry in this table for this person, then create default elements divs  */
    if (dom_elements.length == 0){
        //add default elements
        var nodeA = $('<div></div>'); //for w-100 line
        nodeA.addClass('socket_' + payload.socket_id);      //note: no period on class when referencing, only period when declaring
        
        var nodeB = $('<div></div>'); //for player name
        nodeB.addClass('socket_' + payload.socket_id);      
        
        var nodeC = $('<div></div>'); //for button
        nodeC.addClass('socket_' + payload.socket_id);      
        
        nodeA.addClass('w-100');

        nodeB.addClass('col-9 text-right');
        nodeB.append('<h4>' + payload.username + '</h4>');

        nodeC.addClass('col-3 text-left');
        var buttonC = makeInviteButton();
        nodeC.append(buttonC);

        nodeA.hide();
        nodeB.hide();
        nodeC.hide();

        $('#players').append(nodeA, nodeB, nodeC);
        nodeA.slideDown(1000);
        nodeB.slideDown(1000);
        nodeC.slideDown(1000);


                    /* SAMPLE STRUCTURE

                        A <div class='w-100'>
                        </div> 
                        B  <div class='offset-1 col-8 text-right garyTable3'>
                            BETTY
                        </div> 
                        C  <div class='col-3 text-left garyTable3'>
                            <button type="button">INVITE</button>
                        </div>               
                    */
        
    }
    else{ //else if user is already is this table
        var buttonC = makeInviteButton();
        $('.socket_' + payload.socket_id + ' button').replaceWith(buttonC);
        dom_elements.slideDown(1000);
    } //end     if (dom_elements.length == 0){



    /*Manage the message that 'a new player has joined'*/
    var newHTML = '<p>' + payload.username + ' just entered the lobby</p>';
    var newNode = $(newHTML);
    newNode.hide();
    $('#messages').append(newNode);
    newNode.slideDown(1000);
}); //end socket join_room response

//response 2.5 - NEW what to do when someone has left. opposite of join
socket.on('player_disconnected', function(payload){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }
    
    /*If we are being notified that we left the room, then IGNORE it. */
    if (payload.socket_id == socket.id){
        return; //just ignore
    }

    /* If someone has left room then animate all thier content. */
    var dom_elements = $('.socket_' + payload.socket_id);

    /* If we don't already have entry in this table for this person, then create default elements divs  */
    if (dom_elements.length != 0){
      dom_elements.slideUp(1000);  
    }

    /*Manage the message that 'a new player has joined'*/
    var newHTML = '<p>' + payload.username + ' has left the lobby</p>';
    var newNode = $(newHTML);
    newNode.hide();
    $('#messages').append(newNode);
    newNode.slideDown(1000);

}); //end socket player_disconnected response

//response 3
socket.on('send_message_response', function(payload){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }
    
    $('#messages').append('<p> User <b> ' + payload.username + ' </b>says: ' + payload.message + '</p>');
}); //end socket send_message response


//Client originated messages
/*

join_room
invite
uninvted
game_start
send_message

*/
function send_message(){
    var payload={};
    payload.room        = chat_room;
    payload.username    = username;
    payload.message     = $('#send_message_holder').val();
    console.log('*** Client Log Message: \' send message \' payload: '+ JSON.stringify(payload));
    socket.emit('send_message', payload);
}

function makeInviteButton(){
    var newHTML = '<button type=\'button\' class=\' btn btn-outline-primary\'> Invite ' + '</button>';
    var newNode = $(newHTML);
    return (newNode);
}


//jquery command to run when webpage has COMPLETELY loaded. 
$(function(){
    
    var payload = {}; //payload of msg to send to server
    payload.room        = chat_room;     //set some elements in payload
    payload.username    = username;

    console.log('*** Client Log Msg: \' join room\' payload: ' + JSON.stringify(payload));
            //send payload to server with command join_room
    socket.emit('join_room', payload);
});