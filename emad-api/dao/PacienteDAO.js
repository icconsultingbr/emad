function PacienteDAO(connection, connectionDim) {
    this._connection = connection;
    this._connectionDim = connectionDim;
    this._table = "tb_paciente";
}

PacienteDAO.prototype.salva = function (paciente, callback) {
    const conn = this._connection;
    const table = this._table;

    const connDim = this._connectionDim;
    let novoprod = {};

    conn.beginTransaction(function(err) {
        if (err) { throw err; }

        connDim.beginTransaction(function(errDim) {
            if (errDim) { throw errDim; }

                conn.query(`INSERT INTO ${table} SET geom = POINT(?, ?), ?`, [paciente.longitude, paciente.latitude, paciente], 
                
                function (error, results) {
                    if (error) {return connDim.rollback(function() {conn.rollback();throw error;});}   
                    
                        novoprod = results;
                        console.log('Criou no e-atend o ID ' + results.insertId);
                        conn.query(`SELECT
                        CASE WHEN tp.situacao = 1 THEN 1 ELSE 2 END as id_status_paciente,
                        est.idUnidadeCorrespondenteDim AS unidade_cadastro,
                        est.idUnidadeCorrespondenteDim AS unidade_referida,
                        UPPER(mun.nome) AS cidade_id_cidade,
                        mun.uf,
                        SUBSTR(UPPER(tp.nome),1,70) nome,
                        81 as tipo_logradouro,
                        SUBSTR(UPPER(tp.logradouro),1,50) as nome_logradouro,
                        SUBSTR(UPPER(tp.numero),1,8) as numero,
                        SUBSTR(UPPER(tp.complemento),1,15) as complemento,
                        SUBSTR(UPPER(tp.bairro),1,30) as bairro,
                        SUBSTR(UPPER(tp.nomeMae),1,70) as nome_mae,
                        tp.sexo as sexo,
                        tp.dataNascimento as data_nasc,
                        CASE WHEN tp.situacao = 1 THEN 'A' ELSE 'I' END as status_2,
                        now() data_incl,
                        6 usua_incl,
                        SUBSTR(tp.foneCelular,1,30) as telefone,
                        REPLACE(REPLACE(tp.cpf,'.',''),'-','') as cpf,
                        SUBSTR(UPPER(tp.nomeMae),1,150) as nome_mae_nasc,
                        SUBSTR(UPPER(REPLACE(tp.nomeMae, ' ', '')),1,70) AS nome_mae_sem_espaco,
                        null as	num_pasta,
                        tp.cartaoSus,
                        'P' as tipo_cartao
                    from tb_paciente tp 
                    inner join tb_municipio mun on mun.id = tp.idMunicipio 
                    inner join tb_estabelecimento est on est.id = tp.idEstabelecimentoCadastro
                    where tp.id = ?`, results.insertId, 
                            
                    function (error, dadosPaciente) {
                        if (error) {return connDim.rollback(function() {console.log('Erro' + error);conn.rollback();throw error;});} 

                            console.log('Select ' + JSON.stringify(dadosPaciente));
                            connDim.query(`INSERT INTO paciente (id_status_paciente,unidade_cadastro,unidade_referida,cidade_id_cidade,nome,tipo_logradouro,
                                nome_logradouro,numero,complemento,bairro,nome_mae,sexo,data_nasc,status_2,data_incl,usua_incl,telefone,cpf,nome_mae_nasc,
                                nome_mae_sem_espaco,num_pasta) VALUES (?,?,?,
                                (select cid.id_cidade from cidade cid inner join estado est on est.id_estado = cid.estado_id_estado where cid.nome=? and est.uf=? LIMIT 1),
                                ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) `
                                , [dadosPaciente[0].id_status_paciente,
                                dadosPaciente[0].unidade_cadastro,
                                dadosPaciente[0].unidade_referida,
                                dadosPaciente[0].cidade_id_cidade,
                                dadosPaciente[0].uf,
                                dadosPaciente[0].nome,
                                dadosPaciente[0].tipo_logradouro,
                                dadosPaciente[0].nome_logradouro,
                                dadosPaciente[0].numero,
                                dadosPaciente[0].complemento,
                                dadosPaciente[0].bairro,
                                dadosPaciente[0].nome_mae,
                                dadosPaciente[0].sexo,
                                dadosPaciente[0].data_nasc,
                                dadosPaciente[0].status_2,
                                dadosPaciente[0].data_incl,
                                dadosPaciente[0].usua_incl,
                                dadosPaciente[0].telefone,
                                dadosPaciente[0].cpf,
                                dadosPaciente[0].nome_mae_nasc,
                                dadosPaciente[0].nome_mae_sem_espaco,
                                dadosPaciente[0].num_pasta], 
                                
                        function (error, novoPaciente) {                    
                            if (error) {return connDim.rollback(function() {console.log('Erro no insert' + error);conn.rollback();throw error;});} 

                                console.log('Select ' + JSON.stringify(dadosPaciente));
                                connDim.query(`INSERT INTO cartao_sus (paciente_id_paciente, cartao_sus, tipo_cartao, data_incl, usua_incl) 
                                VALUES (?,?,?,?,?) `,
                                [novoPaciente.insertId,
                                    dadosPaciente[0].cartaoSus,
                                    dadosPaciente[0].tipo_cartao,
                                    dadosPaciente[0].data_incl,
                                    dadosPaciente[0].usua_incl], 

                            function (error, novoPacienteCartaoSus) {                    
                                if (error) {return connDim.rollback(function() {console.log('Erro no insert' + error);conn.rollback();throw error;});} 
                                    
                                    console.log('Criou no dim (paciente) o ID ' + novoPaciente.insertId);                        
                                    console.log('Criou no dim  (cartao_sus) o ID ' + novoPacienteCartaoSus.insertId);

                                    conn.query(`UPDATE ${table} SET idPacienteCorrespondenteDim=? where id=?`,[novoPaciente.insertId,results.insertId],
                                    
                                function (error, atualizacaoInterna) {                    
                                    if (error) {return connDim.rollback(function() {console.log('Erro no update' + error);conn.rollback();throw error;});} 
                                    console.log('Atualizou internamente ' + atualizacaoInterna); 

                                    connDim.commit( 
                                        function(errDimNovo) 
                                            {if (errDimNovo) {return connDim.rollback(function() {console.log('Erro no commit dim' + errDimNovo);conn.rollback();throw errDimNovo;});} 

                                            conn.commit(                        
                                            function(errFora) 
                                                {if (errFora) {return connDim.rollback(function() {console.log('Erro no commit dim' + errFora);conn.rollback();throw errFora;});} 
                                            
                                                console.log('Sucesso!');              
                                                return callback(null,novoprod);             
                                    });
                                });
                            });
                        });
                    });
                });    
            });
        }); 
    }); 
}

PacienteDAO.prototype.salvaAsync = async function(paciente){
    const responsePaciente =  await this._connection.query(`INSERT INTO tb_paciente SET geom = POINT(?, ?), ?`, [paciente.longitude, paciente.latitude, paciente]);
    return [responsePaciente];
}

PacienteDAO.prototype.atualizaAsync = async function(paciente, id){
    const responsePaciente =  await this._connection.query(`UPDATE tb_paciente SET geom = POINT(?, ?), ? WHERE id= ?`, [paciente.longitude, paciente.latitude, paciente, id]);
    return [responsePaciente];
}

PacienteDAO.prototype.transferirUnidade = async function(paciente){
    const responsePaciente =  await this._connection.query(`UPDATE tb_paciente SET idEstabelecimentoCadastro=? WHERE id= ?`, [paciente.idEstabelecimentoCadastro, paciente.id]);
    return [responsePaciente];
}

PacienteDAO.prototype.atualizaHistoriaProgressaFamiliar = async function(historiaProgressaFamiliar, id, idUsuarioAlteracao, dataAlteracao){
    const responsePaciente =  await this._connection.query(`UPDATE tb_paciente SET historiaProgressaFamiliar=?, idUsuarioAlteracao=?, dataAlteracao=? WHERE id= ?`, [historiaProgressaFamiliar, idUsuarioAlteracao, dataAlteracao, id]);
    return [responsePaciente];
}

PacienteDAO.prototype.gravaEstabelecimento = async function(paciente, dataCriacao, usuario){
    const responsePaciente =  await this._connection.query(`INSERT INTO tb_paciente_estabelecimento_historico (idPaciente, idEstabelecimento, dataCriacao, idUsuarioCriacao) VALUES (?, ?, ?, ?)`, [paciente.id, paciente.idEstabelecimentoCadastro, dataCriacao, usuario]);
    return [responsePaciente];
}

PacienteDAO.prototype.atualiza = function (paciente, id, callback) {
    const conn = this._connection;
    const connDim = this._connectionDim;
    const table = this._table;

    let novoprod = {};

    conn.beginTransaction(function(err) {
        if (err) { throw err; }

        connDim.beginTransaction(function(errDim) {
            if (errDim) { throw errDim; }

            if (err) { throw err; }
            conn.query(`UPDATE ${table} SET geom = POINT(?, ?), ? WHERE id= ?`, [paciente.longitude, paciente.latitude, paciente, id], 
            
            function (error, results) {
                if (error) {return connDim.rollback(function() {conn.rollback();throw error;});}   
                
                    novoprod = results;
                    console.log('Update no e-atend do ID ' + id);
                    conn.query(`SELECT
                                    CASE WHEN tp.situacao = 1 THEN 1 ELSE 2 END as id_status_paciente,
                                    est.idUnidadeCorrespondenteDim AS unidade_cadastro,
                                    est.idUnidadeCorrespondenteDim AS unidade_referida,
                                    UPPER(mun.nome) AS cidade_id_cidade,
                                    mun.uf,
                                    SUBSTR(UPPER(tp.nome),1,70) nome,
                                    81 as tipo_logradouro,
                                    SUBSTR(UPPER(tp.logradouro),1,50) as nome_logradouro,
                                    SUBSTR(UPPER(tp.numero),1,8) as numero,
                                    SUBSTR(UPPER(tp.complemento),1,15) as complemento,
                                    SUBSTR(UPPER(tp.bairro),1,30) as bairro,
                                    SUBSTR(UPPER(tp.nomeMae),1,70) as nome_mae,
                                    tp.sexo as sexo,
                                    tp.dataNascimento as data_nasc,
                                    CASE WHEN tp.situacao = 1 THEN 'A' ELSE 'I' END as status_2,
                                    now() data_alt,
                                    6 usua_alt,
                                    SUBSTR(tp.foneCelular,1,30) as telefone,
                                    REPLACE(REPLACE(tp.cpf,'.',''),'-','') as cpf,
                                    SUBSTR(UPPER(tp.nomeMae),1,150) as nome_mae_nasc,
                                    SUBSTR(UPPER(REPLACE(tp.nomeMae, ' ', '')),1,70) AS nome_mae_sem_espaco,
                                    null as	num_pasta,
                                    idPacienteCorrespondenteDim,
                                    tp.cartaoSus,
                                    'P' as tipo_cartao
                                from tb_paciente tp 
                                inner join tb_municipio mun on mun.id = tp.idMunicipio 
                                inner join tb_estabelecimento est on est.id = tp.idEstabelecimentoCadastro
                                where tp.id = ?`, id, 
                        
                function (error, dadosPaciente) {
                    if (error) {return connDim.rollback(function() {console.log('Erro' + error);conn.rollback();throw error;});}                

                        console.log('Select ' + JSON.stringify(dadosPaciente));
                        connDim.query(`UPDATE paciente SET                     
                                        id_status_paciente=?, unidade_cadastro=?, unidade_referida=?, 
                                        cidade_id_cidade=(select cid.id_cidade from cidade cid inner join estado est on est.id_estado = cid.estado_id_estado where cid.nome=? and est.uf=? LIMIT 1),
                                        nome=?, tipo_logradouro=?, 
                                        nome_logradouro=?, numero=?, complemento=?, bairro=?, nome_mae=?, sexo=?, data_nasc=?, status_2=?, 
                                        data_alt=?, usua_alt=?, telefone=?, cpf=?, nome_mae_nasc=?, nome_mae_sem_espaco=?, num_pasta=? 
                                        WHERE id_paciente=?`,
                                        [dadosPaciente[0].id_status_paciente,
                                        dadosPaciente[0].unidade_cadastro,
                                        dadosPaciente[0].unidade_referida,
                                        dadosPaciente[0].cidade_id_cidade,
                                        dadosPaciente[0].uf,
                                        dadosPaciente[0].nome,
                                        dadosPaciente[0].tipo_logradouro,
                                        dadosPaciente[0].nome_logradouro,
                                        dadosPaciente[0].numero,
                                        dadosPaciente[0].complemento,
                                        dadosPaciente[0].bairro,
                                        dadosPaciente[0].nome_mae,
                                        dadosPaciente[0].sexo,
                                        dadosPaciente[0].data_nasc,
                                        dadosPaciente[0].status_2,
                                        dadosPaciente[0].data_alt,
                                        dadosPaciente[0].usua_alt,
                                        dadosPaciente[0].telefone,
                                        dadosPaciente[0].cpf,
                                        dadosPaciente[0].nome_mae_nasc,
                                        dadosPaciente[0].nome_mae_sem_espaco,
                                        dadosPaciente[0].num_pasta,
                                        dadosPaciente[0].idPacienteCorrespondenteDim], 
                            
                    function (error, novoPaciente) {                    
                        if (error) {return connDim.rollback(function() {console.log('Erro no update' + error);conn.rollback();throw error;});}                

                            console.log('Atualizou no dim o ID ' + dadosPaciente[0].idPacienteCorrespondenteDim);
                            console.log('Ultimo ' + JSON.stringify(novoPaciente));

                            console.log('Select ' + JSON.stringify(dadosPaciente));
                            connDim.query(`UPDATE cartao_sus SET                     
                                            cartao_sus=?, tipo_cartao=?
                                            WHERE paciente_id_paciente=?`,
                                            [dadosPaciente[0].cartaoSus,
                                            dadosPaciente[0].tipo_cartao,
                                            dadosPaciente[0].idPacienteCorrespondenteDim], 

                            function (error, novoPacienteSus) {                    
                                if (error) {return connDim.rollback(function() {console.log('Erro no updte' + error);conn.rollback();throw error;});}

                                console.log('Atualizou no dim (cartao_sus) o ID ' + novoPacienteSus);

                                connDim.commit(                        
                                    function(errDimNovo) 
                                        {if (errDimNovo) {return connDim.rollback(function() {console.log('Erro no commit dim' + errDimNovo);conn.rollback();throw errDimNovo;});}

                                    conn.commit(                        
                                        function(errNovo) 
                                            {if (errNovo) {return connDim.rollback(function() {console.log('Erro no commit interno' + errNovo);conn.rollback();throw errNovo;});}
                                            
                                            console.log('Sucesso!');              
                                            return callback(null,novoprod);             
                                });  
                            });
                        });
                    });
                });
            });
        });    
    }); 
}

PacienteDAO.prototype.listarAsync = async function (addFilter, idUsuario) {
    let where = "";
    let offset = " LIMIT 10 OFFSET 0 ";
    
    if (addFilter != null) {
        if (addFilter.cartaoSus) {
            where += ` AND pac.cartaoSus LIKE '%${addFilter.cartaoSus}%'`;
        }

        if (addFilter.nome) {
            where += ` AND UPPER(pac.nome) LIKE '%${addFilter.nome.toUpperCase()}%'`;
        }

        if (addFilter.nomeSocial) {
            where += ` AND UPPER(pac.nomeSocial) LIKE '%${addFilter.nomeSocial.toUpperCase()}%'`;
        }

        if (addFilter.nomeMae) {
            where += ` AND UPPER(pac.nomeMae) LIKE '%${addFilter.nomeMae.toUpperCase()}%'`;
        }
        
        if (addFilter.numeroProntuario) {
            where += ` AND UPPER(pac.numeroProntuario) LIKE '%${addFilter.numeroProntuario.toUpperCase()}%'`;
        }

        if(addFilter.cpf){
            where+=" AND replace(replace(pac.cpf,'.',''),'-','') = replace(replace('"+addFilter.cpf+"','.',''),'-','')";
        }
        
        if(addFilter.dataNascimento){
            where+=" AND DATE_FORMAT(dataNascimento ,'%d/%m/%Y') = '"+addFilter.dataNascimento+"'";
        }

        if(addFilter.idSap){
            where+=" AND pac.idSap LIKE '%"+addFilter.idSap+"%'";
        }

        if(addFilter.limit && addFilter.offset){
            offset = `LIMIT ${addFilter.limit} OFFSET ${addFilter.limit * addFilter.offset}`;
        }
        
        if(addFilter.pesquisa)
            addFilter.pacienteOutroEstabelecimento == 1;

        if(addFilter.idEstabelecimento && addFilter.pacienteOutroEstabelecimento == 2 && !addFilter.pesquisa){
            where+=" AND pac.idEstabelecimentoCadastro = " + addFilter.idEstabelecimento + "";
        } 
        
        if(addFilter.pesquisa){
            where+=" AND pac.situacao = 1 ";
        }

        if (addFilter.pesquisaCentral) {
            where += ` AND (pac.cartaoSus LIKE '%${addFilter.pesquisaCentral}%' OR
                            pac.idSap LIKE '%${addFilter.pesquisaCentral}%' OR
                            UPPER(pac.nome) LIKE UPPER('%${addFilter.pesquisaCentral}%') OR                            
                            replace(replace(pac.cpf,'.',''),'-','') LIKE replace(replace('%${addFilter.pesquisaCentral}%','.',''),'-','') OR
                            UPPER(pac.observacao) LIKE UPPER('%${addFilter.pesquisaCentral}%'))`;
        }
    }    
    const join = ` FROM tb_paciente pac
    INNER JOIN tb_nacionalidade nac ON (pac.idNacionalidade = nac.id)
    INNER JOIN tb_uf nat ON (pac.idNaturalidade = nat.id)
    LEFT JOIN tb_municipio mun ON (pac.idMunicipio = mun.id)
    LEFT JOIN tb_uf uf ON (pac.idUf = uf.id)
    LEFT JOIN tb_modalidade md ON (pac.idModalidade = md.id) 
    LEFT JOIN tb_estabelecimento est ON (pac.idEstabelecimentoCadastro = est.id and est.situacao = 1 and est.id = ${addFilter.idEstabelecimento})                    
    LEFT JOIN tb_estabelecimento estCadastro ON (pac.idEstabelecimentoCadastro = estCadastro.id)                                    
    WHERE 1 = 1 ${where} `;

    const count = await this._connection.query(`SELECT COUNT(1) as total ${join}`);

    const result = await this._connection.query(`SELECT
                                                    pac.id,
                                                    pac.cartaoSus,
                                                    pac.nome,
                                                    pac.nomeSocial,
                                                    pac.nomeMae,
                                                    pac.nomePai,
                                                    DATE_FORMAT(dataNascimento,'%d/%m/%Y') as dataNascimento,
                                                    TIMESTAMPDIFF(YEAR, pac.dataNascimento, CURDATE()) as idade,
                                                    pac.sexo,
                                                    nac.nome AS idNacionalidade,
                                                    nat.nome AS idNaturalidade,
                                                    pac.ocupacao,
                                                    pac.cpf,
                                                    pac.rg,
                                                    pac.dataEmissao,
                                                    pac.orgaoEmissor,
                                                    pac.escolaridade,
                                                    pac.cep,
                                                    pac.logradouro,
                                                    pac.numero,
                                                    pac.complemento,
                                                    pac.bairro,
                                                    mun.nome AS idMunicipio,
                                                    uf.nome AS idUf,
                                                    pac.foneResidencial,
                                                    pac.foneCelular,
                                                    pac.foneContato,
                                                    pac.contato,
                                                    pac.email,
                                                    pac.situacao,
                                                    md.nome AS idModalidade,
                                                    pac.latitude,
                                                    pac.longitude,
                                                    pac.idSap,
                                                    pac.idPacienteCorrespondenteDim,
                                                    pac.apelido,
                                                    pac.observacao, 
                                                    pac.historiaProgressaFamiliar,
                                                    est.id idEstabelecimento,
                                                    estCadastro.nomeFantasia nomeEstabelecimento,
                                                    pac.idEstabelecimentoCadastro,
                                                    (select count(*) from tb_usuario usuario 
                                                    inner join tb_estabelecimento_usuario estabelecimentoUsuario on estabelecimentoUsuario.idUsuario = usuario.id
                                                    where usuario.id = ${idUsuario} and estabelecimentoUsuario.idEstabelecimento = estCadastro.id) vinculadoEstabelecimentoUsuario
                                                ${join}  
                                            ORDER BY pac.nome ASC ${offset}`);
    return {
        total: count[0].total,
        items: result
    }
}

PacienteDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT 

    id,
    cartaoSus,
    nome, 
    nomeSocial, 
    nomeMae, 
    nomePai, 
    DATE_FORMAT(dataNascimento,'%d/%m/%Y') as dataNascimento,
    sexo, 
    idNacionalidade, 
    idNaturalidade, 
    ocupacao, 
    cpf, 
    rg, 
    DATE_FORMAT(dataEmissao,'%d/%m/%Y') as dataEmissao,
    orgaoEmissor, 
    escolaridade, 
    cep, 
    logradouro, 
    numero, 
    complemento, 
    bairro, 
    idMunicipio, 
    idUf, 
    foneResidencial, 
    foneCelular, 
    foneContato, 
    contato, 
    email, 
    situacao, 
    idModalidade, 
    DATE_FORMAT(dataCriacao,'%d/%m/%Y') as dataCriacao,
    latitude,
    longitude,
    idSap,
    idPacienteCorrespondenteDim,
    idTipoSanguineo,
    idRaca,
    numeroProntuario,
    numeroProntuarioCnes,
    falecido,
    idAtencaoContinuada,
    idEstabelecimentoCadastro,
    apelido,
    observacao, 
    historiaProgressaFamiliar,
    foto
    FROM ${this._table} WHERE id = ?`, id, callback);
}

PacienteDAO.prototype.buscaPorIdSync = async function (id) {
    const responsePaciente =  await this._connection.query(`SELECT 

    id,
    cartaoSus,
    nome, 
    nomeSocial, 
    nomeMae, 
    nomePai, 
    DATE_FORMAT(dataNascimento,'%d/%m/%Y') as dataNascimento,
    sexo, 
    idNacionalidade, 
    idNaturalidade, 
    ocupacao, 
    cpf, 
    rg, 
    DATE_FORMAT(dataEmissao,'%d/%m/%Y') as dataEmissao,
    orgaoEmissor, 
    escolaridade, 
    cep, 
    logradouro, 
    numero, 
    complemento, 
    bairro, 
    idMunicipio, 
    idUf, 
    foneResidencial, 
    foneCelular, 
    foneContato, 
    contato, 
    email, 
    situacao, 
    idModalidade, 
    DATE_FORMAT(dataCriacao,'%d/%m/%Y') as dataCriacao,
    latitude,
    longitude,
    idSap,
    idPacienteCorrespondenteDim,
    idTipoSanguineo,
    idRaca,
    numeroProntuario,
    numeroProntuarioCnes,
    falecido,
    idAtencaoContinuada,
    idEstabelecimentoCadastro,
    apelido,
    observacao, 
    historiaProgressaFamiliar,
    foto
    FROM ${this._table} WHERE id = ?`, id);
    return responsePaciente;
}

PacienteDAO.prototype.buscaPorIdFicha = function (id, callback) {
    this._connection.query(`SELECT 
    p.id,
    p.cartaoSus,
    DATE_FORMAT(current_date(),'%d/%m/%y') as dataAtendimento,    
    DATE_FORMAT(DATE_ADD(current_timestamp(), INTERVAL -3 hour),'%H:%i:%s') as hora_atendimento,
    TIMESTAMPDIFF(YEAR, p.dataNascimento, NOW()) as idade, 
    m.nome as nomeMunicipio, 
    p.nome, 
    p.nomeSocial, 
    p.nomeMae, 
    p.nomePai, 
    DATE_FORMAT(p.dataNascimento,'%d/%m/%y') as dataNascimento,
    p.sexo, 
    p.idNacionalidade, 
    p.idNaturalidade, 
    p.ocupacao, 
    p.cpf, 
    p. rg, 
    DATE_FORMAT(p.dataEmissao,'%d/%m/%Y') as dataEmissao,
    p.orgaoEmissor, 
    p.escolaridade, 
    p.cep, 
    p.logradouro, 
    p.numero, 
    p.complemento, 
    p.bairro, 
    p.idMunicipio, 
    p.idUf, 
    p.foneResidencial, 
    p.foneCelular, 
    p.foneContato, 
    p.contato, 
    p.email, 
    p.situacao, 
    p.idModalidade, 
    DATE_FORMAT(p.dataCriacao,'%d/%m/%Y') as dataCriacao,
    p.latitude,
    p.longitude ,
    p.idSap,
    p.idPacienteCorrespondenteDim,
    p.idTipoSanguineo,
    p.idRaca,
    p.numeroProntuario,
    p.numeroProntuarioCnes,
    p.falecido,
    p.idAtencaoContinuada,
    p.idEstabelecimentoCadastro
    FROM ${this._table} p 
    INNER JOIn tb_municipio m ON(p.idMunicipio = m.id) WHERE p.id = ?`, id, callback);
}

PacienteDAO.prototype.buscaEmailPaciente = function (id, callback) {
    this._connection.query(`SELECT p.email FROM ${this._table} p WHERE p.id = ?`, id, callback);
}

PacienteDAO.prototype.buscaEmailPacienteSync = async function (id) {
    const responsePaciente =  await this._connection.query(`SELECT p.email FROM ${this._table} p WHERE p.id = ?`, id);
    return responsePaciente;
}

PacienteDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

PacienteDAO.prototype.deletaPorId = function (id,callback) {
    const conn = this._connection;
    const connDim = this._connectionDim;
    const table = this._table;

    let novoprod = {};

    conn.beginTransaction(function(err) {
        if (err) { throw err; }
        conn.query(`UPDATE ${table} SET situacao = 0 WHERE id = ?`, id, 
        
        function (error, results) {
            if (error) {return conn.rollback(function() {throw error;});}   
            
                novoprod = results;
                console.log('Update no e-atend do ID ' + id);
                conn.query(`SELECT 
                        CASE WHEN tp.situacao = 1 THEN 1 ELSE 2 END as id_status_paciente,
                        CASE WHEN tp.situacao = 1 THEN 'A' ELSE 'I' END as status_2,
                        6 usua_alt, 
                        now() as data_alt, 
                        idPacienteCorrespondenteDim
                    from tb_paciente tp where tp.id = ?`, id, 
                    
            function (error, dadosPaciente) {
                if (error) {return conn.rollback(function() {console.log('Erro' + error);throw error;});}                

                    console.log('Select ' + JSON.stringify(dadosPaciente));
                    connDim.query(`UPDATE paciente SET id_status_paciente=?, status_2=?, usua_alt=?,
                    data_alt=? WHERE id_paciente=?`,
                       [dadosPaciente[0].id_status_paciente,
                        dadosPaciente[0].status_2,
                        dadosPaciente[0].usua_alt,
                        dadosPaciente[0].data_alt, 
                        dadosPaciente[0].idPacienteCorrespondenteDim], 
                        
                function (error, novoPaciente) {                    
                    if (error) {return conn.rollback(function() {console.log('Erro no update ' + error);throw error;});}

                        console.log('Atualizou no dim o ID ' + dadosPaciente[0].idPacienteCorrespondenteDim);
                        console.log('Ultimo ' + JSON.stringify(novoPaciente));

                        conn.commit(
                        
                    function(err) 
                        {if (err) {return conn.rollback(function() {throw err;});}
                        
                        console.log('Sucesso!');              
                        return callback(null,novoprod);             
                    });
                });
            });
        });    
    }); 
}

PacienteDAO.prototype.buscarEstabelecimentos = function (id, raio, idTipoUnidade, callback) {
    this._connection.query(`
        SELECT
            e.cnes,
            e.cnpj,
            e.razaoSocial,
            e.nomeFantasia,
            e.cep,
            e.logradouro,
            e.numero,
            e.complemento,
            e.bairro,
            e.latitude,
            e.longitude,
            m.nome as idMunicipio,
            u.nome as idUf,
            tu.nome as idTipoUnidade,
            ROUND(ST_Distance_Sphere(e.geom, p.geom)) AS distancia,
            e.idUnidadeCorrespondenteDim,
            e.idUnidadePesquisaMedicamentoDim,
            e.idUnidadeRegistroReceitaDim
        FROM tb_estabelecimento e
        INNER JOIN tb_municipio as m ON (e.idMunicipio = m.id) 
        INNER JOIN tb_uf as u ON (e.idUf = u.id) 
        INNER JOIN tb_tipo_unidade as tu ON (e.idTipoUnidade = tu.id)
        INNER JOIN tb_paciente p ON (p.id = ? AND ROUND(ST_Distance_Sphere(e.geom, p.geom)) <= ?)
        WHERE e.idTipoUnidade = ?`, 
        [id, raio, idTipoUnidade],
        callback
    );
}

PacienteDAO.prototype.carregaNomePaciente = async function(id){
    let result =  await this._connection.query(`SELECT nome FROM ${this._table} where id=?`, [id]);
    return result[0].nome ? result[0].nome : "";
}

PacienteDAO.prototype.validaPorChaveSync = async function (tipoValidacao, paciente, id) {
    let pacienteResult = [];
    let where = "";

    switch (tipoValidacao) {
        case 'CPF':
            if (paciente.cpf && typeof (paciente.cpf) != 'undefined' && paciente.cpf != '') 
                where += " AND REPLACE(REPLACE(REPLACE(p.cpf,'.',''),'-',''),'/','') = REPLACE(REPLACE(REPLACE('" + paciente.cpf + "','.',''),'-',''),'/','') ";        
          break;
        case 'SAP':
            if (paciente.idSap && typeof (paciente.idSap) != 'undefined' && paciente.idSap != '')
                where += " AND REPLACE(REPLACE(REPLACE(p.idSap,'.',''),'-',''),'/','') = REPLACE(REPLACE(REPLACE('" + paciente.idSap + "','.',''),'-',''),'/','') ";
          break;
        case 'RG':
            if (paciente.rg && typeof (paciente.rg) != 'undefined' && paciente.rg != '')
                where += " AND REPLACE(REPLACE(REPLACE(p.rg,'.',''),'-',''),'/','') = REPLACE(REPLACE(REPLACE('" + paciente.rg + "','.',''),'-',''),'/','') ";        
          break;
        case 'SUS':
            if (paciente.cartaoSus && typeof (paciente.cartaoSus) != 'undefined' && paciente.cartaoSus != '')
            where += " AND REPLACE(REPLACE(REPLACE(p.cartaoSus,'.',''),'-',''),'/','') = REPLACE(REPLACE(REPLACE('" + paciente.cartaoSus + "','.',''),'-',''),'/','') ";
          break;
    }

    if(where.length == 0)
        return pacienteResult;

    if (id) 
        where += " AND p.id <> " + id;

    pacienteResult =  await this._connection.query(`select p.nome, est.nomeFantasia nomeEstabelecimento from ${this._table} as p inner join tb_estabelecimento est on est.id = p.idEstabelecimentoCadastro WHERE p.situacao = 1 ${where}`);
    return pacienteResult; 
}

PacienteDAO.prototype.carregaPacientePorMedicamento = async function(addFilter, material){
    let where = "";
    let orderBy = "  ";

    if(addFilter != null){   
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined" && addFilter.idEstabelecimento != "null") {
            where+=" AND mvg.idEstabelecimento = " + addFilter.idEstabelecimento + "";
        }

        if (addFilter.idMaterial && addFilter.idMaterial != "undefined") {
            where+=" AND img.idMaterial = " + addFilter.idMaterial + "";
        }   
        
        if (addFilter.lote && addFilter.lote != "undefined") {
            where+=" AND img.lote = '" + addFilter.lote + "'";
        }  

        if (addFilter.idFabricante && addFilter.idFabricante != "undefined"  && addFilter.idFabricante != "null") {
            where+=" AND img.idFabricante = " + addFilter.idFabricante + "";
        }  

        if (addFilter.dataInicial && addFilter.dataFinal) {           
            where+=" AND mvg.dataMovimento >= '" + addFilter.dataInicial + " 00:00:00' AND mvg.dataMovimento <= '" + addFilter.dataFinal + " 23:59:59'";
        }

        if(addFilter.ordenadoPor){
            orderBy += " order by " + addFilter.ordenadoPor + " asc";
        }
    }
    let medicamento;

    if(material){
        medicamento =  await this._connection.query(`select 
                                                            distinct mat.id idMaterial,
                                                            mat.codigo as codigoMaterial,
                                                            mat.descricao as nomeMaterial, 
                                                            count(*) medicamentosPorUnidade , 
                                                            sum(img.quantidade) qtdRetirada
                                                        from tb_material mat
                                                            inner join tb_item_movimento_geral img on mat.id = img.idMaterial 
                                                            inner join tb_fabricante_material fab on img.idFabricante = fab.id
                                                            inner join tb_movimento_geral mvg on img.idMovimentoGeral = mvg.id
                                                            inner join tb_estabelecimento und on mvg.idEstabelecimento = und.id
                                                            inner join tb_paciente pac on mvg.idPaciente = pac.id
                                                            inner join tb_item_receita irc on img.idItemReceita = irc.id
                                                            inner join tb_receita rec on irc.idReceita = rec.id
                                                        where mat.situacao = 1
                                                            and mat.dispensavel = 1
                                                            and fab.situacao = 1
                                                            and und.situacao = 1
                                                            and pac.situacao = 1
                                                            ${where} 
                                                            group by mat.id
                                                            order by mat.descricao asc`);
    }else{
        medicamento =  await this._connection.query(`select 
                                                    mat.codigo as codigoMaterial, 
                                                    mat.descricao as nomeMaterial,
                                                    img.lote as lote, 
                                                    fab.nome as nomeFabricanteMaterial, 
                                                    img.validade as validade,
                                                    img.quantidade as quantidade,
                                                    mvg.dataMovimento as dataMovimento,
                                                    CONCAT(rec.ano,'-',rec.idEstabelecimento ,'-',rec.numero) as numeroReceita,
                                                    UPPER(pac.nome) nomePaciente,
                                                    IFNULL(pac.foneContato,'') telefonePaciente,
                                                    CONCAT(UPPER(IFNULL(pac.logradouro,'')), ', ', UPPER(IFNULL(pac.numero,'')), ' ', UPPER(IFNULL(pac.complemento,'')), UPPER(IFNULL(pac.bairro,'')) ) enderecoPaciente,
                                                    und.nomeFantasia nomeEstabelecimento
                                                from tb_material mat
                                                inner join tb_item_movimento_geral img on mat.id = img.idMaterial 
                                                inner join tb_fabricante_material fab on img.idFabricante = fab.id
                                                inner join tb_movimento_geral mvg on img.idMovimentoGeral = mvg.id
                                                inner join tb_estabelecimento und on mvg.idEstabelecimento = und.id
                                                inner join tb_paciente pac on mvg.idPaciente = pac.id
                                                inner join tb_item_receita irc on img.idItemReceita = irc.id
                                                inner join tb_receita rec on irc.idReceita = rec.id
                                                where mat.situacao = 1 and mat.dispensavel = 1 and fab.situacao = 1 and und.situacao = 1 and pac.situacao = 1 
                                                ${where} 
                                                ${orderBy} `);
    }
    
    
    return medicamento;
}

module.exports = function () {
    return PacienteDAO;
};