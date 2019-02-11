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
    var newHTML = '<button type=\'button\' class=\' audiowideFont btn btn-outline-primary\'> Invite ' + '</button>';
    var newNode = $(newHTML);
    newNode.click(function(){
        invite(socket_id);
    });
    return (newNode);
}

function makeInvitedButton(socket_id){
    var newHTML = '<button type=\'button\' class=\' audiowideFont btn btn-primary\'> Invited ' + '</button>';
    var newNode = $(newHTML);
    newNode.click(function(){
        uninvite(socket_id);
    });    
    return (newNode);
}

function makePlayButton(socket_id){
    var newHTML = '<button type=\'button\' class=\' audiowideFont btn btn-success\'> Play Now ' + '</button>';
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

    $('#quit').append('<a href="lobby.html?username=' + username + '" class="audiowideFont btn btn-danger btn-default active" role="button" aria-pressed="true">Quit</a> ');
});

//globals here

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

    var old_hoverBoard =[
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

var intervalVar;

var interval_timer;

function startBoardAnimation(){
    intervalVar = setInterval(doBoardAnimation, 2500);
}

function stopBoardAnimation(){
    if (intervalVar){
        clearInterval(intervalVar);
    }    
    //color back to normal
    //$('#game_board').css('border-color', '#646464');

}

function doBoardAnimation(){
    //"#ffff99" highlight color
    //"#646464" default color
    
    
    //Peach  highlight
    //DBACA0
    
    //Blue default
    //063442

    $('#game_board').animate({ borderRightWidth: "20px", borderLeftWidth: "20px", borderColor: "#DBACA0" }, {
                                                queue:      true,
                                                duration:   500
                                                });
    
    //$('#game_board').css('border-color', '#ffff99');



    $('#game_board').animate({ borderRightWidth: "10px", borderLeftWidth: "10px", borderColor: "#063442"},  {
                                                queue:      true,
                                                duration:   500
                                                });

}

socket.on('game_update', function(payload){
    var milliseconds = new Date().getTime();
   
    console.log('*** Client log message: game_update  \n payload: ' + JSON.stringify(payload));
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
    $('#my_color').append('<h4>It is '+payload.game.whose_turn+'\s turn. Elapsed time <span id="elapsed"></span></h4>');
    clearInterval(interval_timer);

    interval_timer = setInterval(function(last_time){
                        return function(){
                            //do the work of updating the UI
                            var d = new Date();
                            var elapsedmilli = d.getTime() - last_time;
                            var minutes  = Math.floor(elapsedmilli / (60*1000));
                            var seconds = Math.floor((elapsedmilli % (60*1000)) / 1000);

                            if (seconds < 10){
                                $('#elapsed').html(minutes + ':0' + seconds);
                            }
                            else{
                                $('#elapsed').html(minutes + ':' + seconds);                                
                            }
                        }}(payload.game.last_move_time)
                                                , 1000);
    
    $('#whitename').html(payload.game.player_white.username);
    $('#blackname').html(payload.game.player_black.username);


    //animate changes to the board
    var blacksum = 0;
    var whitesum = 0;
    var row, column;

    //var randomNum = Math.floor((1+Math.random()) * 0x10000).toString(16).substring(1);

    $('.legal').removeClass('legal');

    if (payload.game.whose_turn === my_color){
        //$('#game_board').animate({ borderWidth: "20px" }, 700 ).animate({ borderWidth: "10px" }, 700 );    
        //start interval
        startBoardAnimation();
    }
    else{
        //stop interval
        stopBoardAnimation();
    }
    
    for(row = 0; row < 8; row++){
        for (column = 0; column < 8; column++){

            if (board[row][column].substr(0,1) == 'b'){
                blacksum++;
            }
            if (board[row][column].substr(0,1) == 'w'){
                whitesum++;
            }            
            //if a board space has changed
            if (old_board[row][column] != board[row][column]){
                if (old_board[row][column] == '?' && board[row][column] == ' '){
                    
                    if (((row * 8) + (column + 1 + (row%2))) % 2){
                        $('#' + row + '_' + column).html('<img class="emptyGif" src="assets/images/black_to_empty.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="empty square"/>');
                    }
                    else{
                        $('#' + row + '_' + column).html('<img class="emptyGif" src="assets/images/white_to_empty.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="empty square"/>');                            
                    }                  

                    //$('#' + row + '_' + column).html('<img class="bottomGif" src="assets/images/error.gif" alt="empty square"/>');                            
                                                                                                  
                }
                else if (old_board[row][column] == '?' && board[row][column].substr(0,1) == 'w'){
                    $('#' + row + '_' + column).html('<img src="assets/images/empty_to_white.gif?a='+milliseconds+'_'+uniqueIndex+'"  alt="white"/>');                    
                }                
                else if (old_board[row][column] == '?' && board[row][column].substr(0,1) == 'b'){
                    $('#' + row + '_' + column).html('<img src="assets/images/empty_to_black.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');
                }
                else if (old_board[row][column] == ' ' && board[row][column].substr(0,1) == 'w'){
                    var uniqueIndex = (row * 8) + (column + 1); 
                    $('#' + row + '_' + column).html('<img src="assets/images/empty_to_white.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="white"/>');
                }                
                else if (old_board[row][column] == ' ' && board[row][column].substr(0,1) == 'b'){
                    var uniqueIndex = (row * 8) + (column + 1);                     
                    $('#' + row + '_' + column).html('<img src="assets/images/empty_to_black.gif?a='+milliseconds+'_'+uniqueIndex+'"" alt="black"/>');
                }
                else if (old_board[row][column].substr(0,1) == 'w' && board[row][column] == ' '){
                    $('#' + row + '_' + column).html('<img src="assets/images/error.gif" alt="empty"/>');
                }                
                else if (old_board[row][column].substr(0,1) == 'b' && board[row][column] == ' '){
                    $('#' + row + '_' + column).html('<img src="assets/images/black_to_empty.gif" alt="empty"/>');
                }                                                                
                else if (old_board[row][column].substr(0,1) == 'w' && board[row][column].substr(0,1) == 'b'){
                    var uniqueIndex = (row * 8) + (column + 1);               
                    
                    var direction = board[row][column].substr(1,2);
                    //console.log('white directions: ' + direction);
                    if (direction === 'nn' || direction === 'ss'){
                        //choose vertical
                        $('#' + row + '_' + column).html('<img src="assets/images/white_to_black_vertical.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');                        
                    }
                    else if (direction === 'ww' || direction === 'ee'){
                        //choose horizontal
                        $('#' + row + '_' + column).html('<img src="assets/images/white_to_black_horizontal.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');                        
                    }                    
                    else if (direction === 'nw' || direction === 'se'){
                        //choose diagonal 1
                        $('#' + row + '_' + column).html('<img src="assets/images/white_to_black_diagonal_NW_SE.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');                        
                    }                    
                    else if (direction === 'ne' || direction === 'sw'){
                        //choose diagonal 2
                        $('#' + row + '_' + column).html('<img src="assets/images/white_to_black_diagonal_NE_SW.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');                        
                    }
                    else{
                        $('#' + row + '_' + column).html('<img src="assets/images/white_to_black.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>'); 
                    }                                                            

                    //$('#' + row + '_' + column).html('<img src="assets/images/white_to_black.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');
                }                
                else if (old_board[row][column].substr(0,1) == 'b' && board[row][column].substr(0,1) == 'w'){
                    var uniqueIndex = (row * 8) + (column + 1);                     
                    var direction = board[row][column].substr(1,2);

                    if (direction === 'nn' || direction === 'ss'){
                        //choose vertical
                        $('#' + row + '_' + column).html('<img src="assets/images/black_to_white_vertical.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');                        
                    }
                    else if (direction === 'ww' || direction === 'ee'){
                        //choose horizontal
                        $('#' + row + '_' + column).html('<img src="assets/images/black_to_white_horizontal.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');                        
                    }                    
                    else if (direction === 'nw' || direction === 'se'){
                        //choose diagonal 1
                        $('#' + row + '_' + column).html('<img src="assets/images/black_to_white_diagonal_NW_SE.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');                        
                    }                    
                    else if (direction === 'ne' || direction === 'sw'){
                        //choose diagonal 2
                        $('#' + row + '_' + column).html('<img src="assets/images/black_to_white_diagonal_NE_SW.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>');                        
                    }
                    else{
                        $('#' + row + '_' + column).html('<img src="assets/images/black_to_white.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="black"/>'); 
                    }                                                            

                    //$('#' + row + '_' + column).html('<img src="assets/images/black_to_white.gif?a='+milliseconds+'_'+uniqueIndex+'" alt="white"/>');
                }      
                else{
                    $('#' + row + '_' + column).html('<img src="assets/images/error.gif" alt="error"/>');
                } 
            }   // if (old_board[row][column] != board[row][column]){       

            //set up interactivity
            $('#' + row + '_' + column).off('click'); 
            $('#' + row + '_' + column).removeClass('hovered_over');

            if (payload.game.whose_turn === my_color){
                //if the pos we looking at is a legal move

                if (payload.game.legal_moves[row][column].substr(0,1) === my_color.substr(0,1)){
                    if (true){
                    //    $('#' + row + '_' + column).html('<img src="assets/images/error.gif" alt="empty"/>');
                        //$('#' + row + '_' + column).addClass('legal').animate({ borderWidth: "10px" }, 2000 );
                        $('#' + row + '_' + column).addClass('legal');

                        $('#' + row + '_' + column).attr("numDir", payload.game.legal_moves[row][column].substr(1,1) );

                        //console.log( 'gary numdir: ' + payload.game.legal_moves[row][column].substr(1,1)  );
                        
                        //$('.legal').removeClass('legal');


                    
                        if (false){
                            $( ".legal" ).animate({ width: "50%" }, 2000 );
                    }
                   }

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
                } //end if legal
            } //if my color
            else{
                //not my color
            }
        } //end of second loop for each col
    } //end of master for loop for each row

    var allLegalMoves       = $('.legal');
    var allLegalMovesLen    = allLegalMoves.length;
    var theOne;
    var timeToTrigger       = 0;
    var numDir = 0;

    //animate legal moves
    for (timesToLoop = 0 ; timesToLoop < 2; timesToLoop++){
        for ( i = 0; i < allLegalMovesLen; i++ ){
            timeToTrigger +=150;
            theOne = allLegalMoves.eq(i);
              
                setTimeout(function(aLegalMove, bAdd){
                    return function(){
                        
                        //yellow highlight ffff99
                        aLegalMove.animate({ borderRightWidth: "1px", borderLeftWidth: "1px", backgroundColor: "#DBACA0" }, {
                            queue:      true,
                            duration:   400
                            });
                    
                        //green color 33cc99
                            aLegalMove.animate({ borderRightWidth: "1px", borderLeftWidth: "1px", backgroundColor: "#8D5858" }, {
                            queue:      true,
                            duration:   400
                            });     
                            
                            numDir = aLegalMove.attr("numDir");

                            if (bAdd){
                                aLegalMove.html(numDir);
                            }
                            else{
                                aLegalMove.html('&zwnj;');
                            }
                        }}(theOne, (timesToLoop == 0)),
                    timeToTrigger
                );  //end setTimeOut            
        }//end for loop legal moves
    }


    /* 
            setTimeout(function(id){
                return function(){
                    delete games[id];
                }}(game_id),
                60*60*1000
            );
     */

    /*
    if (allLegalMovesLen >= 1){
        var theOne = allLegalMoves.eq(0);

        theOne.animate({ borderRightWidth: "1px", borderLeftWidth: "1px", backgroundColor: "#ffff99" }, {
            queue:      true,
            duration:   500
            });
    
        theOne.animate({ borderRightWidth: "1px", borderLeftWidth: "1px", backgroundColor: "#33cc99" }, {
            queue:      true,
            duration:   500
            });                    
    }

    if (allLegalMovesLen >= 2){
        var theOne = allLegalMoves.eq(1);

        theOne.animate({ borderRightWidth: "1px", borderLeftWidth: "1px", backgroundColor: "#ffff99" }, {
            queue:      true,
            duration:   500
            });
    
        theOne.animate({ borderRightWidth: "1px", borderLeftWidth: "1px", backgroundColor: "#33cc99" }, {
            queue:      true,
            duration:   500
            });                    
    }
    */    

/*
    allLegalMoves.each(function(){
        $(this).animate({ borderRightWidth: "1px", borderLeftWidth: "1px", backgroundColor: "#ffff99" }, {
            queue:      true,
            duration:   500
            });
    
        $(this).animate({ borderRightWidth: "1px", borderLeftWidth: "1px", backgroundColor: "#33cc99" }, {
            queue:      true,
            duration:   500
            });                                    
   
     });    
*/ 

     console.log('gary num legal: ' + allLegalMoves.length);

    var animateScore        = false;   

    var theBlackSumString = $('#blacksum').html();
    var theWhiteSumString = $('#whitesum').html();

    var blackNumOrig = parseInt(theBlackSumString, 10);
    var whiteNumOrig = parseInt(theWhiteSumString, 10);


    var whichToAnimate   = '#blacksum';    

    var myAnimateColor = '#000000';
    var myAnimateSize  = '1.5em'; //default 
    
    if ( !((whitesum == 2) && (blacksum == 2)) && (blacksum != whitesum)){
        animateScore = true;
        if (my_color === 'white'){
            //if I gained then yellow
            whichToAnimate = '#whitesum';
            if (whitesum > whiteNumOrig){
                myAnimateColor = '#ffff99';
            }
            else if (whitesum < whiteNumOrig){
                myAnimateColor = '#ff0000';
            }

            if (whitesum > blacksum){
                //im in lead then make bigger
                myAnimateSize  = '2.2em';                  
            }
        }
        else{ //black
            whichToAnimate = '#blacksum';
            if (blacksum > blackNumOrig){
                myAnimateColor = '#ffff99';
            }
            else if (blacksum < blackNumOrig){
                myAnimateColor = '#ff0000';
            }

            if (blacksum > whitesum){
                //im in lead then make bigger
                myAnimateSize  = '2.2em';                  
            }
        }
    } //end = 2

    
    $('#blacksum').html(blacksum);
    $('#whitesum').html(whitesum);

    if (animateScore){
        //Got bigger yello
        $(whichToAnimate).animate({ color: myAnimateColor, fontSize: myAnimateSize}, {
            queue:      true,
            duration:   600
            });

        $(whichToAnimate).animate({ color: "#000000", fontSize: '1.5em' }, { //back to normal
            queue:      true,
            duration:   1500
            });    
    }    

    /*
    if (animateScore){
        //Got bigger yello
        $(biggerSum).animate({ color: '#ffff99', fontSize: '2.1em' }, {
            queue:      true,
            duration:   500
            });

        $(biggerSum).animate({ color: "#000000", fontSize: '1.5em' }, {
            queue:      true,
            duration:   1500
            });    
            
        //Got smaller red
        $(otherSum).animate({ color: '#ff0000', fontSize: '0.5em' }, {
            queue:      true,
            duration:   500
            });

        $(otherSum).animate({ color: "#000000", fontSize: '1.5em' }, {
            queue:      true,
            duration:   1500
            });            

    }*/

    /*
    var newHTML = '<p>' + payload.username + ' has left the room</p>';
    var newNode = $(newHTML);
    newNode.hide();
    $('#messages').prepend(newNode);
    newNode.slideDown(1000);
     */
    
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
    $('#game_over').html('<h1>Game over</h1><h2>' + payload.who_won + ' won! </h2>');
    $('#game_over').append('<a href="lobby.html?username=' + username + '" class="btn btn-success btn-lg active" role="button" aria-pressed="true">Return to the lobby</a> ');

    stopBoardAnimation();
    
});    
