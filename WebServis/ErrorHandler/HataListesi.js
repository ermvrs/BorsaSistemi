const HataListesi = [];

var HataEKle = function(hata) {
    console.log('Hata EKlendi')
    console.log(JSON.stringify(hata))
    HataListesi.push(hata);
}
var mevcutHatalar = function() {
    return HataListesi;
}
module.exports = {
    HataEKle,
    mevcutHatalar
}