module.exports = function (app) {

    const _table = "tb_item_receita";

    app.post('/item-receita', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idReceita").notEmpty().withMessage("O campo Receita é um campo obrigatório");
        req.assert("idMaterial").notEmpty().withMessage("O campo Material é um campo obrigatório");
        req.assert("qtdPrescrita").notEmpty().withMessage("O campo Qtd. prescrita é um campo obrigatório");
        req.assert("qtdPrescrita").matches(/^[0-9]+$/).withMessage("O campo Qtd. prescrita deve conter somente números");
        req.assert("tempoTratamento").notEmpty().withMessage("O campo Tempo tratamento é um campo obrigatório");
        req.assert("tempoTratamento").matches(/^[0-9]+$/).withMessage("O campo Tempo tratamento deve conter somente números");
        req.assert("qtdDispAnterior").matches(/^[0-9]+$/).withMessage("O campo Qtd. dispensada anterior deve conter somente números");
        req.assert("qtdDispMes").matches(/^[0-9]+$/).withMessage("O campo Qtd. dispensada mês deve conter somente números");
        req.assert("numReceitaControlada").isLength({ min: 0, max: 20 }).withMessage("O campo Número receita controlada deve ter no máximo 20 caractere(s)");

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

    app.put('/item-receita', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idReceita").notEmpty().withMessage("O campo Receita é um campo obrigatório");
        req.assert("idMaterial").notEmpty().withMessage("O campo Material é um campo obrigatório");
        req.assert("qtdPrescrita").notEmpty().withMessage("O campo Qtd. prescrita é um campo obrigatório");
        req.assert("tempoTratamento").notEmpty().withMessage("O campo Tempo tratamento é um campo obrigatório");
        req.assert("numReceitaControlada").isLength({ min: 0, max: 20 }).withMessage("O campo Número receita controlada deve ter no máximo 20 caractere(s)");
        
        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataAlteracao = new Date;
        obj.idUsuarioAlteracao = usuario.id;

        atualizar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        });  
    });
   
    app.get('/item-receita', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        lista(res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });


    app.get('/item-receita/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function(response) {
            res.status(200).json(response);
            return;      
        });
    }); 

    

    app.get('/item-receita/idMaterial/:idMaterial/idPaciente/:idPaciente', async function (req, res) {
        let usuario = req.usuario;
        let idMaterial = req.params.idMaterial;
        let idPaciente = req.params.idPaciente;        
        let util = new app.util.Util();
        let errors = [];
        
        const connection = await app.dao.connections.EatendConnection.connection();
   
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);             

        try {            
            var responseItemReceita = await itemReceitaRepository.buscarMaterialDispensadoPorPaciente(idMaterial, idPaciente);
            res.status(200).json(responseItemReceita);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });

    app.get('/item-receita/receita/:idReceita', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idReceita;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);
        try {
            
            var itensReceita = await itemReceitaRepository.buscarPorReceita(id);            
            res.status(200).json(itensReceita);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });

    app.delete('/item-receita/:id', function(req,res){     
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
        let objDAO = new app.dao.ItemReceitaDAO(connection);

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
 
    function buscarPorId(id,  res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.ItemReceitaDAO(connection);
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
        let objDAO = new app.dao.ItemReceitaDAO(connection);
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
        let objDAO = new app.dao.ItemReceitaDAO(connection);
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
        let objDAO = new app.dao.ItemReceitaDAO(connection);
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