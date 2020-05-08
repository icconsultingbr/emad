function AtendimentoMedicamentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_medicamento";
}

AtendimentoMedicamentoDAO.prototype.buscaPorAtendimentoId = function (idAtendimento,callback) {
    this._connection.query(`SELECT 
        am.id, 
        am.idMaterialDim,
        am.descricaoMaterialDim, 
        am.uso, 
        am.tipoVia,
        am.quantidade,
        am.apresentacao, 
        am.posologia, 
        am.idAtendimento, 
        am.situacao, 
        am.idPaciente  
    
    from ${this._table} am    
    WHERE am.situacao = 1 AND am.idAtendimento = ?` ,idAtendimento,callback); 
}

AtendimentoMedicamentoDAO.prototype.buscaMedicamentoParaReceitaDim = function (idAtendimento,callback) {
    this._connection.query(`SELECT 
                                am.idMaterialDim,
                                0 as id_estoque, 
                                0 as qtde_lote,
                                am.quantidade as qtde_prescrita,
                                am.uso as tempo_tratamento,
                                0 as qtde_anterior,
                                0 as qtde_dispensada,
                                0 as rec_controlada,
                                0 as id_autorizador,
                                am.posologia as obs      
                            from tb_atendimento_medicamento am    
                            WHERE am.situacao = 1 AND am.enviado = 0 AND am.idAtendimento = ?` ,idAtendimento,callback); 
}

AtendimentoMedicamentoDAO.prototype.confirmaMedicamentoParaReceitaDim = function (id, idReceita, numeroReceita, callback) {
    const conn = this._connection;
    const table = this._table;

    let retorno = {};
    conn.beginTransaction(function(err) {
        if (err) { throw err; }
        conn.query(`UPDATE ${table} SET enviado = 1 WHERE idAtendimento = ?`, id, 
        
        function (error, results) {
            if (error) {return conn.rollback(function() {console.log('Erro' + error);throw error;});}                

                retorno = results;
                
                conn.query(`UPDATE tb_atendimento SET idReceita=?, numeroReceita=? WHERE id=?`, [idReceita,numeroReceita,id], 
                    
            function (error, atualizacaoReceita) {                    
                if (error) {return conn.rollback(function() {console.log('Erro no update ' + error);throw error;});}
                    conn.commit(function(err) 
                        {if (err) {return conn.rollback(function() {throw err;});}
                    
                        console.log('Sucesso!');              
                        return callback(null,retorno);             
                });
            });
        });    
    }); 
}

module.exports = function(){
    return AtendimentoMedicamentoDAO;
};