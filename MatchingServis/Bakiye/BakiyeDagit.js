const Bakiyeler = [];

var BakiyeEkle = function (obj)
{
Bakiyeler.push(obj);
}

var MevcutListe = function() {
    return Bakiyeler;
}
module.exports = {
    BakiyeEkle,
    MevcutListe
}