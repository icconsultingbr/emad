module.exports = function (app) {

    const _table = "tb_pedido_compra";

    app.post('/pedido-compra', async function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("numeroPedido").isLength({ min: 0, max: 255 }).withMessage("O campo Número deve ter no máximo 255 caractere(s)");
        req.assert("numeroEmpenho").isLength({ min: 0, max: 255 }).withMessage("O campo Empenho deve ter no máximo 255 caractere(s)");        

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataCriacao = new Date;
        obj.idUsuarioCriacao = usuario.id;
        obj.situacao = 1;
        obj.status = 'A';

        const connection = await app.dao.connections.EatendConnection.connection();

        const pedidoCompraRepository = new app.dao.PedidoCompraDAO(connection);

        try {
            await connection.beginTransaction();
            
            var response = await pedidoCompraRepository.salva(obj);
            obj.id = response[0].insertId;
            
            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.put('/pedido-compra', async function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("numeroPedido").isLength({ min: 0, max: 255 }).withMessage("O campo Número deve ter no máximo 255 caractere(s)");
        req.assert("numeroEmpenho").isLength({ min: 0, max: 255 }).withMessage("O campo Empenho deve ter no máximo 255 caractere(s)");        
        
        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataAlteracao = new Date;
        obj.idUsuarioAlteracao = usuario.id;

        const connection = await app.dao.connections.EatendConnection.connection();

        const pedidoCompraRepository = new app.dao.PedidoCompraDAO(connection);
        const itemPedidoCompraRepository = new app.dao.ItemPedidoCompraDAO(connection);

        try {
            await connection.beginTransaction();
            
            var response = await pedidoCompraRepository.atualiza(obj, obj.id);

            if(obj.itensPedidoCompraExcluidos && obj.itensPedidoCompraExcluidos.length > 0){
                for (const itemPedidoCompraExcluido of obj.itensPedidoCompraExcluidos) {  
                    if(itemPedidoCompraExcluido.id){                      
                        itemPedidoCompraExcluido.dataAlteracao = new Date;
                        itemPedidoCompraExcluido.idUsuarioAlteracao = usuario.id;
                        itemPedidoCompraExcluido.situacao = 0;//EXCLUIDO
                        var item = await itemPedidoCompraRepository.atualiza(itemPedidoCompraExcluido);  
                    }
                }
            }

            if(obj.itensPedidoCompra && obj.itensPedidoCompra.length > 0){
                for (const itemPedidoCompra of obj.itensPedidoCompra) {  
                    itemPedidoCompra.dataCriacao = new Date;
                    itemPedidoCompra.idUsuarioCriacao = usuario.id;
                    itemPedidoCompra.situacao = 1;//FINALIZADO
                    
                    if(itemPedidoCompra.id){                      
                        delete itemPedidoCompra.dataCriacao;
                        delete itemPedidoCompra.idUsuarioCriacao;
                        itemPedidoCompra.dataAlteracao = new Date;
                        itemPedidoCompra.idUsuarioAlteracao = usuario.id;
                        var item = await itemPedidoCompraRepository.atualiza(itemPedidoCompra);  
                    }
                    else{
                        var responseItemPedidoCompra = await itemPedidoCompraRepository.salva(itemPedidoCompra);    
                        itemPedidoCompra.id = responseItemPedidoCompra[0].insertId; 
                    }
                }
            }
            await connection.commit();
            res.status(201).send(obj);            
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });
   
    app.get('/pedido-compra', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        const query = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const pedidoCompraRepository = new app.dao.PedidoCompraDAO(connection);

        try {
            var response = await pedidoCompraRepository.lista(query.sortColumn, query.sortOrder);
            res.status(201).send(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/pedido-compra/listaEmpenho', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const pedidoCompraRepository = new app.dao.PedidoCompraDAO(connection);

        try {
            var response = await pedidoCompraRepository.listaEmpenho();
            res.status(201).send(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/pedido-compra/:id', async function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const pedidoCompraRepository = new app.dao.PedidoCompraDAO(connection);
        const itemPedidoCompraRepository = new app.dao.ItemPedidoCompraDAO(connection);

        try {
            var responsePedidoCompra = await pedidoCompraRepository.buscaPorId(id);
            var pedido = responsePedidoCompra[0];
            
         var itensPedidoCompra = await itemPedidoCompraRepository.buscarPorPedidoCompra(id);            
            pedido.itensPedidoCompra = itensPedidoCompra ? itensPedidoCompra : null;

            res.status(201).send(pedido);

        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
        }
        finally {
            await connection.close();
        }
    }); 

    app.delete('/pedido-compra/:id', async function(req,res){     
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        const connection = await app.dao.connections.EatendConnection.connection();

        const pedidoCompraRepository = new app.dao.PedidoCompraDAO(connection);

        try {
            await connection.beginTransaction();
            
            var response = await pedidoCompraRepository.deletaPorId(obj.id);
            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });
}