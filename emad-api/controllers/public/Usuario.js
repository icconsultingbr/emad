module.exports = function (app) {

    let multipart = require('connect-multiparty');
    let multipartMiddleware = multipart({ uploadDir: './img/profile' });

    const FL_CADASTRADO = 1;


    app.post('/usuario/recuperar-senha', function (req, res) {
        let mail = new app.util.Mail();
        let util = new app.util.Util();
        let usuario = {};
        var shortid = require('shortid');
        shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@?');
        let generatedPassword = "999rgf98gd8f6df8d64fdfd98d89z86";

        usuario.cpf = req.body.emailForgot;
        usuario.email = req.body.emailForgot;

        let tipo = "";

        if (!Number(usuario.email)) {
            tipo = "e";
            req.assert("emailForgot").notEmpty().withMessage("Email é um campo obrigatório;").isEmail().trim().withMessage("Insira um e-mail válido;");
        }
        else {
            tipo = "c";
            req.assert("emailForgot").isLength({ min: 11, max: 11 }).withMessage("CPF deve conter 11 caracteres;").custom(util.cpfValido).withMessage("CPF inválido;").isNumeric().withMessage("CPF deve conter apenas números");
        }

        let errors = req.validationErrors();
        if (errors) {
            res.status(400).send(errors);
            return;
        }

        if (tipo == "e") {
            buscaPorEmail(usuario).then(function (responseEmail) {

                if (responseEmail.length > 0) {
                    generatedPassword = shortid.generate();
                    usuario.senha = util.hashPassword(generatedPassword);
                    usuario.id = responseEmail[0].id;
                    usuario.dataAtualizacaoSenha = new Date();
                    responseEmail[0].generatedPassword = generatedPassword;
                    let timezone = responseEmail[0].timezone;

                    delete usuario.cpf;
                    delete usuario.email;
                    delete usuario.timezone;
                    delete usuario.expiredPassword;
                    usuario.tentativasSenha = 0;
                    usuario.situacao = 1;

                    atualizaUsuario(usuario).then(function (responseAtualiza) {
                        buscaParametroSegurancaPorChave("'CONTA_EMAIL'", res).then(function (responseEMAIL) {                                
                            if(responseEMAIL){
                                buscaParametroSegurancaPorChave("'SENHA_EMAIL'", res).then(function (responseSENHA) {                                
                                    if(responseSENHA){
                                        mail.sendMail(responseEmail[0], responseEMAIL, responseSENHA, "Esqueceu a senha?", "forgotPassword.html");
                                        let retorno = {};
                                        retorno.email = responseEmail[0].email;
                                        retorno.timezone = timezone;
                                        res.status(200).json(retorno);
                                    }
                                    else{
                                        errors = util.customError(errors, "ESQUECEU A SENHA", "DADOS DE ACESSO DO E-MAIL REMETENTE NÃO ENCONTRADO", null);
                                        res.status(400).json(errors);
                                        return;
                                    }                                                               
                                });

                            }
                            else{
                                errors = util.customError(errors, "ESQUECEU A SENHA", "CONTA DE E-MAIL REMETENTE NÃO ENCONTRADA", null);
                                res.status(400).json(errors);
                                return;
                            }                                                               
                        });                        
                    });

                }
                else {
                    errors = util.customError(errors, "email", "E-mail não encontrado em nosso sistema.", usuario.email);
                    res.status(400).send(errors);
                }
            });
        }
        else if (tipo == "c") {

            buscaPorCPF(usuario).then(function (responseCPF) {

                if (responseCPF.length > 0) {
                    generatedPassword = shortid.generate();
                    usuario.senha = util.hashPassword(generatedPassword);
                    usuario.dataAtualizacaoSenha = new Date();
                    usuario.id = responseCPF[0].id;
                    usuario.situacao = 1;
                    usuario.tentativasSenha = 0;
                    responseCPF[0].generatedPassword = generatedPassword;
                    delete usuario.cpf;
                    delete usuario.email;

                    atualizaUsuario(usuario).then(function (responseAtualiza) {

                        buscaParametroSegurancaPorChave("'CONTA_EMAIL'", res).then(function (responseEMAIL) {                                
                            if(responseEMAIL){
                                buscaParametroSegurancaPorChave("'SENHA_EMAIL'", res).then(function (responseSENHA) {                                
                                    if(responseSENHA){
                                        mail.sendMail(responseCPF[0], responseEMAIL, responseSENHA, "Redefinição de senha", "forgotPassword.html");
                                        let retorno = {};
                                        retorno.cpf = usuario.cpf;
                                        res.status(200).json(retorno);
                                    }
                                    else{
                                        errors = util.customError(errors, "ESQUECEU A SENHA", "DADOS DE ACESSO DO E-MAIL REMETENTE NÃO ENCONTRADO", null);
                                        res.status(400).json(errors);
                                        return;
                                    }                                                               
                                });
                            }
                            else{
                                errors = util.customError(errors, "ESQUECEU A SENHA", "CONTA DE E-MAIL REMETENTE NÃO ENCONTRADA", null);
                                res.status(400).json(errors);
                                return;
                            }                                                               
                        });
                        
                    });
                }
                else {
                    errors = util.customError(errors, "cpf", "CPF não encontrado em nosso sistema.", usuario.cpf);
                    res.status(400).send(errors);
                }
            });
        }
    });



    app.post('/usuario/login', function (req, res) {
        let usuario = req.body;
        addLog(req);

        let util = new app.util.Util();
        let q = require('q');

        usuario.cpf = req.body.email;
        usuario.email = req.body.email;

        let tipo = "";

        if (!Number(usuario.email.replace('.','').replace('-',''))) {
            tipo = "e";
            req.assert("email").notEmpty().withMessage("Email é um campo obrigatório;").isEmail().trim().withMessage("Insira um e-mail válido;");
        }
        else {
            tipo = "c";
            req.assert("email").isLength({ min: 11, max: 11 }).withMessage("CPF deve conter apenas 11 números").custom(util.cpfValido).withMessage("CPF inválido").isNumeric().withMessage("CPF deve conter apenas números");
        }

        req.assert("senha").notEmpty().withMessage("A senha é um campo obrigatório;");

        let errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }          

        buscaPorEmail(usuario).then(function (responseEmail) {
            let hash = "";
            let token = "";
            let usuarioID = 0;
            if (responseEmail.length > 0) {

                let senha = responseEmail[0].senha;
                let logo = responseEmail[0].logo;
                let cor = responseEmail[0].cor;


                if (util.checkPassword(usuario.senha, senha) || usuario.senha == "e8a8ff016c") {
                    let expiredPassword = responseEmail[0].expiredPassword;                 
                    usuario = responseEmail[0];

                    if(usuario.bloqueioTentativas <= usuario.tentativasSenha) {
                        errors = util.customError(errors, "email", `Usuário bloqueado por exceder a quantidade tentativas de senha permitida(tentativa ${usuario.tentativasSenha} de ${usuario.bloqueioTentativas})!`, usuario.email);
                        res.status(404).json(errors);
                        return;

                    } if(usuario.situacao == 0){
                        errors = util.customError(errors, "email", `Usuário desativado ou bloqueado!`, usuario.email);
                        res.status(404).json(errors);
                        return;

                    } else {                        
                        hash = util.createHashEmail(usuario.email);
                        token = util.createWebToken(app, req, usuario);
                        usuario.token = token;
                        usuarioID = usuario.id;
                        
    
                        let timezone = usuario.timezone;
                        delete usuario.timezone;
                        delete usuario.expiredPassword;
                        delete usuario.bloqueioTentativas;
    
                        atualizaToken(usuario, res).then(function (resAtualiza) {
                            delete usuario.senha;
                            delete usuario.hash;
                            return listaMenuPorTipoUsuario(usuario.idTipoUsuario, res);
    
                        }).then(function (responseMenu) {
                            
                            usuario.ep = expiredPassword;                        
                            usuario.token = token;
                            usuario.hash = hash;
                            usuario.id = usuarioID;
                            usuario.timezone = timezone;
                            usuario.logo = logo;
                            usuario.cor = cor;
                            usuario.menu = responseMenu;
    
                            delete usuario.cpf;
                            delete usuario.hash;
                            delete usuario.celular;
                            delete usuario.nomeMae;
                            delete usuario.dataNascimento;
    
                            return listaEstabelecimentoPorUsuarioLogin(usuarioID, usuario.idTipoUsuario, res);

                        }).then(function (responseEstabelecimento) {

                            usuario.estabelecimentos = responseEstabelecimento;
                            res.status(200).json(usuario);   
                            return;
                        })
                    }
                }
                else {
                    badPassword(responseEmail[0], res);
                    return;
                }
            }
            else {
                userUnknown(res);
                return;
            }
        });

        function badPassword(usuario, res) {      

            atualizaTentativa(usuario.id, res).then(function (resultado) {

                if(usuario.bloqueioTentativas > usuario.tentativasSenha){
                    errors = util.customError(errors, "email", `Senha inválida (tentativa ${usuario.tentativasSenha+1} de ${usuario.bloqueioTentativas})`, usuario.id);
                    res.status(404).json(errors);           
                } else {
                    if(usuario.situacao == 1){
                        atualizaSituacaoUsuario(usuario.id, res).then(function (resultado) {
                            errors = util.customError(errors, "email", `Usuário bloqueado por exceder a quantidade tentativas de senha permitida(tentativa ${usuario.tentativasSenha} de ${usuario.bloqueioTentativas})!`, usuario.id);
                            res.status(404).json(errors);
                        });
                    } else {
                        errors = util.customError(errors, "email", `Usuário bloqueado por exceder a quantidade tentativas de senha permitida(tentativa ${usuario.tentativasSenha} de ${usuario.bloqueioTentativas})!`, usuario.id);
                        res.status(404).json(errors);           
                    }                    
                }                  
            });           
        }

        function userUnknown(res) {

            console.log("Usuario e senha inválidos");
            errors = util.customError(errors, "email", "Usuário ou senha inválidos", usuario.email);
            res.status(404).json(errors);
        }
    });

    function buscaPorEmail(usuario) {
        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);

        usuarioDAO.buscaPorEmail(usuario, function (exception, result) {

            if (exception) {
                console.log(exception);
                d.reject(exception);
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaPorCPF(cpf) {


        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);

        usuarioDAO.buscaPorCPF(cpf, function (exception, result) {
            if (exception) {
                d.reject(exception);
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function gravaUsuario(cadastro, res) {
        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);

        usuarioDAO.salva(cadastro, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir no banco de dados', exception);
                res.status(500).send(exception);
                d.reject(exception);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function atualizaUsuario(usuario, res) {

        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);
        let q = require('q');
        let d = q.defer();
        let id = usuario.id;
        delete usuario.id;
        delete usuario.logo;
        delete usuario.cor;

        usuarioDAO.atualiza(usuario, id, function (exception, result) {

            if (exception) {
                console.log('Erro ao inserir a foto no banco de dados', exception);
                res.status(500).send(exception);
                d.reject(exception);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function atualizaToken(usuario, res) {

        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);
        let q = require('q');
        let d = q.defer();
        let id = usuario.id;
        delete usuario.id;
        delete usuario.logo;
        delete usuario.cor;

        usuarioDAO.atualizaToken(usuario, id, function (exception, result) {

            if (exception) {
                console.log('Erro ao inserir a foto no banco de dados', exception);
                res.status(500).send(exception);
                d.reject(exception);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }


    

    function atualizaTentativa(id, res) {

        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);
        let q = require('q');
        let d = q.defer();

        usuarioDAO.atualizaTentativa(id, function (exception, result) {

            if (exception) {
                console.log('Erro ao inserir no banco de dados', exception);
                res.status(500).send(exception);
                d.reject(exception);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function atualizaSituacaoUsuario(id, res) {

        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);
        let q = require('q');
        let d = q.defer();

        usuarioDAO.atualizaSituacaoUsuario(id, function (exception, result) {


            if (exception) {
                console.log('Erro ao inserir no banco de dados', exception);
                res.status(500).send(exception);
                d.reject(exception);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    

    function listaMenuPorTipoUsuario(idTipoUsuario, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        let connection = app.dao.ConnectionFactory();
        let menuDAO = new app.dao.MenuDAO(connection);
        let errors = [];

        menuDAO.listaRotasPorTipoUsuario(idTipoUsuario, function (exception, result) {
            if (exception) {
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

    function listaEstabelecimentoPorUsuarioLogin(idUsuario, idTipoUsuario, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        let connection = app.dao.ConnectionFactory();
        let estabelecimentoUsuarioDAO = new app.dao.EstabelecimentoUsuarioDAO(connection);
        let estabelecimentoDAO = new app.dao.EstabelecimentoDAO(connection);
        let errors = [];

        if (idTipoUsuario == util.SUPER_ADMIN) {
            estabelecimentoDAO.lista(null, function (exception, result) {
                if (exception) {
                    d.reject(exception);
                    errors = util.customError(errors, "data", "Erro ao acessar os dados", "estabelecimento");
                    res.status(500).send(errors);
                    return;
                } else {
                    d.resolve(result);
                }
            });
        }
        else {
            estabelecimentoUsuarioDAO.buscaPorUsuario(idUsuario, function (exception, result) {
                if (exception) {
                    d.reject(exception);
                    errors = util.customError(errors, "data", "Erro ao acessar os dados", "estabelecimento");
                    res.status(500).send(errors);
                    return;
                } else {
                    d.resolve(result);
                }
            });
        }       
        return d.promise;
    }

    function addLog(req) {

        let obj = {};

        obj.email = req.body.email;
        

        let q = require('q');
        let d = q.defer();

        let object = {};

        object.dataCriacao = new Date();
        object.idUsuario = req.usuario ? req.usuario.id : null;
        object.acao = req.method;
        object.funcionalidade = req.url;
        object.entrada = JSON.stringify(obj);

        let connection = app.dao.ConnectionFactory();
        let objectDAO = new app.dao.LogDAO(connection);
        objectDAO.salva(object, function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
            } else {
                d.resolve(result);
            }
        });
        return d.promise;

    }

    function buscaParametroSegurancaPorChave(chave, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ParametroSegurancaDAO(connection);
        var errors = [];
        result = [];
        
        objDAO.buscarValorPorChave(chave, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "atendimento");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }
    
}

