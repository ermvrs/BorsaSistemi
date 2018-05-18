/*
-> POST İLE ALINACAK VERİLER  -> USERID 
-> MONGO DBDEN USER ID VE O USERID NIN ADRESİNİ VE ESKIDEGERINI ÇEKELİM
-> RPC YE getreceivedbyaddress KOMUTU GÖNDERELİM
-> ÖRNEK :  getreceivedbyaddress (adres)mjSk1Ny9spzU2fouzYgLqGUD8U41iR35QN (onaysayısı)6     
-> GERİ ALDIĞIMIZ DEĞERDEN ESKIDEGERI ÇIKARTALIM BU SONUÇU BİR YERE KAYDEDELİM EN SONUNDA KULLANICIYA VERİLECEK.
-> KULLANICIYA BAKİYE EKLENMEDEN RPCDEN GELEN VERİYİ DBDE ESKIDEGER YERİNE YAZALIM Kİ BİR SONRAKİ BAKİYE KONTROLÜNDE KARIŞMASIN.
-> EN SONUNDA İSE JSON İLE RES SEND OLARAK SONUCU EKRANA YAZDIRIN ( SONUÇ = KULLANICININ BAKİYESİNE EKLENECEK MİKTAR.)
*/
const bitcoin = require('bitcoin');
const config = require('../konfigurasyon');
const mongo = require('../mongoDB');
var client = new bitcoin.Client(config.bitcoinRPC);

  var bakiyeKontrol = (userID,addr,callback) => {
    // callbackten eklenecek miktarı gönder sadece ve userID
    //db kayıt kontrolleri burada yap
  client.getReceivedByAddress(addr,6,(err,received) => { if(err) {
    mongo.insertDB('sistem','bitcoin_error',{tip: bakiyeKontrol, adres : addr, userid : userID, hata: err},(dberr,dbres)=> {
      if(dbres)
      {
        console.error("Bitcoin RPC Hatası. Hata veritabanına yazıldı.");
      }
    })
    }
  callback(received);
})}
  module.exports = {
      bakiyeKontrol
  };