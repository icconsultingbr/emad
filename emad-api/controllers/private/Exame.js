const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {

    const _table = "tb_exame";

    app.post('/exame', async function (req, res) {
        let exame = req.body;
        delete exame.id;

        let usuario = req.usuario;
        const util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("idTipoExame").notEmpty().withMessage("O campo Tipo de exame é um campo obrigatório");
        
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const repository = new app.dao.ExameDAO(connection);

        try {
            await connection.beginTransaction();

            exame.dataCriacao = new Date;
            exame.idUsuarioCriacao = usuario.id;
            exame.situacao = 1;

            var response = await repository.salva(exame);

            exame.id = response[0].insertId;
            res.status(201).send(exame);
            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.put('/exame', async function (req, res) {
        let exame = req.body;
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let situacao = 1;//PENDENTE MEDICAMENTOS
        let gravaMovimento = false;
        let movimentoGeral = {};
        let itemMovimentoGeral = {};
        const guid =  uuidv4();

        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        //req.assert("idProfissional").notEmpty().withMessage("O campo Profissional é um campo obrigatório");
        req.assert("idPaciente").notEmpty().withMessage("O campo Paciente é um campo obrigatório");
        
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        if (exame.itensExame.length == 0) {
            errors = util.customError(errors, "header", "Nenhum produto foi adicionado", "");
            res.status(400).send(errors);
            return;
        }
        
        const connection = await app.dao.connections.EatendConnection.connection();

        const exameRepository = new app.dao.ExameDAO(connection);
        const itemExameRepository = new app.dao.ItemExameDAO(connection);
        
        try {
            await connection.beginTransaction();           

            if(exame.itensExame.length > 0)
                situacao = 3;//FINALIZADA            
                
            //Gravar itens do exame
            for (const itemExame of exame.itensExame) {  
                itemReceita.situacao = 1;//FINALIZADO

                delete itemExame.nomeExame;
                delete itemExame.nomeProdutoExame;                
                delete itemExame.nomeMetodoExame;
                delete itemExame.nomeResultado;

                itemExame.idUsuarioCriacao = usuario.id;
                
                if(itemExame.id){                      
                    delete itemExame.dataCriacao;
                    delete itemExame.idUsuarioCriacao;
                    itemExame.dataAlteracao = new Date;
                    itemExame.idUsuarioAlteracao = usuario.id;
                    var item = await itemExameRepository.atualiza(itemExame);  
                }
                else{
                    var responseItemExame = await itemExameRepository.salva(itemExame);    
                    itemExame.id = responseItemExame[0].insertId; 
                }
            }           
            
            exame.dataAlteracao = new Date;
            exame.idUsuarioAlteracao = usuario.id;
            exame.situacao = (receita.acao == 'F' ? 3 : situacao);                       
            
            //atualiza o status da receita
            var responseExame = await exameRepository.atualizaStatus(exame);
           
            res.status(201).send(responseExame);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o exame (" + receita.numero + "), exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });


    app.get('/exame/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const exameRepository = new app.dao.ExameDAO(connection);
        //const itemExameRepository = new app.dao.ItemExameDAO(connection);

        try {
            
            var responseExame = await exameRepository.buscaPorId(id);

            //var itensReceita = await itemExameRepository.buscarPorReceita(id);            
            //responseExame.itensReceita = itensReceita ? itensReceita : null;

            res.status(200).json(responseExame);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });
    
    app.get('/exame', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let queryFilter = req.query;
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        
        try {
            const repository = new app.dao.ExameDAO(connection);
            const response = await repository.listar(queryFilter);
            res.status(200).json(response);
        }
        catch (exception) {
            errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
            res.status(500).send(errors);
        }
        finally{
            await connection.close();
        }
    });

    app.get('/exame/ano/:ano/idEstabelecimento/:idEstabelecimento/numero/:numero', async function (req, res) {
        let usuario = req.usuario;
        let ano = req.params.ano;
        let idEstabelecimento = req.params.idEstabelecimento;
        let numero = req.params.numero;
        let util = new app.util.Util();
        let errors = [];
        
        const connection = await app.dao.connections.EatendConnection.connection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);        
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);        
        const itemMovimentoGeralRepository = new app.dao.ItemMovimentoGeralDAO(connection);        

        try {
            
            var responseReceita = await receitaRepository.buscaReciboReceita(ano, idEstabelecimento, numero);
            var receita = responseReceita[0];

            if(receita){
                var itensReceita = await itemReceitaRepository.buscarPorReceita(receita.id);            
                receita.itensReceita = itensReceita ? itensReceita : null;

                for (const itemReceita of receita.itensReceita) {               

                    var itensEstoque = await itemMovimentoGeralRepository.buscarPorItemReceita(receita.id, itemReceita.id);            
                    itemReceita.itensEstoque = itensEstoque ? itensEstoque : null;
                }
            }
            res.status(200).json(receita);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });

    app.get('/exame/prontuario-paciente/paciente/:idPaciente', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idPaciente;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);

        try {            
            var response = await receitaRepository.buscaPorPacienteIdProntuario(id);
            res.status(200).json(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));            
        }
        finally {
            await connection.close();
        }
    });

    app.get('/exame/prontuario-vacinacao/paciente/:idPaciente', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idPaciente;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);

        try {            
            var response = await receitaRepository.buscaPorPacienteIdProntuarioVacinacao(id);
            res.status(200).json(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));            
        }
        finally {
            await connection.close();
        }
    });

    app.get('/exame/carteira-vacinacao/paciente/:idPaciente', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idPaciente;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);

        try {            
            var response = await receitaRepository.buscaCarteiraVacinacaoPorPaciente(id);
            res.status(200).json(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));            
        }
        finally {
            await connection.close();
        }
    });

    function lista(addFilter, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.ReceitaDAO(connection);

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
}