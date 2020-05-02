function AusenciaProfissionalDAO(connection) {
    this._connection = connection;
    this._table = "tb_ausencia_profissional";
}

AusenciaProfissionalDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

AusenciaProfissionalDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

AusenciaProfissionalDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

AusenciaProfissionalDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

AusenciaProfissionalDAO.prototype.buscaPorProfissionalId = function (idProfissional, callback) {
    this._connection.query(`SELECT 
    ausencia.id,
    CASE  
        WHEN ausencia.idTipoAusencia = 1  THEN 'Férias'  
        WHEN ausencia.idTipoAusencia = 2  THEN 'Falta'  
    END as nomeTipoAusencia,
    DATE_FORMAT(ausencia.periodoInicial, '%d/%m/%Y') as periodoInicial,
    DATE_FORMAT(ausencia.periodoFinal, '%d/%m/%Y') as periodoFinal,
    CASE  
        WHEN ausencia.situacao = 0  THEN 'Inativo'  
        WHEN ausencia.situacao =  1 THEN 'Ativo'  
    END as situacao
    FROM ${this._table} ausencia       
    INNER JOIN tb_profissional c on ausencia.idProfissional = c.id         
    WHERE ausencia.situacao = 1 AND ausencia.idProfissional = ${idProfissional}
    ORDER BY ausencia.id DESC`,callback);
}

module.exports = function(){
    return AusenciaProfissionalDAO;
};