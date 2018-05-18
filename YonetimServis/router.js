const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
var request = require('request');
module.exports = (app,mongo) =>
{
    app.use(express.static(__dirname + '/Yonetim'));
    app.use(cookieParser());
    app.use(session({ secret: 'AdminTestScr' }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}) );

    app.get('/admin/test',(req,res) =>{
        if(req.session.auth)
        {
           switch(parseInt(req.session.authLevel))
           {
               case 1:
               res.send('Destek Ekibi')
               break;
               case 2:
               res.send('Hesap Onaylama Yetkilisi')
               break;
               case 3:
               res.send('Bakiye Düzenleme Yetkisi')
               break;
               case 4:
               res.send('SuperAdmin')
               break;
               default:
               res.send('Bir yetki yok')
               break;
           }
        } else {
            res.send(JSON.stringify({ durum : 'Giriş Yapılmamış'}))
        }
    })
}