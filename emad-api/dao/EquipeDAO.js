function EquipeDAO(connection) {
    this._connection = connection;
    this._table = "tb_equipe";
}

EquipeDAO.prototype.salva = function (obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

EquipeDAO.prototype.atualiza = function (obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

EquipeDAO.prototype.lista = function (callback) {
    this._connection.query(`SELECT a.*, b.nomeFantasia nomeEstabelecimento FROM ${this._table} a
    inner join tb_estabelecimento b on b.id = a.idEstabelecimento
    WHERE a.situacao = 1`, callback);
}

EquipeDAO.prototype.listaPorEstabelecimento = function (idEstabelecimento, callback) {
    this._connection.query(`SELECT a.*, b.nomeFantasia nomeEstabelecimento FROM ${this._table} a
    inner join tb_estabelecimento b on b.id = a.idEstabelecimento
    WHERE b.id = ${idEstabelecimento} AND a.situacao = 1`, callback);
}

EquipeDAO.prototype.buscaPorEquipe = function (idEstabelecimento, callback) {
    this._connection.query(`SELECT 
    e.id,
    e.equipe,
    e.cnes, 
    IFNULL(e.nome, e2.nome) as nome, 
    e.tipo, 
    e.situacao,
    e.idEstabelecimento,
    e.idEquipeEmad,
    e.dataCriacao s
    
    FROM ${this._table} e 
    WHERE e.equipe = '${equipe}' AND e.idEstabelecimento = ${idEstabelecimento} AND e.situacao = 1`, callback);
}

EquipeDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`, id, callback);
}

EquipeDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

EquipeDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " set situacao = 0 WHERE id = ? ", id, callback);
}

EquipeDAO.prototype.dominio = function (callback) {
    this._connection.query("select id, nome FROM " + this._table + " WHERE situacao = 1 ORDER BY nome ASC", callback);
}

EquipeDAO.prototype.buscaEquipeDisponivelParaAgendamentoPorEspecialidade = async function (params, res) {
    return await this._connection.query(
        `select te.* from tb_equipe te
            where exists (select 1 from tb_profissional as pfst
            inner join tb_profissional_equipe tpe on pfst.id = tpe.idProfissional
            inner join tb_estabelecimento_usuario teu on pfst.idUsuario = teu.idUsuario
            where te.idEstabelecimento = teu.idEstabelecimento
            and pfst.idEspecialidade = ${params.idEspecialidade}
            and teu.idEstabelecimento = ${params.idEstabelecimento}
            and not exists (select 1 from tb_agendamento as agt
                           where agt.idProfissional = pfst.id
                           and agt.situacao = 1
                           and (
                               ('${params.dataInicial}' BETWEEN agt.dataInicial and agt.dataFinal
                              or '${params.dataFinal}' BETWEEN agt.dataInicial and agt.dataFinal)
                            or
                             (agt.dataInicial between '${params.dataInicial}' and '${params.dataFinal}'
                              or agt.dataFinal between '${params.dataInicial}' and '${params.dataFinal}')
                              )
                           )
            and not exists (select 1
                            from tb_agendamento as agt
                            inner join tb_profissional_equipe tpet on true
                            where agt.idEquipe = tpet.idEquipe
                            and agt.situacao = 1
                            and pfst.id = tpet.idProfissional
                            and
                            (
                                   ('${params.dataInicial}' BETWEEN agt.dataInicial and agt.dataFinal
                                  or '${params.dataFinal}' BETWEEN agt.dataInicial and agt.dataFinal)
                                or
                                 (agt.dataInicial between '${params.dataInicial}' and '${params.dataFinal}'
                                  or agt.dataFinal between '${params.dataInicial}' and '${params.dataFinal}')
                            ))
        )`, res
    )
}

module.exports = function () {
    return EquipeDAO;
};