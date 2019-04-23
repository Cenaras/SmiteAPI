const md5 = require('js-md5');
const fs = require('fs');
const request = require('request');
var rp = require('request-promise');


var currentDate = new Date();

function convert(n)
{
    if (n < 10) return '0' + n;
    else return n;
}

var devID = "3129";
var authKey = "AD6065793B6F4DD3BDA1DCF6FEB65E79";
var session;

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

//General signature for an API call
function apiCallSignature(method) 
{
    var timestamp = getTimestamp();
    return 'http://api.smitegame.com/smiteapi.svc/' + method + 'Json/' + devID + '/' + md5(devID + method + authKey + timestamp) + '/' + session + '/' + timestamp;
}
//Specific session signature to establish a session
function sessionSignature() 
{
    var timestamp = getTimestamp();
    return 'http://api.smitegame.com/smiteapi.svc/createsessionJson/' + devID + '/' + md5(devID + 'createsession' + authKey + timestamp) + '/' + timestamp;
}

async function setSession() 
{
    var url = sessionSignature();

    var body = await rp(url, {json: true});
    //console.log(body);
    session = body.session_id;
}


function apiCall(url)
{
    request(url, {json: true}, (err, res, body) => {
        if (err) console.log(err);
        console.log(body);
    });
}

function testSession() 
{
    var url = apiCallSignature('testsession');
    apiCall(url)
}

function getGodRanks(player)
{
    var url = apiCallSignature('getgodranks') + '/' + player;
    request(url, {json: true}, (err, res, body) => 
    {
        if (err) console.log(err);
        console.log(body);
    });
}

function getTotalWorshippers(player)
{
    var url = apiCallSignature('getgodranks') + '/' + player;
    request(url, {json: true}, (err, res, body) => 
    {
        if (err) console.log(err)
        console.log(body)
        var totalWorshippers = 0;
        for (i = 0; i < body.length; i++)
        {
            totalWorshippers += (body[i]['Worshippers'])
        }
        console.log(totalWorshippers)
    })
}

function getMatchHistory(player)
{
    var url = apiCallSignature('getmatchhistory') + '/' + player;
    request(url, {json: true}, (err, res, body) => 
    {
        if (err) console.log(err);
        console.log(body);
        
        fs.writeFile('queryresult.txt', JSON.stringify(body), (err) => 
        {
            if (err) throw err;
        })
    });    
}

function getMatchDetails(match_id)
{
    var url = apiCallSignature('getmatchdetails') + '/' + match_id;
    request(url, {json: true}, (err, res, body) => {
        if (err) console.log(err);
        console.log(body);
    });
}


function getPlayerStatus(player)
{
    //var test;
    var url = apiCallSignature("getplayerstatus") + "/" + player;
    request(url, {json: true}, (err, res, body) => {
        if (err) console.log(err);
    });
    //return test; FIND MÅDE AT RETUNERE FRA REQUEST IND TIL GETPLAYERSTATUS, SÅ DEN KAN KALDES DIREKTE (UNDGÅ GLOBAL VARIABLE, TAK)
}

function getPlayer(player)
{
    var url = apiCallSignature("getplayer") + "/" + player
    request(url, {json: true}, (err, res, body) => {
        if (err) console.log(err);
        console.log(body);
    });
}

async function main()
{
    await setSession();
    getPlayer("Cenaras");
}



/* SERVER STUFF */

const http = require('http');
let server = http.createServer((req, res) => 
{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Hello World");
});

server.listen(8080);

