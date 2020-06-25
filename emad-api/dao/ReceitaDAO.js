function ReceitaDAO(connection) {
    this._connection = connection;
    this._table = `tb_receita`;
}

ReceitaDAO.prototype.salva = function(obj, callback) {
    const conn = this._connection;    
    let numeroNovo = {};

    conn.beginTransaction(function(err) {
        if (err) { throw err; }
        conn.query(`SELECT max(numero) as num FROM tb_receita where ano=? and idEstabelecimento=? FOR UPDATE`, [obj.ano, obj.idEstabelecimento], 
        
        function (error, numeroNovaReceita) {
            if (error) {return conn.rollback(function() {throw error;});}  

                numeroNovo = numeroNovaReceita[0].num ? numeroNovaReceita[0].num + 1 : 1;                    
                console.log('Max número' + numeroNovo);

                conn.query(`INSERT INTO tb_receita (idEstabelecimento, idUf, idMunicipio, idProfissional, idPaciente, 
                            idSubgrupoOrigem, ano, numero, dataEmissao, situacao, idUsuarioCriacao, dataCriacao)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                            [obj.idEstabelecimento, obj.idUf, obj.idMunicipio, obj.idProfissional,
                            obj.idPaciente, obj.idSubgrupoOrigem, obj.ano, numeroNovo, 
                            new Date(obj.dataEmissao), obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao], 
                                           
                function (error, novaReceita) {                    
                    if (error) {return conn.rollback(function() {console.log('Erro no update ' + error + conn.query);throw error;});}                        
                        console.log('Receita criada ' + JSON.stringify(numeroNovo));
                        conn.commit(                        
                    function(err) 
                        {if (err) {return conn.rollback(function() {throw err;});}
                        
                        console.log('Sucesso!');              
                        return callback(null,[novaReceita, numeroNovo]);             
                    });
                });
            });
        });        
}


ReceitaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET     
    idEstabelecimento = ?, idUf = ?, idMunicipio = ?, idProfissional = ?, idPaciente = ?, 
    idSubgrupoOrigem = ?, dataEmissao = ?, situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ?
    WHERE id= ?`, [obj.idEstabelecimento, obj.idUf, obj.idMunicipio, obj.idProfissional,
        obj.idPaciente, obj.idSubgrupoOrigem, new Date(obj.dataEmissao), obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, id],
        callback);
}

ReceitaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT                             
                            a.id
                            ,a.idEstabelecimento
                            ,estabelecimento.nomeFantasia nomeEstabelecimento
                            ,a.idMunicipio
                            ,municipio.nome nomeMunicipio
                            ,a.idProfissional
                            ,profissional.nome nomeProfissional
                            ,a.idPaciente
                            ,paciente.nome nomePaciente
                            ,a.idSubgrupoOrigem
                            ,subgrupoOrigem.nome nomeSubgrupoOrigem
                            ,a.ano
                            ,a.numero
                            ,a.dataEmissao
                            ,a.dataUltimaDispensacao
                            ,a.idMotivoFimReceita
                            ,a.idPacienteOrigem
                            ,pacienteOrigem.nome nomePacienteOrigem
                            ,a.idMandadoJudicial                            
                            ,a.situacao
                            ,a.idUf
                            ,CONCAT(municipio.nome,'/',uf.uf) textoCidade
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
                            INNER JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
                            INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
                            INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
                            LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)                                                         
                            INNER JOIN tb_uf uf on uf.id = a.idUf
                            WHERE a.id = ?`, id, callback);
}

ReceitaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

ReceitaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ReceitaDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT                             
                            a.id
                            ,a.idEstabelecimento
                            ,estabelecimento.nomeFantasia nomeEstabelecimento
                            ,a.idMunicipio
                            ,municipio.nome nomeMunicipio
                            ,a.idProfissional
                            ,profissional.nome nomeProfissional
                            ,a.idPaciente
                            ,paciente.nome nomePaciente
                            ,a.idSubgrupoOrigem
                            ,subgrupoOrigem.nome nomeSubgrupoOrigem
                            ,a.ano
                            ,a.numero
                            ,a.dataEmissao
                            ,a.dataUltimaDispensacao
                            ,a.idMotivoFimReceita
                            ,a.idPacienteOrigem
                            ,pacienteOrigem.nome nomePacienteOrigem
                            ,a.idMandadoJudicial                            
                            ,a.situacao
                            ,a.idUf
                            ,CONCAT(municipio.nome,'/',uf.uf) textoCidade
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
                            INNER JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
                            INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
                            INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
                            LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)
                            INNER JOIN tb_uf uf on uf.id = a.idUf`, callback);
}
module.exports = function(){
    return ReceitaDAO;
};