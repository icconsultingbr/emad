const { async } = require("q");

function ItemExameDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_receita`;
}


ItemExameDAO.prototype.salva = async function(itemExame) {
    const novoItemExame = await this._connection.query(`INSERT INTO tb_item_exame (idExame, idProdutoExame, idMetodoExame, resultado, situacao, 
                                                         idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                                                          [itemExame.idExame, itemExame.idProdutoExame, itemExame.idMetodoExame, itemExame.resultado,
                                                            itemExame.situacao, itemExame.idUsuarioCriacao, itemExame.dataCriacao]);

    return [novoItemExame];
}

ItemExameDAO.prototype.atualiza = async function(itemExame) {
    const itemExameAtualizado = await this._connection.query(`UPDATE tb_item_exame SET idExame=?, idProdutoExame=?, idMetodoExame=?, resultado=?, 
                                                            situacao=?, idUsuarioAlteracao=?, dataAlteracao=? 
                                                            WHERE id=?`, 
                                                          [ itemExame.idExame, itemExame.idProdutoExame, itemExame.idMetodoExame,
                                                            itemExame.resultado, itemExame.situacao, itemExame.idUsuarioAlteracao, itemExame.dataAlteracao, itemExame.id]);

    return [itemExameAtualizado];
}

ItemExameDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ItemExameDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

ItemExameDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ItemExameDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                                a.id
                                ,a.idReceita
                                ,a.idMaterial
                                ,material.descricao nomeMaterial
                                ,material.codigo codigoMaterial
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
                                WHERE a.situacao > 1`, callback);
}

ItemExameDAO.prototype.buscarPorReceita = async function(idReceita) {   
    const itemExame = await  this._connection.query(`SELECT
                                a.id
                                ,a.idReceita
                                ,a.idMaterial
                                ,material.descricao nomeMaterial
                                ,material.codigo codigoMaterial
                                ,a.qtdPrescrita
                                ,a.tempoTratamento
                                ,a.qtdDispAnterior
                                ,0 as qtdDispMes
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
                                WHERE a.situacao > 0 and a.idReceita=?`,idReceita);

    return itemExame;
}

ItemExameDAO.prototype.buscarMaterialDispensadoPorPaciente = async function(idMaterial, idPaciente) {   
    const itemExame = await  this._connection.query(`select  
                                                        receita.id, 
                                                        receita.ano, 
                                                        receita.idEstabelecimento, 
                                                        receita.numero, 
                                                        receita.situacao, 
                                                        receita.idPaciente, 
                                                        receita.idProfissional, 
                                                        itemreceita.dataUltDisp 
                                                    from tb_receita receita inner join tb_item_receita itemreceita ON (receita.id = itemreceita.idReceita)
                                                    where itemreceita.idMaterial=? and receita.idPaciente=? and itemreceita.dataUltDisp is not null
                                                    order by itemreceita.dataUltDisp desc `, [idMaterial, idPaciente]);

    return itemExame;
}

module.exports = function(){
    return ItemExameDAO;
};