module.exports = function (app) {
    app.get('/notificacao', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        lista(res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/notificacao/usuario', function (req, res) {
        console.log(req.usuario);
        let usuario = req.usuario;
        listaPorUsuarioId(usuario.id, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/notificacao/usuario/contador', function (req, res) {
        console.log(req.usuario);
        let usuario = req.usuario;
        carregaQtdPorUsuarioId(usuario.id, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/notificacao/usuario/:id(\\d+)', function (req, res) {
        let usuario = req.usuario;
        let idNotificacao = req.params.id
        listaPorUsuarioIdById(usuario.id, idNotificacao, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/notificacao/:id(\\d+)', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.delete('/notificacao/:id', function (req, res) { 
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = []; 
        let id = req.params.id;
        let notificacao = {};
        notificacao.id = id;

        deletaPorId(id, res).then(function (response) {
            res.status(200).json(notificacao);
            return;
        });
    });

    app.put('/notificacao', function (req, res) {
        let notificacao = req.body;
        let util = new app.util.Util();

        let errors = [];
        let id = notificacao.id;
        delete notificacao.id;

        buscarPorId(id, res).then(function (response) {
            if (typeof response != 'undefined') {
                atualizaPorId(notificacao, id, res).then(function (response2) {
                    res.status(201).json(notificacao);
                    return;
                });
            }
            else {
                errors = util.customError(errors, "body", "Notificacao não encontrado!", notificacao.nome);
                res.status(404).send(errors);
                return;
            }
        });
    });

    app.put('/notificacao/visualizada/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();

        let errors = [];

        buscarPorId(id, res).then(function (response) {
            if (typeof response != 'undefined') {
                visualizadaPorId(id, usuario.id, res).then(function (response2) {
                    res.status(200).json({ success: true });
                    return;
                });
            }
            else {
                errors = util.customError(errors, "body", "Notificacao não encontrado!", notificacao.nome);
                res.status(404).send(errors);
                return;
            }
        });
    });

    app.post('/notificacao', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        let util = new app.util.Util();

        delete obj.tipoFormatado;

        req.assert("titulo").notEmpty().withMessage("Título é um campo obrigatório;");
        req.assert("descricao").notEmpty().withMessage("Descrição é um campo obrigatório;");
        req.assert("idTipoUsuario").notEmpty().withMessage("Tipo Usuário é um campo obrigatório;");
        req.assert("tipo").notEmpty().withMessage("Tipo é um campo obrigatório;");

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        obj.situacao = 1;
        obj.idUsuarioCriacao = usuario.id;
        obj.dataCriacao = new Date;
        var errors = [];

        salvaNotificacao(obj, res).then(function (response) {
            obj.id = response.insertId;
            geraNotificacoesUsuarios(obj, res).then(function (response2) {
                res.status(201).send(obj);
            });
        });
    });

    function listaPorUsuarioId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var notificacaoDAO = new app.dao.NotificacaoDAO(connection);
        var errors = [];

        notificacaoDAO.listaPorUsuarioId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "planos");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function carregaQtdPorUsuarioId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var notificacaoDAO = new app.dao.NotificacaoDAO(connection);
        var errors = [];

        notificacaoDAO.carregaQtdPorUsuarioId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "planos");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }    

    function listaPorUsuarioIdById(id, idNotificacao, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var notificacaoDAO = new app.dao.NotificacaoDAO(connection);
        var errors = [];

        notificacaoDAO.listaPorUsuarioIdById(id, idNotificacao, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "planos");
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
        var notificacaoDAO = new app.dao.NotificacaoDAO(connection);
        var errors = [];

        notificacaoDAO.lista(function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "notificacaos");
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
        var notificacaoDAO = new app.dao.NotificacaoDAO(connection);
        var errors = [];

        notificacaoDAO.buscaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "notificacao");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var notificacaoDAO = new app.dao.NotificacaoDAO(connection);
        var errors = [];

        notificacaoDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "notificacao");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }

    function atualizaPorId(notificacao, id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var notificacaoDAO = new app.dao.NotificacaoDAO(connection);
        var errors = [];

        notificacaoDAO.atualizaPorId(notificacao, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "notificacao");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function visualizadaPorId(notificacao_id, usuario_id, res) {
        let util = new app.util.Util();
        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let notificacaoUsuarioDAO = new app.dao.NotificacaoUsuarioDAO(connection);

        notificacaoUsuarioDAO.visualizadaPorId(notificacao_id, usuario_id, function (exception, result) {
            if (exception) {
                console.log('Erro ao marcar a notificação como visualizada no banco de dados', exception);
                res.status(500).send(exception);
                d.reject(exception);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function salvaNotificacao(notificacao, res) {
        delete notificacao.id;
        var connection = app.dao.ConnectionFactory();
        var notificacaoDAO = new app.dao.NotificacaoDAO(connection);
        var q = require('q');
        var d = q.defer();
        delete notificacao.tipoUsuarioNome;
        notificacaoDAO.salva(notificacao, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir Notificacao', exception);
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

    function geraNotificacoesUsuarios(notificacao, res) {
        var connection = app.dao.ConnectionFactory();
        var notificacaousuarioDAO = new app.dao.NotificacaoUsuarioDAO(connection);
        var usuarioDAO = new app.dao.UsuarioDAO(connection);
        var q = require('q');
        var d = q.defer();

        if (notificacao.idUsuario == undefined) {
            usuarioDAO.listaPorTipoUsuario(notificacao.idTipoUsuario, function (exception, result) {
                result.forEach(usuario => {
                    let objNotificacaoUsuario = { idNotificacao: notificacao.id, idUsuario: usuario.id };
                    notificacaousuarioDAO.salva(objNotificacaoUsuario, function (exception2, result2) {
                        if (exception2) {
                            console.log('Erro ao inserir Notificacao', exception);
                            res.status(500).send(exception);
                            d.reject(exception);
                            return;
                        } else {
                            app.get('io').emit(
                                'notification' + objNotificacaoUsuario.idUsuario,
                                { notification: objNotificacaoUsuario }
                            )
                        }

                    });
                })
                d.resolve(result);
            })
        } else {
            let objNotificacaoUsuario = { idNotificacao: notificacao.id, idUsuario: notificacao.idUsuario };
            notificacaousuarioDAO.salva(objNotificacaoUsuario, function (exception2, result2) {
                if (exception2) {
                    console.log('Erro ao inserir Notificacao', exception);
                    res.status(500).send(exception);
                    d.reject(exception);
                    return;
                } else {
                    app.get('io').emit(
                        'notification' + objNotificacaoUsuario.idUsuario,
                        { notification: objNotificacaoUsuario }
                    )
                    d.resolve(result2);
                }

            });

        }
        return d.promise;
    }

}


