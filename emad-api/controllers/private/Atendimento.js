module.exports = function (app) {


    app.get('/atendimento', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
        else {
            listaPorUsuario(usuario, addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
    });

    app.post('/atendimento/print-document', function (req, res) {
        let usuario = req.usuario;

        console.log('teste')
        res.status(200).json({ id: 1 });

    });

    app.post('/atendimento/open-document', function (req, res) {
        let object = {};
        object.msg = 'success';
        res.status(200).json(object);
        return;
    });

    app.post('/atendimento/receita-medica', function (req, res) {
        let object = {};
        object.msg = 'success';
        res.status(200).json(object);
        return;
    });

    app.get('/atendimento/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
            buscarPorId(id, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(400).send(errors);
        }
    });

    app.get('/atendimento/paciente/:id/:idEstabelecimento', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
            buscaPorPacienteId(id, usuario, idEstabelecimento, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(400).send(errors);
        }
    });

    app.post('/atendimento', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        delete obj.pacienteNome;
        obj.idUsuario = usuario.id;
        obj.idUsuarioAlteracao = null;
        var errors = [];
        let idEstabelecimento = req.headers.est;
        let mail = new app.util.Mail();

        if(!obj.situacao)
            obj.situacao = "C";

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {

            req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
            req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");

            let errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }
            
            let dadosPaciente = [];
            let templateFicha = [];
            let urlFicha = "";
            let emailRemetente = "";
            let senhaRemetente = "";
            let emailProfissional = "";
            let emailPaciente = "";

            buscaProfissionalPorUsuario(usuario.id).then(function (responseProfissional) {
                if (responseProfissional.length > 0){                    
                    emailProfissional = responseProfissional[0].email;
                    return salva(obj, res);              
                }
                else {
                    errors = util.customError(errors, "usuário", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos", "404");                                       
                    return Promise.reject(errors);                    
                }
            })
            .then(function (response) {
                if (response) {
                    obj.id = response.insertId;                    
                    obj.emailProfissional = emailProfissional;
                    let buscaChaves = "'URL_FICHA_DIGITAL_SERVICO','CONTA_EMAIL', 'SENHA_EMAIL'";
                    return buscaParametroSegurancaPorChave(buscaChaves, res);
                }
                else {
                    errors = util.customError(errors, "atendimento", "Erro ao salvar o atendimento");                    
                    return Promise.reject(errors);    
                }
            })
            .then(function (responseURL) {
                if (responseURL)  {               
                    urlFicha = responseURL.filter((url) => url.NOME == "URL_FICHA_DIGITAL_SERVICO")[0].VALOR;
                    emailRemetente = responseURL.filter((url) => url.NOME == "CONTA_EMAIL")[0].VALOR;
                    senhaRemetente = responseURL.filter((url) => url.NOME == "SENHA_EMAIL")[0].VALOR;                    
                    return buscaTemplatePorTipoFicha(obj.tipoFicha, res);                
                }
                else {
                    errors = util.customError(errors, "FICHA DIGITAL", "URL para envio da ficha digital não foi encontrada", null);
                    return Promise.reject(errors);    
                }
            }).then(function (template) {
                if (template) {                    
                    templateFicha = template;
                    return buscaDadosEnvioFicha(templateFicha.queryTemplate, obj.id);
                }
                else {
                    errors = util.customError(errors, "TEMPLATE FICHA", "Template da ficha digital não foi encontrado", null);
                    return Promise.reject(errors);    
                }
            }).then(function (dadosFicha) {
                if (dadosFicha) {
                    emailPaciente = dadosFicha.emailPaciente;
                    var client = new app.services.FichaDigitalService();
                    return client.enviaFicha(dadosFicha, urlFicha, templateFicha.xmlTemplate);
                }
                else {
                    errors = util.customError(errors, "TEMPLATE FICHA", "TEMPLATE DA FICHA DIGITAL NÃO ENCONTRADA", null);
                    return Promise.reject(errors);    
                }
            }).then(function (status) {
                if (status == 200) {
                    console.log("STATUS" + status);
                    console.log(emailPaciente);

                    if(emailPaciente != null){
                        obj.email = emailPaciente;
                        return mail.enviaEmailFicha(obj, emailRemetente, senhaRemetente, "Abertura de atendimento", "createTreatment.html");
                    }
                    else{
                        console.log(dadosPaciente.email);                
                        res.status(201).json(obj);
                        return;
                    }                       
                }
                else {
                    errors = util.customError(errors, "FICHA DIGITAL", "Erro ao criar a ficha digital", status);
                    return Promise.reject(errors);    
                }
            })
            .then(function (responseEnvioEmail) {
                if(responseEnvioEmail){
                    res.status(201).json(obj);
                    return;
                }
                else{
                    errors = util.customError(errors, "ENVIO FICHA DIGITAL", "Erro no envio do e-mail de abertura do atendimento", null);
                    return Promise.reject(errors);    
                } 
            }).catch(function(error) {
                return res.status(400).json(error);
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(400).send(errors);
        }
    });

    app.put('/atendimento/parar-atendimento', function (req, res) {

        let obj = req.body;
        let util = new app.util.Util();
        var usuario = req.usuario;
        let errors = [];
        let id = obj.id;
        delete obj.id;
        obj.idUsuarioAlteracao = usuario.id;
        delete obj.idUsuario;

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {

            req.assert("tipo").notEmpty().withMessage("Tipo um campo obrigatório;");

            if(obj.tipo == "X")
                req.assert("motivoCancelamento").notEmpty().withMessage("Motivo do cancelamento é obrigatório;");


            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            buscaProfissionalPorUsuario(usuario.id).then(function (response) {
                if (response.length > 0) {
                    buscarPorId(id, res).then(function (response) {
                        if (typeof response != 'undefined') {
                            finalizaAtendmento(obj, id, res).then(function (response2) {
                                obj.id = id;
                                res.status(200).json(obj);
                                return;
                            });
                        }
                        else {
                            errors = util.customError(errors, "body", "Atendimento não encontrado!", obj.nome);
                            res.status(404).send(errors);
                            return;
                        }
                    });
                }
                else {
                    errors = util.customError(errors, "usuário", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos");                    
                    res.status(404).json(errors);
                    return;
                }
            })
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(400).send(errors);
        }
    });

    app.put('/atendimento', function (req, res) {

        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        delete obj.id;
        delete obj.pacienteNome;        
        obj.idUsuarioAlteracao = usuario.id;
        delete obj.idUsuario;

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {

            req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
            req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");

            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            let cabecalho = "";
            let medicamentos = [];

            buscaProfissionalPorUsuario(usuario.id).then(function (response0) {
                if (response0.length > 0) {
                    buscarPorId(id, res).then(function (response) {
                        if (typeof response != 'undefined') {
                            atualizaPorId(obj, id, res).then(function (response2) {                       
                                if(!obj)
                                    return;    
                            
                                obj.unidade_receita = response.unidade_receita;
                                obj.ano_receita = response.ano_receita;
                                if(response.numero_receita)
                                    obj.numero_receita = response.numero_receita;
        
                                buscaCabecalhoReceitaDim(id, res).then(function (response3) {
                                    cabecalho = response3;
        
                                    if(cabecalho)
                                    {
                                        if (!cabecalho.paciente) {
                                            errors = util.customError(errors, "body", "O paciente não está cadastro no E-CARE", null);
                                            res.status(400).json(errors);
                                            return;
                                        } 
        
                                        if (!cabecalho.prescritor) {
                                            errors = util.customError(errors, "body", "O profissional não está cadastro no E-CARE", null);
                                            res.status(400).json(errors);
                                            return;
                                        } 
        
                                        buscaPorUfNomeDim(cabecalho.cidade, cabecalho.uf, res).then(function (response4) {   
        
                                            if (!response4.id_cidade || response4.id_cidade == 0) {
                                                errors = util.customError(errors, "RECEITA MÉDICA", "Cidade " + cabecalho.cidade + " não encontrada no E-CARE", null);
                                                res.status(400).json(errors);
                                                return;
                                            } 
        
                                            cabecalho.cidade = response4.id_cidade;                                         
                                            delete cabecalho.uf;
        
                                            buscaMedicamentoParaReceitaDim(id, res).then(function (response5) { 
                                                medicamentos = response5;                                                                           
            
                                                var dim = new app.services.DimMedicamentoService();
            
                                                if(medicamentos && medicamentos.length>0){
                                                    buscaParametroSegurancaPorChave("'URL_RECEITA_MEDICA_ENVIO'", res).then(function (response7) { 
                                                        if(response7)
                                                        {
                                                            dim.enviaReceitaMedicaDim(cabecalho, medicamentos, response7[0], function (response6, status) {   
        
                                                                if (status != 200) {
                                                                    errors = util.customError(status, "RECEITA MÉDICA", "Erro ao enviar a receita médica", null);
                                                                    res.status(400).json(errors);
                                                                    return;
                                                                }                                        
                        
                                                                var idReceita;
                                                                var numeroReceita;
                        
                                                                if(response6.split("|") && response6.includes("RIS-")){
                                                                    idReceita = response6.split("|")[1].substr(0,response6.split("|")[1].indexOf('*'));
                                                                    numeroReceita = response6.substr(0,response6.indexOf('|')).replace("RIS-",""); 
                                                                                                                            
                                                                    console.log("numeroReceita" + numeroReceita);
            
                                                                    confirmaMedicamentoParaReceitaDim(id, idReceita, numeroReceita, res).then(function (response7) {
                                                                        obj.id = id;   
                                                                        obj.numero_receita = numeroReceita;
                                                                        res.status(200).json(obj);
                                                                        return;                    
                                                                    });
                                                                }
                                                                else{
                                                                    obj.id = id;   
                                                                    res.status(200).json(obj);
                                                                    return; 
                                                                }                                                                                                  
                                                            });
                                                        }
                                                        else
                                                        {
                                                            errors = util.customError(errors, "RECEITA MÉDICA", "URL PARA ENVIO DA RECEITA NÃO ENCONTRADA", null);
                                                            res.status(400).json(errors);
                                                            return;
                                                        }
                                                    });                                                        
                                                }
                                                else{
                                                    obj.id = id;   
                                                    res.status(200).json(obj);
                                                    return;  
                                                }                                         
                                            });
                                        });
                                    }
                                    else{
                                        obj.id = id;   
                                        res.status(200).json(obj);
                                        return;  
                                    }                            
                                });
                            });
                        }
                        else {
                            errors = util.customError(errors, "body", "Atendimento não encontrado!", obj.nome);
                            res.status(404).send(errors);
                            return;
                        }
                    });
                }
                else {                    
                    errors = util.customError(errors, "usuário", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos");                    
                    res.status(400).json(errors);
                    return;
                }
            });

            
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(400).send(errors);
        }
    });

    app.delete('/atendimento/:id', function (req, res) {
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
            res.status(400).send(errors);
        }
    });


    app.get('/atendimento/dominios', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
        /*else{
            listaPorUsuario(usuario, addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }*/

    });


    function lista(addFilter, res) {

        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);

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
        var objDAO = new app.dao.AtendimentoDAO(connection);
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

    function buscaCabecalhoReceitaDim(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.buscaCabecalhoReceitaDim(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao carregar o cabeçalho dos medicamentos", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function buscaMedicamentoParaReceitaDim(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoMedicamentoDAO(connection);
        var errors = [];

        objDAO.buscaMedicamentoParaReceitaDim(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao carregar medicamentos para envio da receita", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaPorUfNomeDim(nomecidade, uf, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.MunicipioDAO(connection, connectionDim);
        var errors = [];

        objDAO.buscaPorUfNomeDim(nomecidade, uf, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao carregar a cidade do DIM", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }    

    function buscaPorPacienteId(id, usuario, idEstabelecimento, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.buscaPorPacienteId(id, usuario, idEstabelecimento, function (exception, result) {
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
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "atendimento");
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
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {
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

    function confirmaMedicamentoParaReceitaDim(id, idReceita, numeroReceita, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoMedicamentoDAO(connection);
        var errors = [];

        objDAO.confirmaMedicamentoParaReceitaDim(id, idReceita, numeroReceita, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao atualizar os dados dos medicamentos", "atendimento");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function finalizaAtendmento(obj, id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.finaliza(obj, id, function (exception, result) {
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

    function salva(atendimento, res) {
        delete atendimento.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(atendimento, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir atendimento', exception);
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

    function buscarPacientes(id, raio, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.buscarPacientes(id, raio, function (exception, result) {
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

    function lista(addFilter, res) {

        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);

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

    function listaPorUsuario(usuario, addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);

        var errors = [];

        objDAO.listaPorUsuario(usuario.id, addFilter, function (exception, result) {
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

    function buscaDadosEnvioFicha(query, id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);

        var errors = [];

        objDAO.buscaDadosFichaAtendimento(query, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }   

    function buscarPacientePorId(id) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.PacienteDAO(connection);
        var errors = [];

        objDAO.buscaPorIdFicha(id, function (exception, result) {
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

    function buscaProfissionalPorUsuario(id) {
        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let profissionalDAO = new app.dao.ProfissionalDAO(connection);

        profissionalDAO.buscaProfissionalPorUsuario(id, function (exception, result) {
            if (exception) {
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
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaTemplatePorTipoFicha(tipoFicha, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoFichaDAO(connection);
        var errors = [];
        result = [];
        
        objDAO.buscaTemplatePorId(tipoFicha, function (exception, result) {
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