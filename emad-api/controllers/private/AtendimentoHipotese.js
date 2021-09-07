module.exports = function (app) {

    const _table = "tb_atendimento_hipotese_diagnostica";

    app.post('/atendimento-hipotese', async function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];             

        req.assert("idPaciente").notEmpty().withMessage("Paciente é campo Obrigatório");
        req.assert("idHipoteseDiagnostica").notEmpty().withMessage("Hipótese diagnóstica é um campo Obrigatório");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoHipoteseRepository = new app.dao.AtendimentoHipoteseDiagnosticaDAO(connection);

        try {
            await connection.beginTransaction();

            if(obj.funcionalidade == 'PACIENTE')
            {
                var responseBuscaHipotese = await atendimentoHipoteseRepository.validaHipotesePorPaciente(obj);

                if (responseBuscaHipotese.length > 0) {
                    errors = util.customError(errors, "header", "Hipótese já está vinculada ao paciente!", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }
            }

            delete obj.funcionalidade;
            obj.dataCriacao = new Date;
            obj.idUsuarioCriacao = usuario.id;
            obj.situacao = 1;
            obj.idEstabelecimento = obj.idEstabelecimento;            
        
            var response = await atendimentoHipoteseRepository.salva(obj);           
            obj.id = response[0].insertId;

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.get('/atendimento-hipotese/atendimento/:id', async function(req,res){ 
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        
        try {
            const atendimentoHipoteseRepository = new app.dao.AtendimentoHipoteseDiagnosticaDAO(connection);
            const response = await atendimentoHipoteseRepository.buscarPorAtendimentoId(id);
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

    app.get('/atendimento-hipotese/paciente/:id', async function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        
        try {
            const atendimentoHipoteseRepository = new app.dao.AtendimentoHipoteseDiagnosticaDAO(connection);
            const response = await atendimentoHipoteseRepository.listarPorPaciente(id);
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

    app.get('/atendimento-hipotese/paciente-agrupado/:id', async function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        
        try {
            const atendimentoHipoteseRepository = new app.dao.AtendimentoHipoteseDiagnosticaDAO(connection);
            const response = await atendimentoHipoteseRepository.listarPorPacienteAgrupada(id);
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

    app.delete('/atendimento-hipotese/:id', async function (req, res) {
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoHipoteseRepository = new app.dao.AtendimentoHipoteseDiagnosticaDAO(connection);

        try {
            await connection.beginTransaction();

            obj.dataAlteracao = new Date;
            obj.idUsuarioAlteracao = usuario.id;
            obj.situacao = 0;            
        
            var response = await atendimentoHipoteseRepository.deletaPorId(obj);           

            res.status(201).send(response);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });
}

