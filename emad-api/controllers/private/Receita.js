module.exports = function (app) {

    const _table = "tb_receita";

    app.post('/receita', async function (req, res) {
        let receita = req.body;
        delete receita.id;

        let usuario = req.usuario;
        const util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("idMunicipio").notEmpty().withMessage("O campo Município é um campo obrigatório");
        req.assert("idProfissional").notEmpty().withMessage("O campo Profissional é um campo obrigatório");
        req.assert("idPaciente").notEmpty().withMessage("O campo Paciente é um campo obrigatório");
        req.assert("idSubgrupoOrigem").notEmpty().withMessage("O campo Origem é um campo obrigatório");
        req.assert("ano").notEmpty().withMessage("O campo Ano é um campo obrigatório");
        req.assert("ano").matches(/^[0-9]+$/).withMessage("O campo Ano deve conter somente números");
        req.assert("dataEmissao").notEmpty().withMessage("O campo Data emissão é um campo obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        if (receita.idSubgrupoOrigem == "null") {
            errors = util.customError(errors, "header", "Origem é um campo obrigatório", "");
            res.status(400).send(errors);
            return;
        }

        const connection = app.dao.connections.EatendConnection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);

        try {
            await connection.beginTransaction();

            receita.dataCriacao = new Date;
            receita.idUsuarioCriacao = usuario.id;

            receita.numero = await receitaRepository.obterProximoNumero(receita.ano, receita.idEstabelecimento);
            
            var response = await receitaRepository.salva(receita);

            receita.id = response[0].insertId;

            res.status(201).send(receita);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            connection.close();
        }
    });

    app.put('/receita', async function (req, res) {
        let receita = req.body;
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("idMunicipio").notEmpty().withMessage("O campo Município é um campo obrigatório");
        req.assert("idProfissional").notEmpty().withMessage("O campo Profissional é um campo obrigatório");
        req.assert("idPaciente").notEmpty().withMessage("O campo Paciente é um campo obrigatório");
        req.assert("idSubgrupoOrigem").notEmpty().withMessage("O campo Origem é um campo obrigatório");
        req.assert("ano").notEmpty().withMessage("O campo Ano é um campo obrigatório");
        req.assert("dataEmissao").notEmpty().withMessage("O campo Data emissão é um campo obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        if (receita.idSubgrupoOrigem == "null") {
            errors = util.customError(errors, "header", "Origem é um campo obrigatório", "");
            res.status(401).send(errors);
        }

        
        const connection = app.dao.connections.EatendConnection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);
        const estoqueRepository = new app.dao.EstoqueDAO(connection);
        const movimentoGeralRepository = new app.dao.ItemReceitaDAO(connection);
        const itemMovimentoGeralRepository = new app.dao.ItemReceitaDAO(connection);
        const movimentoLivroRepository = new app.dao.ItemReceitaDAO(connection);

        try {
            await connection.beginTransaction();

            receita.dataAlteracao = new Date;
            receita.idUsuarioAlteracao = usuario.id;
            
            var responseReceita = await receitaRepository.atualizaStatus(receita);
            
            receita.itensReceita.forEach(async (itemReceita) => {
                itemReceita.idReceita = receita.id;
                itemReceita.dataCriacao = new Date;
                itemReceita.idUsuarioCriacao = usuario.id;
                itemReceita.situacao = 1;

                await itemReceitaRepository.salva(itemReceita);    
            });

            res.status(201).send(responseReceita);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            connection.close();
        }
    });

    app.get('/receita', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        lista(addFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });


    app.get('/receita/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];


        const connection = app.dao.connections.EatendConnection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);

        try {
            
            var responseReceita = await receitaRepository.buscaPorId(id);
            var receita = responseReceita[0];

            var itensReceita = await itemReceitaRepository.buscarPorReceita(id);            
            receita.itensReceita = itensReceita ? itensReceita : null;
            
            res.status(200).json(receita);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            connection.close();
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