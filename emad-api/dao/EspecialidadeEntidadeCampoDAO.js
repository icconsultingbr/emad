function EspecialidadeEntidadeCampoDAO(connection) {
    this._connection = connection;
    this._table = `tb_especialidade_entidade_campo`;
}

EspecialidadeEntidadeCampoDAO.prototype.salva = async function(objeto) {
    const response = await this._connection.query("INSERT INTO " + this._table + " SET ?", objeto);
    return [response];
}

EspecialidadeEntidadeCampoDAO.prototype.atualiza = async function(objeto, id) {
    let response =  await this._connection.query("UPDATE " + this._table + " SET ?  where id= ?", [objeto, id]);
    return response[0];
}

EspecialidadeEntidadeCampoDAO.prototype.deletaPorId = async function (id) {
    let response =  await this._connection.query("UPDATE " + this._table + " set situacao = 0 WHERE id = ? ", id);
    return response;
}

EspecialidadeEntidadeCampoDAO.prototype.listaPorEspecialidade = async function(idEspecialidade) {   
    let response = await this._connection.query(`SELECT
                             a.id
                            ,a.idEspecialidade
                            ,especialidade.nome nomeEspecialidade
                            ,a.idEntidadeCampo
                            ,entidadeCampo.nome nomeCampo
                            ,entidadeCampo.descricao descricaoCampo
                            ,entidade.nome nomeEntidade
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_especialidade especialidade ON (a.idEspecialidade = especialidade.id and especialidade.situacao = 1)
                            INNER JOIN tb_entidade_campo entidadeCampo ON(a.idEntidadeCampo = entidadeCampo.id) 
                            INNER JOIN tb_entidade entidade ON(entidadeCampo.idEntidade = entidade.id) 
                            WHERE a.situacao = 1 and a.idEspecialidade=?`, idEspecialidade);

    return response;
}

EspecialidadeEntidadeCampoDAO.prototype.buscaEntidadeCampoPorEspecialidade = async function(idEntidadeCampo, idEspecialidade) {   
    let response = await this._connection.query(`SELECT
                            count(1) total
                            FROM ${this._table} a                            
                            WHERE a.situacao = 1 and a.idEntidadeCampo=? and a.idEspecialidade=?`, [idEntidadeCampo, idEspecialidade]);
    return response[0];   
}

module.exports = function(){
    return EspecialidadeEntidadeCampoDAO;
};