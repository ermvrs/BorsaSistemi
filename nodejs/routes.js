var bodyParser = require('body-parser');
var btc = require('./Bitcoin/Bitcoin');
var club = require('./ClubCoin/ClubCoin');
var config = require('./konfigurasyon');
var log = require('./logger');
var konsol = require('./consoleHandler');
module.exports = function(app,mongo) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.get("/", function (req, res) {
  
        res.send("WebServer Node.js ErmVrs - Fonksiyonlarda GET kullanmayın. Kullanırsanız cevap hata gelir");
    });

    //mongo db bağlantısı
    //logger örnek -> logger.logEkle("Bilgi", "Sunucu Açıldı");
    //bitcoin routes
    app.post('/test/', (req,res) => {
        mongo.selectOneDB('sistem','bitcoin',{userID : req.body.userID},(resx) => { 
            // resten dönen değer ne ona göre işlem yap.
            if(resx != null)
            {
                console.log("RES : " + resx)
                res.send(resx.adres)
            } else {
                // user ID'ye mevcut adres yok.
                res.send("else")
                console.log(resx)
                console.log('else')
            }
            })
    })
    app.post('/bitcoin/adres', (req,res) => {
        //req.body.userid -> userID
        //dbye kayıt et
       //TODO -> DBDE AYNI USER ID YE ADRES VERİLDİYSE YENİ ÜRETME ONU VER  <========
       // TODO -> KONFIGURASYON DOSYASINI KRİPTOLA
      try{
        // ## DEĞİŞKEN SEKTÖRÜ
       if(!req.body.userID)
       {
           res.send("userID boş olamaz");
       }
       // ## API KEY SEKTÖRÜ
       if(config.ApiGuvenligi && config.ApiKey != req.body.ApiKey)
       {
           // body de gelen ApiKey sistemdekiyle uyuşmadı
           res.send('Api Key Hatası.');
       }
       // ## IP ADRES SEKTÖRÜ ##
       if(config.IPGuvenligi && config.izinliIPListesi.indexOf(req.ip.split(':')[3]) == -1) //req.connection.remoteaddress check edilmeli
       {
           //ip güvenliği açıksa ve requestte gelen ip adresi izinli ip listesinde değil ise burada hata verilecek.
           res.send('Bu IP Adresinden Erişim Yapılmamaktadır.');
       }
       //userID daha önce adres verildimi kontrol
       mongo.selectOneDB('sistem','bitcoin',{userID : req.body.userID},(result) => { 
       if(result != null)
       {
           var objretn = {
            userID : req.body.userID,
            adres  : result.adres
           }
           res.send(JSON.stringify(objretn));
           //userID'ye mevcut yatırma adresi var
       } else {
        btc.adres.adresOlustur(req.body.userID,(user,addr,hata) => {
            if(hata)
            {
                log.logEkle('HATA',hata.code);
                res.send(JSON.stringify({Hata : hata.code}));
            }
            else 
            {
            mongo.insertDB('sistem','bitcoin',{userID : user, adres: addr,received: 0},(err,resultInsert) => {if(err) throw err; })
            var returnObject = {
                userID : req.body.userID,
                adres  : addr
            }
             res.send(JSON.stringify(returnObject));
            }
            })
            
       }
       })

        } catch (ex)
        {
            // Hatayı loga yaz
            log.logEkle("HATA" , ex);
            // Hatayı konsola yazalım
            konsol.HataYaz("HATA Mesajı", "POST-BTC/ADRES/ CATCH HATASI : " + ex);
        }
        });
    //adresOlustur fonksiyonu callbacki (userID,Adres şeklinde)
    app.post('/bitcoin/bakiye' , (req,res) => {
        //req.body.adres -> adres
        //req.body.userID -> userID
        //db callbacki result orada result.received olarak seç
        // önce dbdeki receivedi çekelim
        try{
        if(!req.body.userID)
        {
            res.send("userID boş olamaz");
        }
        if(config.ApiGuvenligi && config.ApiKey != req.body.ApiKey)
        {
            // body de gelen ApiKey sistemdekiyle uyuşmadı
            res.send('Api Key Hatası.');
        }
        // ## IP ADRES SEKTÖRÜ ##
        if(config.IPGuvenligi && config.izinliIPListesi.indexOf(req.ip.split(':')[3]) == -1) //req.connection.remoteaddress check edilmeli
        {
            //ip güvenliği açıksa ve requestte gelen ip adresi izinli ip listesinde değil ise burada hata verilecek.
            res.send('Bu IP Adresinden Erişim Yapılmamaktadır.');
        }
      mongo.selectDB('sistem','bitcoin',{userID : req.body.userID,adres:req.body.adres},(result) => {
        //şimdi sistemden bu hesabın bakiyesini alalım
        btc.bakiye.bakiyeKontrol(req.body.userID,req.body.adres,(received_rpc) => {
            var obj = {
                userID: result[0].userID,
                EklenecekMiktar : received_rpc - result[0].received
            }
            mongo.updateDB('sistem','bitcoin',{userID : result[0].userID,adres : result[0].adres} , { $set: {received : received_rpc}},(res) => { console.log("DB Update Cevabı : "+ res);})
            res.send(JSON.stringify(obj));
        })
      })
     } catch (ex)
     {
    log.logEkle("HATA" , ex);
    // Hatayı konsola yazalım
    konsol.HataYaz("HATA Mesajı", "POST-BTC/BAKİYE/ CATCH HATASI : " + ex);
     }
    });
    app.post('/bitcoin/paracekme' , (req,res) => {
        btc.paraCekme.paraGonder(req.body.adres,req.body.miktar,(txid) =>{
        var obj = {
            CekilenAdres: req.body.adres,
            Miktar: req.body.miktar,
            TXID: txid,
            userID: req.body.userID
        }
        mongo.insertDB('sistem','bitcoin_withdraw',obj,(err,res) => {
            if(err) throw err;
            console.log(res);
        })
        res.send(JSON.stringify(obj));
        })
        })

    //bitcoin cash routes
    app.post('/bch/adres',(req,res) => { res.send("testbch")})
    app.post('/bch/bakiye')
    app.post('/bch/paracekme')

    app.post('/club/adres', (req,res) => {
    //req.body.userid -> userID
    //dbye kayıt et
    club.adres.adresOlustur(req.body.userID,(user,addr) => {
        //db kaydet
        mongo.insertDB('sistem','clubcoin',{userID : user, adres: addr,received: 0},(err,res) => {if(err) throw err; console.log(res)})
        var returnObject = {
            userID : req.body.userID,
            adres  : addr
        }
         res.send(JSON.stringify(returnObject));
        })
    });
    app.post('/club/bakiye' , (req,res) => {
        //req.body.adres -> adres
        //req.body.userID -> userID
        //db callbacki result orada result.received olarak seç
        // önce dbdeki receivedi çekelim
    mongo.selectDB('sistem','clubcoin',{userID : req.body.userID,adres:req.body.adres},(result) => {
        //şimdi sistemden bu hesabın bakiyesini alalım
        club.bakiye.bakiyeKontrol(req.body.userID,req.body.adres,(received_rpc) => {
            var obj = {
                userID: result[0].userID,
                EklenecekMiktar : received_rpc - result[0].received
            }
            mongo.updateDB('sistem','clubcoin',{userID : result[0].userID,adres : result[0].adres} , { $set: {received : received_rpc}},(res) => { console.log("DB Update Cevabı : "+ res);})
            res.send(JSON.stringify(obj));
        })
    })
    });
    //paraç ekme gelen veriler
    // adres,miktar,userID
    app.post('/club/paracekme' , (req,res) => {
    club.paraCekme.paraGonder(req.body.adres,req.body.miktar,(txid) =>{
    var obj = {
        CekilenAdres: req.body.adres,
        Miktar: req.body.miktar,
        TXID: txid,
        userID: req.body.userID
    }
    mongo.insertDB('sistem','clubcoin_withdraw',obj,(err,res) => {
        if(err) throw err;
        console.log(res);
    })
    res.send(JSON.stringify(obj));
    })
    })

    app.get('/bitcoin/adres', (req,res) => { res.send('Get Kullanımı Yasak.');})
        

};