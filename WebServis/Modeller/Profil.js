const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt'),
      SALT_WORK_FACTOR = 10,
      SALT = '$2b$10$i2JOfyr3t.sBmeuZsRGywu';

var Profil = new Schema({
    email: {
        type: String,
        required: true
    },
    sifre: {
        type: String,
        required: true
    }
});

Profil.methods.SifreHash = function (sifre,callback){
    bcrypt.hash(sifre,SALT,function(err,hash) {
        if(err) throw err;
        callback(hash);
    })
}

module.exports = mongoose.model('Profil',Profil);