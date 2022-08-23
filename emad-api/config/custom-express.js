var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var cors = require('cors');
const config = require('./config');

module.exports = function () {
    var app = express(); 

    app.set('superSecret', 'ed281fe0f84dceef9a11e89f9159046c'); // usado para gerar o token no JWT
    app.use(bodyParser.json({ limit: "5mb", extended: true }));
    app.use(bodyParser.urlencoded({ limit: "5mb", extended: true, parameterLimit:5000 }));
    app.use(expressValidator());
    app.use(cookieParser());
    app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(express.static(__dirname + '/../img/'));
    app.use('/fotos', express.static(`${config.folderUpload}`));

    app.options('*', cors());

    consign().include('middlewares/Cors.js')
        .then('controllers/public')
        .then('middlewares/AutenticacaoRotas.js')
        .then('controllers/private')
        .then('cache')
        .then('dao')
        .then('util')
        .then('services')
        .then('cron')
        .into(app);

    return app;
}