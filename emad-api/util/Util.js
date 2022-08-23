

function Util() { }


var config = require('../config/config');

Util.prototype.URL_SERVER = config.urlApi;
Util.prototype.SUPER_ADMIN = config.superAdmin;
Util.prototype.ADMIN = config.admin;
Util.prototype.CONSULTA = config.consulta;

Util.prototype.dateToISO = function (str) {
    var newData = str.split("/");
    return newData[2] + "-" + newData[1] + "-" + newData[0];
}
Util.prototype.dateTimeToISO = function (str) {
    var newData = str.split("/");
    var newHours = newData[2].split(" ");
    return newHours[0] + "-" + newData[1] + "-" + newData[0] + " " + newHours[1];
}


Util.prototype.cpfValido = function (str) {
    var CPF = require("cpf_cnpj").CPF;

    if (CPF.isValid(str)) {
        return true;
    }
    else {
        return false;
    }
}

Util.prototype.cartaoSUSValido = function (str) {

    const vetNumero = str.split('')
    if (str.match(/[1-2]\d{10}00[0-1]/) || str.match(/[7-9]\d{14}/))
        return vetNumero.reduce((soma, valor, indice) =>
            soma + parseInt(valor) * (15 - indice), 0) % 11 === 0

    return false
}

Util.prototype.customError = function (errors, field, message, value) {
    if (errors == false) {
        errors = [];
    }

    var error = {};
    error.location = "body";
    error.param = field;
    error.msg = message;
    error.value = value;
    errors.push(error);
    return errors;
}

Util.prototype.isValidDate = function (value) {

    value = Util.prototype.dateToISO(value);
    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

    const date = new Date(value);
    if (!date.getTime()) return false;
    return date.toISOString().slice(0, 10) === value;
}

Util.prototype.hashPassword = function (pwd) {
    var bcrypt = require('bcrypt');
    var hash = bcrypt.hashSync(pwd, 10);
    return hash;
}

Util.prototype.checkPassword = function (pwd, hash) {

    var bcrypt = require('bcrypt');
    return bcrypt.compareSync(pwd, hash);
}

Util.prototype.createWebToken = function (app, req, usuario) {

    let jwt = require('jsonwebtoken');
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let userAgent = req.headers['user-agent'];
    let host = req.headers['host'];

    let payload = {
        usuario: { id: usuario.id, idTipoUsuario: usuario.idTipoUsuario, ep: usuario.expiredPassword },
        host: host,
        ip: ip,
        userAgent: userAgent
    };

    let token = jwt.sign(payload, app.settings.superSecret, {
        expiresIn: 180 * 60 * 1  // expires in seconds
        //expiresIn: 60  // expires in seconds
    });
    var datetime = new Date();
    console.log('Criou token do usuário: ' + usuario.id + ', at: ' + datetime + ', token: ' + token);
    return token;
}

Util.prototype.createHashEmail = function (email) {
    var hash = "";

    for (var i = email.length; i > 0; --i)
        hash += (Math.floor(Math.random() * 256)).toString(16);

    return hash;
}

Util.prototype.makeDirectory = function (dir) {
    var fs = require('fs');

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

module.exports = function () {
    return Util;
};


