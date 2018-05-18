const bitcoin = require('bitcoin');
const config = require('../konfigurasyon');
var client = new bitcoin.Client(config.clubcoinRPC);

 
  var paraGonder = (adres,miktar,callback) => {
      client.sendToAddress(adres,miktar,(err,res) => { if(err) {return console.error(err);}
    //callback at
    callback(res); // callback txid olmalı eğer işlem gerçekleşirse
 })}
  module.exports = {
      paraGonder
  };