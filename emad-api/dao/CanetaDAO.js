function CanetaDAO(connection) {
    this._connection = connection;
    this._table = "tb_caneta";
}

CanetaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

CanetaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

CanetaDAO.prototype.lista = function(addFilter, callback) {
    
    let where = "";

    if (addFilter.idEstabelecimento) {
        where+=" AND c.idEstabelecimento  = "+addFilter.idEstabelecimento;
    }

    this._connection.query(`SELECT 
    c.id,
    c.idModeloCaneta,
    m.nome as nomeModeloCaneta,
    concat(serialNumber,' (',m.nome,')') as nome,
    c.serialNumber, 
    c.situacao,
    c.idEstabelecimento,    
    c.dataCriacao,    
    e.nomeFantasia
    FROM ${this._table} c     
    INNER JOIN tb_estabelecimento e ON(c.idEstabelecimento = e.id) 
    INNER JOIN tb_modelo_caneta m ON(c.idModeloCaneta = m.id) 
    WHERE 1=1  AND c.situacao = 1  ${where}`,callback);    
}

CanetaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

CanetaDAO.prototype.listaPorEstabelecimentoDisponivel = function (idEstabelecimento, dataInicial, horaInicial, dataFinal, horaFinal, callback) {

    let periodoinicial = "";
    let periodofinal = "";

    periodoinicial = dataInicial + " " + horaInicial;
    periodofinal = dataFinal + " " + horaFinal;

    this._connection.query(`SELECT 
    c.id,
    CASE 
        WHEN profissional_caneta.idProfissional is not null  THEN concat(serialNumber,' (',m.nome,') - Vinculada ao profissional: ', profissional.nome, ' (', DATE_FORMAT(profissional_caneta.periodoInicial, '%d/%m/%Y %H:%i'), ' - ', DATE_FORMAT(profissional_caneta.periodoFinal, '%d/%m/%Y %H:%i'),')')  
        ELSE concat(serialNumber,' (',m.nome,')') 
    END AS nome,
    CASE 
        WHEN profissional_caneta.idProfissional is not null  THEN true  
        ELSE false 
    END AS disabled 
    FROM ${this._table} c    
    INNER JOIN tb_estabelecimento e ON(c.idEstabelecimento = e.id) 
    INNER JOIN tb_modelo_caneta m ON(c.idModeloCaneta = m.id) 
    LEFT JOIN tb_atribuicao_caneta profissional_caneta on profissional_caneta.idCaneta = c.id 
    AND     
    ('${periodoinicial}'  BETWEEN  profissional_caneta.periodoInicial AND profissional_caneta.periodoFinal  ||
     '${periodofinal}'    BETWEEN profissional_caneta.periodoInicial AND profissional_caneta.periodoFinal   ||
     profissional_caneta.periodoInicial BETWEEN '${periodoinicial}' and '${periodofinal}'             ||
     profissional_caneta.periodoFinal BETWEEN '${periodoinicial}' and '${periodofinal}'
     )
     AND profissional_caneta.situacao = 1
    LEFT JOIN tb_profissional profissional on profissional.id = profissional_caneta.idProfissional
    WHERE c.idEstabelecimento = ${idEstabelecimento} AND c.situacao = 1`,callback);
}

CanetaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

CanetaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

CanetaDAO.prototype.dominio = function(callback) {
    this._connection.query(`select c.id, concat(serialNumber,' (',m.nome,')') as nome FROM "+this._table+" c INNER JOIN tb_modelo_caneta m ON(c.idModeloCaneta = m.id) 
    WHERE c.situacao = 1 ORDER BY c.serialNumber ASC`,callback);
}

module.exports = function(){
    return CanetaDAO;
};