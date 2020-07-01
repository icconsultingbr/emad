module.exports = function (app) {

    app.get('/profissional', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.get('/profissional/equipe/:id', function (req, res) {

        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
                buscarPorEquipe(id, res).then(function (response) {
                    res.status(200).json(response);
                    return;
                });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });


    app.get('/profissional/estabelecimento/:id', function (req, res) {

        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];



        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {

            buscarPorEstabelecimento(id, res).then(function (response) {
                res.status(200).json(response);
                return;
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });




    app.get('/profissional/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
            buscarPorId(id, res).then(function (response) { 
                buscarEstabelecimentosPorUsuario(response.idUsuario, res).then(function (response2) {
                    response.estabelecimentos = response2;
                    res.status(200).json(response);
                    return;
                });
            });
        } 
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }

    });

    app.post('/profissional', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;        
        var util = new app.util.Util();
        var errors = [];
        let arrEstabelecimentos = [];
        let arrEstabelecimentosDim = [];
        let dadosUsuario = {};
        let estabelecimentos = obj.estabelecimentos;
        
        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
           
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

            buscaPorEmail(dadosUsuario).then(function (responseEmail) {
                if (responseEmail.length > 0) {
                    errors = util.customError(errors, "email", "Já existe um usuário cadastrado com este e-mail!", dadosUsuario.email);                    
                    return Promise.reject(errors);   
                }
                else {
                    return buscaPorCPF(dadosUsuario);
                }
            }).then(function (responseCPF) {
                if (responseCPF.length > 0) {
                    errors = util.customError(errors, "cpf", "Já existe um usuário cadastrado com este CPF!", dadosUsuario.cpf);                    
                    return Promise.reject(errors);   
                }
                else {
                    return gravaUsuario(dadosUsuario, res);
                }
            }).then(function (cad) {
                if (cad) {
                    dadosUsuario.id = cad.insertId;
                    obj.idUsuario = cad.insertId;
                    return salva(obj, res);
                }
                else {
                    errors = util.customError(errors, "USUÁRIO", "Erro na criação do usuário!", null);                    
                    return Promise.reject(errors);  
                }
            }).then(function (profissional) {
                if (profissional)
                    return deletaEstabelecimentosPorUsuario(dadosUsuario.id, res);
                else {
                    errors = util.customError(errors, "PROFISSIONAL", "Erro na criação do profissional!", null);                    
                    return Promise.reject(errors);  
                }
            }).then(function (responseDelete) {
                for (var i = 0; i < estabelecimentos.length; i++) {
                    arrEstabelecimentos.push("(" + dadosUsuario.id + ", " + estabelecimentos[i].id + ")");
                }
                return atualizaEstabelecimentosPorUsuario(arrEstabelecimentos, res);
            }).then(function (responseAtualiza) {
                delete dadosUsuario.senha;
                delete dadosUsuario.hash;

                token = util.createWebToken(app, req, dadosUsuario);
                dadosUsuario.token = token;

                return buscaEstabelecimentoPorProfissionalParaDim(dadosUsuario.id, res);
            }).then(function (estabelecimentosDIM) {
                if (estabelecimentosDIM){
                    for (var i = 0; i < estabelecimentosDIM.length; i++) {
                        arrEstabelecimentosDim.push("(" + estabelecimentosDIM[i].idUnidadeCorrespondenteDim + ", " + estabelecimentosDIM[i].idProfissionalCorrespondenteDim + ", NOW(), 6)");
                    }

                    if(arrEstabelecimentosDim.length > 0)
                        return atualizaEstabelecimentosPorProfissionalDim(dadosUsuario.id, arrEstabelecimentosDim, res)
                    else{
                        res.status(201).json(obj);
                        return;
                    }
                }                    
                else {
                    res.status(201).json(obj);
                    return;
                }
            }).then(function (responseAtualizaEstabelecimentos) {                    
                res.status(201).json(obj);
                return;        
            }).catch(function(error) {
                return res.status(400).json(error);
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.put('/profissional', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        let arrEstabelecimentosDim = [];
        let arrEstabelecimentos = [];        
        let dadosUsuario = {};
        let estabelecimentos = obj.estabelecimentos;


        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {

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

            buscarPorId(id).then(function (responseProfissional) {
                if (responseProfissional) {
                    dadosUsuario.id = responseProfissional.idUsuario;
                    idUsuario = responseProfissional.idUsuario;
                    return buscaPorEmail(dadosUsuario);                    
                }
                else {
                    errors = util.customError(errors, "PROFISSIONAL", "Profissional não encontrado!", null);                    
                    return Promise.reject(errors);   
                }
            }).then(function (responseEmail) {
                if (responseEmail.length > 0) {
                    errors = util.customError(errors, "email", "Já existe um usuário cadastrado com este e-mail!", dadosUsuario.email);                    
                    return Promise.reject(errors);   
                }
                else {
                    return buscaPorCPF(dadosUsuario);
                }
            }).then(function (responseCPF) {
                if (responseCPF.length > 0) {
                    errors = util.customError(errors, "cpf", "Já existe um usuário cadastrado com este CPF!", dadosUsuario.cpf);                    
                    return Promise.reject(errors);   
                }
                else {
                    return gravaUsuario(dadosUsuario, res);                    
                }
            }).then(function (responseUsuario) {
                if (responseUsuario) {
                    return atualizaPorId(obj, id, res);
                }
                else {
                    errors = util.customError(errors, "USUÁRIO", "Erro na atualização do usuário!", null);                    
                    return Promise.reject(errors);  
                }
            }).then(function (profissional) {
                obj.id = id;
                dadosUsuario.id = idUsuario;
                return deletaEstabelecimentosPorUsuario(dadosUsuario.id, res);
            }).then(function (responseDelete) {
                for (var i = 0; i < estabelecimentos.length; i++) {
                    arrEstabelecimentos.push("(" + dadosUsuario.id + ", " + estabelecimentos[i].id + ")");
                }
                return atualizaEstabelecimentosPorUsuario(arrEstabelecimentos, res);
            }).then(function (responseAtualiza) {                
                delete dadosUsuario.hash;

                token = util.createWebToken(app, req, dadosUsuario);
                dadosUsuario.token = token;
                return buscaEstabelecimentoPorProfissionalParaDim(dadosUsuario.id, res);
            }).then(function (estabelecimentosDIM) {
                if (estabelecimentosDIM){
                    for (var i = 0; i < estabelecimentosDIM.length; i++) {
                        arrEstabelecimentosDim.push("(" + estabelecimentosDIM[i].idUnidadeCorrespondenteDim + ", " + estabelecimentosDIM[i].idProfissionalCorrespondenteDim + ", NOW(), 6)");
                    }

                    if(arrEstabelecimentosDim.length > 0)
                        return atualizaEstabelecimentosPorProfissionalDim(dadosUsuario.id, arrEstabelecimentosDim, res)
                    else{
                        res.status(201).json(obj);
                        return;
                    }
                }                    
                else {
                    res.status(201).json(obj);
                    return;
                }
            }).then(function (responseAtualizaEstabelecimentos) {                    
                res.status(201).json(obj);
                return;        
            }).catch(function(error) {
                return res.status(400).json(error);
            });   
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.delete('/profissional/:id', function (req, res) {
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
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

    function atualizaPorId(obj, id, res) {

        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.ProfissionalDAO(connection, connectionDim);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {

            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "profissional");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salva(profissional, res) {
        delete profissional.id;
        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.ProfissionalDAO(connection, connectionDim);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(profissional, function (exception, result) {
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

    function atualizaEstabelecimentosPorProfissionalDim(idUsuario, estabelecimentos, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.ProfissionalDAO(connection, connectionDim);
        var errors = [];

        objDAO.atualizaEstabelecimentosPorProfissionalDim(idUsuario, estabelecimentos, function (exception, result) {
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

    function buscaEstabelecimentoPorProfissionalParaDim(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);
        var errors = [];

        objDAO.buscaEstabelecimentoPorProfissionalParaDim(id, function (exception, result) {
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

    function buscaPorEmail(usuario) {
        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);

        usuarioDAO.buscaPorEmail(usuario, function (exception, result) {
            if (exception) {
                d.reject(exception);
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaPorCPF(usuario) {
        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let usuarioDAO = new app.dao.UsuarioDAO(connection);

        usuarioDAO.buscaPorCPF(usuario, function (exception, result) {
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


        if (typeof (cadastro.id) != 'undefined' && cadastro.id != null) {
            let id = cadastro.id;
            delete cadastro.id;


            usuarioDAO.atualiza(cadastro, id, function (exception, result) {
                if (exception) {
                    console.log('Erro ao inserir no banco de dados', exception);
                    res.status(500).send(exception);
                    d.reject(exception);
                    return;
                } else {
                    d.resolve(result);

                }
            });
        }
        else {

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
        }

        return d.promise;
    }

    function deletaEstabelecimentosPorUsuario(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoUsuarioDAO(connection);
        var errors = [];

        objDAO.deletaEstabelecimentosPorUsuario(id, function (exception, result) {
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

    function atualizaEstabelecimentosPorUsuario(estabelecimentos, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoUsuarioDAO(connection);
        var errors = [];

        if(estabelecimentos.length > 0)
        {             
            objDAO.atualizaEstabelecimentosPorUsuario(estabelecimentos, function (exception, result) {
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
        }
        else
            d.resolve(null);
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