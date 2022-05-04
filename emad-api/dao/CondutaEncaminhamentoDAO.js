function CondutaEncaminhamentoDAO(connection) {
    this._connection = connection;
    this._table = `tb_conduta`;
}

CondutaEncaminhamentoDAO.prototype.salva = function (obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

CondutaEncaminhamentoDAO.prototype.atualiza = function (obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

CondutaEncaminhamentoDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

CondutaEncaminhamentoDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " set situacao = 0 WHERE id = ? ", id, callback);
}

CondutaEncaminhamentoDAO.prototype.lista = function (id, callback) {

    this._connection.query(`SELECT 
                                conduta.id, 
                                conduta.nome, 
                                conduta.codigoSus 
                            FROM ${this._table} as conduta 
                            INNER JOIN tb_tipo_ficha ttf on ttf.tipoAtendimentoSus = conduta.idTipoFichaSus
                            WHERE ttf.id = ?`, id, callback);

    // this._connection.query(`SELECT 
    //                             conduta.id, 
    //                             conduta.nome, 
    //                             conduta.codigoSus
    //                         FROM ${this._table} as conduta 
    //                         INNER JOIN tb_tipo_ficha ttf on ttf.tipoAtendimentoSus = conduta.idTipoFichaSus
    //                         WHERE ttf.id = ?` , id, callback);
}

CondutaEncaminhamentoDAO.prototype.lista = function (id, callback) {
    this._connection.query(`SELECT
                                conduta.id, 
                                conduta.nome, 
                                conduta.codigoSus 
                            FROM ${this._table} conduta
                            INNER JOIN tb_tipo_ficha ttf on ttf.tipoAtendimentoSus = conduta.idTipoFichaSus 
                            WHERE  ttf.id= ?`, id, callback);

}
module.exports = function () {
    return CondutaEncaminhamentoDAO;
};


// --Carregar condutas para ficha odontologica
// select conduta.id, conduta.nome, conduta.codigoSus from tb_conduta conduta
// inner join tb_tipo_ficha ttf on ttf.tipoAtendimentoSus = conduta.idTipoFichaSus
// where ttf.id=8
// order by conduta.id

// --Carregar condutas para ficha atendimento indidivual
// select conduta.id, conduta.nome, conduta.codigoSus from tb_conduta conduta
// inner join tb_tipo_ficha ttf on ttf.tipoAtendimentoSus = conduta.idTipoFichaSus
// where ttf.id=1
// order by conduta.id