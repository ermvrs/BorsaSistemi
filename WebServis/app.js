var app = require('express')();
var db = require('./db');
var mongo = require('./veritabani');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var socket = require('./socket');

db.connectDB(() => {
    mongo.connectDB( function(err) {
        if(err) throw err;
        console.log("MongoDB Bağlantısı Kuruldu.")

            server.listen(8082, function () {

                require('./router.js')(app,socket,io);
                app.get('*', function (req, res) {
                    res.sendFile(__dirname + '/Public/index.html');
                });
                socket.SocketStart(io); // statik eventleri yükleyelim.
                console.log("Web Sunucusu çalışıyor.");
            });

});
})
