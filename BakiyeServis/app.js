var mongo = require('./Veritabani');
var express = require('express');
var BakiyeService = require('./Bakiye/IslemHandler');
var app = express();
mongo.connectDB( function(err) {
    if(err) throw err;
console.info('MongoDB Bağlantısı Kuruldu.')

require('./routes.js')(app,mongo);
app.listen(8080, function () {
    console.log("Sunucu çalışıyor.");
    BakiyeService.IslemHandle(mongo);
  });
});