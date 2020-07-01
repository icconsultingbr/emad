function MovimentoGeralDAO(connection) {
    this._connection = connection;
    this._table = `tb_movimento_geral`;
}

MovimentoGeralDAO.prototype.salva = async function(obj) {
    const novoMovimentoGeral = await this._connection.query(`INSERT INTO tb_movimento_geral (idTipoMovimento, idUsuario, idEstabelecimento, idReceita, idPaciente, 
                                                            numeroDocumento, dataMovimento, numeroControle, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [obj.idTipoMovimento, obj.idUsuario, obj.idEstabelecimento,
                                                            obj.idReceita, obj.idPaciente, obj.numeroDocumento, obj.dataMovimento, 
                                                            obj.numeroControle, obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao]);                                                            
    return [novoMovimentoGeral];
}

module.exports = function(){
    return MovimentoGeralDAO;
};