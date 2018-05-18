const bcrypt = require('bcrypt'),
      SALT = '$2b$10$i2JOfyr3t.sBmeuZsRGywu';

var Kriptola = function(sifre,callback){
    if(typeof sifre !== 'undefined' && sifre) {
        if(sifre.length > 0)
        {
           bcrypt.hash(sifre,SALT,function(err,hash) {
           if(err) throw err;
           callback(hash);
           });
        } else { callback(null); }
    } else {
        callback(null)
    }
}

module.exports = {Kriptola};