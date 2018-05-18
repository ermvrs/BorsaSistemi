
var EmirListele = function (Database,Parite,Side,callback) {

Database.selectDB('eslestirme',Parite,{ side: Side} , (res) =>{
callback(res);
})
}
module.exports = {
    EmirListele
}