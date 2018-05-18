const EmirArray = [];

var EmirEkle = function (obj) {
EmirArray.push(obj);
}

var EmirCikar = function () {
    EmirArray.shift();
}

var EmirCikarCikaniDondur = function (){
    if(EmirArray.length > 0) {
    var obj = EmirArray[0];
    EmirArray.shift();
    return obj;
    } else {
        return false;
    }
}
var MevcutListe = function() {
    return EmirArray;
}
module.exports = {
EmirEkle,EmirCikar,MevcutListe,EmirCikarCikaniDondur
};