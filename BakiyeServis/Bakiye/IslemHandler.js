
var islemSira = require('./BakiyeSirala');
var Konfig = require('../konfigurasyon');
var request = require('request');
var IslemHandle = function(Database) {
    var SiradakiIslem = islemSira.BakiyeCikarCikaniDondur();
    if(!SiradakiIslem) 
    {
        console.log("Sırada İşlem Yok");
        setTimeout(() => {
            IslemHandle(Database)
        },500);
     } else {
    //burada sıradaki emri bir kere eşleştir ve miktarını güncelle sonra onu tekrar yeni miktarıyla listeye at eğer miktar kaldıysa.
    IsleNew(SiradakiIslem,Database,IslemHandle);
    }
}
// Hata Çıkarsa switchten çıkıp ıkmyıormu bak
var IsleNew = function(Islem,Database,callback) {
    console.log('İşleme Başladı')
    switch(Islem.islemtipi)
    {
        case 0:
        // Emir Girme
        console.log(JSON.stringify(Islem));
        console.log('EMir GİRME')
            Database.selectOneDB('BakiyeServis','bakiyeler',{
                seq: Islem.seq
            },(res) =>{
                if(Islem.emir.side == 1)
                {
                    console.log('Satış Emri')
                    // Satış Emri Parabiriminden azalacak
                    switch(Islem.emir.paratipi){
                        case 1:
                        if(res.btc >= Islem.emir.miktar)
                        {
                            Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ btc : - parseFloat(parseFloat(Islem.emir.miktar).toFixed(8))},(cevap) =>{
                                console.log(cevap)
                                // Emri İşleme Gönder
                                request.post({
                                    url:     'http://localhost:8081/test/',
                                    headers: {'content-type' : 'application/x-www-form-urlencoded'},
                                    json: true,
                                    form: Islem.emir
                                  }, function(error, response, body){
                                    console.log(body);
                                    //
                                    // --> Buralara Log Ekle
                                  });
                            })
                        } else {
                            console.log('Bakiye Yetersiz')
                        }
                        break;
                        case 2:
                        if(res.ltc >= Islem.emir.miktar)
                        {
                            Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ ltc : - parseFloat(parseFloat(Islem.emir.miktar).toFixed(8))},(cevap) =>{
                                console.log(cevap)
                                // Emri İşleme Gönder
                                request.post({
                                    url:     'http://localhost:8081/test/',
                                    headers: {'content-type' : 'application/x-www-form-urlencoded'},
                                    json: true,
                                    form: Islem.emir
                                  }, function(error, response, body){
                                    console.log(body);
                                    //
                                    // --> Buralara Log Ekle
                                  });
                            })
                        } else {
                            console.log('Bakiye Yetersiz')
                        }
                        break;
                        case 3:
                        if(res.bch >= Islem.emir.miktar)
                        {
                            Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ bch : - parseFloat(parseFloat(Islem.emir.miktar).toFixed(8))},(cevap) =>{
                                console.log(cevap)
                                // Emri İşleme Gönder
                                request.post({
                                    url:     'http://localhost:8081/test/',
                                    headers: {'content-type' : 'application/x-www-form-urlencoded'},
                                    json: true,
                                    form: Islem.emir
                                  }, function(error, response, body){
                                    console.log(body);
                                    //
                                    // --> Buralara Log Ekle
                                  });
                            })
                        } else {
                            console.log('Bakiye Yetersiz')
                        }
                        break;
                        default:
                        break;
                    }

                } else {
                    console.log('AlIŞ EMRİ')
                    // Alış Emri TL azalacak
                    if(res.tl >= parseFloat(Islem.emir.miktar) * parseFloat(Islem.emir.kur))
                    {
                        // Bakiye Yeterli
                        Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ tl : - (parseFloat(Islem.emir.miktar) * parseFloat(Islem.emir.kur))},(cevap) =>{
                            console.log(cevap)
                            // Emri İşleme Gönder
                            request.post({
                                url:     'http://localhost:8081/test/',
                                headers: {'content-type' : 'application/x-www-form-urlencoded'},
                                json: true,
                                form: Islem.emir
                              }, function(error, response, body){
                                console.log(body);
                                //
                                // --> Buralara Log Ekle
                              });
                        })
                    }

                }
            })
        break;
        case 1:
        // Emir Eşleşme Bakiye Dağıtımı
        // paratipi hep 0 gelmeli
        // emirin içi burada -> miktar,paratipi,seq olacak
        Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ tl : parseFloat(parseFloat(Islem.emir.miktar).toFixed(2))},(cevap) =>{
            console.log('TL Verildi')
            switch(Islem.emir.paratipi)
            {
                case 1:
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.emir.seq},{ btc : parseFloat(parseFloat(Islem.emir.miktar).toFixed(8))},(cevap) =>{
                    console.log('BTC Verildi')
                })
                break;
                case 2:
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.emir.seq},{ ltc : parseFloat(parseFloat(Islem.emir.miktar).toFixed(8))},(cevap) =>{
                    console.log('LTC Verildi')
                })
                break;
                case 3:
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.emir.seq},{ bch : parseFloat(parseFloat(Islem.emir.miktar).toFixed(8))},(cevap) =>{
                    console.log('LTC Verildi')
                })
                break;
                default:
                break;
            }
        })
        
        break;
        case 2:
        // Emir Silme Bakiye Geri Dönüşü
        // burada bakılan veri sadece Emirin içinde olanlar
        console.log('EMir silme')
        if(Islem.emir.side == 0)
        {
            // alış emri ise adama tl vericez
            Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.emir.seq},{ tl : (parseFloat(Islem.emir.miktar) * parseFloat(Islem.emir.kur))},(cevap) =>{
                console.log('Emri Silinene bakiyesi verildi.')
            })
        } else {
            switch(Islem.emir.paratipi)
            {
                case 1:
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.emir.seq},{ btc : Islem.emir.miktar},(cevap) =>{
                    console.log('BTC Verildi')
                })
                break;
                case 2:
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.emir.seq},{ ltc : Islem.emir.miktar},(cevap) =>{
                    console.log('LTC Verildi')
                })
                break;
                case 3:
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.emir.seq},{ bch : Islem.emir.miktar},(cevap) =>{
                    console.log('LTC Verildi')
                })
                break;
                default:
                break;
            }
        }
        break;
        case 3:
        // Para Yatırma
        switch(Islem.paratipi)
        {
            // LOG EKLE
            case 0:
            Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ tl : Islem.miktar},(cevap) =>{
                console.log("DEPOSIT TL")
            })
            break;
            case 1:
            Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ btc : Islem.miktar},(cevap) =>{
                console.log("DEPOSIT BTC")
            })
            break;
            case 2:
            Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ ltc : Islem.miktar},(cevap) =>{
                console.log("DEPOSIT LTC")
            })
            break;
            case 3:
            Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ bch : Islem.miktar},(cevap) =>{
                console.log("DEPOSIT BCH")
            })
            break;
        }
        break;
        case 4:
        // Para Çekme
        // Burası Yapılacak -> Hangi Adrese göndereceğini kontrol ettir.
        Database.selectOneDB('BakiyeServis','bakiyeler',{
            seq: Islem.seq
        },(res) =>{
            switch(Islem.paratipi)
            {
                case 0:
                if(res.tl >= Islem.miktar)
                {
                    Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ tl : - Islem.miktar},(cevap) =>{
                        console.log('Withdraw Yapıldı[TL]')
                    })
                } else {
                    console.log('Withdraw için yetersiz TL')
                }
                break;
                case 1:
                if(res.btc >= Islem.miktar)
                {
                    Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ btc : - Islem.miktar},(cevap) =>{
                        console.log('Withdraw Yapıldı[BTC]')
                    })
                } else {
                    console.log('Withdraw için yetersiz BTC')
                }
                break;
                case 2:
                if(res.ltc >= Islem.miktar)
                {
                    Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ ltc : - Islem.miktar},(cevap) =>{
                        console.log('Withdraw Yapıldı[LTC]')
                    })
                } else {
                    console.log('Withdraw için yetersiz LTC')
                }
                break;
                case 3:
                if(res.bch >= Islem.miktar)
                {
                    Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ bch : - Islem.miktar},(cevap) =>{
                        console.log('Withdraw Yapıldı[BCH]')
                    })
                } else {
                    console.log('Withdraw için yetersiz BCH')
                }
                break;
                default:
                break;
            }
        });
        break;
        case 5:
        // Yönetimden Eklenen Bakiye, direk işleme sok ve log tut
        switch(Islem.paratipi){
            case 0:
            if(Islem.degisim == 0)
            {
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ tl : Islem.miktar},(cevap) =>{
                    console.log("Yönetim TL Arttırma")
                })
            } else {
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ tl : - Islem.miktar},(cevap) =>{
                    console.log("Yönetim TL Azaltma")
                })
            }
            break;
            case 1:
            if(Islem.degisim == 0)
            {
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ btc : Islem.miktar},(cevap) =>{
                    console.log("Yönetim BTC Arttırma")
                })
            } else {
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ btc : - Islem.miktar},(cevap) =>{
                    console.log("Yönetim BTC Azaltma")
                })
            }
            break;
            case 2:
            if(Islem.degisim == 0)
            {
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ ltc : Islem.miktar},(cevap) =>{
                    console.log("Yönetim LTC Arttırma")
                })
            } else {
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ ltc : - Islem.miktar},(cevap) =>{
                    console.log("Yönetim LTC Azaltma")
                })
            }
            break;
            case 3:
            if(Islem.degisim == 0)
            {
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ bch : Islem.miktar},(cevap) =>{
                    console.log("Yönetim BCH Arttırma")
                })
            } else {
                Database.bakiyeArtir('BakiyeServis','bakiyeler',{seq: Islem.seq},{ bch : - Islem.miktar},(cevap) =>{
                    console.log("Yönetim BCH Azaltma")
                })
            }
            break;
            default:
            break;
        }
        break;
        default:
        break;
    }
    console.log('İşlem Bitti')
    callback(Database)
}

var Isle = function(Islem,Database,callback) {
    if(Islem.degisim == 0)
    {
    Database.selectOneDB(Konfig.dbName,Konfig.collName,{
      seq: Islem.seq
    },(response) =>{
        switch(Islem.paratipi){
            
            case 0:
            console.log(JSON.stringify(response))
            console.log(JSON.stringify(Islem))
            if(response.tl >= Islem.miktar)
            {
                console.info('İşleme Bakiye Yeterli.');
                Database.bakiyeArtir(Konfig.dbName,Konfig.collName,{seq: Islem.seq},{ tl : - Islem.miktar},(cevap) =>{
                    console.table(cevap)
                })
            } else {
                console.error('Bakiye Yetersiz');
            }
            break;
            case 1:
            if(response.btc >= Islem.miktar)
            {
                console.info('İşleme Bakiye Yeterli.');
                Database.bakiyeArtir(Konfig.dbName,Konfig.collName,{seq: Islem.seq},{ btc : - Islem.miktar},(cevap) =>{
                    console.table(cevap)
                })
            } else {
                console.error('Bakiye Yetersiz');
                
            }
            break;
            case 2:
            if(response.ltc >= Islem.miktar)
            {
                console.info('İşleme Bakiye Yeterli.');
                Database.bakiyeArtir(Konfig.dbName,Konfig.collName,{seq: Islem.seq},{ ltc : - Islem.miktar},(cevap) =>{
                    console.table(cevap)
                })
            } else {
                console.error('Bakiye Yetersiz');
                
            }
            break;
            case 3:
            if(response.bch >= Islem.miktar)
            {
                console.info('İşleme Bakiye Yeterli.');
                Database.bakiyeArtir(Konfig.dbName,Konfig.collName,{seq: Islem.seq},{ bch : - Islem.miktar},(cevap) =>{
                    console.table(cevap)
                })
            } else {
                console.error('Bakiye Yetersiz');
            }
            break;
        }
        callback(Database)
        })
    } else {
        //Bakiye Arttır
        switch(Islem.paratipi)
        {
            case 0:
            Database.bakiyeArtir(Konfig.dbName,Konfig.collName,{seq: Islem.seq},{ tl : Islem.miktar},(cevap) =>{
                console.table(cevap)
            })
            break;
            case 1:
            Database.bakiyeArtir(Konfig.dbName,Konfig.collName,{seq: Islem.seq},{ btc : Islem.miktar},(cevap) =>{
                console.table(cevap)
            })
            break;
            case 2:
            Database.bakiyeArtir(Konfig.dbName,Konfig.collName,{seq: Islem.seq},{ ltc : Islem.miktar},(cevap) =>{
                console.table(cevap)
            })
            break;
            case 3:
            Database.bakiyeArtir(Konfig.dbName,Konfig.collName,{seq: Islem.seq},{ bch : Islem.miktar},(cevap) =>{
                console.table(cevap)
            })
            break;
            default:
            console.error('Hatalı Para tipi');
            break;
        }
        callback(Database);
    } 
}

module.exports = {
    Isle,IslemHandle
}