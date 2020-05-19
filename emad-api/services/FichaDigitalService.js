const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function FichaDigitalService() {
}

FichaDigitalService.prototype.enviaFicha = function (obj, url, callback) {    
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
        
        var guid =  uuidv4();
        var arquivoCompleto = __dirname + '/../xml/file-' + guid + '.xml';

        fs.writeFile(arquivoCompleto, htmlResult, (err) => {
            if (err) throw err;

            var FormData = require('form-data');
            var form = new FormData();
            form.append('userName', 'admin');
            form.append('password', 'admin');
            form.append('action', 'print');
            form.append('xmlFile', fs.createReadStream(arquivoCompleto));            

            form.submit(url.VALOR, function (err, res) {
                callback(res.statusCode);  
                fs.unlinkSync(arquivoCompleto);     
            });
        });
    });
}

module.exports = function () {
    return FichaDigitalService;
}
