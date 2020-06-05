function ListaControleEspecialDAO(connection) {
    this._connection = connection;
    this._table = `tb_lista_controle_especial`;
}

ListaControleEspecialDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

ListaControleEspecialDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

ListaControleEspecialDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ListaControleEspecialDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

ListaControleEspecialDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ListaControleEspecialDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.codigoLista
                            ,a.listaControleEspecial
                            ,a.idLivro
                            ,livro.nome nomeLivro
                            ,a.receitaControlada
                            ,a.medicamentoControlado
                            ,a.situacao
                            FROM ${this._table} a
                            LEFT JOIN tb_livro livro ON (a.idLivro = livro.id)
                            WHERE a.situacao = 1`, callback);
}
module.exports = function(){
    return ListaControleEspecialDAO;
};