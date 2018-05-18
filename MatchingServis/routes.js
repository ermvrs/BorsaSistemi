var bodyParser = require('body-parser');
const Emir = require('./Modeller/Emir');
const EmirListesi = require('./Eslestirme/EmirListesi');
const EmirSirala = require('./Eslestirme/EmirSirala');
const EmirEslestir = require('./Eslestirme/EmirEslestir');
const BakiyeSirala = require('./Bakiye/BakiyeDagit');
module.exports = function(app,mongo) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.get("/", function (req, res) {
  
        res.send("WebServer Node.js ErmVrs - Fonksiyonlarda GET kullanmayın. Kullanırsanız cevap hata gelir");
    });

    //mongo db bağlantısı
    //logger örnek -> logger.logEkle("Bilgi", "Sunucu Açıldı");
    //bitcoin routes
    app.post('/test/', (req,res) => {
     
        var obj = new Emir(req.body.seq,req.body.miktar,req.body.kur,req.body.side,req.body.paratipi,req.body.islemtipi);
        EmirSirala.EmirEkle(obj);
        console.log(JSON.stringify(obj));
        res.send(JSON.stringify( { sonuc : parseFloat(obj.kur * obj.miktar).toFixed(2)}));
    
    })
    app.post('/emirekle/', (req,res) => {
        var obj = new Emir(req.body.userid,req.body.miktar,req.body.kur,req.body.side,req.body.paratipi);
        mongo.insertDB('eslestirme','btctry',obj,(err,resx) => {
            if(err) throw err;
            console.log(resx)
        })
        res.send('Emir Veritabanına Girildi.');
    })
    app.post('/liste/', (req,res) => {
       if(req.body.apiKey != 'TESTAPI')
       {
           res.send("Yanlış Api Key");
       }
      var Emirler =  EmirListesi.EmirListele(mongo,'btctry',req.body.side,(resp) => {
       console.log(JSON.stringify(resp))
       console.log('Emir Sayısı : ' + resp.length)
       res.send(JSON.stringify(resp));
      });
    })
    app.get('/btctry/satis/' , (req,res) => {
        var Emirler = EmirListesi.EmirListele(mongo,'btctry',1,(resp) =>{
            res.send(JSON.stringify(resp));
        })
    })
    app.get('/btctry/alis/' , (req,res) => {
        
        var Emirler = EmirListesi.EmirListele(mongo,'btctry',0,(resp) =>{
            res.send(JSON.stringify(resp));
        })
    })
    app.get('/view/liste/' , (req,res) =>{
        res.sendFile('./Web/liste/liste.html', { root : __dirname});
    })
    
        

};