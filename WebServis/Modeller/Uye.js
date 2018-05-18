const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt'),
      SALT_WORK_FACTOR = 10,
      SALT = '$2b$10$i2JOfyr3t.sBmeuZsRGywu',
      request = require('request');

var Uye = new Schema({
        seq: {
            type: Number,
            unique: true,
        },
        email: { 
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
       },
       isim: {
           type: String,
           unique: false
       },
       sifre: {
           type: String,
           required: true
       },
       tl:  {
           type: Number,
           default: 0.00
       },
       btc:  {
           type: Number,
           default: 0.00000000
       },
       ltc: {
           type: Number,
           default: 0.00000000
       },
       bch: {
           type: Number,
           default: 0.00000000
       }
})
var UyeModel = mongoose.model('Uye',Uye);


Uye.pre('save',function(next) {
    var user = this;
    UyeModel.find({email: user.email},function(err,docs){
        if(!docs.length){
            if (!user.isModified('sifre')) return next();
            // hash the password using our new salt
            bcrypt.hash(user.sifre, SALT, function(err, hash) {
                if (err) return next(err);
                // override the cleartext password with the hashed one
                user.sifre = hash;
                var seq = 1;
                UyeModel.find({},function (err,resp){
                    if(err) throw err;
                    seq = resp.length + 1;
                    user.seq = seq;
                    //Bakiye Oluştur
                    request.post({
                        url:     'http://localhost:8080/bakiyeBaslangici/',
                        headers: {'content-type' : 'application/x-www-form-urlencoded'},
                        json: true,
                        form: {seq: user.seq}
                      }, function(error, response, body){
                        console.log(body);
                        //socket.EmirleriGuncelle();
                        next();
                      });

                })

            });
            
        }else {
            next(new Error("E-Posta Kayıtlı"));
        }
    });

})

Uye.statics.sifreHash = function(sifre,callback){

    bcrypt.hash(sifre,SALT,function(err,hash) {
        if(err) throw err;
        callback(hash);
    })
}

Uye.methods.sifreKarsilastir = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

Uye.methods.sifreGuncelle = function(yeniSifre,callback){

    Uye.sifreHash(yeniSifre,function(hash) {
       this.Uye.sifre = hash;
       this.Uye.save();
       callback();
    })
}

module.exports = UyeModel;

