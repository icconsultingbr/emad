module.exports = function (app) {

    app.get('/tipo-usuario', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
            lista(res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        } else if((usuario.idTipoUsuario == util.ADMIN)){
            listaPorAdmin(res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.get('/tipo-usuario-profissional', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        listaTipoUsuarioProfissional(res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });   
    });

    app.get('/tipo-usuario/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.post('/tipo-usuario', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        let util = new app.util.Util();
        let permissoes = obj.permissoes;
        let errors = [];
        let arrPermissoes = [];        

        req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
        req.assert("permissoes").notEmpty().withMessage("Permissões é um campo obrigatório;");
        req.assert("periodoSenha").notEmpty().withMessage("Você precisa informar o período de troca da senha (em dias)!;");
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        delete obj.permissoes;
        obj.situacao = 1;

        salva(obj, res).then(function (response) {
            obj.id = response.insertId;

            for (var i = 0; i < permissoes.length; i++) {
                arrPermissoes.push("(" + obj.id + ", " + permissoes[i].id + ")");
            }
            deletaPermissoes(obj.id, res).then(function (response3) {
                atualizaPermissoes(arrPermissoes,res).then(function (response4) {
                    res.status(201).json(obj);
                    return;
                });                           
            });                
        });
    });

    app.put('/tipo-usuario', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let permissoes = obj.permissoes;
        let errors = [];
        let id = obj.id;
        delete obj.id;
        
        let arrPermissoes = [];

        req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
        req.assert("permissoes").notEmpty().withMessage("Permissões é um campo obrigatório;");
        req.assert("periodoSenha").notEmpty().withMessage("Você precisa informar o período de troca da senha (em dias)!;");
        
        errors = req.validationErrors();

        delete obj.permissoes;

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        for (var i = 0; i < permissoes.length; i++) {
            arrPermissoes.push("(" + id + ", " + permissoes[i].id + ")");
        }

        buscarPorId(id, res).then(function (response) {
            if (typeof response != 'undefined') {
                atualizaPorId(obj, id, res).then(function (response2) {
                    deletaPermissoes(id, res).then(function (response3) {
                        atualizaPermissoes(arrPermissoes,res).then(function (response4) {
                            res.status(201).json(obj);
                            return;
                        });                           
                    });
                });
            }
            else {
                errors = util.customError(errors, "body", "Grupo de usuário não encontrado!", obj.nome);
                res.status(404).send(errors);
                return;
            }
        });
    });


    app.delete('/tipo-usuario/:id', function (req, res) {
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

    function listaPorAdmin(res) {
        var q = require('q'); 
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioDAO(connection);

        var errors = []; 

        objDAO.listaPorAdmin(util.SUPER_ADMIN, function (exception, result) {
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
        var objDAO = new app.dao.TipoUsuarioDAO(connection);

        var errors = [];

        objDAO.lista(function (exception, result) {
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

    function listaTipoUsuarioProfissional(res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioDAO(connection);

        var errors = [];

        objDAO.listaTipoUsuarioProfissional(function (exception, result) {
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

    function buscarPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioDAO(connection);
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


    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "tipo-usuario");
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
        var objDAO = new app.dao.TipoUsuarioDAO(connection);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "tipo-usuario");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }
    


    function deletaPermissoes(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioMenuDAO(connection);
        var errors = [];

        objDAO.deletaPermissoes(id,function (exception, result) {
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

    function atualizaPermissoes(permissoes, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioMenuDAO(connection);
        var errors = [];

        objDAO.atualizaPermissoes(permissoes, function (exception, result) {
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


    function salva(obj, res) {
        delete obj.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioDAO(connection);
        var q = require('q');
        var d = q.defer();
        objDAO.salva(obj, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir um grupo de usuário', exception);
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


