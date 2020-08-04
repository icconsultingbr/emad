function ParametroSegurancaDAO(connection) {
    this._connection = connection;
    this._table = "tb_parametro_seguranca";
}

ParametroSegurancaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

ParametroSegurancaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

ParametroSegurancaDAO.prototype.lista = function(callback) {    
    this._connection.query(`SELECT id, nome, case when mascaraGrid then '*********' else valor end as valor, observacao, situacao FROM ${this._table}  WHERE situacao = 1`,callback);    
}

ParametroSegurancaDAO.prototype.listaStorage = function(callback) {    
    this._connection.query(`SELECT id, nome, valor FROM ${this._table}  WHERE situacao = 1 
    and nome in ('CONTA_EMAIL','URL_FICHA_MEDICA_IMPRESSAO','URL_FICHA_MEDICA_VISUALIZACAO',
    'URL_RECEITA_MEDICA_VISUALIZACAO','URL_RECEITA_MEDICA_ENVIO','URL_FICHA_DIGITAL_SERVICO')`,callback);    
}

ParametroSegurancaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ParametroSegurancaDAO.prototype.buscarValorPorChave = function (nomeChave, callback) {
    this._connection.query(`SELECT NOME, VALOR FROM ${this._table} WHERE NOME IN (${nomeChave})`, callback);
}

ParametroSegurancaDAO.prototype.buscarValorPorChaveSync = async function (nomeChave) {
    const valor =  await this._connection.query(`SELECT NOME, VALOR FROM ${this._table} WHERE NOME IN (${nomeChave})`);
    return valor;
}

ParametroSegurancaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

ParametroSegurancaDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY id ASC",callback);
}

ParametroSegurancaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ParametroSegurancaDAO.prototype.obterConexaoDim = function(callback) {
    const sql = `SELECT nome, valor from ${this._table} where nome in ('ECARE_HOST', 'ECARE_USERNAME', 'ECARE_PASSWORD', 'ECARE_DATABASE', 'ECARE_PORT')`;
    this._connection.query(sql, callback);
}

module.exports = function(){
    return ParametroSegurancaDAO;
};