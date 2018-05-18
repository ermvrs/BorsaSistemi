/*
-> ALINACAK VERİLER -- USERID -- ÇEKİLECEK ADRES -- MİKTAR 
*/
const bitcoin = require('bitcoin');
const config = require('../konfigurasyon');
var mongo = require('../mongoDB');
var client = new bitcoin.Client(config.bitcoinRPC);

 
  var paraGonder = (adres,miktar,callback) => {
      client.sendToAddress(adres,miktar,(err,res) => { if(err) {
        mongo.insertDB('sistem','bitcoin_error',{tip: paracekme, addr : adres, cekilenMiktar : miktar, hata: err},(dberr,dbres)=> {
          if(dbres)
          {
            console.error("Bitcoin RPC Hatası. Hata veritabanına yazıldı.");
          }
        })
        }
    //callback at
    callback(res); // callback txid olmalı eğer işlem gerçekleşirse
 })}
  module.exports = {
      paraGonder
  };