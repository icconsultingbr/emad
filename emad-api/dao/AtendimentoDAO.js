const QueryBuilder = require('../infrastructure/QueryBuilder');

function AtendimentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento";
}

AtendimentoDAO.prototype.listarAsync = async function(addFilter) { 
    let where = "";
    let offset = "";
    let orderBy = addFilter.sortColumn ? `${addFilter.sortColumn}` : "id";

    if(addFilter != null){       

        if(addFilter.cartaoSus){
            where+=" AND p.cartaoSus LIKE '%"+addFilter.cartaoSus+"%'";
        }

        if(addFilter.cpf){
            where+=" AND p.cpf = '"+addFilter.cpf+"'";
        }

        if (addFilter.nomePaciente) {
            where+=" AND p.nome LIKE '%"+addFilter.nomePaciente+"%'";
        }

        if (addFilter.dataCriacao) {
           
            where+=" AND a.dataCriacao >= '"+addFilter.dataCriacao+" 00:00:00' AND a.dataCriacao <= '"+addFilter.dataCriacao+" 23:59:59'";
        }

        if (addFilter.idEstabelecimento) {
            where+=" AND a.idEstabelecimento  = "+addFilter.idEstabelecimento;
        }

        if (addFilter.situacao) {
            where+=" AND a.situacao  = '"+addFilter.situacao+"'";
            
            if(addFilter.situacao == "0")
                orderBy = " cla.peso desc, a.dataCriacao asc ";
        }

        if(addFilter.idSap){
            where+=" AND p.idSap like '%"+addFilter.idSap+"%'";
        }

        if(addFilter.idPaciente){
            where+=" AND p.id = "+addFilter.idPaciente + " ";
        }

        if(addFilter.limit && addFilter.offset){
            offset = `LIMIT ${addFilter.limit} OFFSET ${addFilter.limit * addFilter.offset}`;
        }

        if (addFilter.pesquisaCentral) {
            where += ` AND (p.cartaoSus LIKE '%${addFilter.pesquisaCentral}%' OR
                            p.idSap LIKE '%${addFilter.pesquisaCentral}%' OR
                            UPPER(p.nome) LIKE UPPER('%${addFilter.pesquisaCentral}%') OR                            
                            UPPER(pro.nome) LIKE UPPER('%${addFilter.pesquisaCentral}%') OR   
                            UPPER(ficha.nome) LIKE UPPER('%${addFilter.pesquisaCentral}%') OR   
                            replace(replace(p.cpf,'.',''),'-','') LIKE replace(replace('%${addFilter.pesquisaCentral}%','.',''),'-','') OR
                            a.id LIKE '%${addFilter.pesquisaCentral}%')`;
        }
    }

    const join = ` FROM ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    INNER JOIN tb_usuario u ON(a.idUsuario = u.id) 
    INNER JOIN tb_profissional pro on pro.idUsuario = u.id
    INNER JOIN tb_classificacao_risco cla on cla.id = a.idClassificacaoRisco
    INNER JOIN tb_cor_classificacao_risco cor on cor.id = cla.idCorClassificacaoRisco
    INNER JOIN tb_tipo_ficha ficha on ficha.id = a.tipoFicha
    WHERE 1=1 ${where} `;

    const count = await this._connection.query(`SELECT COUNT(1) as total ${join}`);

    const query = QueryBuilder.datatable(`SELECT 
                                            a.id, 
                                            a.idPaciente, 
                                            p.cartaoSus,
                                            p.cpf, 
                                            p.nome as nomePaciente, 
                                            a.dataCriacao,
                                            a.dataFinalizacao, 
                                            a.idEstabelecimento, 
                                            e.nomeFantasia, 
                                            a.idUsuario, 
                                            pro.nome, 
                                            a.situacao,
                                            p.idSap,
                                            a.tipoFicha,
                                            a.idClassificacaoRisco,
                                            cor.cor corIconeGrid,
                                            cla.nome tooltipIconeGrid,
                                            p.idPacienteCorrespondenteDim,
                                            YEAR(a.dataCriacao) as ano_receita,
                                            a.numeroReceita as numero_receita,
                                            e.id as unidade_receita,
                                            pro.id as idProfissional,
                                            ficha.nome tipoFichaNome
                                            ${join}`, orderBy, addFilter.sortOrder, addFilter.limit, addFilter.offset);

    const result = await this._connection.query(query);

    return {
        total: count[0].total,
        items: result
    }
}

AtendimentoDAO.prototype.lista = function(addFilter, callback) { 
    let where = "";

    if(addFilter != null){       

        if(addFilter.cartaoSus){
            where+=" AND p.cartaoSus LIKE '%"+addFilter.cartaoSus+"%'";
        }

        if(addFilter.cpf){
            where+=" AND p.cpf = '"+addFilter.cpf+"'";
        }

        if (addFilter.nomePaciente) {
            where+=" AND p.nome LIKE '%"+addFilter.nomePaciente+"%'";
        }

        if (addFilter.dataCriacao) {
           
            where+=" AND a.dataCriacao >= '"+addFilter.dataCriacao+" 00:00:00' AND a.dataCriacao <= '"+addFilter.dataCriacao+" 23:59:59'";
        }

        if (addFilter.idEstabelecimento) {
            where+=" AND a.idEstabelecimento  = "+addFilter.idEstabelecimento;
        }

        if (addFilter.situacao) {
            where+=" AND a.situacao  = '"+addFilter.situacao+"'";
        }

        if(addFilter.idSap){
            where+=" AND p.idSap like '%"+addFilter.idSap+"%'";
        }

        if(addFilter.idPaciente){
            where+=" AND p.id = "+addFilter.idPaciente + " ";
        }
    }

    this._connection.query(`SELECT 
        a.id, 
        a.idPaciente, 
        p.cartaoSus,
        p.cpf, 
        p.nome as nomePaciente, 
        a.dataCriacao,
        a.dataFinalizacao, 
        a.idEstabelecimento, 
        e.nomeFantasia, 
        a.idUsuario, 
        pro.nome, 
        a.situacao,
        p.idSap,
        a.tipoFicha,
        a.idClassificacaoRisco,
        cor.cor corIconeGrid,
        cla.nome tooltipIconeGrid,
        p.idPacienteCorrespondenteDim,
        YEAR(a.dataCriacao) as ano_receita,
        a.numeroReceita as numero_receita,
        e.id as unidade_receita,
        pro.id as idProfissional,
        ficha.nome tipoFichaNome
    FROM ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    INNER JOIN tb_usuario u ON(a.idUsuario = u.id) 
    INNER JOIN tb_profissional pro on pro.idUsuario = u.id
    INNER JOIN tb_classificacao_risco cla on cla.id = a.idClassificacaoRisco
    INNER JOIN tb_cor_classificacao_risco cor on cor.id = cla.idCorClassificacaoRisco
    INNER JOIN tb_tipo_ficha ficha on ficha.id = a.tipoFicha
    WHERE 1=1 ${where} 
    ORDER BY a.id DESC`, callback);
}

AtendimentoDAO.prototype.listaPorUsuario = function(id, addFilter, callback) {   
    let where = "";

    if(addFilter != null){       

        if(addFilter.cartaoSus){
            where+=" AND p.cartaoSus LIKE '%"+addFilter.cartaoSus+"%'";
        }

        if(addFilter.cpf){
            where+=" AND p.cpf = '"+addFilter.cpf+"'";
        }

        if (addFilter.nomePaciente) {
            where+=" AND p.nome LIKE '%"+addFilter.nomePaciente+"%'";
        }

        if (addFilter.dataCriacao) {
           
            where+=" AND a.dataCriacao >= '"+addFilter.dataCriacao+" 00:00:00' AND a.dataCriacao <= '"+addFilter.dataCriacao+" 23:59:59'";
        }

        if (addFilter.idEstabelecimento) {
            where+=" AND a.idEstabelecimento  = "+addFilter.idEstabelecimento;
        }

        if (addFilter.situacao) {
            where+=" AND a.situacao  = '"+addFilter.situacao+"'";
        }

        if(addFilter.idSap){
            where+=" AND p.idSap like '%"+addFilter.idSap+"%'";
        }

        if(addFilter.idPaciente){
            where+=" AND p.id = "+addFilter.idPaciente + " ";
        }
    }

    this._connection.query(`SELECT 
        a.id, 
        a.idPaciente, 
        p.cartaoSus,
        p.cpf, 
        p.nome as nomePaciente, 
        a.dataCriacao,
        a.dataFinalizacao, 
        a.idEstabelecimento, 
        e.nomeFantasia, 
        a.idUsuario, 
        pro.nome, 
        a.situacao, 
        p.idSap,
        a.tipoFicha,
        a.idClassificacaoRisco,
        cor.cor corIconeGrid,
        cla.nome tooltipIconeGrid,
        p.idPacienteCorrespondenteDim,
        YEAR(a.dataCriacao) as ano_receita,
        a.numeroReceita as numero_receita,
        e.id as unidade_receita,
        pro.id as idProfissional,
        ficha.nome tipoFichaNome
    FROM ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    INNER JOIN tb_usuario u ON(a.idUsuario = u.id) 
    INNER JOIN tb_profissional pro on pro.idUsuario = u.id
    INNER JOIN tb_classificacao_risco cla on cla.id = a.idClassificacaoRisco
    INNER JOIN tb_cor_classificacao_risco cor on cor.id = cla.idCorClassificacaoRisco
    INNER JOIN tb_tipo_ficha ficha on ficha.id = a.tipoFicha
    WHERE a.idUsuario = ? ${where} 
    ORDER BY a.id DESC`, id, callback);
}

AtendimentoDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query(`select p.nome,
                                p.historiaProgressaFamiliar pacienteHistoriaProgressa,
                                YEAR(a.dataCriacao) as ano_receita,
                                a.numeroReceita as numero_receita,
                                e.id as unidade_receita,
                                a.* from ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id) 
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    WHERE a.id = ?` ,id,callback); 
}

AtendimentoDAO.prototype.buscaPorHistoricoId = async function (idHistorico) {
    const response =  await this._connection.query(`select p.nome,
                                p.historiaProgressaFamiliar pacienteHistoriaProgressa,
                                YEAR(a.dataCriacao) as ano_receita,
                                a.numeroReceita as numero_receita,
                                e.id as unidade_receita,                              
                                tipo_historico.nome nomeTipoHistorico, 
                                usu.nome nomeProfissional, 
                                DATE_FORMAT(DATE_ADD(a.dataCriacao, INTERVAL -3 hour),'%d/%m/%Y %H:%i:%s') dataHistorico,
                                a.* from tb_atendimento_historico a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id) 
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    inner join tb_tipo_atendimento_historico tipo_historico on tipo_historico.id = a.idTipoAtendimentoHistorico
    inner join tb_usuario usu on usu.id = a.idUsuario
    WHERE a.id = ?` ,idHistorico); 
    return response;
}

AtendimentoDAO.prototype.buscaPorPacienteId = function (idPaciente, usuario, idEstabelecimento, callback) {    
    this._connection.query("select * from "+this._table + " WHERE idPaciente = ? AND dataFinalizacao IS NULL AND dataCancelamento IS NULL AND idEstabelecimento = ? AND idUsuario = ?" ,[idPaciente,idEstabelecimento,usuario.id],callback); 
}

AtendimentoDAO.prototype.buscaPorPacienteIdProntuario = async function (idPaciente, tipo) {    
    var where = "";

    if(tipo == 2)
        where = " and ficha.tipo in (1, 2) ";
    else if(tipo == 3)
        where = " and ficha.tipo = 3 ";     

    const response =  await this._connection.query(`select a.*, 
                                CASE  
                                WHEN a.situacao = '0'  THEN 'Sala de espera'  
                                WHEN a.situacao = 'A'  THEN 'Alta'  
                                WHEN a.situacao = 'C' THEN 'Em aberto'  
                                WHEN a.situacao = 'E' THEN 'Evasão'  
                                WHEN a.situacao = 'O' THEN 'Óbito'  
                                WHEN a.situacao = '2' THEN 'Concluído'  
                                WHEN a.situacao = '5' THEN 'Transferência hospitalar/ambulatório'  
                                WHEN a.situacao = '6' THEN 'Transferência unidade prisional'  
                                WHEN a.situacao = '7' THEN 'Desinternação'  
                                WHEN a.situacao = '8' THEN 'Álvara de soltura'  
                                ELSE 'Cancelado'
                                END as situacaoNome,
                                ficha.nome fichaNome,
                                clas.nome classificacaoNome,
                                estabelecimento.nomeFantasia estabelecimentoNome,
                                usuario.nome nomeProfissional
    from tb_atendimento a 
    inner join tb_tipo_ficha ficha on ficha.id = a.tipoFicha
    inner join tb_classificacao_risco clas on clas.id = a.idClassificacaoRisco
    inner join tb_estabelecimento estabelecimento on a.idEstabelecimento = estabelecimento.id
    inner join tb_usuario usuario on usuario.id = a.idUsuario
    WHERE a.idPaciente = ? ${where} order by a.id desc`, idPaciente); 
    return response;
}


AtendimentoDAO.prototype.buscaSinaisVitaisPorPacienteId = async function (idPaciente, tipo) {    
    var where = "";
    
    if(tipo == 'pressaoArterial')
        where = " and a.pressaoArterial is not null and a.pressaoArterial <> ''  ";     
    else if(tipo == 'pulso')
        where = " and a.pulso is not null and a.pulso <> ''  ";     
    else if(tipo == 'saturacao')
        where = " and a.saturacao is not null and a.saturacao <> ''  ";     
    else if(tipo == 'temperatura')
        where = " and a.temperatura is not null and a.temperatura <> ''  ";     
    else if(tipo == 'peso')
        where = " and a.peso is not null and a.peso <> ''  ";     

    const response =  await this._connection.query(`select a.id, a.pressaoArterial, a.pulso, a.saturacao, a.temperatura, a.peso, a.dataCriacao,
    DATE_FORMAT(a.dataCriacao,'%d/%m/%Y') as label
    from tb_atendimento a     
    WHERE a.idPaciente = ? ${where} order by a.id desc`, idPaciente); 
    return response;
}

AtendimentoDAO.prototype.salva = function(objeto,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

AtendimentoDAO.prototype.salvaSync = async function(objeto) {
    const response = await this._connection.query("INSERT INTO "+this._table+" SET ?", objeto);
    return [response];
}

AtendimentoDAO.prototype.salvaHistoricoSync = async function(objeto) {
    const response = await this._connection.query("INSERT INTO tb_atendimento_historico SET ?", objeto);
    return [response];
}

AtendimentoDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

AtendimentoDAO.prototype.buscaCabecalhoReceitaDim = function (id, callback) {
    this._connection.query(`SELECT 
                                YEAR(now()) as ano,
                                est.idUnidadeRegistroReceitaDim as unidade,
                                pac.idPacienteCorrespondenteDim as paciente,
                                pro.idProfissionalCorrespondenteDim as prescritor,
                                0 as id_mandado_judicial,
                                6 as id_login, 
                                pac.idPacienteCorrespondenteDim as id_paciente,
                                est.idUnidadeRegistroReceitaDim as id_unidade_sistema,
                                UUID() as num_controle,
                                mun.nome cidade,
                                mun.uf      
                            from tb_atendimento atend
                            inner join tb_estabelecimento est on est.id = atend.idEstabelecimento 
                            inner join tb_paciente pac on pac.id = atend.idPaciente 
                            inner join tb_usuario usu on usu.id = atend.idUsuario
                            inner join tb_profissional pro on pro.idUsuario = usu.id
                            inner join tb_municipio mun on mun.id = est.idMunicipio 
                            WHERE  atend.id = ?
                            and exists (select 1 from tb_atendimento_medicamento tam where tam.idAtendimento = atend.id and enviado=0)` , id, callback); 
}

AtendimentoDAO.prototype.buscaDadosFichaAtendimento = function (command, id ,callback) {
    this._connection.query(command + id,callback);
}

AtendimentoDAO.prototype.buscaDadosFichaAtendimentoSync = async function (command, id) {
    let atendimento = await this._connection.query(command + id);
    return atendimento;
}

AtendimentoDAO.prototype.buscaProfissionalAberturaAtendimento = function (idUsuario, idAtendimento, callback) {    
    this._connection.query(`select 1 from tb_atendimento atend 
    inner join tb_profissional proAbertura on proAbertura.idUsuario = atend.idUsuario 
    inner join tb_profissional proAlteracao on proAlteracao.idUsuario = ?
    where atend.id = ? and (proAbertura.idUsuario = proAlteracao.idUsuario || proAbertura.situacao = 0)` ,[idUsuario,idAtendimento],callback); 
}

AtendimentoDAO.prototype.carregaQtdAtendimentosPorPeriodo = function (periodo, idEstabelecimento, callback) {    
    this._connection.query(`select count(1) as qtd from tb_atendimento ta where idEstabelecimento = ? and  dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY` ,[idEstabelecimento,periodo],callback); 
}

AtendimentoDAO.prototype.carregaAtendimentosPorPeriodo = function (periodo, idEstabelecimento, callback) {       
    if(periodo>30){
        this._connection.query(`select CONCAT(LPAD(a.mes,2,'0'),'/',a.ano) as label, qtd as data from (SELECT YEAR(dataCriacao) ano, MONTH(dataCriacao) mes, COUNT(1) qtd
        FROM tb_atendimento ta where idEstabelecimento = ? and  dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
        GROUP BY YEAR(dataCriacao), MONTH(dataCriacao)
        order by YEAR(dataCriacao), MONTH(dataCriacao) desc) a` ,[idEstabelecimento,periodo],callback); 
    }
    else{
        this._connection.query(`select DATE_FORMAT(dataCriacao,'%d/%m/%Y') as label , count(1) as data  from tb_atendimento ta 
        where idEstabelecimento = ? and  dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
        group by DATE_FORMAT(dataCriacao,'%d/%m/%Y')
        order by DATE_FORMAT(dataCriacao,'%d/%m/%Y') desc` ,[idEstabelecimento,periodo],callback); 
    }
}

AtendimentoDAO.prototype.carregaTipoAtendimentoExistentesPorPeriodo = function (periodo, idEstabelecimento, callback) {    
    this._connection.query(`select  ttf.nome  from 
                            tb_tipo_ficha ttf inner join
                            tb_atendimento ta on ta.tipoFicha = ttf.id 
                            where ta.idEstabelecimento = ? and  ta.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
                            group by ttf.nome
                            order by ttf.nome asc` ,[idEstabelecimento,periodo],callback); 
}  

AtendimentoDAO.prototype.carregaTipoAtendimentoPorPeriodo = function (periodo, idEstabelecimento, callback) {       
    if(periodo>30){
        this._connection.query(`select CONCAT(LPAD(a.mes,2,'0'),'/',a.ano) as label, qtd as data, a.nome from (SELECT YEAR(ta.dataCriacao) ano, MONTH(ta.dataCriacao) mes, COUNT(1) qtd,  ttf.nome
        FROM tb_atendimento ta inner join tb_tipo_ficha ttf on ttf.id = ta.tipoFicha 
        where ta.idEstabelecimento = ? and  ta.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
        GROUP BY YEAR(ta.dataCriacao), MONTH(ta.dataCriacao),  ttf.nome
        order by YEAR(ta.dataCriacao), MONTH(ta.dataCriacao) desc) a` ,[idEstabelecimento,periodo],callback); 
    }
    else{
        this._connection.query(`select DATE_FORMAT(ta.dataCriacao,'%d/%m/%Y') as label , count(1) as data, ttf.nome  from 
        tb_tipo_ficha ttf inner join
        tb_atendimento ta on ta.tipoFicha = ttf.id 
        where ta.idEstabelecimento = ? and  ta.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
        group by DATE_FORMAT(ta.dataCriacao,'%d/%m/%Y'), ttf.nome
        order by DATE_FORMAT(ta.dataCriacao,'%d/%m/%Y') desc  ` ,[idEstabelecimento,periodo],callback); 
    }
}

AtendimentoDAO.prototype.carregaAtendimentoSituacaoExistentesPorPeriodo = function (periodo, idEstabelecimento, callback) {    
    this._connection.query(`SELECT   CASE  
                                WHEN ta.situacao = 'A'  THEN 'Alta'  
                                WHEN ta.situacao = 'C' THEN 'Em aberto'  
                                WHEN ta.situacao = 'E' THEN 'Evasão'  
                                WHEN ta.situacao = 'O' THEN 'Óbito'  
                                WHEN ta.situacao = '2' THEN 'Concluído'  
                                WHEN ta.situacao = '5' THEN 'Transferência hospitalar/ambulatório'  
                                WHEN ta.situacao = '6' THEN 'Transferência unidade prisional'  
                                WHEN ta.situacao = '7' THEN 'Desinternação'  
                                WHEN ta.situacao = '8' THEN 'Álvara de soltura'  
                                ELSE 'Cancelado'
                                END as situacao from                             
                            tb_atendimento ta 
                            where ta.idEstabelecimento = ? and  ta.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
                            group by ta.situacao
                            order by ta.situacao asc` ,[idEstabelecimento,periodo],callback); 
}  

AtendimentoDAO.prototype.carregaAtendimentoSituacaoPorPeriodo = function (periodo, idEstabelecimento, callback) {       
    if(periodo>30){
        this._connection.query(`select CONCAT(LPAD(a.mes,2,'0'),'/',a.ano) as label, qtd as data, a.situacao from (SELECT YEAR(ta.dataCriacao) ano, MONTH(ta.dataCriacao) mes, COUNT(1) qtd,  CASE  
                                        WHEN ta.situacao = 'A'  THEN 'Alta'  
                                        WHEN ta.situacao = 'C' THEN 'Em aberto'  
                                        WHEN ta.situacao = 'E' THEN 'Evasão'  
                                        WHEN ta.situacao = 'O' THEN 'Óbito'  
                                        WHEN ta.situacao = '2' THEN 'Concluído'  
                                        WHEN ta.situacao = '5' THEN 'Transferência hospitalar/ambulatório'  
                                        WHEN ta.situacao = '6' THEN 'Transferência unidade prisional'  
                                        WHEN ta.situacao = '7' THEN 'Desinternação'  
                                        WHEN ta.situacao = '8' THEN 'Álvara de soltura' 
                                        ELSE 'Cancelado'
                                        END as situacao
                                FROM tb_atendimento ta 
                                where ta.idEstabelecimento = ? and  ta.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
                                GROUP BY YEAR(ta.dataCriacao), MONTH(ta.dataCriacao),  ta.situacao
                                order by YEAR(ta.dataCriacao), MONTH(ta.dataCriacao) desc) a      ` ,[idEstabelecimento,periodo],callback); 
    }
    else{
        this._connection.query(`select DATE_FORMAT(ta.dataCriacao,'%d/%m/%Y') as label , count(1) as data, CASE  
                                WHEN ta.situacao = 'A'  THEN 'Alta'  
                                WHEN ta.situacao = 'C' THEN 'Em aberto'  
                                WHEN ta.situacao = 'E' THEN 'Evasão'  
                                WHEN ta.situacao = 'O' THEN 'Óbito'  
                                WHEN ta.situacao = '2' THEN 'Concluído'  
                                WHEN ta.situacao = '5' THEN 'Transferência hospitalar/ambulatório'  
                                WHEN ta.situacao = '6' THEN 'Transferência unidade prisional'  
                                WHEN ta.situacao = '7' THEN 'Desinternação'  
                                WHEN ta.situacao = '8' THEN 'Álvara de soltura' 
                                ELSE 'Cancelado'
                                END as situacao  from         
                                tb_atendimento ta 
                                where ta.idEstabelecimento = ? and  ta.dataCriacao >=  DATE(NOW()) - INTERVAL ? DAY
                                group by DATE_FORMAT(ta.dataCriacao,'%d/%m/%Y'), ta.situacao
                                order by DATE_FORMAT(ta.dataCriacao,'%d/%m/%Y') desc` ,[idEstabelecimento,periodo],callback); 
    }
}

AtendimentoDAO.prototype.buscaProfissionalPorUsuarioSync = async function (idUsuario) {    
    let profissional =  await this._connection.query(`SELECT * FROM tb_profissional as p WHERE p.idUsuario = ? AND p.situacao = 1`, [idUsuario]);

    return profissional[0];
}

AtendimentoDAO.prototype.buscaPorIdSync = async function (id) {
    let atendimento =  await this._connection.query(`select p.nome, p.historiaProgressaFamiliar, e.idMunicipio as idMunicipioEstabelecimento, e.idUf as idUfEstabelecimento , a.* 
    from ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id) 
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    WHERE a.id = ?`,[id]); 
    return atendimento[0];
}

AtendimentoDAO.prototype.buscaHistoricoPorAtendimento = async function (id) {
    let atendimento =  await this._connection.query(`select historico.id idHistorico, historico.idAtendimento, historico.idTipoAtendimentoHistorico, 
    tipo_historico.nome nomeTipoHistorico, usu.nome nomeProfissional, usu.foto fotoProfissional,
    historico.textoHistorico, DATE_FORMAT(DATE_ADD(historico.dataCriacao, INTERVAL -3 hour),'%d/%m/%Y %H:%i:%s') dataHistorico
    from tb_atendimento_historico historico 
    inner join tb_tipo_atendimento_historico tipo_historico on tipo_historico.id = historico.idTipoAtendimentoHistorico
    inner join tb_usuario usu on usu.id = historico.idUsuario
    where historico.idAtendimento=?
    order by historico.dataCriacao desc`,[id]); 
    return atendimento;
}

AtendimentoDAO.prototype.atualizaPorIdSync = async function(objeto, id) {
    let atendimento =  await this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id]);

    return atendimento[0];
}

module.exports = function(){
    return AtendimentoDAO;
};