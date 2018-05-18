const EmirSira = require('./EmirSirala');
const BakiyeDagit = require('../Bakiye/BakiyeDagit');
const Bakiye = require('../Modeller/Bakiye');
const request = require('request');
var EmirHandle = function(Database) {
    var SiradakiEmir = EmirSira.EmirCikarCikaniDondur();
    if(!SiradakiEmir) 
    {
        console.log("Sırada Emir Yok");
        setTimeout(() => {
            EmirHandle(Database)
        },500);
     }
    else {
    //burada sıradaki emri bir kere eşleştir ve miktarını güncelle sonra onu tekrar yeni miktarıyla listeye at eğer miktar kaldıysa.
    EmirGir(SiradakiEmir,Database,EmirHandle);
    }


}
var EmirGir = function (Emir,Database,callback) {
// Emir bir Emir model objesi şeklinde olmalı.
// aynı kurdan emirleri görme çalışıyor paratipini tabloda tutmaya gerek yok.
// Side 1 -> Satış , 0 -> Alış
if(Emir.islemtipi == 0)
{
var Parite = null;
var ArananSide = (Emir.side == 1) ? 0 : 1;
  switch (Emir.paratipi)
  {
    case 1:
    Parite = 'btctry';
    break;
    case 2:
    break;
    default:
    break;
  }
  EslesecekEmirGetir(Emir.kur,ArananSide,"btctry",Database, (response) => {
    if(response == false) {
      console.log('Eşleşme yok.');
      console.log(typeof Parite)
      EmirInsertDB(Database,Emir,Parite,()=>{
        callback(Database);
      });

    } else {
      console.log('Girilen Emir : ' + JSON.stringify(Emir));
      console.log('Eşleşen Emir : ' +JSON.stringify(response));

      Eslestir(Emir,response,Database,"btctry",(eslesmisEmir) =>{
      if(eslesmisEmir.miktar > 0)
      {
          console.log(eslesmisEmir.miktar);
          EmirSira.EmirEkle(eslesmisEmir);
          callback(Database);
      } else {
          //Emrin Tamamı eşleşmiş.
          console.log('Emrin tamamı eşleşmiş');
          callback(Database);
      }
      })
  }
 });
} else if(Emir.islemtipi == 1){
// emir sil
    console.log('EMir Sİlme İşlemi yapılacak')
    callback(Database)
} else {
    console.log('Geçersiz İşlem tipi')
    callback(Database);
}
}


var EslesecekEmirGetir = function(Kur,Side,Parite,Database,callback) {
//side aranan side olmalı
  var Eslesmeler = Database.selectDB('eslestirme',Parite,{ kur : Kur, side : Side},(res) =>{
    console.log("ARANAN SIDE : " +Side);
    console.log('Eşleşebilecek Emir Sayısı : ' + res.length);
    console.log('İlk Emir : ' + JSON.stringify(res[0]));
    if(res.length == 0) {
        console.log("burası")
    callback(false);
    } else {
    callback(res[0]);
    }
})
}

var Eslestir = function (GirilenEmir,MevcutEmir,Database,Parite,callback) {
GirilenEmir.miktar = parseFloat(GirilenEmir.miktar);
MevcutEmir.miktar = parseFloat(MevcutEmir.miktar);
    if(GirilenEmir.miktar > MevcutEmir.miktar)
  { // burada girilen emrin devam etmesi gerekiyor.
    console.log("**");
    if(GirilenEmir.side == "1")
    {
        console.log("SEKTÖR 1");
      //var EmirGireneEklenecekBakiye = new Bakiye(GirilenEmir.seq,'0',MevcutEmir.miktar * MevcutEmir.kur);
      //var MevcutEmirSahibineEklenecekBakiye = new Bakiye(MevcutEmir.seq,'1',MevcutEmir.miktar); // Para tipi sistemini çoklu parabirimi halinde değiştir.
      request.post({
        url:     'http://localhost:8080/islemEkle',
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        json: true,
        form: {seq : GirilenEmir.seq, miktar : MevcutEmir.miktar * MevcutEmir.kur, paratipi : 0, degisim : 1, islemtipi:1, emir : MevcutEmir}
      }, function(error, response, body){
          if(error) console.error(error);
        console.log(body);
        EmirSil(Database,MevcutEmir,Parite,()=>{
            var guncelGirilenEmir = GirilenEmir;
            guncelGirilenEmir.miktar -= MevcutEmir.miktar;
            callback(guncelGirilenEmir) // yeni güncel emri geri döndürelim
         });
      });
       /*
       -> Bakiye Dağıtım örnek objesi
       -> Seq = bakiye verilecek userin seq
       ->
       */
      // paratipi = 0 -> TL
     //Emir girene TL MevcutEmire BTC gidecek.

    } else {
        let bakiyeData = {seq : MevcutEmir.seq, miktar : MevcutEmir.miktar * MevcutEmir.kur, paratipi : 0, degisim : 1, islemtipi:1, emir : MevcutEmir};
        bakiyeData.emir.seq = GirilenEmir.seq;
        request.post({
            url:     'http://localhost:8080/islemEkle',
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            json: true,
            form: bakiyeData
          }, function(error, response, body){
              if(error) console.error(error);
            console.log(body);
            EmirSil(Database,MevcutEmir,Parite,()=>{
                var guncelGirilenEmir = GirilenEmir;
                guncelGirilenEmir.miktar -= MevcutEmir.miktar;
                callback(guncelGirilenEmir)
            });
          });
        //var EmirGireneEklenecekBakiye = new Bakiye(GirilenEmir.userid,'1',MevcutEmir.miktar);
        //var MevcutEmirSahibineEklenecekBakiye = new Bakiye(MevcutEmir.userid,'0',MevcutEmir.miktar * MevcutEmir.kur); // Para tipi sistemini çoklu parabirimi halinde değiştir.

    }
  } else if(GirilenEmir.miktar == MevcutEmir.miktar) 
  {
    if(GirilenEmir.side == "1")
    {
        console.log("Sektör 3");
       // var EmirGireneEklenecekBakiye = new Bakiye(GirilenEmir.userid,'0',MevcutEmir.miktar * MevcutEmir.kur);
        // var MevcutEmirSahibineEklenecekBakiye = new Bakiye(MevcutEmir.userid,'1',MevcutEmir.miktar); // Para tipi sistemini çoklu parabirimi halinde değiştir.
        request.post({
            url:     'http://localhost:8080/islemEkle',
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            json: true,
            form: {seq : GirilenEmir.seq, miktar : MevcutEmir.miktar * MevcutEmir.kur, paratipi : 0, degisim : 1, islemtipi:1, emir : MevcutEmir}
          }, function(error, response, body){
              if(error) console.error(error);
            console.log(body);
            EmirSil(Database,MevcutEmir,Parite,()=>{
                var guncelGirilenEmir = GirilenEmir;
                guncelGirilenEmir.miktar = 0;
                callback(guncelGirilenEmir)
            });
          });


    } else {
        console.log("Sektör 4");
        let bakiyeData = {seq : MevcutEmir.seq, miktar : MevcutEmir.miktar * MevcutEmir.kur, paratipi : 0, degisim : 1, islemtipi:1, emir : MevcutEmir};
        bakiyeData.emir.seq = GirilenEmir.seq;
        request.post({
            url:     'http://localhost:8080/islemEkle',
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            json: true,
            form: bakiyeData
          }, function(error, response, body){
              if(error) console.error(error);
            console.log(body);
            EmirSil(Database,MevcutEmir,Parite,()=>{
                var guncelGirilenEmir = GirilenEmir;
                guncelGirilenEmir.miktar = 0;
                callback(guncelGirilenEmir)
            });
          });

        //var EmirGireneEklenecekBakiye = new Bakiye(GirilenEmir.userid,'1',MevcutEmir.miktar);
        //var MevcutEmirSahibineEklenecekBakiye = new Bakiye(MevcutEmir.userid,'0',MevcutEmir.miktar * MevcutEmir.kur); // Para tipi sistemini çoklu parabirimi halinde değiştir.

    }
  } else {
        //GirilenEmir.miktar < MevcutEmir.miktar
    if(GirilenEmir.side == "1")
    {
        console.log("Sektör 5");
        var guncelEmir = JSON.parse(JSON.stringify(MevcutEmir));
        guncelEmir.miktar -= GirilenEmir.miktar;
        guncelEmir.miktar = parseFloat(guncelEmir.miktar).toFixed(8);
       // var EmirGireneEklenecekBakiye = new Bakiye(GirilenEmir.userid,'0',GirilenEmir.miktar * GirilenEmir.kur);
        //var MevcutEmirSahibineEklenecekBakiye = new Bakiye(MevcutEmir.userid,'1',GirilenEmir.miktar);

        let bakiyeData = {seq : GirilenEmir.seq, miktar : GirilenEmir.miktar * GirilenEmir.kur, paratipi : 0, degisim : 1, islemtipi:1, emir : JSON.parse(JSON.stringify(MevcutEmir))};
        bakiyeData.emir.miktar = GirilenEmir.miktar;
        request.post({
            url:     'http://localhost:8080/islemEkle',
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            json: true,
            form: bakiyeData
          }, function(error, response, body){
              if(error) console.error(error);
            console.log(body);
            EmirGuncelle(Database,MevcutEmir,guncelEmir,'btctry',()=> {
                var guncelGirilenEmir = GirilenEmir;
                guncelGirilenEmir.miktar = 0;
                callback(guncelGirilenEmir)
            });
          });
    } else {
        console.log("Sektör 6");
        var guncelEmir = JSON.parse(JSON.stringify(MevcutEmir));
        guncelEmir.miktar -= GirilenEmir.miktar;
        var EmirGireneEklenecekBakiye = new Bakiye(GirilenEmir.userid,'1',GirilenEmir.miktar);
        var MevcutEmirSahibineEklenecekBakiye = new Bakiye(MevcutEmir.userid,'0',GirilenEmir.miktar * GirilenEmir.kur); 
        
        let bakiyeData = {seq : MevcutEmir.seq, miktar : GirilenEmir.miktar * GirilenEmir.kur, paratipi : 0, degisim : 1, islemtipi:1, emir : JSON.parse(JSON.stringify(MevcutEmir))};
        bakiyeData.emir.seq = GirilenEmir.seq;
        bakiyeData.emir.miktar = GirilenEmir.miktar;
        request.post({
            url:     'http://localhost:8080/islemEkle',
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            json: true,
            form: bakiyeData
          }, function(error, response, body){
              if(error) console.error(error);
            console.log(body);
            EmirGuncelle(Database,MevcutEmir,guncelEmir,'btctry',()=> {
                var guncelGirilenEmir = GirilenEmir;
                guncelGirilenEmir.miktar = 0;
                callback(guncelGirilenEmir)
            });
          });

    }
 }
}
var EmirGuncelle = function (Database,Eski,Yeni,Parite,callback) {

    Eski.miktar = parseFloat(parseFloat(Eski.miktar).toFixed(8));
    Yeni.miktar = parseFloat(parseFloat(Yeni.miktar).toFixed(8));
    console.log('Emir Güncelleme Başladı.')
    console.log('Eski Emir : ' + JSON.stringify(Eski));
    console.log('Yeni : ' + JSON.stringify(Yeni));
    Database.updateDB('eslestirme',Parite,Eski,Yeni,(res) => {
        console.log('Emir Güncellendi : ' + res);
        request.post({
            url:     'http://localhost:8082/api/kurAzalt',
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            json: true,
            form: {kur : Yeni.kur, miktar : Eski.miktar - Yeni.miktar, side : Eski.side, paraTipi : Eski.paraTipi}
          });
        callback();
    })
}
var EmirSil = function (Database,Emir,Parite,callback) {
    Emir.miktar = parseFloat(parseFloat(Emir.miktar).toFixed(8));
    Database.deleteDB('eslestirme',Parite,Emir,(res) => {
        console.log("Emir Silindi : " + res);
        // Emir Silindiğini WebSiteye Gönder
        request.post({
            url:     'http://localhost:8082/api/kurAzalt',
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            json: true,
            form: {kur : Emir.kur, miktar : Emir.miktar, side : Emir.side, paraTipi : Emir.paraTipi}
          });
        callback();
    })
}

var EmirInsertDB = function(Database,Emir,Parite,callback) {
    Emir.miktar = parseFloat(parseFloat(Emir.miktar).toFixed(8));
    Emir.kur = parseFloat(parseFloat(Emir.kur).toFixed(2));
  Database.insertDB('eslestirme',Parite,Emir,(err,res) => {
      console.log('Emir Eklendi : ' + res)
      // Emir Ekleme WebSiteye Gönder
      request.post({
        url:     'http://localhost:8082/api/emirEkle',
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        json: true,
        form: {kur : Emir.kur, miktar : Emir.miktar, side : Emir.side, paraTipi : Emir.paraTipi}
      });
      callback();
  })
}
module.exports = {
    EmirGir,EmirHandle
};