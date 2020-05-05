function PacienteDAO(connection, connectionDim) {
    this._connection = connection;
    this._connectionDim = connectionDim;
    this._table = "tb_paciente";
}

PacienteDAO.prototype.salva = function (paciente, idEstabelecimento, callback) {
    const conn = this._connection;
    const table = this._table;

    const connDim = this._connectionDim;
    let novoprod = {};
    console.log('Estabelecimento ' + idEstabelecimento);

    conn.beginTransaction(function(err) {
        if (err) { throw err; }
        conn.query(`INSERT INTO ${table} SET geom = POINT(?, ?), ?`, [paciente.longitude, paciente.latitude, paciente], 
        
        function (error, results) {
            if (error) {return conn.rollback(function() {throw error;});}   
            
                novoprod = results;
                console.log('Criou no e-atend o ID ' + results.insertId);
                conn.query(`SELECT
                CASE WHEN tp.situacao = 1 THEN 1 ELSE 2 END as id_status_paciente,
                (SELECT idUnidadeCorrespondenteDim FROM tb_estabelecimento te where id=17) AS unidade_cadastro,
                (SELECT idUnidadeCorrespondenteDim FROM tb_estabelecimento te where id=17) AS unidade_referida,
                UPPER(mun.nome) AS cidade_id_cidade,
                mun.uf,
                UPPER(tp.nome) nome,
                81 as tipo_logradouro,
                UPPER(tp.logradouro) as nome_logradouro,
                UPPER(tp.numero) as numero,
                UPPER(tp.complemento) as complemento,
                UPPER(tp.bairro) as bairro,
                UPPER(tp.nomeMae) as nome_mae,
                tp.sexo as sexo,
                tp.dataNascimento as data_nasc,
                CASE WHEN tp.situacao = 1 THEN 'A' ELSE 'I' END as status_2,
                now() data_incl,
                6 usua_incl,
                tp.foneCelular as telefone,
                REPLACE(REPLACE(tp.cpf,'.',''),'-','') as cpf,
                UPPER(tp.nomeMae) as nome_mae_nasc,
                UPPER(REPLACE(tp.nomeMae, ' ', '')) nome_mae_sem_espaco,
                null as	num_pasta
            from tb_paciente tp 
            inner join tb_municipio mun on mun.id = tp.idMunicipio where tp.id = ?`, results.insertId, 
                    
            function (error, dadosPaciente) {
                if (error) {return conn.rollback(function() {console.log('Erro' + error);throw error;});}                

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
                    if (error) {return conn.rollback(function() {console.log('Erro no insert ' + error);throw error;});}

                        console.log('Criou no dim o ID ' + novoPaciente.insertId);                        

                        conn.query(`UPDATE ${table} SET idPacienteCorrespondenteDim=? where id=?`,[novoPaciente.insertId,results.insertId],
                            
                    function (error, atualizacaoInterna) {                    
                        if (error) {return conn.rollback(function() {console.log('Erro no update inerno ' + error);throw error;});}
                        console.log('Atualizou internamente ' + atualizacaoInterna); 

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
    }); 
}

PacienteDAO.prototype.atualiza = function (paciente, id, idEstabelecimento, callback) {
    const conn = this._connection;
    const connDim = this._connectionDim;
    const table = this._table;

    let novoprod = {};

    conn.beginTransaction(function(err) {
        if (err) { throw err; }
        conn.query(`UPDATE ${table} SET geom = POINT(?, ?), ? WHERE id= ?`, [paciente.longitude, paciente.latitude, paciente, id], 
        
        function (error, results) {
            if (error) {return conn.rollback(function() {throw error;});}   
            
                novoprod = results;
                console.log('Update no e-atend do ID ' + id);
                conn.query(`SELECT 
                                CASE WHEN tp.situacao = 1 THEN 1 ELSE 2 END as id_status_paciente,
                                (SELECT idUnidadeCorrespondenteDim FROM tb_estabelecimento te where id=17) AS unidade_cadastro,
                                (SELECT idUnidadeCorrespondenteDim FROM tb_estabelecimento te where id=17) AS unidade_referida,
                                UPPER(mun.nome) AS cidade_id_cidade,
                                mun.uf,
                                UPPER(tp.nome) nome,
                                81 as tipo_logradouro,
                                UPPER(tp.logradouro) as nome_logradouro,
                                UPPER(tp.numero) as numero,
                                UPPER(tp.complemento) as complemento,
                                UPPER(tp.bairro) as bairro,
                                UPPER(tp.nomeMae) as nome_mae,
                                tp.sexo as sexo,
                                tp.dataNascimento as data_nasc,
                                CASE WHEN tp.situacao = 1 THEN 'A' ELSE 'I' END as status_2,
                                6 usua_alt, 
                                now() as data_alt, 
                                tp.foneCelular as telefone,
                                REPLACE(REPLACE(tp.cpf,'.',''),'-','') as cpf,
                                UPPER(tp.nomeMae) as nome_mae_nasc,
                                UPPER(REPLACE(tp.nomeMae, ' ', '')) nome_mae_sem_espaco,
                                null as	num_pasta,                     
                                idPacienteCorrespondenteDim
                            from tb_paciente tp 
                            inner join tb_municipio mun on mun.id = tp.idMunicipio where tp.id = ?`, id, 
                    
            function (error, dadosPaciente) {
                if (error) {return conn.rollback(function() {console.log('Erro' + error);throw error;});}                

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

PacienteDAO.prototype.lista = function (addFilter, callback) {
    let where = "";

    if (addFilter != null) {
        if (addFilter.cartaoSus) {
            where += ` AND pac.cartaoSus = ${addFilter.cartaoSus}`;
        }

        if (addFilter.nome) {
            where += ` AND UPPER(pac.nome) LIKE '%${addFilter.nome.toUpperCase()}%'`;
        }

        if (addFilter.nomeSocial) {
            where += ` AND UPPER(pac.nomeSocial) LIKE '%${addFilter.nomeSocial.toUpperCase()}%'`;
        }

        if(addFilter.cpf){
            where+=" AND pac.cpf LIKE '%"+addFilter.cpf+"%'";
        }

        if(addFilter.idSap){
            where+=" AND pac.idSap LIKE '%"+addFilter.idSap+"%'";
        }
    }

    this._connection.query(`
        SELECT
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
            latitude,
            longitude,
            pac.idSap,
            pac.idPacienteCorrespondenteDim
        FROM tb_paciente pac
        INNER JOIN tb_nacionalidade nac ON (pac.idNacionalidade = nac.id)
        INNER JOIN tb_uf nat ON (pac.idNaturalidade = nat.id)
        INNER JOIN tb_municipio mun ON (pac.idMunicipio = mun.id)
        INNER JOIN tb_uf uf ON (pac.idUf = uf.id)
        INNER JOIN tb_modalidade md ON (pac.idModalidade = md.id) 
        ${where} AND pac.situacao = 1`,
        callback);
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
    idPacienteCorrespondenteDim
    FROM ${this._table} WHERE id = ?`, id, callback);
}

PacienteDAO.prototype.buscaPorIdFicha = function (id, callback) {
    this._connection.query(`SELECT 
    p.id,
    p.cartaoSus,
    DATE_FORMAT(current_date(),'%d/%m/%y') as dataAtendimento,    
    DATE_FORMAT(DATE_ADD(current_timestamp(), INTERVAL -3 hour),'%H:%m:%s') as hora_atendimento,
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
    p.idPacienteCorrespondenteDim
    FROM ${this._table} p 
    INNER JOIn tb_municipio m ON(p.idMunicipio = m.id) WHERE p.id = ?`, id, callback);
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

module.exports = function () {
    return PacienteDAO;
};