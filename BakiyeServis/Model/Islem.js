
function Bakiye(seq,paratipi,miktar,degisim,emir,islemtipi) {
    /*
    islemtipi 
    0 -> Emir Girme      -> Emir Gerekli
    1 -> Emir Eşleşme Bakiye Dağıtımı
    2 -> Emir Silme
    3 -> Deposit
    4 -> Withdraw
    5 -> Yonetim (Yönetim Panelinden Yapılan değişimler.)
    */
    var obj = {};
    obj.emir = {};
    if(emir)
    {
        //obj.emir = emir;
        obj.emir.seq = parseInt(emir.seq);
        obj.emir.paratipi = parseInt(emir.paratipi);
        obj.emir.side = parseInt(emir.side);
        obj.emir.miktar = parseFloat(emir.miktar);
        obj.emir.kur = parseFloat(emir.kur);
        obj.emir.islemtipi = 0; // emir ekleme
    }
    obj.seq = parseInt(seq);
    obj.islemtipi = parseInt(islemtipi);
    if(obj.islemtipi == 2)
    {
        obj.emir.islemtipi = 1; //emir silme
    }
    obj.paratipi = parseInt(paratipi);
    //degisim 1 artar , 0 azalır
    if(obj.paratipi == 0)
    {
        obj.miktar = parseFloat(parseFloat(miktar).toFixed(2));
        obj.degisim = parseInt(degisim);
        return obj;
    } else {
        obj.miktar = parseFloat(parseFloat(miktar).toFixed(8));
        obj.degisim = parseInt(degisim);
        return obj;
    }

}
module.exports = Bakiye;