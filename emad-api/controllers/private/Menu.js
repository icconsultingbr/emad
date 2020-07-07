module.exports = function (app) {

    app.post('/menu', function (req, res) {
        var menu = req.body;
        var usuario = req.usuario;

        req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
        req.assert("rota").notEmpty().withMessage("Rota é um campo obrigatório;");
        req.assert("ordem").notEmpty().withMessage("Ordem é um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situacao é um campo obrigatório;");

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        menu.situacao = (menu.situacao ? 1 : 0);

        if (menu.menuPai == '') {
            menu.menuPai = null;
        }

        var util = new app.util.Util();
        var errors = [];

        salvaMenu(menu, res).then(function (response) {
            menu.id = response.insertId;
            res.status(201).send(menu);
        });
    });


    app.get('/menu', function (req, res) {
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];

        lista(res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/menu/descricao', function (req, res) {
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];

        listaDescricao(res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/menu/ordem-menu-filho/:id', function (req, res) {
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        let idMenuPai = req.params.id;

        listaOrdemMenuFilhoPorMenuPai(idMenuPai, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });
    

    app.get('/menu/tipo-usuario', function (req, res) {
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];

        listaPorTipoUsuario(usuario.idTipoUsuario, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/menu/tipo-usuario/descricao/:id', function (req, res) {
        var usuario = req.usuario;
        let id = req.params.id;
        var util = new app.util.Util();
        var errors = [];

        listaPorTipoUsuarioDescricao(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/menu/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.put('/menu', function (req, res) {

        let usuario = req.usuario;
        let menu = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = menu.id;
        delete menu.id;

        req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
        req.assert("rota").notEmpty().withMessage("Rota é um campo obrigatório;");
        req.assert("ordem").notEmpty().withMessage("Ordem é um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situacao é um campo obrigatório;");

        if (!menu.menuPai) {
            menu.menuPai = "";
        }

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        if (menu.menuPai == '') {
            menu.menuPai = null;
        }

        buscarPorId(id, res).then(function (response) {
            if (typeof response != 'undefined') {
                atualizaPorId(menu, id, response.ordem, res).then(function (response2) {
                    res.status(200).json(menu);
                    return;
                });
            }
            else {
                errors = util.customError(errors, "body", "Menu não encontrado!", menu.nome);
                res.status(404).send(errors);
                return;
            }
        });
    });


    app.delete('/menu/:id', function (req, res) {

        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let menu = {};
        menu.id = id;

        deletaPorId(id, res).then(function (response) {
            res.status(200).json(menu);
            return;
        });
    });

    function listaPorTipoUsuario(idTipoUsuario, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var menuDAO = new app.dao.MenuDAO(connection);
        var errors = [];

        menuDAO.listaPorTipoUsuario(idTipoUsuario, function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "menu");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function listaPorTipoUsuarioDescricao(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var menuDAO = new app.dao.MenuDAO(connection);
        var errors = [];

        menuDAO.listaPorTipoUsuarioDescricao(id, function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "menu");
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
        var menuDAO = new app.dao.MenuDAO(connection);
        var errors = [];

        menuDAO.lista(function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "menu");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function listaDescricao(res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var menuDAO = new app.dao.MenuDAO(connection);
        var errors = [];

        menuDAO.listaDescricao(function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "menu");
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
        var menuDAO = new app.dao.MenuDAO(connection);
        var errors = [];

        menuDAO.buscaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "menu");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function atualizaPorId(menu, id, ordemAtual, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var menuDAO = new app.dao.MenuDAO(connection);
        var errors = [];


        menuDAO.atualizaPorId(menu, id, ordemAtual ,function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "menu");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salvaMenu(menu, res) {
        delete menu.id;
        var connection = app.dao.ConnectionFactory();
        var menuDAO = new app.dao.MenuDAO(connection);
        var q = require('q');
        var d = q.defer();

        menuDAO.salva(menu, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir Menu', exception);
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

    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var menuDAO = new app.dao.MenuDAO(connection);
        var errors = [];

        menuDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "menu");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function listaOrdemMenuFilhoPorMenuPai(idMenuPai, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var menuDAO = new app.dao.MenuDAO(connection);
        var errors = [];

        menuDAO.listaOrdemMenuFilhoPorMenuPai(idMenuPai, function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "menu");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }    
}

