module.exports = function (app) {

    app.get('/equipe', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let queryFilter = req.query;

        listaPorEstabelecimento(queryFilter.idEstabelecimento, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/equipe/agendamento', function (req, res) {
        let usuario = req.usuario;
        let params = req.params;
        let queryParams = req.query;
        let util = new app.util.Util();
        let errors = [];
    
        const filters = {
            dataInicial: queryParams.dataInicial,
            dataFinal: queryParams.dataFinal,
            idEstabelecimento: queryParams.idEstabelecimento
        };
    
        listaEquipeDisponivelParaAgendamentoPorEspecialidade(filters, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });
    
    app.get('/equipe/estabelecimento/:id', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let queryFilter = req.params.id;

        listaPorEstabelecimento(queryFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/equipe/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            buscarProfissionaisPorEquipe(id, res).then(function (response2) {
                response.profissionais = response2;
                res.status(200).json(response);
                return;
            });
        });
    });

    app.get('/equipe/equipe/:equipe/:idEstabelecimento', function (req, res) {
        let usuario = req.usuario;
        let equipe = req.params.equipe;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];

        buscarPorEquipe(equipe, idEstabelecimento, res).then(function (response) {
            console.log(response);
            res.status(200).json(response);
            return;
        });

    });

    app.post('/equipe', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        let profissionais = obj.profissionais;
        let arrProfissionais = [];

        req.assert("tipo").notEmpty().withMessage("Tipo é um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situacao é um campo obrigatório;");
        req.assert("idEstabelecimento").notEmpty().withMessage("Estabelecimento é um campo obrigatório;");
        req.assert("ine").notEmpty().withMessage("INE é um campo obrigatório;");
        req.assert("ine").isLength({ min: 10, max: 10 }).withMessage("O campo INE deve ter 10 caracteres");

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        obj.dataCriacao = new Date;

        delete obj.profissionais;

        salva(obj, res).then(function (response) {
            obj.id = response.insertId;

            deletaProfissionaisPorEquipe(obj.id, res).then(function (response3) {


                if (profissionais.length) {
                    for (var i = 0; i < profissionais.length; i++) {
                        arrProfissionais.push("(" + obj.id + ", " + profissionais[i].id + ")");
                    }

                    atualizaProfissionaisPorEquipe(arrProfissionais, res).then(function (response4) {


                        res.status(201).json(obj);
                        return;
                    });
                } else {
                    res.status(201).json(obj);
                    return;
                }
            });
        });
    });

    app.put('/equipe', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        let profissionais = obj.profissionais;
        let arrProfissionais = [];

        req.assert("tipo").notEmpty().withMessage("Tipo é um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situacao é um campo obrigatório;");
        req.assert("idEstabelecimento").notEmpty().withMessage("Estabelecimento é um campo obrigatório;");
        req.assert("ine").notEmpty().withMessage("INE é um campo obrigatório;");
        req.assert("ine").isLength({ min: 10, max: 10 }).withMessage("O campo INE deve ter 10 caracteres");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        delete obj.profissionais;

        buscarPorId(id, res).then(function (response) {
            if (typeof response != 'undefined') {
                atualizaPorId(obj, id, res).then(function (response2) {
                    id = id;
                    deletaProfissionaisPorEquipe(id, res).then(function (response3) {
                        if (profissionais.length) {
                            for (var i = 0; i < profissionais.length; i++) {
                                arrProfissionais.push("(" + id + ", " + profissionais[i].id + ")");
                            }
                            atualizaProfissionaisPorEquipe(arrProfissionais, res).then(function (response4) {
                                res.status(201).json(obj);
                                return;
                            });
                        } else {
                            res.status(201).json(obj);
                            return;
                        }
                    });
                });

            } else {
                errors = util.customError(errors, "body", "Equipe não encontrado!", obj.nome);
                res.status(404).send(errors);
                return;
            }
        });
    });

    app.delete('/equipe/:id', function (req, res) {
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        deletaPorId(id, res).then(function (response) {
            res.status(200).json(obj);
            return;
        });
    });

    function listaPorEstabelecimento(estabelecimento, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection);

        var errors = [];

        objDAO.listaPorEstabelecimento(estabelecimento, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function listaEquipeDisponivelParaAgendamentoPorEspecialidade(req, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection, null);
        var errors = [];


        var errors = [];

        objDAO.buscaEquipeDisponivelParaAgendamentoPorEspecialidade(req, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function lista(res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection);

        var errors = [];

        objDAO.lista(function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "Equipe");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscarPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection);
        var errors = [];

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

    function buscarPorEquipe(equipe, idEstabelecimento, res) {

        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection);
        var errors = [];

        objDAO.buscaPorEquipe(equipe, idEstabelecimento, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscarProfissionaisPorEquipe(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalEquipeDAO(connection);
        var errors = [];

        objDAO.buscarProfissionaisPorEquipe(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "Profissionais por equipe");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result);
            }
        });
        return d.promise;
    }

    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "equipe");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }

    function atualizaPorId(obj, id, res) {

        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {

            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "equipe");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salva(equipe, res) {
        delete equipe.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(equipe, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir Tipo de servico', exception);
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

    function deletaProfissionaisPorEquipe(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalEquipeDAO(connection);
        var errors = [];

        objDAO.deletaProfissionaisPorEquipe(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "apagar permissoes");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function atualizaProfissionaisPorEquipe(profissionais, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalEquipeDAO(connection);
        var errors = [];

        objDAO.atualizaProfissionaisPorEquipe(profissionais, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "apagar permissoes");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }
}