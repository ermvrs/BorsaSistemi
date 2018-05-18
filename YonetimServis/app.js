var app = require('express')();
const mongo = require('./veritabani');
mongo.connectDB( function(err) {
    if(err) throw err;
    console.log("MongoDB Bağlantısı Kuruldu.")
  

  app.listen(8083, function () {
      console.log("Yönetim Sistemi Başladı");
      require('./router.js')(app,mongo);
      app.get('*', function (req, res) {
        res.sendFile(__dirname + '/Yonetim/index.html');
    });
    });
  });

