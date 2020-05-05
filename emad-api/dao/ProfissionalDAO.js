function ProfissionalDAO(connection, connectionDim) {
    this._connection = connection;
    this._connectionDim = connectionDim;
    this._table = "tb_profissional";
}

ProfissionalDAO.prototype.salva = function(profissional, callback) {
    const conn = this._connection;
    const table = this._table;

    const connDim = this._connectionDim;
    let novoprod = {};

    conn.beginTransaction(function(err) {
        if (err) { throw err; }
        conn.query(`INSERT INTO ${table} SET geom = POINT(?, ?), ?`, [profissional.longitude, profissional.latitude, profissional], function (error, results) {
          if (error) {
            return conn.rollback(function() {
                throw err;                
            });
          }   
          novoprod = results;
          console.log('Criou no e-atend o ID ' + results.insertId);
          conn.query(`SELECT
                        null as	cidade_id_cidade,
                        tabelauf.uf as estado_id_estado,
                        esp.id_tipo_conselho as tipo_conselho_id_tipo_conselho,
                        esp.id_tipo_prescritor as tipo_prescritor_id_tipo_prescritor,
                        UPPER(tp.nome) as nome,
                        CASE WHEN tp.situacao = 1 THEN 'A' ELSE 'I' END as status_2,
                        tp.crm inscricao,
                        null as	data_inscricao,
                        UPPER(cargoProfissional) as especialidade,
                        6 usua_incl,
                        now() as	data_incl
                    from tb_profissional tp 
                    inner join tb_especialidade esp on esp.id = tp.idEspecialidade 
                    inner join tb_uf tabelauf on tabelauf.id=tp.idUf 
                    where tp.id = ?`, results.insertId, function (error, dadosProfissionais) {

                if (error) {
                return conn.rollback(function() {
                    console.log('Erro' + err);
                    throw err;
                });
                }                
                console.log('Select ' + JSON.stringify(dadosProfissionais));

                connDim.query(`INSERT INTO profissional (cidade_id_cidade, estado_id_estado, tipo_conselho_id_tipo_conselho, 
                    tipo_prescritor_id_tipo_prescritor, nome, status_2, inscricao, data_inscricao, especialidade, usua_incl,
                    data_incl) VALUES (?,(SELECT id_estado from estado where uf=?),?,?,?,?,?,?,?,?,?) `
                , [dadosProfissionais[0].cidade_id_cidade,dadosProfissionais[0].estado_id_estado,
                   dadosProfissionais[0].tipo_conselho_id_tipo_conselho,dadosProfissionais[0].tipo_prescritor_id_tipo_prescritor,
                   dadosProfissionais[0].nome,dadosProfissionais[0].status_2,dadosProfissionais[0].inscricao,
                   dadosProfissionais[0].data_inscricao,dadosProfissionais[0].especialidade,dadosProfissionais[0].usua_incl,
                   dadosProfissionais[0].data_incl]
                
                , function (error, novoProfissional) {
                    if (error) {
                    return conn.rollback(function() {
                        console.log('Erro no insert ' + error);
                        throw error;
                    });
                    }

            console.log('Criou no dim o ID ' + novoProfissional.insertId);
            console.log('Ultimo ' + JSON.stringify(novoProfissional));

            conn.commit(function(err) {
              if (err) {
                return conn.rollback(function() {                  
                    throw err;
                });
              }
              console.log('Sucesso!');              
              return callback(null,novoprod);              
            });
          });
        });
      });    
    }); 
}

ProfissionalDAO.prototype.atualiza = function(profissional, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET geom = POINT(?, ?), ? WHERE id= ?`, [profissional.longitude, profissional.latitude, profissional, id], callback);
}

ProfissionalDAO.prototype.listaPorEstabelecimento = function(estabelecimento, callback) {
    this._connection.query(`
        SELECT * 
        FROM ${this._table} as t 
        INNER JOIN tb_estabelecimento_profissional as ep ON (t.id = ep.idProfissional) 
        WHERE ep.idEstabelecimento = ?`, 
    estabelecimento.id, 
    callback);
}

ProfissionalDAO.prototype.lista = function(addFilter, callback) {
    let where = "";

    if (addFilter != null) {       
        if (addFilter.nome) {
            where += ` AND prof.nome = ${addFilter.nome}`;
        }

        if (addFilter.profissionalSus) {
            where += ` AND prof.profissionalSus = ${addFilter.profissionalSus}`;
        }

        if (addFilter.idEspecialidade) {
            where += ` AND prof.idEspecialidade = ${addFilter.idEspecialidade}`;
        }

        if(addFilter.estabelecimentos) {
            where += ` AND ep.idEstabelecimento = ${addFilter.estabelecimentos}`;
        }
    }

    this._connection.query(`
        SELECT
            prof.id,
            prof.cpf,
            prof.nome,
            prof.nomeMae,
            prof.nomePai,
            prof.dataNascimento,
            GROUP_CONCAT(e.razaoSocial) as estabelecimentos, 
            prof.sexo,
            nac.nome AS idNacionalidade,
            nat.nome AS idNaturalidade,
            prof.profissionalSus,
            prof.rg,
            prof.dataEmissao,
            prof.orgaoEmissor,
            prof.escolaridade,
            prof.cep,
            prof.logradouro,
            prof.numero,
            prof.complemento,
            mun.nome AS idMunicipio,
            uf.nome AS idUf,
            prof.bairro,
            prof.foneResidencial,
            prof.foneCelular,
            prof.email,
            esp.nome AS idEspecialidade,
            prof.vinculo,
            prof.crm,
            prof.cargaHorariaSemanal,
            prof.cargoProfissional,
            prof.situacao,
            prof.latitude,
            prof.longitude
        FROM tb_profissional prof 
        INNER JOIN tb_estabelecimento_profissional ep ON (ep.idProfissional = prof.id)
        INNER JOIN tb_estabelecimento e ON (ep.idEstabelecimento = e.id AND e.situacao = 1)
        INNER JOIN tb_nacionalidade nac ON (prof.idNacionalidade = nac.id)
        INNER JOIN tb_uf nat ON (prof.idNaturalidade = nat.id)
        INNER JOIN tb_municipio mun ON (prof.idMunicipio = mun.id)
        INNER JOIN tb_uf uf ON (prof.idUf = uf.id)
        INNER JOIN tb_especialidade esp ON (prof.idEspecialidade = esp.id)  
        WHERE prof.situacao = 1 
        ${where}  
        
        GROUP BY         
            prof.id,
            prof.cpf,
            prof.nome,
            prof.nomeMae,
            prof.nomePai,
            prof.dataNascimento,
            
            prof.sexo,
            nac.nome,
            nat.nome,
            prof.profissionalSus,
            prof.rg,
            prof.dataEmissao,
            prof.orgaoEmissor,
            prof.escolaridade,
            prof.cep,
            prof.logradouro,
            prof.numero,
            prof.complemento,
            mun.nome,
            uf.nome,
            prof.bairro,
            prof.foneResidencial,
            prof.foneCelular,
            prof.email,
            esp.nome,
            prof.vinculo,
            prof.crm,
            prof.cargaHorariaSemanal,
            prof.cargoProfissional,
            prof.situacao,
            prof.latitude,
            prof.longitude `,
    callback);
}

ProfissionalDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query(`SELECT 
        id,
        cpf,
        nome,
        nomeMae, 
        nomePai, 
        DATE_FORMAT(dataNascimento,'%d/%m/%Y') as dataNascimento,
        sexo,  
        idNacionalidade, 
        idNaturalidade, 
        profissionalSus, 
        rg, 
        DATE_FORMAT(dataEmissao,'%d/%m/%Y') as dataEmissao, 
        orgaoEmissor, 
        escolaridade, 
        cep, 
        logradouro, 
        numero, 
        complemento, 
        idMunicipio, 
        idUf, 
        bairro, 
        foneResidencial,
        foneCelular, 
        email, 
        idEspecialidade, 
        vinculo, 
        crm, 
        cargaHorariaSemanal, 
        cargoProfissional, 
        situacao, 
        dataCriacao,
        latitude,
        longitude
     FROM ${this._table} WHERE id = ?`,id,callback);
}

ProfissionalDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

ProfissionalDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ProfissionalDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

ProfissionalDAO.prototype.buscarPorEstabelecimento = function(id, callback) {
    this._connection.query(`
        SELECT t.id, t.nome 
        FROM ${this._table} as t 
        INNER JOIN tb_estabelecimento_profissional as ep ON (t.id = ep.idProfissional) 
        WHERE ep.idEstabelecimento = ?`, id, callback);
}

ProfissionalDAO.prototype.buscaPorEquipe = function(id, callback) {
    this._connection.query(`
        SELECT p.id, p.nome 
        FROM ${this._table} as p 
        INNER JOIN tb_profissional_equipe as pe ON (p.id = pe.idProfissional) 
        WHERE pe.idEquipe = ?`, id, callback);
}

module.exports = function(){
    return ProfissionalDAO;
};