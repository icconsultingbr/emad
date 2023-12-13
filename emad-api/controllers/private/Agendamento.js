 module.exports = function (app) {
 
 app.post('/agendamento', function (req, res) {
        var obj = req.body;
        // var util = new app.util.Util();
        // var dataInicio = obj.dataInicio + " " + obj.horaInicio;
        // var dataFim = obj.dataInicio + " " + obj.horaFim;
        // var json = {};

        // json.idPaciente = obj.idPaciente;
        // json.idEquipe = obj.idEquipe;
        // json.idProfissional = obj.idProfissional;
        // json.idTipoAgenda = obj.idTipoAgenda;
        // json.dataInicio = util.dateTimeToISO(dataInicio);
        // json.dataFim = util.dateTimeToISO(dataFim);
        // json.dataVigencia = obj.dataVigencia ? util.dateToISO(obj.dataVigencia) : null;
        // json.daysFlag = daysFlag;
        // json.observacoes = obj.observacoes;
        // json.situacao = 1;
        // json.idEstabelecimento = obj.idEstabelecimento;

        salvar(json, res).then(function (response) {
            json.id = response.insertId;
            res.status(201).send(json);
        });
    });

    function salvar(obj, res) {
        delete obj.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendaDAO(connection);
        let q = require('q');
        let d = q.defer();

        objDAO.salva(obj, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir', exception);
                res.status(500).send(exception);
                d.reject(exception);
                return;
            }
            else {
                d.resolve(result);
            }
        });
        return d.promise;
    }
}