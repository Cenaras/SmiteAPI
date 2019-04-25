var currentDate = new Date();
var lastSearchedPlayerName;
var lastSearchedPlayerClan;



var devID = "3129";
var authKey = "AD6065793B6F4DD3BDA1DCF6FEB65E79";
var sessionSignature;

function convert(n)
{
    if (n < 10) return '0' + n;
    else return n;
}

function getTimestamp()
{
    var year = currentDate.getUTCFullYear();
    var month = currentDate.getUTCMonth() + 1;
    var date = currentDate.getUTCDate();
    var hour = currentDate.getUTCHours();
    var minute = currentDate.getUTCMinutes();
    var seconds = currentDate.getUTCSeconds();
    return year + convert(month) + convert(date) + convert(hour) + convert(minute) + convert(seconds);
}



$(document).ready(function ()
{
    establishSession();
    
    $(".playerBoxName").html(localStorage.getItem('lastSearchedPlayerName'));
    $(".playerClanName").html(localStorage.getItem('lastSearchedPlayerClan'));
    search();
})

function search()
{
    $("#searchArea").keypress(function(e) {
        //Enter key
        if (e.which == 13) 
        {
            $('#searchButton').click();
            return false;
        }
      });

    $("#searchButton").click(function()
    {
        localStorage.setItem('lastSearchedPlayerName', $("#searchField").val());
        
        console.log("Search Field: " + $("#searchField").val());
        getPlayer($("#searchField").val());
        //window.location.replace("playerstats.html");
    

    });
}
//http://restlet.com/company/blog/2016/09/27/how-to-fix-cors-problems/
//var testUrl = "http://api.openweathermap.org/data/2.5/weather?q=London&appid=3e9124630ad1dffb2a2c1e4cee2a2f05"

function establishSession()
{
    var testUrl = getSessionSignature();
    $.ajax
    ({
        
        url: testUrl,
        type: "GET",
        dataType: "json",
        contentType: 'application/json',

        success: function(data)
        {
            console.log("We did it!");
            localStorage.setItem('sessionSignature', data.session_id);
        },
        error: function()
        {
            console.log("Error");
        }
    })
}

//The URL called, to retrieve a session ID
function getSessionSignature()
{
    var timestamp = getTimestamp();
    return 'http://api.smitegame.com/smiteapi.svc/createsessionJson/' + 
        devID + '/' + $.MD5(devID + 'createsession' + authKey + timestamp) + '/' + timestamp;
}


function apiCallSignature(method) 
{
    var timestamp = getTimestamp();
    return 'http://api.smitegame.com/smiteapi.svc/' + method + 'Json/' + devID + '/' + $.MD5(devID + method + authKey + timestamp) + '/' + localStorage.getItem('sessionSignature') + '/' + timestamp;
}


function getPlayer(player)
{
    var callUrl = apiCallSignature("getplayer") + "/" + player
    $.ajax
    ({
        url: callUrl,
        type: "GET",
        dataType: "json",
        contentType: 'application/json',

        success: function(data)
        {
            console.log(data);
            console.log("Test: " + data[0].hz_player_name);
            console.log(data[0].Team_Name);
            localStorage.setItem('lastSearchedPlayerClan', data[0].Team_Name)
            
        },
        error: function()
        {
            console.log("Error");
        }
    })
}



