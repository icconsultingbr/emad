const { async } = require("q");

function ItemReceitaDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_receita`;
}

ItemReceitaDAO.prototype.salva = async function(itemReceita) {
    const novoItemReceita = await this._connection.query(`INSERT INTO tb_item_receita (idReceita, idMaterial, qtdPrescrita, tempoTratamento, qtdDispAnterior, 
                                                            dataUltDisp, numReceitaControlada, observacao, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [itemReceita.idReceita, itemReceita.idMaterial, itemReceita.qtdPrescrita, itemReceita.tempoTratamento,
                                                            itemReceita.qtdDispAnterior, new Date(itemReceita.dataUltDisp),
                                                            itemReceita.numReceitaControlada, itemReceita.observacao, itemReceita.situacao, itemReceita.idUsuarioCriacao, 
                                                            itemReceita.dataCriacao]);

    return [novoItemReceita];
}

ItemReceitaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

ItemReceitaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ItemReceitaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

ItemReceitaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ItemReceitaDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                                a.id
                                ,a.idReceita
                                ,a.idMaterial
                                ,material.descricao nomeMaterial
                                ,a.qtdPrescrita
                                ,a.tempoTratamento
                                ,a.qtdDispAnterior
                                ,a.qtdDispMes
                                ,a.dataUltDisp
                                ,a.numReceitaControlada
                                ,a.idMotivoFimReceita
                                ,motivoFimReceita.nome nomeMotivoFimReceita
                                ,a.dataFimReceita
                                ,a.observacao
                                ,a.idUsuarioFimReceita
                                ,usuarioFimReceita.nome nomeUsuarioFimReceita
                                ,a.situacao             
                                FROM ${this._table} a
                                INNER JOIN tb_material material ON (a.idMaterial = material.id)
                                LEFT JOIN tb_motivo_fim_receita motivoFimReceita ON (a.idMotivoFimReceita = motivoFimReceita.id)                            
                                LEFT JOIN tb_usuario usuarioFimReceita ON (a.idUsuarioFimReceita = usuarioFimReceita.id)                            
                                WHERE a.situacao = 1`, callback);
}

ItemReceitaDAO.prototype.buscarPorReceita = async function(idReceita) {   
    const itemReceita = await  this._connection.query(`SELECT
                                a.id
                                ,a.idReceita
                                ,a.idMaterial
                                ,material.descricao nomeMaterial
                                ,a.qtdPrescrita
                                ,a.tempoTratamento
                                ,a.qtdDispAnterior
                                ,a.qtdDispMes
                                ,a.dataUltDisp
                                ,a.numReceitaControlada
                                ,a.idMotivoFimReceita
                                ,motivoFimReceita.nome nomeMotivoFimReceita
                                ,a.dataFimReceita
                                ,a.observacao
                                ,a.idUsuarioFimReceita
                                ,usuarioFimReceita.nome nomeUsuarioFimReceita
                                ,a.situacao             
                                FROM ${this._table} a
                                INNER JOIN tb_material material ON (a.idMaterial = material.id)
                                LEFT JOIN tb_motivo_fim_receita motivoFimReceita ON (a.idMotivoFimReceita = motivoFimReceita.id)                            
                                LEFT JOIN tb_usuario usuarioFimReceita ON (a.idUsuarioFimReceita = usuarioFimReceita.id)                            
                                WHERE a.situacao = 1 and a.idReceita=?`,idReceita);

    return itemReceita;
}

module.exports = function(){
    return ItemReceitaDAO;
};