module.exports = function (app) {

    app.get('/equipe', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.get('/equipe/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorId(id, res).then(function (response) {
                buscarProfissionaisPorEquipe(id, res).then(function (response2) {
                    response.profissionais = response2;
                    res.status(200).json(response);
                    return;
                });
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });


    app.get('/equipe/equipe/:equipe/:idEstabelecimento', function (req, res) {
        let usuario = req.usuario;
        let equipe = req.params.equipe;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorEquipe(equipe, idEstabelecimento, res).then(function (response) {
                console.log(response);
                res.status(200).json(response);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    }); 


    app.post('/equipe', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        let profissionais = obj.profissionais;
        let arrProfissionais = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {

            if (obj.equipe == "EMAD") {
                req.assert("equipe").notEmpty().withMessage("Equipe é um campo obrigatório;");
                req.assert("tipo").notEmpty().withMessage("Tipo é um campo obrigatório;");
                req.assert("situacao").notEmpty().withMessage("Situacao é um campo obrigatório;");
                req.assert("idEstabelecimento").notEmpty().withMessage("Estabelecimento é um campo obrigatório;");
            } else {
                req.assert("equipe").notEmpty().withMessage("Equipe é um campo obrigatório;");
                req.assert("idEquipeEmad").notEmpty().withMessage("Equipe EMAD é um campo obrigatório;");
            }

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

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.put('/equipe', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        let profissionais = obj.profissionais;
        let arrProfissionais = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            if (obj.equipe == "EMAD") {
                req.assert("equipe").notEmpty().withMessage("Equipe é um campo obrigatório;");
                req.assert("tipo").notEmpty().withMessage("Tipo é um campo obrigatório;");
                req.assert("situacao").notEmpty().withMessage("Situacao é um campo obrigatório;");
                req.assert("idEstabelecimento").notEmpty().withMessage("Estabelecimento é um campo obrigatório;");
            } else {
                req.assert("equipe").notEmpty().withMessage("Equipe é um campo obrigatório;");
                req.assert("idEquipeEmap").notEmpty().withMessage("Equipe EMAP é um campo obrigatório;");
            }
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

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.delete('/equipe/:id', function (req, res) {
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            deletaPorId(id, res).then(function (response) {
                res.status(200).json(obj);
                return;
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    function listaPorEstabelecimento(estabelecimento, addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EquipeDAO(connection);

        var errors = [];

        objDAO.listaPorEstabelecimento(estabelecimento, addFilter, function (exception, result) {
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
                errors = util.customError(errors, "data", "Erro ao apagar os dados", "equipe");
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