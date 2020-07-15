module.exports = function (app) {

    const _table = "tb_estoque";

    app.post('/estoque', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idFabricanteMaterial").notEmpty().withMessage("O campo Fabricante é um campo obrigatório");
        req.assert("idMaterial").notEmpty().withMessage("O campo Material é um campo obrigatório");
        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("lote").notEmpty().withMessage("O campo Lote é um campo obrigatório");
        req.assert("lote").isLength({ min: 0, max: 30 }).withMessage("O campo Lote deve ter no máximo 30 caractere(s)");
        req.assert("validade").notEmpty().withMessage("O campo Validade é um campo obrigatório");
        req.assert("quantidade").notEmpty().withMessage("O campo Quantidade é um campo obrigatório");
        req.assert("quantidade").matches(/^[0-9]+$/).withMessage("O campo Quantidade deve conter somente números");
        req.assert("motivoBloqueio").isLength({ min: 0, max: 120 }).withMessage("O campo Motivo bloqueio deve ter no máximo 120 caractere(s)");        

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataCriacao = new Date;
        obj.idUsuarioCriacao = usuario.id;
        obj.validade = util.dateToISO(obj.validade);
        
        salvar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        }); 
    });

    app.put('/estoque', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idFabricanteMaterial").notEmpty().withMessage("O campo Fabricante é um campo obrigatório");
        req.assert("idMaterial").notEmpty().withMessage("O campo Material é um campo obrigatório");
        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("lote").notEmpty().withMessage("O campo Lote é um campo obrigatório");
        req.assert("lote").isLength({ min: 0, max: 30 }).withMessage("O campo Lote deve ter no máximo 30 caractere(s)");
        req.assert("validade").notEmpty().withMessage("O campo Validade é um campo obrigatório");
        req.assert("quantidade").notEmpty().withMessage("O campo Quantidade é um campo obrigatório");
        req.assert("motivoBloqueio").isLength({ min: 0, max: 120 }).withMessage("O campo Motivo bloqueio deve ter no máximo 120 caractere(s)");
        
        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataAlteracao = new Date;
        obj.idUsuarioAlteracao = usuario.id;
        obj.validade = util.dateToISO(obj.validade);

        atualizar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        }); 
    });
   
    app.get('/estoque', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        lista(addFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });


    app.get('/estoque/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];


        buscarPorId(id, res).then(function(response) {
            res.status(200).json(response);
            return;      
        });
    }); 
    
    app.get('/estoque/unidade/:idEstabelecimento/pesquisa', async function (req, res) {
        let usuario = req.usuario;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorUnidade(idEstabelecimento, addFilter);
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });    

    app.get('/estoque/unidade/:idEstabelecimento/relatorio', async function (req, res) {
        let usuario = req.usuario;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorUnidade(idEstabelecimento, addFilter);            
            for (const itemEstoque of responseEstoque) {               
                var itensEstoque = await estoqueRespository.carregaEstoquePorUnidadeDetalhe(itemEstoque.idMaterial, idEstabelecimento);
                itemEstoque.itensEstoque = itensEstoque ? itensEstoque : null;
            }
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });  

    app.get('/estoque/unidade/:idEstabelecimento/material/:idMaterial', async function (req, res) {        
        let idEstabelecimento = req.params.idEstabelecimento;
        let idMaterial = req.params.idMaterial;
        let util = new app.util.Util();

        let errors = [];
        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorUnidadeDetalhe(idMaterial,idEstabelecimento);
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    }); 

    app.get('/estoque/material/:idMaterial/tipo-pesquisa/:tipoPesquisa', async function (req, res) {
        let usuario = req.usuario;
        let idMaterial = req.params.idMaterial;
        let tipoPesquisa = req.params.tipoPesquisa;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorMedicamento(idMaterial);
            
            if(tipoPesquisa == "relatorio")
            {
                for (const itemEstoque of responseEstoque) {               
                    var itensEstoque = await estoqueRespository.carregaEstoquePorUnidadeDetalhe(itemEstoque.idMaterial, itemEstoque.idEstabelecimento);
                    itemEstoque.itensEstoque = itensEstoque ? itensEstoque : null;
                }
            }
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });  

    app.get('/estoque/material/:idMaterial/estabelecimento/:idEstabelecimento/consumo', async function (req, res) {
        let usuario = req.usuario;
        let idMaterial = req.params.idMaterial;
        let idEstabelecimento = req.params.idEstabelecimento;        
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorConsumo(idMaterial, idEstabelecimento, addFilter);            
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });  

    app.delete('/estoque/:id', function(req,res){     
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

    function lista(addFilter, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.EstoqueDAO(connection);

        let errors = [];

        objDAO.lista(addFilter, function (exception, result) {
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
        let objDAO = new app.dao.EstoqueDAO(connection);
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
        let objDAO = new app.dao.EstoqueDAO(connection);
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
        let objDAO = new app.dao.EstoqueDAO(connection);
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
        let objDAO = new app.dao.EstoqueDAO(connection);
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