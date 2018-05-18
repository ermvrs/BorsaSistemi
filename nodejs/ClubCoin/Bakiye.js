const bitcoin = require('bitcoin');
const config = require('../konfigurasyon');
var client = new bitcoin.Client(config.clubcoinRPC);

  var bakiyeKontrol = (userID,addr,callback) => {
    // callbackten eklenecek miktarı gönder sadece ve userID
    //db kayıt kontrolleri burada yap
  client.getReceivedByAddress(addr,6,(err,received) => { if(err) {return console.error(err);}
  callback(received);
})}
  module.exports = {
      bakiyeKontrol
  };