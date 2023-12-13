const ProfissionalDAO = require("./ProfissionalDAO");

function ProfissionalEquipeDAO(connection) {
    this._connection = connection;
    this._table = "tb_profissional_equipe";
}

ProfissionalEquipeDAO.prototype.deletaProfissionaisPorEquipe = function (id, callback) {
    this._connection.query("DELETE FROM " + this._table + " WHERE idEquipe = ?", id, callback);
}

ProfissionalEquipeDAO.prototype.atualizaProfissionaisPorEquipe = function (profissionais, callback) {

    this._connection.query(`INSERT INTO ${this._table} (idEquipe, idProfissional) VALUES ${profissionais}`, callback);
}

ProfissionalEquipeDAO.prototype.buscarProfissionaisPorEquipe = function (id, callback) {
    this._connection.query(`SELECT 
                                p.nome,
                                p.profissionalSus,
                                p.foneCelular,
                                p.email,
                                p.idEspecialidade,
                                p.teleatendimento,
                                p.situacao
                            from ${this._table} pe
                            INNER JOIN tb_profissional p ON pe.idProfissional = p.id
                            WHERE pe.idEquipe = ${id}`, callback);
}

module.exports = function () {
    return ProfissionalEquipeDAO;
};