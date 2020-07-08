module.exports = function (app) {

    app.get('/profissional', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        lista(addFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/profissional/equipe/:id', function (req, res) {

        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorEquipe(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/profissional/estabelecimento/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorEstabelecimento(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/profissional/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) { 
            buscarEstabelecimentosPorUsuario(response.idUsuario, res).then(function (response2) {
                response.estabelecimentos = response2;
                res.status(200).json(response);
                return;
            });
        });
    });

    app.post('/profissional', async function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;        
        var util = new app.util.Util();
        var errors = [];
        let arrEstabelecimentos = [];
        let arrEstabelecimentosDim = [];
        let dadosUsuario = {};
        let estabelecimentos = obj.estabelecimentos;
        
        dadosUsuario.cpf = obj.cpf.replace(/[.-]/g, '');
        if(obj.foneCelular)
            dadosUsuario.celular = obj.foneCelular.replace(/[() -]/g, '');

        req.assert("cpf").notEmpty().withMessage("CPF é um campo obrigatório;");
        req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");            
        req.assert("dataNascimento").notEmpty().withMessage("Data de Nascimento é um campo obrigatório;");
        req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
        req.assert("profissionalSus").notEmpty().withMessage("Profissional SUS é um campo obrigatório;");                                    
        req.assert("idEspecialidade").notEmpty().withMessage("Especialidade é um campo obrigatório;");
        req.assert("email").notEmpty().withMessage("Email é um campo obrigatório;");            
        req.assert("idTipoUsuario").notEmpty().withMessage("Grupo de usuário é um campo obrigatório");
        req.assert("senha").notEmpty().withMessage("A senha é um campo obrigatório;").matches(/^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&]{8,}/).withMessage("A senha deve conter pelo menos 8 caracteres, letras e números;");
        req.assert("confirmaSenha").notEmpty().withMessage("A confirmação da senha é um campo obrigatório;").equals(obj.senha).withMessage("A senha e confirmação devem ser idênticas;");
        req.assert("estabelecimentos").notEmpty().withMessage("Selecione o(s) estabelecimento(s) vinculado(s) ao usuário");
        req.assert("idMunicipio").notEmpty().withMessage("Munícipio é um campo obrigatório;");
        req.assert("idUf").notEmpty().withMessage("UF é um campo obrigatório;");
        
        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        obj.dataCriacao = new Date;
        if (obj.dataEmissao != null) {
            obj.dataEmissao = util.dateToISO(obj.dataEmissao);
        }
        obj.dataNascimento = util.dateToISO(obj.dataNascimento);

        delete obj.idEstabelecimento;

        //DADOS PARA CRIAÇÃO DO USUÁRIO
        dadosUsuario.situacao = 1;
        dadosUsuario.dataCriacao = new Date;                        
        dadosUsuario.dataNascimento = obj.dataNascimento;  
        dadosUsuario.email = obj.email;            
        dadosUsuario.idTipoUsuario = obj.idTipoUsuario;
        dadosUsuario.nome = obj.nome;
        dadosUsuario.nomeMae = obj.nomeMae;            
        dadosUsuario.sexo = obj.sexo;

        let hash = util.createHashEmail(obj.email);
        dadosUsuario.hash = hash;

        let senha = util.hashPassword(obj.senha);
        dadosUsuario.senha = senha;
        dadosUsuario.tentativasSenha = 0;
        dadosUsuario.foto = "";

        delete obj.senha;
        delete obj.confirmaSenha;
        delete obj.estabelecimentos;
        delete obj.idTipoUsuario;      
        
        const connection = await app.dao.connections.EatendConnection.connection();

            const usuarioRepository = new app.dao.UsuarioDAO(connection);
            const profissionalRepository = new app.dao.ProfissionalDAO(connection);
            const estabelecimentoUsuarioRepository = new app.dao.EstabelecimentoUsuarioDAO(connection);
            
            try {

                await connection.beginTransaction();           
    
                var buscaEmailProfissional = await usuarioRepository.buscaPorEmailSync(dadosUsuario);               

                if (buscaEmailProfissional.length > 0) {
                    errors = util.customError(errors, "header", "Já existe um usuário cadastrado com este e-mail!", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }

                var buscaCpfProfissional = await usuarioRepository.buscaPorCPFSync(dadosUsuario);               

                if (buscaCpfProfissional.length > 0) {
                    errors = util.customError(errors, "header", "Já existe um usuário cadastrado com este CPF!", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }
                
                var usuarioResult = {};                
                
                if (typeof (dadosUsuario.id) != 'undefined' && dadosUsuario.id != null) {                    
                    let idUsuario = dadosUsuario.id;
                    delete dadosUsuario.id;  

                    usuarioResult = await usuarioRepository.atualizaSync(dadosUsuario); 
                    dadosUsuario.id = idUsuario;
                }
                else {        
                    usuarioResult = await usuarioRepository.salvaSync(dadosUsuario);                                         
                    obj.idUsuario = usuarioResult.insertId;
                    dadosUsuario.id = obj.idUsuario;
                }

                var salvaProfissional = await profissionalRepository.salvaSync(obj);          

                obj.id = salvaProfissional.insertId;

                var deleteResult  = await estabelecimentoUsuarioRepository.deletaEstabelecimentosPorUsuarioSync(dadosUsuario.id);

                for (const item of estabelecimentos) {
                    arrEstabelecimentos.push("(" + dadosUsuario.id + ", " + item.id + ")");   
                }

                var atualizaResult  = await estabelecimentoUsuarioRepository.atualizaEstabelecimentosPorUsuarioSync(arrEstabelecimentos);
                
                delete dadosUsuario.senha;
                delete dadosUsuario.hash;

                token = util.createWebToken(app, req, dadosUsuario);
                dadosUsuario.token = token;

                res.status(201).send(obj);
    
                await connection.commit();
            }
            catch (exception) {
                console.log("Erro ao salvar o profissional (" + obj.nome + "), exception: " +  exception);
                res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
                await connection.rollback();
            }
            finally {
                await connection.close();
            }

    });

    app.put('/profissional', async function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        let arrEstabelecimentosDim = [];
        let arrEstabelecimentos = [];        
        let dadosUsuario = {};
        let estabelecimentos = obj.estabelecimentos;


        dadosUsuario.cpf = obj.cpf.replace(/[.-]/g, '');
            if(obj.foneCelular)
                dadosUsuario.celular = obj.foneCelular.replace(/[() -]/g, '');

            req.assert("cpf").notEmpty().withMessage("CPF é um campo obrigatório;");
            req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");            
            req.assert("dataNascimento").notEmpty().withMessage("Data de Nascimento é um campo obrigatório;");
            req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
            req.assert("profissionalSus").notEmpty().withMessage("Profissional SUS é um campo obrigatório;");                                    
            req.assert("idEspecialidade").notEmpty().withMessage("Especialidade é um campo obrigatório;");
            req.assert("email").notEmpty().withMessage("Email é um campo obrigatório;");            
            req.assert("idTipoUsuario").notEmpty().withMessage("Grupo de usuário é um campo obrigatório");
            req.assert("estabelecimentos").notEmpty().withMessage("Selecione o(s) estabelecimento(s) vinculado(s) ao usuário");
            req.assert("idMunicipio").notEmpty().withMessage("Munícipio é um campo obrigatório;");
            req.assert("idUf").notEmpty().withMessage("UF é um campo obrigatório;");

            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            if (obj.dataEmissao != null) {
                obj.dataEmissao = util.dateToISO(obj.dataEmissao);
            }
            obj.dataNascimento = util.dateToISO(obj.dataNascimento);

            delete obj.estabelecimentos;
            delete obj.idEstabelecimento;

            const connection = await app.dao.connections.EatendConnection.connection();

            const usuarioRepository = new app.dao.UsuarioDAO(connection);
            const profissionalRepository = new app.dao.ProfissionalDAO(connection);
            const estabelecimentoUsuarioRepository = new app.dao.EstabelecimentoUsuarioDAO(connection);
            
            try {

                await connection.beginTransaction();           
    
                //DADOS PARA CRIAÇÃO DO USUÁRIO
                dadosUsuario.situacao = 1;            
                dadosUsuario.dataNascimento = obj.dataNascimento;  
                dadosUsuario.email = obj.email;            
                dadosUsuario.idTipoUsuario = obj.idTipoUsuario;
                dadosUsuario.nome = obj.nome;
                dadosUsuario.nomeMae = obj.nomeMae;            
                dadosUsuario.sexo = obj.sexo;
                dadosUsuario.tentativasSenha = 0;
                dadosUsuario.foto = "";

                delete obj.senha;
                delete obj.confirmaSenha;            
                delete obj.idTipoUsuario;  
                let idUsuario = 0;

                var buscaProfissional = await profissionalRepository.buscaPorIdSync(id);               

                if (!buscaProfissional) {
                    errors = util.customError(errors, "header", "Profissional não encontrado", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }

                dadosUsuario.id = buscaProfissional.idUsuario;
                idUsuario = buscaProfissional.idUsuario;                

                var buscaEmailProfissional = await usuarioRepository.buscaPorEmailSync(dadosUsuario);               

                if (buscaEmailProfissional.length > 0) {
                    errors = util.customError(errors, "header", "Já existe um usuário cadastrado com este e-mail!", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }

                var buscaCpfProfissional = await usuarioRepository.buscaPorCPFSync(dadosUsuario);               

                if (buscaCpfProfissional.length > 0) {
                    errors = util.customError(errors, "header", "Já existe um usuário cadastrado com este CPF!", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }
                
                var usuarioResult = {};                
                
                if (typeof (dadosUsuario.id) != 'undefined' && dadosUsuario.id != null) {                    
                    let idUsuario = dadosUsuario.id;
                    delete dadosUsuario.id;  

                    usuarioResult = await usuarioRepository.atualizaSync(dadosUsuario); 
                    dadosUsuario.id = idUsuario;
                }
                else {        
                    usuarioResult = await usuarioRepository.salvaSync(dadosUsuario);                                         
                    obj.idUsuario = idUsuario;
                }

                var atualizaProfissional = await profissionalRepository.atualizaSync(obj, id);          

                obj.id = id;

                var deleteResult  = await estabelecimentoUsuarioRepository.deletaEstabelecimentosPorUsuarioSync(dadosUsuario.id);

                for (const item of estabelecimentos) {
                    arrEstabelecimentos.push("(" + dadosUsuario.id + ", " + item.id + ")");   
                }

                var atualizaResult  = await estabelecimentoUsuarioRepository.atualizaEstabelecimentosPorUsuarioSync(arrEstabelecimentos);
                
                delete dadosUsuario.hash;

                token = util.createWebToken(app, req, dadosUsuario);
                dadosUsuario.token = token;

                res.status(201).send(obj);
    
                await connection.commit();
            }
            catch (exception) {
                console.log("Erro ao salvar o profissional (" + obj.nome + "), exception: " +  exception);
                res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
                await connection.rollback();
            }
            finally {
                await connection.close();
            }
    });

    app.delete('/profissional/:id', function (req, res) {
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

    function listaPorEstabelecimento(estabelecimento, addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);

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

    function lista(addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);

        var errors = [];

        objDAO.lista(addFilter, function (exception, result) {
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

    function buscarPorEquipe(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);
        var errors = [];

        objDAO.buscaPorEquipe(id, function (exception, result) {
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

    function buscarPorEstabelecimento(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);
        var errors = [];

        objDAO.buscarPorEstabelecimento(id, function (exception, result) {
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

    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.ProfissionalDAO(connection, connectionDim);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "profissional");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function buscarPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);
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

    function buscarEstabelecimentosPorUsuario(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoUsuarioDAO(connection);
        var errors = [];
        
        objDAO.buscaPorUsuario(id, function (exception, result) {
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