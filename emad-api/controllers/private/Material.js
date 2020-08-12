module.exports = function (app) {

    const _table = "tb_material";

    app.post('/material', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        obj.periodoDispensavel = (!obj.periodoDispensavel) ?  0: obj.periodoDispensavel;
        obj.estoqueMinimo = (!obj.estoqueMinimo) ?  0: obj.estoqueMinimo;   

        req.assert("codigo").notEmpty().withMessage("O campo Código é um campo obrigatório").matches(/^[0-9]+$/).withMessage("O campo Código deve conter somente números");
        req.assert("codigo").isLength({ min: 0, max: 9 }).withMessage("O campo Código deve ter no máximo 9 dígitos");
        req.assert("descricao").notEmpty().withMessage("O campo Descrição é um campo obrigatório");
        req.assert("descricao").isLength({ min: 0, max: 60 }).withMessage("O campo Descrição deve ter no máximo 60 caractere(s)");
        req.assert("idUnidadeMaterial").notEmpty().withMessage("O campo Unidade dispensada é um campo obrigatório");
        req.assert("periodoDispensavel").matches(/^[0-9]+$/).withMessage("O campo Período dispensável deve conter somente números");
        req.assert("periodoDispensavel").isLength({ min: 0, max: 5 }).withMessage("O campo Período dispensável deve ter no máximo 5 dígitos");
        req.assert("estoqueMinimo").matches(/^[0-9]+$/).withMessage("O campo Estoque mínimo deve conter somente números");
        req.assert("estoqueMinimo").isLength({ min: 0, max: 10 }).withMessage("O campo Estoque mínimo deve ter no máximo 10 dígitos");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataCriacao = new Date;
        obj.idUsuarioCriacao = usuario.id;

        salvar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        }); 
    });

    app.put('/material', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        obj.periodoDispensavel = (!obj.periodoDispensavel) ?  0: obj.periodoDispensavel;
        obj.estoqueMinimo = (!obj.estoqueMinimo) ?  0: obj.estoqueMinimo;        

        req.assert("codigo").notEmpty().withMessage("O campo Código é um campo obrigatório").matches(/^[0-9]+$/).withMessage("O campo Código deve conter somente números");
        req.assert("codigo").isLength({ min: 0, max: 9 }).withMessage("O campo Código deve ter no máximo 9 dígitos");
        req.assert("descricao").notEmpty().withMessage("O campo Descrição é um campo obrigatório");
        req.assert("descricao").isLength({ min: 0, max: 60 }).withMessage("O campo Descrição deve ter no máximo 60 caractere(s)");
        req.assert("idUnidadeMaterial").notEmpty().withMessage("O campo Unidade dispensada é um campo obrigatório");
        req.assert("periodoDispensavel").matches(/^[0-9]+$/).withMessage("O campo Período dispensável deve conter somente números");
        req.assert("periodoDispensavel").isLength({ min: 0, max: 5 }).withMessage("O campo Período dispensável deve ter no máximo 5 dígitos");
        req.assert("estoqueMinimo").matches(/^[0-9]+$/).withMessage("O campo Estoque mínimo deve conter somente números");
        req.assert("estoqueMinimo").isLength({ min: 0, max: 10 }).withMessage("O campo Estoque mínimo deve ter no máximo 10 dígitos");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.idTipoMaterial = (!obj.idTipoMaterial) ? null : obj.idTipoMaterial;
        obj.idFamiliaMaterial = (!obj.idFamiliaMaterial) ? null : obj.idFamiliaMaterial;
        obj.idSubGrupoMaterial = (!obj.idSubGrupoMaterial) ? null : obj.idSubGrupoMaterial;
        obj.idGrupoMaterial = (!obj.idGrupoMaterial) ? null : obj.idGrupoMaterial;
        obj.idListaControleEspecial = (!obj.idListaControleEspecial) ? null : obj.idListaControleEspecial;

        obj.dataAlteracao = new Date;
        obj.idUsuarioAlteracao = usuario.id;

        atualizar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        });  
    });
   
    app.get('/material', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        if(addFilter){
            if (addFilter.descricao) {
                listaPorDescricao(addFilter, res).then(function (resposne) {
                    res.status(200).json(resposne);
                    return;
                });
            }                
            else {
                lista(res).then(function (resposne) {
                    res.status(200).json(resposne);
                    return;
                });
            }
        } 
    });       

    app.get('/material/especialidade-usuario', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;        
        let id = req.params.id;

        listaPorDescricaoUsuarioEspecialidade(addFilter, usuario.id, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/material/especialidade/:id', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;
        let id = req.params.id;

        listaPorDescricaoProfissionalEspecialidade(addFilter, id, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });  

    app.get('/material/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];


        buscarPorId(id, res).then(function(response) {
            res.status(200).json(response);
            return;      
        });
    }); 

    app.get('/material/paciente/:idPaciente/filtros', async function (req, res) {
        let usuario = req.usuario;
        let idPaciente = req.params.idPaciente;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const medicamentoRepository = new app.dao.MaterialDAO(connection);

        try {            
            var response = {};
            
            response.listaUnidades = await medicamentoRepository.carregaMedicamentoPorPaciente(idPaciente, addFilter, true);
            response.totalGeralReceitas  = 0;
            response.totalGeralRetiradas = 0;

            if(response.listaUnidades.length > 0){
                for (const itemUnidade of response.listaUnidades) {       
                    addFilter.idEstabelecimento = itemUnidade.idUnidade;
                    response.totalGeralReceitas += itemUnidade.medicamentosPorUnidade;
                    response.totalGeralRetiradas += itemUnidade.qtdRetirada;

                    var itensUnidade = await medicamentoRepository.carregaMedicamentoPorPaciente(idPaciente, addFilter, false);
                    itemUnidade.itensUnidade = itensUnidade ? itensUnidade : null;
                }            
            }   
            res.status(200).json(response);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    }); 

    app.get('/material/profissional/:idProfissional/filtros', async function (req, res) {
        let usuario = req.usuario;
        let idProfissional = req.params.idProfissional;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const medicamentoRepository = new app.dao.MaterialDAO(connection);

        try {            
            var response = {};
            
            response.listaUnidades = await medicamentoRepository.carregaMedicamentoPorProfissional(idProfissional, addFilter, true);
            response.totalQtdPrescrita  = 0;
            response.totalQtdDispensada = 0;

            if(response.listaUnidades.length > 0){
                for (const itemUnidade of response.listaUnidades) {       
                    addFilter.idEstabelecimento = itemUnidade.idUnidade;
                    response.totalQtdPrescrita += itemUnidade.totalQtdPrescrita;
                    response.totalQtdDispensada += itemUnidade.totalQtdDispensada;

                    var itensUnidade = await medicamentoRepository.carregaMedicamentoPorProfissional(idProfissional, addFilter, false);
                    itemUnidade.itensUnidade = itensUnidade ? itensUnidade : null;
                }            
            }   
            res.status(200).json(response);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    }); 

    app.delete('/material/:id', function(req,res){     
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;
        
        deletaPorId(id, res).then(function(response) {
            res.status(200).json(obj);
            return;      
        });
    });

    function lista(res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.MaterialDAO(connection);

        let errors = [];

        objDAO.lista(function (exception, result) {
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

    function listaPorDescricao(addFilter, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.MaterialDAO(connection);

        let errors = [];

        objDAO.listaPorDescricao(addFilter, function (exception, result) {
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

    function listaPorDescricaoProfissionalEspecialidade(addFilter, idProfissional, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.MaterialDAO(connection);

        let errors = [];

        objDAO.listaPorDescricaoProfissionalEspecialidade(addFilter, idProfissional, function (exception, result) {
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
    
    function listaPorDescricaoUsuarioEspecialidade(addFilter, idUsuario, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.MaterialDAO(connection);

        let errors = [];

        objDAO.listaPorDescricaoUsuarioEspecialidade(addFilter, idUsuario, function (exception, result) {
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
 
    function buscarPorId(id,  res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.MaterialDAO(connection);
        let errors =[];
     
        objDAO.buscaPorId(id, function(exception, result){
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


    function salvar(obj, res){
        delete obj.id;
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.MaterialDAO(connection);
        let q = require('q');
        let d = q.defer();

        objDAO.salva(obj, function(exception, result){
            if(exception){
                console.log('Erro ao inserir', exception);
                res.status(500).send(exception);   
                d.reject(exception);
                return;
            }
            else{   
                d.resolve(result);
            }
        });
        return d.promise; 
    }

    function atualizar(obj, res){
        let id = obj.id;
        delete obj.id;
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.MaterialDAO(connection);
        let q = require('q');
        let d = q.defer();

        objDAO.atualiza(obj, id, function(exception, result){
            if(exception){
                console.log('Erro ao alterar o registro', exception);
                res.status(500).send(exception);   
                d.reject(exception);
                return;
            }
            else{   
                d.resolve(result);
            }
        });
        return d.promise; 
    }

    function deletaPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.MaterialDAO(connection);
        let errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }
}