

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var mongo = require('./mongoDB');
var logger = require('./logger');
mongo.connectDB( function(err) {
  if(err) throw err;
  console.log("MongoDB Bağlantısı Kuruldu.")

require('./routes.js')(app,mongo);
app.listen(8082, function () {
    console.log("Sunucu çalışıyor.");
  });
});
//mongodb bağlantı kapatılmasını ayarla.