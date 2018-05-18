
var online = [];
var kayitli = new Map();
var Seq_SocketID_KeyPair = {};
var SocketID_Seq_KeyPair = {};

var ServerSocket = null;

var SocketStart = function (io) {
    ServerSocket = io;
    io.on('connection',function (socket) {

        online.push(socket); // yeni girişi arraye ekleyelim.

        socket.on('disconnect', function() {
            var i = online.indexOf(socket); // çıkışı arrayden çıkartalım
            online.splice(i, 1);
            let socketID = socket.id;
            let seq = SocketID_Seq_KeyPair[socketID];
            console.log("SEQ : " + seq);
            if(seq != undefined){
                delete SocketID_Seq_KeyPair[socketID];
                delete Seq_SocketID_KeyPair[seq];
            }
            
        })
        socket.on('giris', function(data) {
            console.log(data.SEQ);
            socket.emit('bakiye','guncelle')
            SocketID_Seq_KeyPair[data.SEQ] = socket.id;
            Seq_SocketID_KeyPair[socket.id] = data.SEQ;
            console.log("SEQ : " + Seq_SocketID_KeyPair[socket.id])
            console.log("SocketID : " + SocketID_Seq_KeyPair[data.SEQ])
        })
        socket.on('bakiye', function() {
            console.log('Bakiye Güncelleme');
            socket.emit('bakiye','guncelle')
        })
        socket.broadcast.emit('testResponse','Başkası geldi')
        console.log(kayitli.entries());
     })
}

var testSeq = function(seq) {
    return kayitli.has(seq);
}

// SEQ e göre veri gönderme --- Erim VARIŞ 
var sendWithSeq = function(seq){
    if(SocketID_Seq_KeyPair[seq] != undefined)
    {
        ServerSocket.to(SocketID_Seq_KeyPair[seq]).emit('mesaj','Sunucudan Gelen Mesaj')
        return true;
    } else {
        return false;
    }
}

var EmirleriGuncelle = function() {
    ServerSocket.emit('emirGuncelle','Emirler Guncellendi');
    console.log('Emirler güncellendi.')
}
var emirEkle = function(Kur,Miktar,Side) {
    ServerSocket.emit('emirEkle',{ kur : parseFloat(Kur), miktar : parseFloat(Miktar), side : parseFloat(Side)});
    console.log('done');
}
var emirSil = function(Kur,Miktar,Side){
    ServerSocket.emit('emirSil', {kur : parseFloat(Kur), miktar: parseFloat(Miktar) , side: parseFloat(Side)})
    console.log('Emir Silindi.')
}
var kurAzalt = function(Kur,Miktar,Side){
    ServerSocket.emit('kurAzalt', { kur: parseFloat(Kur), miktar: parseFloat(Miktar), side: parseFloat(Side)})
    console.log('Emir Azaltıldı.')
}
module.exports = {SocketStart,testSeq,sendWithSeq,EmirleriGuncelle,emirEkle,emirSil,kurAzalt}