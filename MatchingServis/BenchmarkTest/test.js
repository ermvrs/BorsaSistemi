const request = require('request');
const random = require('random-float');
const emirEklemeURL = 'http://localhost:8082/req/';

var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

// Configure the request


emirEkle();
function emirEkle() {
    var _Kur = randKur();
    var _Miktar = randMiktar();
    var _userID = randuserID();
    var _Side = randSide();
    var obj = {
        kur:_Kur,
        miktar: _Miktar,
        userid: _userID,
        side: _Side,
        paratipi: '1'
    }
    var options = {
        url: emirEklemeURL,
        method: 'POST',
        headers: headers,
        form: obj
    }
    console.log(obj);
    request(options, function (error, response, body) {
        setTimeout(emirEkle,1000)
    })


}

function randKur() {

    return random(1,100000).toFixed(2);
}
function randMiktar() {
    return random(1,1000).toFixed(8);
}
function randuserID(){
    return (Math.random() * (100000 - 1) + 1).toFixed(0);
}

function randSide(){
    return Math.round(Math.random()).toString();
}