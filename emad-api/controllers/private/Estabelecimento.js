module.exports = function (app) {

    app.get('/estabelecimento', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
        else {
            listaPorUsuario(usuario, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }

    });

    app.get('/estabelecimento/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    }); 

    app.get('/estabelecimento/local/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscaCidadePorIdEstabelecimento(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });    

    app.post('/estabelecimento', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];

        req.assert("cnsProfissionaleSus").matches(/^[0-9]+$/).withMessage("O campo CNS Profissional eSus deve conter somente números");
        req.assert("cnsProfissionaleSus").isLength({ min: 15, max: 15 }).withMessage("O campo CNS Profissional eSus deve ter no máximo 15 caracteres");
        req.assert("cnes").notEmpty().withMessage("CNES é um campo obrigatório;");
        req.assert("cnpj").notEmpty().withMessage("CNPJ é um campo obrigatório;");
        req.assert("razaoSocial").notEmpty().withMessage("Razão social é um campo obrigatório;");
        req.assert("nomeFantasia").notEmpty().withMessage("Nome fantasia é um campo obrigatório;");
        req.assert("logradouro").notEmpty().withMessage("Endereço é um campo obrigatório;");
        req.assert("numero").notEmpty().withMessage("Número é um campo obrigatório;");
        req.assert("bairro").notEmpty().withMessage("Bairro é um campo obrigatório;");
        req.assert("idUf").notEmpty().withMessage("Estado é um campo obrigatório;");
        req.assert("idMunicipio").notEmpty().withMessage("Município é um campo obrigatório;");
        req.assert("grauDependencia").notEmpty().withMessage("Grau de dependência é um campo obrigatório;");
        req.assert("terceiros").notEmpty().withMessage("Terceiros é um campo obrigatório;");
        req.assert("idTipoUnidade").notEmpty().withMessage("Tipo de unidade é um campo obrigatório;");
        req.assert("esferaAdministradora").notEmpty().withMessage("Esfera administradora é um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");


        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        obj.dataCriacao = new Date;

        salva(obj, res).then(function (response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        });
    });


    app.put('/estabelecimento', function (req, res) {

        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        delete obj.id;

            req.assert("cnsProfissionaleSus").notEmpty().withMessage("CNS Profissional eSus é um campo obrigatório;");
            req.assert("cnes").notEmpty().withMessage("CNES é um campo obrigatório;");
            req.assert("cnpj").notEmpty().withMessage("CNPJ é um campo obrigatório;");
            req.assert("razaoSocial").notEmpty().withMessage("Razão social é um campo obrigatório;");
            req.assert("nomeFantasia").notEmpty().withMessage("Nome fantasia é um campo obrigatório;");
            req.assert("logradouro").notEmpty().withMessage("Endereço é um campo obrigatório;");
            req.assert("numero").notEmpty().withMessage("Número é um campo obrigatório;");
            req.assert("bairro").notEmpty().withMessage("Bairro é um campo obrigatório;");
            req.assert("idUf").notEmpty().withMessage("Estado é um campo obrigatório;");
            req.assert("idMunicipio").notEmpty().withMessage("Município é um campo obrigatório;");
            req.assert("grauDependencia").notEmpty().withMessage("Grau de dependência é um campo obrigatório;");
            req.assert("terceiros").notEmpty().withMessage("Terceiros é um campo obrigatório;");
            req.assert("idTipoUnidade").notEmpty().withMessage("Tipo de unidade é um campo obrigatório;");
            req.assert("esferaAdministradora").notEmpty().withMessage("Esfera administradora é um campo obrigatório;");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");

            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            buscarPorId(id, res).then(function (response) {
                if (typeof response != 'undefined') {
                    atualizaPorId(obj, id, res).then(function (response2) {
                        res.status(200).json(obj);
                        return;
                    });
                }
                else {
                    errors = util.customError(errors, "body", "Estabelecimento não encontrado!", obj.nome);
                    res.status(404).send(errors);
                    return;
                }
            });
    });

    app.delete('/estabelecimento/:id', function (req, res) {
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


    app.get('/estabelecimento/dominios', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        lista(addFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/estabelecimento/nivel-superior/:id', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let id = req.params.id;
        let obj = {};
        obj.id = id;
        let errors = [];

        listaEstabelecimentosNivelSuperior(id, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/estabelecimento/pacientes/:id/:raio/:idModalidade/:sexo/:idadeDe/:idadeAte', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let raio = req.params.raio;
        let idModalidade = req.params.idModalidade;
        let sexo = req.params.sexo;
        let idadeDe = req.params.idadeDe;
        let idadeAte= req.params.idadeAte;
        let util = new app.util.Util();
        let errors = [];

        buscarPacientes(id, raio, idModalidade, sexo, idadeDe, idadeAte,  res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });


    async function listaPorUsuario(usuario, res) {
        var util = new app.util.Util();
        const connection = await app.dao.connections.EatendConnection.connection();

        var objDAO = new app.dao.EstabelecimentoDAO(connection);

        try{
            return await objDAO.listaPorUsuario(usuario.id);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "data", "Erro ao acessar os dados", "objs"));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    }

    async function lista(addFilter, res) {
        var util = new app.util.Util();
        const connection = await app.dao.connections.EatendConnection.connection();

        var objDAO = new app.dao.EstabelecimentoDAO(connection);

        try{
            return await objDAO.lista(addFilter);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "data", "Erro ao acessar os dados", "objs"));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    }

    function listaEstabelecimentosNivelSuperior(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoDAO(connection);

        var errors = [];

        objDAO.listaEstabelecimentosNivelSuperior(id, function (exception, result) {
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
        var objDAO = new app.dao.EstabelecimentoDAO(connection);
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
    
    function buscaCidadePorIdEstabelecimento(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoDAO(connection);
        var errors = [];

        objDAO.buscaCidadePorIdEstabelecimento(id, function (exception, result) {
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
        var objDAO = new app.dao.EstabelecimentoDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "estabelecimento");
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
        var objDAO = new app.dao.EstabelecimentoDAO(connection);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "estabelecimento");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }


    function salva(estabelecimento, res) {
        delete estabelecimento.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoDAO(connection);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(estabelecimento, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir Estabelecimento', exception);
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

    function buscarPacientes(id, raio, idModalidade, sexo, idadeDe, idadeAte, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoDAO(connection);
        var errors = [];

        objDAO.buscarPacientes(id, raio, idModalidade, sexo, idadeDe, idadeAte, function (exception, result) {
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

}