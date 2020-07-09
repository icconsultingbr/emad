const { async } = require("q");

function ItemReceitaDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_receita`;
}

ItemReceitaDAO.prototype.salva = async function(itemReceita) {
    const novoItemReceita = await this._connection.query(`INSERT INTO tb_item_receita (idReceita, idMaterial, qtdPrescrita, tempoTratamento, qtdDispAnterior, 
                                                        qtdDispMes, dataUltDisp, numReceitaControlada, observacao, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [itemReceita.idReceita, itemReceita.idMaterial, itemReceita.qtdPrescrita, itemReceita.tempoTratamento,
                                                            itemReceita.qtdDispAnterior, itemReceita.qtdDispMes, itemReceita.dataUltDisp ? new Date(itemReceita.dataUltDisp) : null,
                                                            itemReceita.numReceitaControlada, itemReceita.observacao, 
                                                            itemReceita.situacao, itemReceita.idUsuarioCriacao, itemReceita.dataCriacao]);

    return [novoItemReceita];
}

ItemReceitaDAO.prototype.atualiza = async function(itemReceita) {
    const itemReceitaAtualizado = await this._connection.query(`UPDATE tb_item_receita SET qtdDispAnterior=?, qtdDispMes=?, dataUltDisp=?, observacao=?, 
                                                            idMotivoFimReceita=?, dataFimReceita=?, idUsuarioFimReceita=?, situacao=?, idUsuarioAlteracao=?, dataAlteracao=? 
                                                            WHERE id=?`, 
                                                          [ itemReceita.qtdDispAnterior, itemReceita.qtdDispMes, itemReceita.dataUltDisp ? new Date(itemReceita.dataUltDisp) : null,
                                                            itemReceita.observacao, itemReceita.idMotivoFimReceita, itemReceita.dataFimReceita ? new Date(itemReceita.dataFimReceita) : null,
                                                            itemReceita.idUsuarioFimReceita, itemReceita.situacao, itemReceita.idUsuarioAlteracao, itemReceita.dataAlteracao, itemReceita.id]);

    return [itemReceitaAtualizado];
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

ItemReceitaDAO.prototype.buscarPorReceita = async function(idReceita) {   
    const itemReceita = await  this._connection.query(`SELECT
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

    return itemReceita;
}

ItemReceitaDAO.prototype.buscarMaterialDispensadoPorPaciente = async function(idMaterial, idPaciente) {   
    const itemReceita = await  this._connection.query(`select  
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

    return itemReceita;
}

module.exports = function(){
    return ItemReceitaDAO;
};