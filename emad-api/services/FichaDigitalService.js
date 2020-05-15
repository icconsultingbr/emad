function FichaDigitalService() {
}

FichaDigitalService.prototype.enviaFicha = function (obj, url, callback) {    
    const fs = require('fs');
    fs.readFile(__dirname + '/../xml/pattern.xml', "utf8", function (err, html) {        
       
        var template = html;  
        var htmlResult = template
            .replace(/{{codigo_estabelecimento}}/g, obj.idEstabelecimento)  	
            .replace(/{{data_atendimento}}/g, obj.dataAtendimento)
            .replace(/{{data_nascimento_paciente}}/g, obj.dataNascimento)
            .replace(/{{hora_atendimento}}/g, obj.hora_atendimento)
            .replace(/{{idade_paciente}}/g, obj.idade)
            .replace(/{{municipio_paciente}}/g, obj.nomeMunicipio)
            .replace(/{{nome_paciente}}/g, obj.nome)
            .replace(/{{numero_atendimento}}/g, obj.idAtendimento)
            .replace(/{{numero_sus}}/g, obj.cartaoSus)
            .replace(/{{sexo_paciente}}/g, obj.sexo);

        fs.writeFile(__dirname + '/../xml/pattern2.xml', htmlResult, (err) => {
            if (err) throw err;

            var FormData = require('form-data');
            var form = new FormData();
            form.append('userName', 'admin');
            form.append('password', 'admin');
            form.append('action', 'print');
            form.append('xmlFile', fs.createReadStream(__dirname + '/../xml/pattern2.xml'));

            //console.log(fs.createReadStream(__dirname +'/../xml/pattern.xml').toString());

            form.submit(url.VALOR, function (err, res) {
                callback(res.statusCode);                
            });
        });
    });







}




module.exports = function () {
    return FichaDigitalService;
}
