/*
-> Bir tane adres modeli oluşturulacak.
-> DB'de kayıt şekli -> USERID & ADRES & ESKIDEGER    belki para çekme değeride eklenebilir. ama gerek yok.
-> Bir tane Adres Oluştur Modeli oluştur mongoose ile ( eski projedeki user dan çek )
-> rpc node a getnewaddress komutu gönder ve gelen veriyi dbye user id ve adres olarak kaydet.
-> user id yi websiteden post ile al.
-> gelen adresi json ile res write at.
*/

/*
örnek komut
curl --data-binary '{"jsonrpc" : "1.0","id":"curltext","method":"getnewaddress","params":[]}' -H 'content-type:text/plain;' http://user:pass@213.128.67.134:8332/

*/

// -> clubcoinden test edilmiştir.
const bitcoin = require('bitcoin');
const config = require('../konfigurasyon');
const mongo = require('../mongoDB');
var client = new bitcoin.Client(config.bitcoinRPC);

  var adresOlustur = (userID,callback) => { client.getNewAddress((err,addr) => { if(err) {
    mongo.insertDB('sistem','bitcoin_error',{tip: adresOlustur, userid : userID, hata: err},(dberr,dbres)=> {
      if(dbres)
      {
        console.error("Bitcoin RPC Hatası. Hata veritabanına yazıldı.");
      }
    })
    }
     callback(userID,addr,err);})};
  
  module.exports = {
      adresOlustur
  };