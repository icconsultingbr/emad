function AtribuicaoCanetaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atribuicao_caneta";
}

AtribuicaoCanetaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

AtribuicaoCanetaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

AtribuicaoCanetaDAO.prototype.lista = function(addFilter, callback) {
    let where = "";

    if (addFilter != null) {
        if (addFilter.periodoInicial) {           
            where+=" AND profissional_caneta.periodoInicial >= '"+addFilter.periodoInicial+" 00:00:00' AND profissional_caneta.periodoInicial <= '"+addFilter.periodoInicial+" 23:59:59'";
        }
    }

    if (addFilter.idProfissional) {
        where+=" AND profissional_caneta.idProfissional  = "+addFilter.idProfissional;
    }

    if (addFilter.idCaneta) {
        where+=" AND profissional_caneta.idCaneta  = "+addFilter.idCaneta;
    }

    if (addFilter.idEstabelecimento) {
        where+=" AND c.idEstabelecimento  = "+addFilter.idEstabelecimento;
    }

    this._connection.query(`SELECT 
    profissional_caneta.id,
    concat(c.serialNumber,' (',m.nome,')') AS nomeCaneta,
    DATE_FORMAT(profissional_caneta.periodoInicial, '%d/%m/%Y %H:%i') as periodoInicial,
    DATE_FORMAT(profissional_caneta.periodoFinal, '%d/%m/%Y %H:%i') as periodoFinal,
    CASE  
        WHEN profissional_caneta.situacao = 0  THEN 'Inativo'  
        WHEN profissional_caneta.situacao =  1 THEN 'Ativo'  
        END as situacao,
    p.nome as nomeProfissional,
    profissional_caneta.idProfissional,
    profissional_caneta.idCaneta
    FROM ${this._table} profissional_caneta       
    INNER JOIN tb_caneta c on profissional_caneta.idCaneta = c.id     
    INNER JOIN tb_modelo_caneta m ON(c.idModeloCaneta = m.id)
    INNER JOIN tb_profissional p ON(profissional_caneta.idProfissional = p.id)
    WHERE 1=1 ${where} AND profissional_caneta.situacao = 1  
    ORDER BY profissional_caneta.periodoFinal DESC`,callback);    
}

AtribuicaoCanetaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

AtribuicaoCanetaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

AtribuicaoCanetaDAO.prototype.buscaPorProfissionalId = function (idProfissional, dataInicial, horaInicial, dataFinal, horaFinal, callback) {
    let periodoinicial = "";
    let periodofinal = "";
    
    periodoinicial = dataInicial + " " + horaInicial;
    periodofinal = dataFinal + " " + horaFinal;

    this._connection.query(`SELECT 
    profissional_caneta.id,
    concat(c.serialNumber,' (',m.nome,')') AS nome,
    DATE_FORMAT(profissional_caneta.periodoInicial, '%d/%m/%Y %H:%i') as periodoInicial,
    DATE_FORMAT(profissional_caneta.periodoFinal, '%d/%m/%Y %H:%i') as periodoFinal,
    CASE  
        WHEN profissional_caneta.situacao = 0  THEN 'Inativo'  
        WHEN profissional_caneta.situacao =  1 THEN 'Ativo'  
        END as situacao
    FROM ${this._table} profissional_caneta       
    INNER JOIN tb_caneta c on profissional_caneta.idCaneta = c.id     
    INNER JOIN tb_modelo_caneta m ON(c.idModeloCaneta = m.id)
    WHERE profissional_caneta.situacao = 1 AND profissional_caneta.idProfissional = ${idProfissional}
        AND
        ('${periodoinicial}'  BETWEEN  profissional_caneta.periodoInicial AND profissional_caneta.periodoFinal  ||
        '${periodofinal}'    BETWEEN profissional_caneta.periodoInicial AND profissional_caneta.periodoFinal   ||
        profissional_caneta.periodoInicial BETWEEN '${periodoinicial}' and '${periodofinal}'             ||
        profissional_caneta.periodoFinal BETWEEN '${periodoinicial}' and '${periodofinal}'
         )
    ORDER BY profissional_caneta.periodoFinal DESC`,callback);
}

module.exports = function(){
    return AtribuicaoCanetaDAO;
};