function ComorbidadeEstabelecimentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_hipotese_diagnostica"
}


ComorbidadeEstabelecimentoDAO.prototype.lista = async function (addFilter, callback) {
    let where = "";
    let comorbidades;

    if (addFilter != null) {
        if (addFilter && addFilter != "undefined") {
            where += " ahd.idEstabelecimento = " + addFilter;
        }
    }

    comorbidades = await this._connection.query(`SELECT
                                                  hd.cid_10 as cid10
                                                 ,hd.nome as nomeComorbidade
                                                 ,count(pac.id) as qtdPacientes
                                                 FROM ${this._table} ahd
                                                 INNER JOIN tb_hipotese_diagnostica hd on hd.id = ahd.idHipoteseDiagnostica
                                                 INNER JOIN tb_paciente pac on pac.id = ahd.idPaciente
                                                 WHERE ${where}
                                                 GROUP BY hd.cid_10, hd.nome `, callback);
    return comorbidades;
}

module.exports = function () {
    return ComorbidadeEstabelecimentoDAO;
};