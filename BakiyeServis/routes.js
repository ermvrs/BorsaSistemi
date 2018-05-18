var bodyParser = require('body-parser');
const BakiyeSirala = require('./Bakiye/BakiyeSirala');
const Islem = require('./Model/Islem');
module.exports = function(app,mongo) {
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.get("/", function (req, res) {
  
        res.send("Bakiye Sunucusu -- Erim VARIŞ");
    });
    app.post('/islemEkle', (req,res)=>{
       // burada bakiye işlemi eklenecek
       let islem = new Islem(req.body.seq,req.body.paratipi,req.body.miktar,req.body.degisim,req.body.emir,req.body.islemtipi)
       console.log(JSON.stringify(islem));
       BakiyeSirala.BakiyeEkle(islem);
       res.send('Sıraya Eklendi')
    })
    app.post('/islemListele', (req,res) =>{
        res.send(JSON.stringify(BakiyeSirala.MevcutListe()));
    })
    app.post('/islemEkleYeni',(req,res) =>{
        let islem = new Islem(req.body.seq,req.body.paratipi,req.body.miktar,req.body.degisim,req.body.emir,req.body.islemtipi);
        BakiyeSirala.BakiyeEkle(islem);
        res.send('İşlem Sıralandı.')
    })
    app.post('/preBakiyeKontrol',(req,res) =>{
        console.log('BakiyeKOntrol')
        console.log(JSON.stringify(req.body))
        // req.body -> miktar, paratipi, seq
        mongo.selectOneDB('BakiyeServis','bakiyeler',{
            seq: parseInt(req.body.seq)
        },(resp)=>{
               switch(parseInt(req.body.paratipi))
               {
                   case 0:
                    // böyle bir ihtimal yok
                   if(resp.tl >= req.body.miktar)
                   {
                       res.send(JSON.stringify({sonuc : true}));
                   } else {
                    res.send(JSON.stringify({sonuc : false}));
                   }
                   break;
                   case 1:
                   if(parseInt(req.body.side) == 1 && resp.btc >= req.body.miktar || parseInt(req.body.side) == 0 && resp.tl >= req.body.miktar)
                   {
                    res.send(JSON.stringify({sonuc : true}));
                   } else {
                    res.send(JSON.stringify({sonuc : false}));
                   }
                   break;
                   case 2:
                   if(parseInt(req.body.side) == 1 && resp.ltc >= req.body.miktar || parseInt(req.body.side) == 0 && resp.tl >= req.body.miktar)
                   {
                    res.send(JSON.stringify({sonuc : true}));
                   } else {
                    res.send(JSON.stringify({sonuc : false}));
                   }
                   break;
                   case 3:
                   if(parseInt(req.body.side) == 1 && resp.bch >= req.body.miktar || parseInt(req.body.side) == 0 && resp.tl >= req.body.miktar)
                   {
                    res.send(JSON.stringify({sonuc : true}));
                   } else {
                    res.send(JSON.stringify({sonuc : false}));
                   }
                   break;
                   default:
                   res.send('Geçersiz Paratipi')
                   break;
               }
        });
    })
    app.post('/bakiyeBaslangici',(req,res) =>{
        //Yeni Oluşturulan üyelikler için buraya SEQ göndererek bakiye girişlerini yapabiliriz.
        mongo.insertDB('BakiyeServis','bakiyeler',{
            seq: parseFloat(req.body.seq),
            tl: parseFloat(parseFloat(0.00).toFixed(2)),
            btc: parseFloat(parseFloat(0.00000000).toFixed(8)),
            ltc: parseFloat(parseFloat(0.00000000).toFixed(8)),
            bch: parseFloat(parseFloat(0.00000000).toFixed(8))
        },(response) =>{
            mongo.insertDB('BakiyeServis','cuzdanlar',{
                seq: parseFloat(req.body.seq),
                tl_dep : 0,
                tl_with : 0,
                tl_total : 0,
                btc_dep: 0,
                btc_with: 0,
                btc_total: 0,
                ltc_dep: 0,
                ltc_with: 0,
                ltc_total: 0,
                bch_dep: 0,
                bch_with: 0,
                bch_total: 0
            },(responsex) => {
                res.send('Cüzdan ve Bakiye Oluşturuldu.')
            })
        })
    })

    app.post('/bakiyeGetir',(req,res) =>{
        mongo.selectOneDB('BakiyeServis','bakiyeler',{ seq: parseInt(req.body.seq) },(response) =>{
            if(!response) 
            {
            res.send(JSON.stringify({ error: 'noseq'}));
            } else {
                res.send(JSON.stringify(response));
            }

        })
    })
};