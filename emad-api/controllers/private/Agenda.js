module.exports = function (app) {

    app.get('/agenda', function (req, res) {

        let addFilter = req.query;

        listaAgendas(addFilter = req.query, "agenda", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/agenda/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];


        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorId(id, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    });

    app.delete('/agenda/:id', function(req,res){     
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;
        
        if(usuario.idTipoUsuario == util.SUPER_ADMIN){	
            deletaPorId(id, res).then(function(response) {
                res.status(200).json(obj);
                return;      
            });

        } else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    });

    app.post('/agenda', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        var daysFlag = "";
        var dataInicio = obj.dataInicio + " " + obj.horaInicio;
        var dataFim = obj.dataInicio + " " + obj.horaFim;
        var json = {};


        if (obj.idTipoAgenda == 'S') {

            if (obj.dom == true) {
                daysFlag += "_0";
            }
            if (obj.seg == true) {
                daysFlag += "_1";
            }
            if (obj.ter == true) {
                daysFlag += "_2";
            }
            if (obj.qua == true) {
                daysFlag += "_3";
            }
            if (obj.qui == true) {
                daysFlag += "_4";
            }
            if (obj.sex == true) {
                daysFlag += "_5";
            }
            if (obj.sab == true) {
                daysFlag += "_6";
            }
        }


        json.idPaciente = obj.idPaciente;
        json.idEquipe = obj.idEquipe;
        json.idProfissional = obj.idProfissional;
        json.idTipoAgenda = obj.idTipoAgenda;
        json.dataInicio = util.dateTimeToISO(dataInicio);
        json.dataFim = util.dateTimeToISO(dataFim);
        json.dataVigencia = obj.dataVigencia ? util.dateToISO(obj.dataVigencia) : null;
        json.daysFlag = daysFlag;
        json.observacoes = obj.observacoes;
        json.situacao = 1;
        json.idEstabelecimento = obj.idEstabelecimento;


        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            salvar(json, res).then(function (response) {
                json.id = response.insertId;
                res.status(201).send(json);
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }

    });

    app.put('/agenda', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        var daysFlag = "";
        var dataInicio = obj.dataInicio + " " + obj.horaInicio;
        var dataFim = obj.dataInicio + " " + obj.horaFim;
        var json = {};


        if (obj.idTipoAgenda == 'S') {

            if (obj.dom == true) {
                daysFlag += "_0";
            }
            if (obj.seg == true) {
                daysFlag += "_1";
            }
            if (obj.ter == true) {
                daysFlag += "_2";
            }
            if (obj.qua == true) {
                daysFlag += "_3";
            }
            if (obj.qui == true) {
                daysFlag += "_4";
            }
            if (obj.sex == true) {
                daysFlag += "_5";
            }
            if (obj.sab == true) {
                daysFlag += "_6";
            }
        }


        json.id = obj.id;
        json.idPaciente = obj.idPaciente;
        json.idEquipe = obj.idEquipe;
        json.idProfissional = obj.idProfissional;
        json.idTipoAgenda = obj.idTipoAgenda;
        json.dataInicio = util.dateTimeToISO(dataInicio);
        json.dataFim = util.dateTimeToISO(dataFim);
        json.dataVigencia = obj.dataVigencia ? util.dateToISO(obj.dataVigencia) : null;
        json.daysFlag = daysFlag;
        json.observacoes = obj.observacoes;
        json.situacao = 1;


        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            editar(json, res).then(function (response) {
                res.status(201).send(response);
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }

    });

    function listaAgendas(addFilter, dom, res) {
        var q = require('q');
        var d = q.defer();

        var util = new app.util.Util();
        var errors = [];

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.AgendaDAO(connection);

        dao.lista(addFilter, function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", dom);
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

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

    function editar(obj, res) {
        let id = obj.id;
        delete obj.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendaDAO(connection);
        let q = require('q');
        let d = q.defer();


        objDAO.atualiza(obj, id, function (exception, result) {
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

    function buscarPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendaDAO(connection);
        let errors = [];

        objDAO.buscaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function deletaPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendaDAO(connection);
        let errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }
}


