function AgendamentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_agendamento";
}

AgendamentoDAO.prototype.salva = function (obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

AgendamentoDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`select a.id as idAgendamento,
                                a.idPaciente,
                                a.idEquipe,
                                a.idProfissional,
                                a.formaAtendimento,
                                a.tipoAtendimento,
                                DATE_FORMAT(a.dataInicial, '%Y-%m-%dT%H:%i:%s') dataInicial,
                                DATE_FORMAT(a.dataFinal, '%Y-%m-%dT%H:%i:%s') dataFinal,
                                a.observacao,
                                e.nome as nomeEquipe,
                                p.nome as profissionalNome,
                                p.id as profissionalId,
                                p.teleatendimento as profissionalTeleatendimento,
                                pc.nome as pacienteNome,
                                te.nome as especialidadeNome,
                                te.id as especialidadeId,
                                e.idEstabelecimento equipeEstabelecimetoId,
                                pc.idEstabelecimentoCadastro pacienteEstabeleciomentoId
                                FROM tb_agendamento a 
                                left join tb_profissional p ON (a.idProfissional = p.id)
                                left join tb_especialidade te on p.idEspecialidade = te.id
                                left join tb_equipe e ON (a.idEquipe = e.id)
                                inner join tb_paciente pc ON(a.idPaciente = pc.id)
                            where a.id = ?`, id, callback);
}

// AgendamentoDAO.prototype.buscaPorProfissional = function (id, callback) {
//     this._connection.query(`select 
//        a.id as idAgendamento,
//         a.idPaciente,
//         a.idEquipe,
//         a.idProfissional,
//         a.formaAtendimento,
//         a.tipoAtendimento,
//         a.dataInicial,
//         a.dataFinal,
//         a.observacao,
//         e.nome,
//         p.nome as profissionalNome,
//         p.id as profissionalId,
//         p.teleatendimento as profissionalTeleatendimento,
//         pc.nome as pacienteNome
//             FROM ${this._table} a 
//             inner join tb_profissional p ON(a.idProfissional = p.id) 
//             left join tb_equipe e ON(a.idEquipe = e.id)
//             inner join tb_paciente pc ON(a.idPaciente = pc.id)
//         where a.situacao = 1 AND a.idProfissional = ?`, id, callback);
// }
AgendamentoDAO.prototype.buscaPorEquipe = function (id, callback) {
    this._connection.query(`select 
       a.id as idAgendamento,
        a.idPaciente,
        a.idEquipe,
        a.idProfissional,
        a.formaAtendimento,
        a.tipoAtendimento,
        a.dataInicial,
        a.dataFinal,
        a.observacao,
        e.nome,
        p.nome as profissionalNome,
        p.id as profissionalId,
        p.teleatendimento as profissionalTeleatendimento,
        pc.nome as pacienteNome
            FROM ${this._table} a 
            inner join tb_profissional p ON(a.idProfissional = p.id) 
            left join tb_equipe e ON(a.idEquipe = e.id)
            inner join tb_paciente pc ON(a.idPaciente = pc.id)
        where a.situacao = 1 AND a.idEquipe = ?`, id, callback);
}

// AgendamentoDAO.prototype.buscaPorPaciente = function (id, callback) {
//     this._connection.query(`select 
//        a.id as idAgendamento,
//         a.idPaciente,
//         a.idEquipe,
//         a.idProfissional,
//         a.formaAtendimento,
//         a.tipoAtendimento,
//         a.dataInicial,
//         a.dataFinal,
//         a.observacao,
//         e.nome,
//         p.nome as profissionalNome,
//         p.id as profissionalId,
//         p.teleatendimento as profissionalTeleatendimento,
//         pc.nome as pacienteNome
//             FROM ${this._table} a 
//             left join tb_profissional p ON(a.idProfissional = p.id) 
//             left join tb_equipe e ON(a.idEquipe = e.id)
//             inner join tb_paciente pc ON(a.idPaciente = pc.id)
//         where a.situacao = 1 AND a.idPaciente = ?`, id, callback);
// }

AgendamentoDAO.prototype.buscaPorProfissional = function (id, callback) {
    this._connection.query(`select 
       a.id as idAgendamento,
        a.idPaciente,
        a.idEquipe,
        a.idProfissional,
        a.formaAtendimento,
        a.tipoAtendimento,
        a.dataInicial,
        a.dataFinal,
        a.observacao,
        e.nome,
        p.nome as profissionalNome,
        p.id as profissionalId,
        p.teleatendimento as profissionalTeleatendimento,
        pc.nome as pacienteNome
            FROM ${this._table} a 
            inner join tb_profissional p ON(a.idProfissional = p.id) 
            left join tb_equipe e ON(a.idEquipe = e.id)
            inner join tb_paciente pc ON(a.idPaciente = pc.id)
        where a.situacao = 1 AND a.idProfissional = ?`, id, callback);
}

AgendamentoDAO.prototype.buscaPorPaciente = function (id, callback) {
    this._connection.query(`select 
       a.id as idAgendamento,
        a.idPaciente,
        a.idEquipe,
        a.idProfissional,
        a.formaAtendimento,
        a.tipoAtendimento,
        a.dataInicial,
        a.dataFinal,
        a.observacao,
        e.nome,
        p.nome as profissionalNome,
        p.id as profissionalId,
        p.teleatendimento as profissionalTeleatendimento,
        pc.nome as pacienteNome
            FROM ${this._table} a 
            left join tb_profissional p ON(a.idProfissional = p.id) 
            left join tb_equipe e ON(a.idEquipe = e.id)
            inner join tb_paciente pc ON(a.idPaciente = pc.id)
        where a.situacao = 1 AND a.idPaciente = ?`, id, callback);
}

AgendamentoDAO.prototype.lista = function (addFilter, callback) {
    let where = " 1=1";

    if (addFilter.idPaciente) {
        where += " AND a.idPaciente = " + addFilter.idPaciente;
    }
    if (addFilter.idEquipe) {
        where += " AND a.idEquipe = " + addFilter.idEquipe;
    }
    if (addFilter.idProfissional) {
        where += " AND a.idProfissional = " + addFilter.idProfissional;
    }

    this._connection.query(
        `SELECT 
        a.id as idAgendamento, 
        a.idPaciente, 
        a.idEquipe, 
        a.idProfissional, 
        a.formaAtendimento, 
        a.tipoAtendimento, 
        a.dataInicial, 
        a.dataFinal, 
        a.observacao,
        e.nome,
        p.nome as profissionalNome,
        p.id as profissionalId,
        p.teleatendimento as profissionalTeleatendimento,
        pc.nome as pacienteNome
            FROM ${this._table} a 
            left join tb_profissional p ON(a.idProfissional = p.id) 
            left join tb_equipe e ON(a.idEquipe = e.id)
            inner join tb_paciente pc ON(a.idPaciente = pc.id)
            WHERE ${where} AND a.situacao = 1`, callback);
}

AgendamentoDAO.prototype.atualiza = function (obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

AgendamentoDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " set situacao = 0 WHERE id = ? ", id, callback);
}

AgendamentoDAO.prototype.formaAtendimento = function (callback) {
    this._connection.query("SELECT * from tb_forma_atendimento fa", callback)
}
AgendamentoDAO.prototype.tipoAtendimento = function (callback) {
    this._connection.query("SELECT * from tb_agendamento_tipo_atendimento ata", callback)
}

module.exports = function () {
    return AgendamentoDAO;
};