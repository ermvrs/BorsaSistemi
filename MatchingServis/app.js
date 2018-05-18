
var express = require('express');
var app = express();
var mongo = require('./mongoDB');
const EmirEngine = require('./Eslestirme/EmirEslestir');
mongo.connectDB( function(err) {
  if(err) throw err;
  console.log("MongoDB Bağlantısı Kuruldu.")

require('./routes.js')(app,mongo);
app.listen(8081, function () {
    console.log("Sunucu çalışıyor.");
    EmirEngine.EmirHandle(mongo);
  });
});