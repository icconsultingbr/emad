function MovimentoLivroDAO(connection) {
    this._connection = connection;
    this._table = `tb_movimento_livro`;
}

MovimentoLivroDAO.prototype.salva = async function(obj) {
    const novoMovimentoLivro = await this._connection.query(`INSERT INTO tb_movimento_livro (idMovimentoGeral, idEstabelecimento, idMaterial, idTipoMovimento, saldoAnterior, 
                                                            quantidadeSaida, saldoAtual, dataMovimentacao, historico, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [obj.idMovimentoGeral, obj.idEstabelecimento, obj.idMaterial,
                                                            obj.idTipoMovimento, obj.saldoAnterior, obj.quantidadeSaida, obj.saldoAtual, 
                                                            obj.dataMovimentacao, obj.historico,  obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao]);                                                            
    return [novoMovimentoLivro];
}

MovimentoLivroDAO.prototype.carregaQtdSaida = async function(obj){
    let quantidadeSaida =  await this._connection.query(`select quantidadeSaida from tb_movimento_livro where idMovimentoGeral=? and idEstabelecimento=? and IdMaterial=?`, [obj.idMovimentoGeral, obj.idEstabelecimento, obj.idMaterial]);
    return quantidadeSaida.length > 0 ? quantidadeSaida[0].quantidadeSaida : 0;
}

MovimentoLivroDAO.prototype.atualizaSaida = async function(qtdeSaidaLivro, saldoAtualUnidade, obj, idUsuario){
    const registroAtualizado =  await this._connection.query(`update tb_movimento_livro set quantidadeSaida=?, saldoAtual=?, idUsuarioAlteracao = ?, dataAlteracao = NOW()
                                                            where idMovimentoGeral = ? and idEstabelecimento = ? and idMaterial = ?`, [qtdeSaidaLivro, saldoAtualUnidade, idUsuario,obj.idMovimentoGeral, obj.idEstabelecimento, obj.idMaterial]);
    return [registroAtualizado];
}

module.exports = function(){
    return MovimentoLivroDAO;
};