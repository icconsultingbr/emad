module.exports = function (app) {

    const _table = "tb_especialidade_entidade_campo";

    app.post('/especialidade-entidade-campo', async function(req,res){
        let obj = req.body;
        delete obj.id;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idEntidadeCampo").notEmpty().withMessage("O campo da entidade é um campo obrigatório");        
        req.assert("idEspecialidade").notEmpty().withMessage("O campo Especialidade é um campo obrigatório");        

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const especialidadeEntidadeCampoRepository = new app.dao.EspecialidadeEntidadeCampoDAO(connection);

        try {
            await connection.beginTransaction();
            
            var buscaEspecialidadeEntidadeCampo = await especialidadeEntidadeCampoRepository.buscaEntidadeCampoPorEspecialidade(obj.idEntidadeCampo, obj.idEspecialidade);

            if (buscaEspecialidadeEntidadeCampo) {

                if (buscaEspecialidadeEntidadeCampo.total > 0){                    
                    errors = util.customError(errors, "header", "O campo já está vinculado com a especialidade", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;  
                }               
            }
            
            obj.dataCriacao = new Date;
            obj.idUsuarioCriacao = usuario.id;
            obj.situacao = 1;
            
            var response = await especialidadeEntidadeCampoRepository.salva(obj);

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
   
    app.get('/especialidade-entidade-campo/especialidade', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let idEspecialidade = req.params.idEspecialidade;
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const especialidadeEntidadeCampoRepository = new app.dao.EspecialidadeEntidadeCampoDAO(connection);
        const profissionalRepository = new app.dao.ProfissionalDAO(connection);
                
        var buscaProfissional = await profissionalRepository.buscaProfissionalPorUsuarioSync(usuario.id);

        if (!buscaProfissional) {
            errors = util.customError(errors, "header", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos", "");
            res.status(400).send(errors);
            await connection.rollback();
            return;
        }

        try {
            const response = await especialidadeEntidadeCampoRepository.listaPorEspecialidade(buscaProfissional.idEspecialidade);
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

    app.delete('/especialidade-entidade-campo/:id', async function(req,res){
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;   

        const connection = await app.dao.connections.EatendConnection.connection();

        const especialidadeEntidadeCampoRepository = new app.dao.EspecialidadeEntidadeCampoDAO(connection);

        try {
            await connection.beginTransaction();
            var response = await especialidadeEntidadeCampoRepository.deletaPorId(id);
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