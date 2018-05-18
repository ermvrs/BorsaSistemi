const bitcoin = require('bitcoin');
const config = require('../konfigurasyon');
var client = new bitcoin.Client(config.clubcoinRPC);

  var adresOlustur = (userID,callback) => { client.getNewAddress((err,addr) => { if(err) return console.error(err); callback(userID,addr);})};

  module.exports = {
      adresOlustur
  };