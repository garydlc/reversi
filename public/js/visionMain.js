/* functions for general use*/
function triggerTheSequence(whichSequence){
    console.log("Called 'triggerTheSequence'. Go dim the scene and start stream.");
    var evt_up = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window
      });
    var evt_down = new MouseEvent("mousedown", {
        bubbles: true,
        cancelable: true,
        view: window
      });

     try{
         if (whichSequence == 'go'){
             document.getElementById("233").dispatchEvent(evt_down);
             document.getElementById("233").dispatchEvent(evt_up);
         }
         else if (whichSequence == 'go2'){
            document.getElementById("233").dispatchEvent(evt_down);
            document.getElementById("233").dispatchEvent(evt_up);
         }
     }
     catch(err){
        console.log('Could not start the sequence. No id 233')
     }
}

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


//chat room will come from URL
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
7 send_message_response
8 log
*/

//response 8 - What do do when server sends me a log message
socket.on( 'log', function(array){
    console.log.apply(console, array);
});

//response 1 - What to do when server responds that someone joined a room
socket.on('join_room_response', function(payload){
    //console.log('someone joined the control room');
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    }    

}); //end socket join_room response

//response 7
socket.on('send_message_response', function(payload){
    if (payload.result == 'fail'){
        alert(payload.message);
        return;
    } else if (payload.message == 'go' || payload.message == 'go2' ){
        triggerTheSequence(payload.message);
    }
    
}); //end socket send_message response

//jquery command to run when webpage has completely loaded. 
$(function(){
    
    var payload = {}; //payload of msg to send to server
    payload.room        = chat_room;
    payload.username    = username;

    console.log('*** Client Log Msg: \'join room\' payload: ' + JSON.stringify(payload));
            //send payload to server with command join_room
    socket.emit('join_room', payload);
});