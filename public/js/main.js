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

console.log( username ) ;
$('#messages').append('<h4>' + username + '</h4>');

