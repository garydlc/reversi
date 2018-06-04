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
1 join_room_response
2 invite_response
3 invited
4 uninvite_response
5 uninvited
6 game_start_response
7 send_message_response
8 log
9 player_disconnected
*/

//response 8 - What do do when server sends me a lot message
socket.on( 'log', function(array){
    console.log.apply(console, array);
});

//response 1 - What to do when server responds that someone joined a room
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
        var buttonC = makeInviteButton(payload.socket_id);
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
    else{ //else if user is already is this table (something weird happened)
        uninvite(payload.socket_id);
        var buttonC = makeInviteButton(payload.socket_id);
        $('.socket_' + payload.socket_id + ' button').replaceWith(buttonC);
        dom_elements.slideDown(1000);
    } //end     if (dom_elements.length == 0){

    /*Manage the message that 'a new player has joined'*/
    var newHTML = '<p>' + payload.username + ' just entered the room</p>';
    var newNode = $(newHTML);
    newNode.hide();
    $('#messages').prepend(newNode);
    newNode.slideDown(1000);
}); //end socket join_room response

//response 9 - NEW what to do when someone has left. opposite of join
socket.on('player_disconnected', function(payload){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }
    
    /*If we are being notified that we left the room, then IGNORE it. */
    if (payload.socket_id == socket.id){
        return; //just ignore
    }

    /* If someone has left room then animate out all thier content. */
    var dom_elements = $('.socket_' + payload.socket_id);

    /* if something exitsts.  */
    if (dom_elements.length != 0){
      dom_elements.slideUp(1000);  
    }

    /*Manage the message that 'a new player has joined'*/
    var newHTML = '<p>' + payload.username + ' has left the room</p>';
    var newNode = $(newHTML);
    newNode.hide();
    $('#messages').prepend(newNode);
    newNode.slideDown(1000);

}); //end socket player_disconnected response

//invitation capability. click invite button, go here and send message to server. 
function invite(who) {
    var payload             = {};
    payload.requested_user  = who; //this is a socket

    console.log('*** Client Log Message: \'invite\' payload: ' + JSON.stringify(payload));
    socket.emit('invite', payload);
}

//response 2 - the response to me inviting someone else
socket.on('invite_response', function(payload ){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }

    var newNode = makeInvitedButton(payload.socket_id);
    $('.socket_' + payload.socket_id + ' button').replaceWith(newNode);
    
    //$('#messages').append('invited response received!!!!!!' );
}); //end invite response

//response 3 - Handle a notification that we have been invited. Someone else invited me
socket.on('invited', function(payload ){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }

    var newNode = makePlayButton(payload.socket_id);
    $('.socket_' + payload.socket_id + ' button').replaceWith(newNode);
    
    //$('#messages').append('invited response received!!!!!!' );
}); //end invited response

////////////////////////
//uninvite capability. click invited button,  send uninvite message to server. 
function uninvite(who) {
    var payload             = {};
    payload.requested_user  = who; //this is a socket

    console.log('*** Client Log Message: \'uninvite\' payload: ' + JSON.stringify(payload));
    socket.emit('uninvite', payload);
}

//response 4 - the response to me uninviting someone else
socket.on('uninvite_response', function(payload ){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }

    var newNode = makeInviteButton(payload.socket_id);
    $('.socket_' + payload.socket_id + ' button').replaceWith(newNode);
    
    //$('#messages').append('invited response received!!!!!!' );
}); //end uninvited response

//response 5 - someone else uninvited me. Handle a notification that we have been uninvited
socket.on('uninvited', function(payload ){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }

    var newNode = makeInviteButton(payload.socket_id);
    $('.socket_' + payload.socket_id + ' button').replaceWith(newNode);
    
}); //end uninvited
///////////////////////
///////////////////////
//Send a game start mesage to the server
function game_start(who) {
    var payload             = {};
    payload.requested_user  = who; //this is a socket

    console.log('*** Client Log Message: \'game_start\' payload: ' + JSON.stringify(payload));
    socket.emit('game_start', payload);
}

//response 6 - Handle a notification that we have been engaged.
socket.on('game_start_response', function(payload ){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }

    var newNode = makeEngagedButton();
    $('.socket_' + payload.socket_id + ' button').replaceWith(newNode);

    /* Jump to a new page */
    window.location.href = 'game.html?username=' + username + '&game_id=' + payload.game_id;
    
}); //end game_start_response
///////////////////////

function send_message(){
    var payload={};
    payload.room        = chat_room;
    payload.message     = $('#send_message_holder').val();
    console.log('*** Client Log Message: \' send message \' payload: '+ JSON.stringify(payload));
    socket.emit('send_message', payload);
    $('#send_message_holder').val('');    
}

//response 7
socket.on('send_message_response', function(payload){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }
    
    var newHTML =  '<p><b> ' + payload.username + ' </b>says: ' + payload.message + '</p>';
    var newNode = $(newHTML);
    newNode.hide();
    $('#messages').prepend(newNode);
    newNode.slideDown(1000);

}); //end socket send_message response


///////////////////////////
//send a game start message to server
function game_start(who) {
    var payload             = {};
    payload.requested_user  = who; //this is a socket

    console.log('*** Client Log Message: \'game_start\' payload: ' + JSON.stringify(payload));
    socket.emit('game_start', payload);
}

//response6 - the response to me uninviting someone else
socket.on('uninvite_response', function(payload ){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }

    var newNode = makeInviteButton(payload.socket_id);
    $('.socket_' + payload.socket_id + ' button').replaceWith(newNode);
    
    //$('#messages').append('invited response received!!!!!!' );
}); //end uninvited response

//response 5 - someone else uninvited me. Handle a notification that we have been uninvited
socket.on('uninvited', function(payload ){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }

    //alert('gary got uninviteD response - someone else uninvited MEEEEEE');    
    var newNode = makeInviteButton(payload.socket_id);

    $('.socket_' + payload.socket_id + ' button').replaceWith(newNode);
    
}); //end uninvited
///////////////////////////

//Client originated messages
/*

join_room
invite
uninvted
game_start
send_message

*/

function makeInviteButton(socket_id){
    var newHTML = '<button type=\'button\' class=\' btn btn-outline-primary\'> Invite ' + '</button>';
    var newNode = $(newHTML);
    newNode.click(function(){
        invite(socket_id);
    });
    return (newNode);
}

function makeInvitedButton(socket_id){
    var newHTML = '<button type=\'button\' class=\' btn btn-primary\'> Invited ' + '</button>';
    var newNode = $(newHTML);
    newNode.click(function(){
        uninvite(socket_id);
    });    
    return (newNode);
}

function makePlayButton(socket_id){
    var newHTML = '<button type=\'button\' class=\' btn btn-success\'> Play Now ' + '</button>';
    var newNode = $(newHTML);
    newNode.click(function(){
        game_start(socket_id);
    });        
    return (newNode);
}

function makeEngagedButton(){
    var newHTML = '<button type=\'button\' class=\' btn btn-danger\'> Engaged ' + '</button>';
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

    $('#quit').append('<a href="lobby.html?username=' + username + '" class="btn btn-danger btn-default active" role="button" aria-pressed="true">Quit</a> ');
});

var old_board =[
                    ['?', '?', '?', '?', '?', '?', '?', '?'],
                    ['?', '?', '?', '?', '?', '?', '?', '?'],
                    ['?', '?', '?', '?', '?', '?', '?', '?'],
                    ['?', '?', '?', '?', '?', '?', '?', '?'],
                    ['?', '?', '?', '?', '?', '?', '?', '?'],
                    ['?', '?', '?', '?', '?', '?', '?', '?'],
                    ['?', '?', '?', '?', '?', '?', '?', '?'],
                    ['?', '?', '?', '?', '?', '?', '?', '?']                    
                ];

var my_color = ' ';

socket.on('game_update', function(payload){
    console.log('*** Client log message: game_update \'n payload: ' + JSON.stringify(payload));
    //check for a good board update

    if (payload.result == 'fail'){
        console.log(payload.message);
        alert(payload.message);
        window.location.href = 'lobby.html?username=' + username;
        return;
    }    

    //check for a good board in the payload
    var board = payload.game.board;
    if('undefined' == typeof board || !board){
        console.log('internal error: received a malformed board update from the server');
        return;
    }

    //update my color
    if(socket.id == payload.game.player_white.socket){
        my_color = 'white';
    }
    else if(socket.id == payload.game.player_black.socket){
        my_color = 'black';
    }
    else{
        //something weird is going on
        //send client back to lobby. 
        window.location.href = 'lobby.html?username=' + username;
        return;
    }

    $('#my_color').html('<h3 id="my_color"> I am ' + my_color + '</h3>');

    //animate changes to the board
    var blacksum = 0;
    var whitesum = 0;
    var row, column;

    var randomNum = Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);
    

    for(row = 0; row < 8; row++){
        for (column = 0; column < 8; column++){

            if (board[row][column] == 'b'){
                blacksum++;
            }
            if (board[row][column] == 'w'){
                whitesum++;
            }            
            //if a board space has changed
            if (old_board[row][column] != board[row][column]){
                if (old_board[row][column] == '?' && board[row][column] == ' '){
                    if (((row * 8) + (column + 1 + (row%2))) % 2){
                        $('#' + row + '_' + column).html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a='+randomNum+'" alt="empty square"/>');
                    }
                    else{
                        $('#' + row + '_' + column).html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a='+randomNum+'" alt="empty square"/>');                            
                    }                  

                    //$('#' + row + '_' + column).html('<img class="bottomGif" src="assets/images/empty.gif" alt="empty square"/>');                            
                                                                                                  
                }
                else if (old_board[row][column] == '?' && board[row][column] == 'w'){
                    $('#' + row + '_' + column).html('<img src="assets/images/empty_to_white.gif" alt="white"/>');                    
                }                
                else if (old_board[row][column] == '?' && board[row][column] == 'b'){
                    $('#' + row + '_' + column).html('<img src="assets/images/empty_to_black.gif" alt="black"/>');
                }
                else if (old_board[row][column] == ' ' && board[row][column] == 'w'){
                    var uniqueIndex = (row * 8) + (column + 1); 
                    $('#' + row + '_' + column).html('<img src="assets/images/empty_to_white.gif?a='+uniqueIndex+'" alt="white"/>');
                }                
                else if (old_board[row][column] == ' ' && board[row][column] == 'b'){
                    var uniqueIndex = (row * 8) + (column + 1);                     
                    $('#' + row + '_' + column).html('<img src="assets/images/empty_to_black.gif?a='+uniqueIndex+'"" alt="black"/>');
                }
                else if (old_board[row][column] == 'w' && board[row][column] == ' '){
                    $('#' + row + '_' + column).html('<img src="assets/images/white_to_empty.gif" alt="empty"/>');
                }                
                else if (old_board[row][column] == 'b' && board[row][column] == ' '){
                    $('#' + row + '_' + column).html('<img src="assets/images/black_to_empty.gif" alt="empty"/>');
                }                                                                
                else if (old_board[row][column] == 'w' && board[row][column] == 'b'){
                    $('#' + row + '_' + column).html('<img src="assets/images/white_to_black.gif" alt="black"/>');
                }                
                else if (old_board[row][column] == 'b' && board[row][column] == 'w'){
                    $('#' + row + '_' + column).html('<img src="assets/images/black_to_white.gif" alt="white"/>');
                }      
                else{
                    $('#' + row + '_' + column).html('<img src="assets/images/error.gif" alt="error"/>');
                }        
                
                //set up interactivity
                $('#' + row + '_' + column).off('click');

                //closure function attached to the square
                if(board[row][column] == ' '){
                    $('#' + row + '_' + column).addClass('hovered_over');
                    $('#' + row + '_' + column).click(function(r,c){
                        return function(){
                            var payload = {};
                            payload.row         = r;
                            payload.column      = c;
                            payload.color       = my_color;
                            console.log('*** Client log message: \'play_token\' payload: ' + JSON.stringify(payload));
                            socket.emit('play_token', payload);
                        };
                    }(row, column));
                    
                }
                else{
                    $('#' + row + '_' + column).removeClass('hovered_over');
                }
            }
        }
    } //end of master for loop

    /*
    if (blacksum == 2 && whitesum == 2 ){
        setTimeout(function(){
            return function(){
                $('#2_2').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=b" alt="empty square"/>');
                $('#2_3').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=b" alt="empty square"/>');
                $('#2_4').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=b" alt="empty square"/>');
                $('#2_5').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=b" alt="empty square"/>');

                $('#3_5').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=b" alt="empty square"/>');
                $('#4_5').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=b" alt="empty square"/>');
                $('#5_5').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=b" alt="empty square"/>');

                $('#5_4').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=b" alt="empty square"/>');                                                                                    
                $('#5_3').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=b" alt="empty square"/>');
                $('#5_2').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=b" alt="empty square"/>');

                $('#4_2').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=b" alt="empty square"/>');
                $('#3_2').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=b" alt="empty square"/>');             
            }}(),
            200
        );  
              
        setTimeout(function(){
            return function(){
                $('#1_1').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');
                $('#1_2').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                $('#1_3').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');
                $('#1_4').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                $('#1_5').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');
                $('#1_6').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');

                $('#2_6').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');
                $('#3_6').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                $('#4_6').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');
                $('#5_6').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                $('#6_6').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');
                                               
                $('#6_5').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                $('#6_4').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');
                $('#6_3').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                $('#6_2').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');                
                $('#6_1').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                
                $('#5_1').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');
                $('#4_1').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                $('#3_1').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=e" alt="empty square"/>');                
                $('#2_1').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=e" alt="empty square"/>');
                
            }}(),
            500
        );

        setTimeout(function(){
            return function(){
                $('#0_0').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');                
                $('#0_1').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#0_2').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#0_3').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                //$('#0_4').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#0_5').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#0_6').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#0_7').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');


                $('#1_7').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#2_7').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#3_7').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#4_7').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#5_7').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#6_7').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');                
                $('#7_7').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');

                $('#7_6').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');                
                $('#7_5').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#7_4').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#7_3').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#7_2').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
               // $('#7_1').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#7_0').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');

                $('#6_0').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#5_0').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#4_0').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#3_0').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');
                $('#2_0').html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a=f" alt="empty square"/>');
                $('#1_0').html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a=f" alt="empty square"/>');                
            }}(),
            800
        );
        
     } */

    $('#blacksum').html(blacksum);
    $('#whitesum').html(whitesum);
    
    old_board = board;

}); //end of socket game_update


socket.on('play_token_response', function(payload){
    console.log('*** Client log message: play_token_response \'n payload: ' + JSON.stringify(payload));
    //check for a good play token response

    if (payload.result == 'fail'){
        console.log(payload.message);
        alert(payload.message);
        return;
    }
});    

socket.on('game_over', function(payload){
    console.log('*** Client log message: game_over \'n payload: ' + JSON.stringify(payload));
    //check for a good play token response

    if (payload.result == 'fail'){
        console.log(payload.message);
        alert(payload.message);
        return;
    }

    //jump to a new page
    $('#game_over').html('<h1>Game over</h1><h2>' + payload.who_won + ' won!</h2>');
    $('#game_over').append('<a href="lobby.html?username=' + username + '" class="btn btn-success btn-lg active" role="button" aria-pressed="true">Return to the lobby</a> ');
    
});    