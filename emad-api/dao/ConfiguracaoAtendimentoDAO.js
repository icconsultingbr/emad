function ConfiguracaoAtendimentoDAO(connection) {
  this._connection = connection;
  this._table = "tb_configuracao_atendimento";
}

ConfiguracaoAtendimentoDAO.prototype.salva = function (obj, callback) {
  this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
};

ConfiguracaoAtendimentoDAO.prototype.atualiza = function (obj, id, callback) {
  this._connection.query(
    `UPDATE ${this._table} SET ? WHERE id= ?`,
    [obj, id],
    callback
  );
};

ConfiguracaoAtendimentoDAO.prototype.lista = function (callback) {
  this._connection.query(
    `select con.id, est.nomeFantasia as estabelecimento, fic.nome as tipoFicha, esp.nome as especialidade from ${this._table} con
    inner join tb_estabelecimento est on con.idEstabelecimento = est.id
    inner join tb_tipo_ficha fic on con.idTipoFicha = fic.id
    inner join tb_especialidade esp on con.idEspecialidade = esp.id
    WHERE con.situacao = 1 ORDER BY con.id ASC `,
    callback
  );
};

ConfiguracaoAtendimentoDAO.prototype.buscaPorId = function (id, callback) {
  this._connection.query(
    `SELECT * FROM ${this._table} WHERE id = ?`,
    id,
    callback
  );
};

ConfiguracaoAtendimentoDAO.prototype.deletaPorId = function (id, callback) {
  this._connection.query(
    "UPDATE " + this._table + " set situacao = 0 WHERE id = ? ",
    id,
    callback
  );
};

ConfiguracaoAtendimentoDAO.prototype.obterIdEspecialidadeProfissionalSync =
  async function (idUsuario) {
    let profissional = await this._connection.query(
      `        
        SELECT especialidade.id FROM tb_profissional profissional 
        inner join tb_especialidade especialidade on especialidade.id = profissional.idEspecialidade
        inner join tb_usuario usuario on usuario.id = profissional.idUsuario 
        where usuario.id=?`,
      [idUsuario]
    );

    return profissional[0];
  };

ConfiguracaoAtendimentoDAO.prototype.obterConfiguracaoAtendimentoSync =
  async function (idTipoFicha, idEstabelecimento, idEspecialidade) {
    let confiuracaoAtendimento = await this._connection.query(
      ` SELECT * FROM ${this._table} where idTipoFicha = ? and idEstabelecimento = ? and idEspecialidade = ?`,
      [idTipoFicha, idEstabelecimento, idEspecialidade]
    );

    return confiuracaoAtendimento[0];
  };

module.exports = function () {
  return ConfiguracaoAtendimentoDAO;
};
