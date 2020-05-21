function DimMedicamentoService(){
}

DimMedicamentoService.prototype.enviaReceitaMedicaDim = function(cabecalho, medicamentos, url){    
    var Client = require('node-rest-client').Client;
    var client = new Client();
    
    return new Promise((resolve, reject) => {
        let template = `ano={{ano}}&unidade={{unidade}}&cidade={{cidade}}&paciente={{paciente}}&prescritor={{prescritor}}
        &id_mandado_judicial={{id_mandado_judicial}}&id_login={{id_login}}&id_paciente={{id_paciente}}&id_unidade_sistema={{id_unidade_sistema}}
        &num_controle={{num_controle}}&itens_receita={{itens_receita}}`;
    
        var itemReceita = "";
    
        medicamentos.forEach(item => {        
            itemReceita += item.idMaterialDim + ",";
            itemReceita += item.id_estoque + ",";
            itemReceita += item.qtde_lote + ",";
            itemReceita += item.qtde_prescrita + ",";
            itemReceita += item.tempo_tratamento + ",";
            itemReceita += item.qtde_anterior + ",";
            itemReceita += item.qtde_dispensada + ",";
            itemReceita += item.rec_controlada + ",";
            itemReceita += item.id_autorizador + ",";
            itemReceita += item.obs + "|";
        });
    
        itemReceita = itemReceita.replace(/.$/,"")
    
        var consulta = template
                 .replace(/{{ano}}/g, cabecalho.ano)  	
                 .replace(/{{unidade}}/g, cabecalho.unidade)
                 .replace(/{{cidade}}/g, cabecalho.cidade)
                 .replace(/{{paciente}}/g, cabecalho.paciente)
                 .replace(/{{prescritor}}/g, cabecalho.prescritor)
                 .replace(/{{id_mandado_judicial}}/g, cabecalho.id_mandado_judicial)
                 .replace(/{{id_login}}/g, cabecalho.id_login)
                 .replace(/{{id_paciente}}/g, cabecalho.id_paciente)
                 .replace(/{{id_unidade_sistema}}/g, cabecalho.id_unidade_sistema)
                 .replace(/{{num_controle}}/g, cabecalho.num_controle)
                 .replace(/{{itens_receita}}/g, itemReceita);
    
    
        console.log("Comando que será enviado" +  consulta);   
    
        client.get(url.VALOR + consulta, function (data, res) {    
            if(Buffer.isBuffer(data)){
                data = data.toString('utf8');                
            }
            resolve({data: data, status: res.statusCode});                
        });
    });
}

module.exports = function(){
    return DimMedicamentoService;
}