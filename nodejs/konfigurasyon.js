const bitcoinRPC = {
    host: '213.128.67.134',
    port: 18333,
    user: 'test',
    pass: 'testt'
};
const clubcoinRPC = {
    host: '213.128.67.134',
    port: 8332,
    user: 'test',
    pass: 'testt'
};
const bitcoincashRPC = {
    host: '213.128.67.134',
    port : 8333,
    user : 'test',
    pass: 'testt'
}


const logger = true; // dbye eklenen ve çıkarılan işlemleri tarihiyle log dosyasına kaydedecek.
const testMode = false;
const ApiGuvenligi = false; //Doğru yaptığında api key harici gelen verileri kabul etmiyor.
const ApiKey = "test123";

const IPGuvenligi = true;
const izinliIPListesi = [
'127.0.0.1',
'213.128.67.134'
];

// eğer request yukarıdaki ip adreslerinden biriyle yapılmazsa işlem yapma.

module.exports = {
    bitcoinRPC,
    bitcoincashRPC,
    clubcoinRPC,
    testMode,
    logger,
    ApiGuvenligi,
    ApiKey,
    IPGuvenligi,
    izinliIPListesi
};