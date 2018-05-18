const logFile = ('./log.txt');
const fs = require('fs');
//NodeJS Logger ErmVrs
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}
function log(tip,data) {
    this.tip = tip;
    this.data = data;
}
var logEkle = (tip,data) =>{
  fs.appendFile(logFile,"[" + new Date().toJSON() + "] Tip : ["+ tip + "] İçerik : {" + data + "} \r\n",(err) => {
      if(err)
      {
      console.error("Log Yazma Hatası : " + err);
      }
  })
}

module.exports = {logEkle};