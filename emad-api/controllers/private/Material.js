module.exports = function (app) {

    const _table = "tb_material";

    app.post('/material', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        obj.periodoDispensavel = (!obj.periodoDispensavel || obj.periodoDispensavel.trim() == "") ?  0: obj.periodoDispensavel;
        obj.estoqueMinimo = (!obj.estoqueMinimo || obj.estoqueMinimo.trim() == "") ?  0: obj.estoqueMinimo;

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

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){
            salvar(obj, res).then(function(response) {
                obj.id = response.insertId;
                res.status(201).send(obj);
            });  

        } else{
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.put('/material', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        obj.periodoDispensavel = (!obj.periodoDispensavel || obj.periodoDispensavel.trim() == "") ?  0: obj.periodoDispensavel;
        obj.estoqueMinimo = (!obj.estoqueMinimo || obj.estoqueMinimo.trim() == "") ?  0: obj.estoqueMinimo;        

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

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){
            atualizar(obj, res).then(function(response) {
                obj.id = response.insertId;
                res.status(201).send(obj);
            });  

        } else{
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });
   
    app.get('/material', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario <= util.SUPER_ADMIN) {
            lista(res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });


    app.get('/material/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];


        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            buscarPorId(id, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    app.delete('/material/:id', function(req,res){     
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;
        
        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){	
            deletaPorId(id, res).then(function(response) {
                res.status(200).json(obj);
                return;      
            });

        } else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
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