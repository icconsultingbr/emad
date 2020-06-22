function ReceitaDAO(connection) {
    this._connection = connection;
    this._table = `tb_receita`;
}

ReceitaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

ReceitaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

ReceitaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ReceitaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

ReceitaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ReceitaDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT                             
                            a.id
                            ,a.idEstabelecimento
                            ,estabelecimento.nomeFantasia nomeEstabelecimento
                            ,a.idMunicipio
                            ,municipio.nome nomeMunicipio
                            ,a.idProfissional
                            ,profissional.nome nomeProfissional
                            ,a.idPaciente
                            ,paciente.nome nomePaciente
                            ,a.idSubgrupoOrigem
                            ,subgrupoOrigem.nome nomeSubgrupoOrigem
                            ,a.ano
                            ,a.numero
                            ,a.dataEmissao
                            ,a.dataUltimaDispensacao
                            ,a.idMotivoFimReceita
                            ,a.idPacienteOrigem
                            ,pacienteOrigem.nome nomePacienteOrigem
                            ,a.idMandadoJudicial                            
                            ,a.situacao
                            ,a.idUf
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
                            INNER JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
                            INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
                            INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
                            LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)`, callback);
}
module.exports = function(){
    return ReceitaDAO;
};