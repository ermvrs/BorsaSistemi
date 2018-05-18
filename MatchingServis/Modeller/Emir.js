
function Emir(seq,miktar,kur,side,paratipi,islemtipi) {
 // islem tipi 0-> emir girme , 1 -> emir silme
 var obj = {};
 obj.seq= parseInt(seq);
 obj.islemtipi = parseInt(islemtipi);
 obj.miktar = parseFloat(parseFloat(miktar).toFixed(8));
 obj.kur= parseFloat(parseFloat(kur).toFixed(2));
 obj.side = parseInt(side);
 obj.paratipi = parseInt(paratipi);
 return obj;
}
module.exports = Emir;