function EstabelecimentoProfissionalDAO(connection, connectionDim) {
    this._connection = connection;
    this._connectionDim = connectionDim;
    this._table = "tb_estabelecimento_profissional";
}

EstabelecimentoProfissionalDAO.prototype.deletaEstabelecimentosPorProfissional = function (id, callback) {
    const conn = this._connection;
    const connDim = this._connectionDim;
    const table = this._table;

    let novoprod = {};

    conn.beginTransaction(function(err) {
        if (err) { throw err; }
        conn.query("DELETE FROM " + table + " WHERE idProfissional = ?", id, 
        
        function (error, results) {
            if (error) {return conn.rollback(function() {throw error;});}   
            
                novoprod = results;
                console.log('Delete no e-atend do ID ' + id);
                conn.query(`SELECT 
                                idProfissionalCorrespondenteDim
                            from tb_profissional tp where tp.id = ?`, id, 
                    
            function (error, dadosProfissionais) {
                if (error) {return conn.rollback(function() {console.log('Erro' + error);throw error;});}                

                    console.log('Select ' + JSON.stringify(dadosProfissionais));

                    connDim.query(`DELETE FROM unidade_has_profissional WHERE profissional_id_profissional=?`
                        , [dadosProfissionais[0].idProfissionalCorrespondenteDim], 
                        
                function (error, novoProfissional) {                    
                    if (error) {return conn.rollback(function() {console.log('Erro no delete ' + error);throw error;});}

                        console.log('Delete no dim o ID profissional ' + dadosProfissionais[0].idProfissionalCorrespondenteDim);
                        console.log('Ultimo ' + JSON.stringify(novoProfissional));

                        conn.commit(
                        
                    function(err) 
                        {if (err) {return conn.rollback(function() {throw err;});}
                        
                        console.log('Sucesso!');              
                        return callback(null,novoprod);             
                    });
                });
            });
        });    
    }); 
}

EstabelecimentoProfissionalDAO.prototype.atualizaEstabelecimentosPorProfissional = function (estabelecimentos, callback) {
    this._connection.query("INSERT INTO " + this._table + " (idProfissional, idEstabelecimento) VALUES " + estabelecimentos, callback);
}

EstabelecimentoProfissionalDAO.prototype.atualizaEstabelecimentosPorProfissionalDim = function (estabelecimentos, callback) {
    this._connectionDim.query("INSERT INTO unidade_has_profissional (unidade_id_unidade, profissional_id_profissional, date_incl, usua_incl) VALUES " + estabelecimentos, callback);
}

EstabelecimentoProfissionalDAO.prototype.buscaPorUsuario = function (id, callback) {
    this._connection.query(`
        SELECT e.id, e.razaoSocial as nome FROM ${this._table} as ep 
        INNER JOIN tb_estabelecimento e ON(ep.idEstabelecimento = e.id) 
        WHERE ep.idProfissional = ? AND e.situacao = 1`, id, callback);
}

EstabelecimentoProfissionalDAO.prototype.buscaEstabelecimentoPorProfissionalParaDim = function (id, callback) {
    this._connection.query(`SELECT pro.idProfissionalCorrespondenteDim , est.idUnidadeCorrespondenteDim 
            FROM ${this._table} tep 
        INNER JOIN tb_estabelecimento est on est.id = tep.idEstabelecimento 
        INNER JOIN tb_profissional pro on tep.idProfissional = pro.id 
        WHERE tep.idProfissional = ?  AND est.situacao = 1`, id, callback);
}


module.exports = function () {
    return EstabelecimentoProfissionalDAO;
};