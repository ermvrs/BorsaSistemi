const BakiyeArray = [];

var BakiyeEkle = function (obj) {
BakiyeArray.push(obj);
}

var BakiyeCikar = function () {
    BakiyeArray.shift();
}

var BakiyeCikarCikaniDondur = function (){
    if(BakiyeArray.length > 0) {
    var obj = BakiyeArray[0];
    BakiyeArray.shift();
    return obj;
    } else {
    return false;
    }
}
var MevcutListe = function() {
    return BakiyeArray;
}
module.exports = {
BakiyeEkle,BakiyeCikar,BakiyeCikarCikaniDondur,MevcutListe
};