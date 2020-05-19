function Mail() {
}


Mail.prototype.sendMail = function (usuario, urlEmail, urlSenha, _subject, _html) {

    'use strict';
    const nodemailer = require('nodemailer');
    const fs = require('fs');

    var config = require('config');
    const SERVER_URL = config.get('urlApi');

    const transporter = nodemailer.createTransport({
        host: "smtp.icconsulting.com.br",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: urlEmail.VALOR,
            pass: urlSenha.VALOR
        },
        tls: { rejectUnauthorized: false }
    });

    fs.readFile(__dirname + '/../templates/' + _html, "utf8", function (err, html) {
        var day = new Date();
        var year = day.getFullYear();

        var template = html;


        var htmlResult = template.replace(/{{nome}}/g, usuario.nome).replace(/{{ano}}/g, year).replace(/{{email}}/g, usuario.email).replace(/{{SERVER_URL}}/g, SERVER_URL).replace(/{{TOKEN}}/g, usuario.hash).replace(/{{PASSWORD}}/g, usuario.generatedPassword);

        var mailOptions = {
            from: '"E-ATENDE" <' + urlEmail.VALOR + '>',
            to: usuario.email,
            subject: _subject,
            html: htmlResult
        };

        transporter.sendMail(mailOptions, function (error, response) {
            console.log('enviando email de boas vindas..');

            if (error) {
                console.log(error);
            }
        });
    });
}

Mail.prototype.enviaEmailFicha = function (obj, urlEmail, urlSenha, _subject, _html) {

    console.log('testeficha');
    'use strict';
    const nodemailer = require('nodemailer');
    const fs = require('fs');

    var config = require('config');
    const SERVER_URL = config.get('urlApi');

    const transporter = nodemailer.createTransport({
        host: "smtp.icconsulting.com.br",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: urlEmail.VALOR,
            pass: urlSenha.VALOR
        },
        tls: { rejectUnauthorized: false }
    });

    fs.readFile(__dirname + '/../templates/' + _html, "utf8", function (err, html) {
        var day = new Date();
        var pad = "00";
        var today = "" +day.getDate();
        var dia = pad.substring(0, pad.length - today.length) + today;
        var year = day.getFullYear();
        var month = new Array();

        month[0] = "01";
        month[1] = "02";
        month[2] = "03";
        month[3] = "04";
        month[4] = "05";
        month[5] = "06";
        month[6] = "07";
        month[7] = "08";
        month[8] = "09";
        month[9] = "10";
        month[10] = "11";
        month[11] = "12";
        var mountA = month[day.getMonth()];
        day.setHours(day.getHours() - 3);
        var time = day.getHours() + ":" + day.getMinutes();



        var template = html;


        var htmlResult = template
            .replace(/{{idAtendimento}}/g, obj.id)
            .replace(/{{dataAbertura}}/g, dia + "/" + mountA + "/" + year)
            .replace(/{{ano}}/g, year)
            .replace(/{{hora}}/g, time);

        var mailOptions = {
            from: '"E-ATENDE" <' + urlEmail.VALOR + '>',
            to: obj.email ,
            bcc: '' + obj.emailProfissional + '' ,
            subject: _subject,
            html: htmlResult
        };

        transporter.sendMail(mailOptions, function (error, response) {
            console.log('enviando email de boas vindas..');

            if (error) {
                console.log(error);
            }
        });
    });
}

module.exports = function () {
    return Mail;
}