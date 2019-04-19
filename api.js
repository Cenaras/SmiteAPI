var currentDate = new Date();
var lastSearchedPlayer = "Test";


function convert(n)
{
    if (n < 10) return '0' + n;
    else return n;
}

var devID = "3129";
var authKey = "AD6065793B6F4DD3BDA1DCF6FEB65E79";
var sessionSignature;

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
    
    console.log(localStorage.getItem('lastSearchedPlayer'));
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
        console.log($.MD5("test"));
        //console.log($("#searchField").val());
        localStorage.setItem('lastSearchedPlayer', $("#searchField").val());
        window.location.replace("playerstats.html")
    
    });
}






