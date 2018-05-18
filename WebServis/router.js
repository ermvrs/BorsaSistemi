const express = require('express');
const bodyParser = require('body-parser');
const UyeModel = require('./Modeller/Uye');
const ProfilModel = require('./Modeller/Profil');
const config = require('./config');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const Kripto = require('./Fonksiyonlar/crypt');
const Veritabani = require('./veritabani');
const HataListesi = require('./ErrorHandler/HataListesi');

var bcrypt = require('bcrypt'),
SALT = '$2b$10$i2JOfyr3t.sBmeuZsRGywu';

var request = require('request');

function checkAuth (req, res, next) {

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
	if (req.url === '/api/kontrol' && (!req.session || !req.session.authenticated)) {
		res.send('Giriş Yapılmadı')
		return;
	}

	next();
}
var sifreGuncelle = function (yeniSifre,callback) {
  bcrypt.hash(yeniSifre,SALT,function(err,hash) {
     if(err) throw err;
     callback(hash);
  })
}

module.exports = (app,socket,io) =>
{
    //public klasörünü yayınlayalım
    app.use(express.static(__dirname + '/Public'));
    app.use(cookieParser());
    app.use(session({ secret: 'test' }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}) );

    app.post('/api/bakiyeArtir', (req,res) =>{
      switch(req.body.paraTipi)
      {
        case '0':
        console.log('this')
        var obj = { tl: parseFloat(parseFloat(req.body.miktar).toFixed(2))}
        Veritabani.bakiyeArtir('mongoose-bcrypt-test','uyes',{seq : req.body.seq},obj,(response)=>{
          res.send(response)
        })
        break;
        case '1':
        var obj = { btc: parseFloat(parseFloat(req.body.miktar).toFixed(8))}
        Veritabani.bakiyeArtir('mongoose-bcrypt-test','uyes',{seq : req.body.seq},obj,(response)=>{
          res.send(response)
        })
        break;
        case '2':
        var obj = { ltc: parseFloat(parseFloat(req.body.miktar).toFixed(8))}
        Veritabani.bakiyeArtir('mongoose-bcrypt-test','uyes',{seq : req.body.seq},obj,(response)=>{
          res.send(response)
        })
        break;
        case '3':
        var obj = { bch: parseFloat(parseFloat(req.body.miktar).toFixed(8))}
        Veritabani.bakiyeArtir('mongoose-bcrypt-test','uyes',{seq : req.body.seq},obj,(response)=>{
          res.send(response)
        })
        break;
      }
    })
    app.post('/api/bakiyeAzalt', (req,res) =>{
      switch(req.body.paraTipi)
      {
        case '0':
        console.log('this')
        var obj = { tl: - parseFloat(parseFloat(req.body.miktar).toFixed(2))}
        Veritabani.bakiyeAzalt('mongoose-bcrypt-test','uyes',{seq : req.body.seq},obj,(response)=>{
          res.send(response)
        })
        break;
        case '1':
        var obj = { btc: - parseFloat(parseFloat(req.body.miktar).toFixed(8))}
        Veritabani.bakiyeAzalt('mongoose-bcrypt-test','uyes',{seq : req.body.seq},obj,(response)=>{
          res.send(response)
        })
        break;
        case '2':
        var obj = { ltc: - parseFloat(parseFloat(req.body.miktar).toFixed(8))}
        Veritabani.bakiyeAzalt('mongoose-bcrypt-test','uyes',{seq : req.body.seq},obj,(response)=>{
          res.send(response)
        })
        break;
        case '3':
        var obj = { bch: - parseFloat(parseFloat(req.body.miktar).toFixed(8))}
        Veritabani.bakiyeAzalt('mongoose-bcrypt-test','uyes',{seq : req.body.seq},obj,(response)=>{
          res.send(response)
        })
        break;
      }
    })
    app.get('/api/liste', (req,res) => {
        res.send(JSON.stringify({ isim : 'Erim', soyisim: 'Varış'}))
    });
    app.get('/api/webConfig' , (req,res) =>{
        res.send(JSON.stringify(config.WebConfig));
    });
    app.post('/api/kayit' , (req,res) => {
        var newUser = UyeModel({
            email: req.body.email,
            isim: req.body.isim,
            sifre: req.body.sifre
        })
        newUser.save((err) =>{
            if(err) {
            res.send(JSON.stringify({ kayit : err.message}))
            } else {
            res.send(JSON.stringify({ kayit: "Kayıt Tamamlandı."}));
            }
        })
    });

     app.get('/api/btctry/old/alis', (req,res) =>{
        request.get({
            url: 'http://localhost:8081/btctry/alis/',
            json: true,
            headers: {'User-Agent': 'request'}
          }, (err, response, data) => {
            if (err) {
              res.send(JSON.stringify({hata: '1'}))
            } else if (response.statusCode !== 200) {
              console.log('Status:', response.statusCode);
              res.send(response)
            } else {
              // data is already parsed as JSON:
              res.send(data)
            }
        });
     })
     app.get('/api/btctry/alis', (req,res) =>{
       Veritabani.AlisEmirYukle('eslestirme','btctry',0,(doc) =>{
         res.send(JSON.stringify(doc))
       })
     })
     app.get('/api/btctry/satis', (req,res) =>{
      Veritabani.SatisEmirYukle('eslestirme','btctry',1,(doc) =>{
        res.send(JSON.stringify(doc))
      })
    })

     app.get('/api/btctry/old/satis', (req,res) =>{
        request.get({
            url: 'http://localhost:8081/btctry/satis/',
            json: true,
            headers: {'User-Agent': 'request'}
          }, (err, response, data) => {
            if (err) {
              res.send(JSON.stringify({hata: '1'}))
            } else if (response.statusCode !== 200) {
              console.log('Status:', response.statusCode);
              res.send(response)
            } else {
              // data is already parsed as JSON:
              res.send(data)
            }
        });
     })

     app.post('/api/btctry/emir', (req,res) =>{
         /****** BURASI YAPILACAK POST İLE VERİ GÖNDERİMİNDE HATA VAR  */
         // req.body.userid , miktar, kur , side, paratipi -> 1 btc
         console.log(isNaN(req.body.miktar))
         if(isNaN(req.body.miktar) || isNaN(req.body.kur) || !req.session.seq || (parseFloat(req.body.miktar) <= 0)|| (parseFloat(req.body.kur) <= 0))
         {
           res.send('Miktar ve kur boş olamaz');
         } else {
         var emirObj = {

         }
         req.body.seq = parseInt(req.session.seq);
         console.log({seq: req.body.seq, paratipi: req.body.paratipi, miktar: req.body.miktar, degisim: 1, islemtipi: 0, emir : req.body});
         console.log("try")
         request.post({
           url: 'http://localhost:8080/preBakiyeKontrol/',
           headers: {'content-type' : 'application/x-www-form-urlencoded'},
           json: true,
           form : req.body
         }, function(error,response,body) {
           console.log('Bakiye KOntrol edildi')
           if(body.sonuc)
           {
            request.post({
              url:     'http://localhost:8080/islemEkle/',
              headers: {'content-type' : 'application/x-www-form-urlencoded'},
              json: true,
              form: { seq: req.body.seq, paratipi: req.body.paratipi, miktar: req.body.miktar, degisim: 1, islemtipi: 0, emir : req.body}
            }, function(error, response, body){
              console.log('EMir gönderildi')
              console.log(body);
              //socket.EmirleriGuncelle();
              res.send(body);
            });
           } else {
           res.send(body);
           }
         })
         /*
         request.post({
            url:     'http://localhost:8081/test/',
            headers: {'content-type' : 'application/x-www-form-urlencoded'},
            json: true,
            form: req.body
          }, function(error, response, body){
            console.log(body);
            //socket.EmirleriGuncelle();
            res.send(body);
          });*/
        }
     })
     app.post('/api/giris/test', function (req,res) {
           Kripto.Kriptola(req.body.sifre,(hash) =>{
             console.log(hash)
               Veritabani.selectDB('mongoose-bcrypt-test','uyes',{email: req.body.email ,sifre: hash},(response) =>{
                res.send(JSON.stringify(response[0].seq));
               })
           })
     })
     app.use(checkAuth);
     ///
     /// BURADAN SONRAKİ ROUTELER GİRİŞ YAPILDIMI KONTROL EDİYOR. ÜSTÜNDEKİLER İÇİN GİRİŞ YAPILMASI GEREKMİYOR.
     //

     app.post('/api/giris', function (req, res) {
     if(!req.session.authenticated){
       Kripto.Kriptola(req.body.sifre,(hash) =>{
         Veritabani.selectDB('mongoose-bcrypt-test','uyes',{email: req.body.email ,sifre: hash},(response)=>{
           if(response.length > 0)
           {
            req.session.authenticated = true;
            req.session.email = req.body.email;
            req.session.seq = response[0].seq;
             res.send(JSON.stringify({ cevap:'1', mesaj: 'Giriş Yapıldı.'}));
           } else {
             res.send(JSON.stringify({ cevap:'0', mesaj: 'Bilgiler Hatalı.'}));
           }
         })
       })
       } else {
         res.send('Zaten giriş yapılmış');
       } 
     });
     app.get('/api/cikis',(req,res) => {
       if(req.session.authenticated){
        req.session.destroy();
        res.send('Çıkış Yapıldı.');
       } else {
        res.send('Zaten Çıkış Yapılmış.');
       }

     })
     app.get('/api/girisKontrol',(req,res)=> {
       if(!req.session.authenticated)
       {
         res.send(JSON.stringify({durum: '0',}));
       } else {
         res.send(JSON.stringify({durum: '1', email: req.session.email, seq : req.session.seq}));
       }
     });

     app.get('/api/bakiyeGetir', (req,res) =>{
       if(!req.session.authenticated) {
         res.send(JSON.stringify({ durum: '0'}))
       } else {
        request.post({
          url:     'http://localhost:8080/bakiyeGetir/',
          headers: {'content-type' : 'application/x-www-form-urlencoded'},
          json: true,
          form: { seq: parseInt(req.session.seq)}
        }, function(error, response, body){
          console.log('Bakiye')
          console.log(body);
          //socket.EmirleriGuncelle();
          res.send(body);
        });
       }
     })
     app.post('/api/sifreGuncelle',(req,res) => {
       if(typeof req.body.yeniSifre == 'undefined' && !req.body.yeniSifre)
       {
         res.send('Yeni Şifre boş olamaz');
       } else if(req.body.yeniSifre.length == 0)
       {
        res.send('Yeni Şifre boş olamaz');
       } else {

       
       console.log(JSON.stringify(req.body));
        Kripto.Kriptola(req.body.mevcutSifre ,(hash1) =>{
        Veritabani.selectDB('mongoose-bcrypt-test','uyes',{email: req.session.email, sifre: hash1},(response) =>{
        if(response.length > 0)
        {
          Kripto.Kriptola(req.body.yeniSifre ,(hash2)=>{
           Veritabani.updateDB('mongoose-bcrypt-test','uyes',{email: req.session.email, sifre: hash1},{sifre: hash2},(resp)=>{
             console.log(resp);
             res.send('Şifre Değiştirildi.');
           })
          })
        } else {
           res.send('Mevcut şifre hatalı.')
               }
         })
       })
      }
     })
     
     app.post('/api/emirEkle',(req,res) =>{
       // ip koruması ekle
       console.log('Soket emir eklendi')
       socket.emirEkle(req.body.kur,req.body.miktar,req.body.side);
       res.send('okey');
     })
     app.post('/api/kurAzalt',(req,res) =>{
       //ip koruması ekle
      console.log('Soket emir azaltıldı')
      socket.kurAzalt(req.body.kur,req.body.miktar,req.body.side);
      res.send('okey');
    })
     app.post('/api/emirSil',(req,res)=>{

     })
     app.post('/api/hataOlustur',(req,res) =>{
       HataListesi.HataEKle({ Baslik : req.body.baslik, Icerik: req.body.icerik});
       res.send('Hata EKlendi.');
     })
     app.post('/api/hataListesi',(req,res) =>{
       res.send(JSON.stringify(HataListesi.mevcutHatalar()));
     })



}