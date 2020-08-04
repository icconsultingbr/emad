module.exports = function (app) {

    app.get('/dominios/uf', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.UfDAO(connection);

        listaDominios(dao, "uf", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });


    app.get('/dominios/especialidade', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.EspecialidadeDAO(connection);

        listaDominios(dao, "especialidade", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });


    app.get('/dominios/tipo-unidade', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.TipoUnidadeDAO(connection);

        listaDominios(dao, "tipo-unidade", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/nacionalidade', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.NacionalidadeDAO(connection);

        listaDominios(dao, "nacionalidade", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/estabelecimento', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.EstabelecimentoDAO(connection);
        

        listaDominios(dao, "estabelecimento", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/modalidade', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.ModalidadeDAO(connection);
        
        listaDominios(dao, "modalidade", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/equipe', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.EquipeDAO(connection);
        
        listaDominios(dao, "Equipe EMAD", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/hipotese-diagnostica', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.HipoteseDiagnosticaDAO(connection);
        
        listaDominios(dao, "Hipótese diagnóstica", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/medicamento', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.MedicamentoDAO(connection);
        
        listaDominios(dao, "Medicamentos", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/profissional', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.ProfissionalDAO(connection);
        
        listaDominios(dao, "Profissional", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/caneta', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.CanetaDAO(connection);
        
        listaDominios(dao, "Caneta", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/modelo-caneta', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.ModeloCanetaDAO(connection);
        
        listaDominios(dao, "Modelo de caneta", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/tipo-ficha', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.TipoFichaDAO(connection);
        
        listaDominios(dao, "Tipo de ficha", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/usuario', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.UsuarioDAO(connection);
        
        listaDominios(dao, "Usuário", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/raca', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.RacaDAO(connection);
        
        listaDominios(dao, "Raça", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/grupo-origem-receita', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_grupo_origem_receita");

        listaDominios(dao, "Grupo origem de receita", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/livro', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_livro");

        listaDominios(dao, "Livros", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/atencao-continuada', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_atencao_continuada");

        listaDominios(dao, "Grupo de atençao continuada", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/grupo-material', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_grupo_material");

        listaDominios(dao, "Grupo origem de receita", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/tipo-material', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_tipo_material");

        listaDominios(dao, "Tipo de material", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/tipo-movimento', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_tipo_movimento");

        listaDominios(dao, "Tipo de movimento", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/motivo-fim-receita', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_motivo_fim_receita");

        listaDominios(dao, "Motivo fim receita", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/fabricante-material', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_fabricante_material");

        listaDominios(dao, "Fabricante de material", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/lista-controle-especial', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.ListaControleEspecialDAO(connection, "tb_lista_controle_especial");

        listaDominios(dao, "Lista de controle especial", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/tipo-usuario', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.TipoUsuarioDAO(connection);

        listaDominios(dao, "tipo-usuario", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/unidade-material', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_unidade_material");

        listaDominios(dao, "Unidade de material", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/tipo-notificacao', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_tipo_notificacao");

        listaDominios(dao, "Tipos de notificações", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/cor-classificacao-risco', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_cor_classificacao_risco");

        listaDominios(dao, "Cor de classificação do risco", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/classificacao-risco', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_classificacao_risco");

        listaDominios(dao, "Classificação de risco", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/grupo-origem', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_grupo_origem");

        listaDominios(dao, "Grupos de origem", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
                
    app.get('/dominios/municipios', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_municipio");

        listaDominios(dao, "Municípios", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/subgrupo-origem', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection, "tb_subgrupo_origem");

        listaDominios(dao, "Sub grupo de origem", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/item-receita', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection);

        listaDominios(dao, "Itens da receita", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/pedido-compra', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection);

        listaDominios(dao, "Pedido de compra", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    app.get('/dominios/item-pedido-compra', function(req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.GenericDAO(connection);

        listaDominios(dao, "Item do pedido de compra", res).then(function(response) {
            res.status(200).json(response);
            return;
        });
    });
        
    function listaDominios(dao, dom, res) {
        var q = require('q');
        var d = q.defer();
        
        var util = new app.util.Util();      
        var errors = [];

        dao.dominio(function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", dom);
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

}


