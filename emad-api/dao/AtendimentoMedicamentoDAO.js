function AtendimentoMedicamentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_medicamento";
}

AtendimentoMedicamentoDAO.prototype.buscaPorAtendimentoId = function (idAtendimento,callback) {
    this._connection.query(`SELECT 
        am.id, 
        am.idMaterial,
        material.descricao descricaoMaterial, 
        am.uso, 
        tvm.nome as tipoVia,
        am.quantidade,
        am.apresentacao, 
        am.posologia, 
        am.idAtendimento, 
        am.situacao, 
        am.idPaciente  
    
    from ${this._table} am   
    INNER JOIN tb_material material ON (material.id = am.idMaterial) 
    LEFT JOIN tb_tipo_via_material tvm ON (tvm.id = am.idTipoViaMaterial) 
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

AtendimentoMedicamentoDAO.prototype.buscaMedicamentoReceitaSync = async function (idAtendimento) {
    let atendimentoMedicamento =  await this._connection.query(`SELECT 
                        am.idMaterial,                                
                        am.quantidade as qtdPrescrita,
                        am.uso as tempoTratamento,
                        itemReceita.qtdDispAnterior as qtdDispAnterior,
                        itemReceita.qtdDispMes as qtdDispMes,
                        0 as numReceitaControlada,
                        0 as idAutorizador,
                        am.posologia as observacao,
                        itemReceita.id,
                        itemReceita.situacao
                    from tb_atendimento_medicamento am    
                    INNER JOIN tb_atendimento atendimento on (atendimento.id = am.idAtendimento )                            
                    LEFT JOIN tb_item_receita itemReceita on (itemReceita.idReceita = atendimento.idReceita and itemReceita.idMaterial =  am.idMaterial)
                    WHERE am.situacao = 1 AND am.idAtendimento = ?` , idAtendimento); 

    return atendimentoMedicamento;                            
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

AtendimentoMedicamentoDAO.prototype.carregaQtdMedicamentosPorPeriodo = function (periodo, idEstabelecimento, callback) {    
    this._connection.query(`select count(1) as qtd from tb_atendimento_medicamento med inner join
    tb_atendimento atend on atend.id = med.idAtendimento 
    where med.enviado = 1 and atend.idEstabelecimento = ? and  med.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY` ,[idEstabelecimento,periodo],callback); 
}

AtendimentoMedicamentoDAO.prototype.carregaMedicamentosPorPeriodo = function (periodo, idEstabelecimento, callback) {       
    if(periodo>30){
        this._connection.query(`select CONCAT(LPAD(a.mes,2,'0'),'/',a.ano) as label, qtd as data from (		
            SELECT YEAR(med.dataCriacao) ano, MONTH(med.dataCriacao) mes, COUNT(1) qtd
            FROM tb_atendimento_medicamento med inner join
            tb_atendimento ta on ta.id = med.idAtendimento 
            where med.enviado = 1 and  ta.idEstabelecimento = ? and  med.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
            GROUP BY YEAR(med.dataCriacao), MONTH(med.dataCriacao)
            order by YEAR(med.dataCriacao), MONTH(med.dataCriacao) desc) a    ` ,[idEstabelecimento,periodo],callback); 
    }
    else{
        this._connection.query(`select DATE_FORMAT(med.dataCriacao,'%d/%m/%Y') as label , count(1) as data  from 
		tb_atendimento_medicamento med inner join
		tb_atendimento ta on ta.id = med.idAtendimento 
        where med.enviado = 1 and  ta.idEstabelecimento = ? and  med.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
        group by DATE_FORMAT(med.dataCriacao,'%d/%m/%Y')
        order by DATE_FORMAT(med.dataCriacao,'%d/%m/%Y') desc` ,[idEstabelecimento,periodo],callback); 
    }
}

module.exports = function(){
    return AtendimentoMedicamentoDAO;
};