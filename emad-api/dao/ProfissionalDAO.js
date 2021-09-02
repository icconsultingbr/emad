function ProfissionalDAO(connection, connectionDim) {
    this._connection = connection;
    this._connectionDim = connectionDim;
    this._table = "tb_profissional";
}

ProfissionalDAO.prototype.listaPorEstabelecimento = function (estabelecimento, callback) {
    this._connection.query(`
        SELECT * 
        FROM ${this._table} as t 
        INNER JOIN tb_estabelecimento_usuario as ep ON (t.idUsuario = ep.idUsuario) 
        WHERE ep.idEstabelecimento = ?`,
        estabelecimento.id,
        callback);
}

ProfissionalDAO.prototype.lista = function (addFilter, callback) {
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

        if (addFilter.idEstabelecimento) {
            where += ` AND ep.idEstabelecimento = ${addFilter.idEstabelecimento}`;
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
            prof.longitude,
            prof.idUsuario,
            usu.nome nomeUsuario,
            prof.profissionalCNS profissionalCNS,
            prof.idConselho
        FROM tb_profissional prof 
        INNER JOIN tb_estabelecimento_usuario ep ON (ep.idUsuario = prof.idUsuario)
        INNER JOIN tb_usuario usu ON (prof.idUsuario = usu.id)
        INNER JOIN tb_estabelecimento e ON (ep.idEstabelecimento = e.id AND e.situacao = 1)
        LEFT JOIN tb_nacionalidade nac ON (prof.idNacionalidade = nac.id)
        LEFT JOIN tb_uf nat ON (prof.idNaturalidade = nat.id)
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
            prof.longitude,
            prof.idUsuario,
            usu.nome,
            prof.profissionalCNS `,
        callback);
}

ProfissionalDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT 
        pro.id,
        pro.cpf,
        pro.nome,
        pro.nomeMae, 
        pro.nomePai, 
        DATE_FORMAT(pro.dataNascimento,'%d/%m/%Y') as dataNascimento,
        pro.sexo,  
        pro.idNacionalidade, 
        pro.idNaturalidade, 
        pro.profissionalSus, 
        pro.rg, 
        DATE_FORMAT(pro.dataEmissao,'%d/%m/%Y') as dataEmissao, 
        pro.orgaoEmissor, 
        pro.escolaridade, 
        pro.cep, 
        pro.logradouro, 
        pro.numero, 
        pro.complemento, 
        pro.idMunicipio, 
        pro.idUf, 
        pro.bairro, 
        pro.foneResidencial,
        pro.foneCelular, 
        pro.email, 
        pro.idEspecialidade, 
        pro.vinculo, 
        pro.crm, 
        pro.cargaHorariaSemanal, 
        pro.cargoProfissional, 
        pro.situacao, 
        pro.dataCriacao,
        pro.latitude,
        pro.longitude,
        pro.idUsuario,
        usu.idTipoUsuario,
        pro.profissionalCNS,
        pro.idConselho
     FROM ${this._table} as pro
     LEFT JOIN tb_usuario as usu ON (usu.id = pro.idUsuario) 
     WHERE pro.id = ?`, id, callback);
}

ProfissionalDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

ProfissionalDAO.prototype.deletaPorId = function (id, callback) {
    const conn = this._connection;
    const connDim = this._connectionDim;
    const table = this._table;

    let novoprod = {};

    conn.beginTransaction(function (err) {
        if (err) { throw err; }
        conn.query(`UPDATE ${table} SET situacao = 0, idUsuario = null WHERE id = ?`, id,

            function (error, results) {
                if (error) { return conn.rollback(function () { throw error; }); }

                novoprod = results;
                console.log('Update no e-atend do ID ' + id);
                conn.query(`SELECT 
                        CASE WHEN tp.situacao = 1 THEN 'A' ELSE 'I' END as status_2,
                        6 usua_alt, 
                        now() as data_alt, 
                        idProfissionalCorrespondenteDim
                    from tb_profissional tp where tp.id = ?`, id,

                    function (error, dadosProfissionais) {
                        if (error) { return conn.rollback(function () { console.log('Erro' + error); throw error; }); }

                        console.log('Select ' + JSON.stringify(dadosProfissionais));
                        connDim.query(`UPDATE profissional SET status_2=?, usua_alt=?,
                    data_alt=? WHERE id_profissional=?`
                            , [dadosProfissionais[0].status_2, dadosProfissionais[0].usua_alt,
                            dadosProfissionais[0].data_alt, dadosProfissionais[0].idProfissionalCorrespondenteDim],

                            function (error, novoProfissional) {
                                if (error) { return conn.rollback(function () { console.log('Erro no update ' + error); throw error; }); }

                                console.log('Atualizou no dim o ID ' + dadosProfissionais[0].idProfissionalCorrespondenteDim);
                                console.log('Ultimo ' + JSON.stringify(novoProfissional));

                                conn.commit(

                                    function (err) {
                                        if (err) { return conn.rollback(function () { throw err; }); }

                                        console.log('Sucesso!');
                                        return callback(null, novoprod);
                                    });
                            });
                    });
            });
    });
}

ProfissionalDAO.prototype.dominio = function (callback) {
    this._connection.query("select id, nome FROM " + this._table + " WHERE situacao = 1 ORDER BY nome ASC", callback);
}

ProfissionalDAO.prototype.buscarPorEstabelecimento = function (id, callback) {
    this._connection.query(`
        SELECT t.id, t.nome 
        FROM ${this._table} as t 
        INNER JOIN tb_estabelecimento_usuario as ep ON (t.idUsuario = ep.idUsuario) 
        WHERE ep.idEstabelecimento = ? AND t.situacao = 1 `, id, callback);
}

ProfissionalDAO.prototype.buscaPorEquipe = function (id, callback) {
    this._connection.query(`
        SELECT p.id, p.nome 
        FROM ${this._table} as p 
        INNER JOIN tb_profissional_equipe as pe ON (p.id = pe.idProfissional) 
        WHERE pe.idEquipe = ?`, id, callback);
}

ProfissionalDAO.prototype.atualizaEstabelecimentosPorProfissionalDim = function (idUsuario, estabelecimentos, callback) {
    const conn = this._connection;
    const connDim = this._connectionDim;

    let novoprod = {};

    connDim.beginTransaction(function (err) {
        if (err) { throw err; }
        conn.query(`SELECT 
                        idProfissionalCorrespondenteDim
                        from tb_profissional tp where tp.idUsuario = ?`, idUsuario,

            function (error, dadosProfissionais) {
                if (error) { return connDim.rollback(function () { console.log('Erro' + error); throw error; }); }

                novoprod = dadosProfissionais;
                console.log('Select ' + JSON.stringify(dadosProfissionais));

                connDim.query(`DELETE FROM unidade_has_profissional WHERE profissional_id_profissional=?`
                    , [dadosProfissionais[0].idProfissionalCorrespondenteDim],

                    function (error, resultDelete) {
                        if (error) { return connDim.rollback(function () { console.log('Erro no delete ' + error); throw error; }); }

                        console.log('Delete no dim o ID profissional ' + dadosProfissionais[0].idProfissionalCorrespondenteDim);
                        console.log(JSON.stringify(resultDelete));

                        connDim.query("INSERT INTO unidade_has_profissional (unidade_id_unidade, profissional_id_profissional, date_incl, usua_incl) VALUES " + estabelecimentos
                            ,
                            function (error, resultInsert) {
                                if (error) { return connDim.rollback(function () { console.log('Erro no INSERT ' + error); throw error; }); }

                                console.log(JSON.stringify(resultInsert));

                                connDim.commit(

                                    function (err) {
                                        if (err) { return connDim.rollback(function () { throw err; }); }

                                        console.log('Sucesso!');
                                        return callback(null, novoprod);
                                    });
                            });
                    });
            });
    });
}

ProfissionalDAO.prototype.buscaEstabelecimentoPorProfissionalParaDim = function (idUsuario, callback) {
    this._connection.query(`SELECT pro.idProfissionalCorrespondenteDim , est.idUnidadeCorrespondenteDim 
            FROM tb_estabelecimento_usuario tep 
        INNER JOIN tb_estabelecimento est on est.id = tep.idEstabelecimento 
        INNER JOIN tb_profissional pro on tep.idUsuario = pro.idUsuario 
        WHERE tep.idUsuario = ?  AND est.situacao = 1`, idUsuario, callback);
}

ProfissionalDAO.prototype.buscaPorUsuario = function (idUsuario, callback) {
    this._connection.query(`
        SELECT e.id, e.razaoSocial as nome FROM tb_estabelecimento_usuario as ep 
        INNER JOIN tb_estabelecimento e ON(ep.idEstabelecimento = e.id) 
        WHERE ep.idUsuario = ? AND e.situacao = 1`, id, callback);
}

ProfissionalDAO.prototype.buscaProfissionalPorUsuario = function (idUsuario, callback) {
    this._connection.query(`
        SELECT * FROM tb_profissional as p         
        WHERE p.idUsuario = ? AND p.situacao = 1`, idUsuario, callback);
}

ProfissionalDAO.prototype.buscaProfissionalPorUsuarioSync = async function (idUsuario) {
    let profissional = await this._connection.query(`SELECT * FROM tb_profissional as p WHERE p.idUsuario = ? AND p.situacao = 1`, [idUsuario]);

    return profissional[0];
}

ProfissionalDAO.prototype.buscaPorIdSync = async function (id) {
    let profissional = await this._connection.query(`SELECT 
        pro.id,
        pro.cpf,
        pro.nome,
        pro.nomeMae, 
        pro.nomePai, 
        DATE_FORMAT(pro.dataNascimento,'%d/%m/%Y') as dataNascimento,
        pro.sexo,  
        pro.idNacionalidade, 
        pro.idNaturalidade, 
        pro.profissionalSus, 
        pro.rg, 
        DATE_FORMAT(pro.dataEmissao,'%d/%m/%Y') as dataEmissao, 
        pro.orgaoEmissor, 
        pro.escolaridade, 
        pro.cep, 
        pro.logradouro, 
        pro.numero, 
        pro.complemento, 
        pro.idMunicipio, 
        pro.idUf, 
        pro.bairro, 
        pro.foneResidencial,
        pro.foneCelular, 
        pro.email, 
        pro.idEspecialidade, 
        pro.vinculo, 
        pro.crm, 
        pro.cargaHorariaSemanal, 
        pro.cargoProfissional, 
        pro.situacao, 
        pro.dataCriacao,
        pro.latitude,
        pro.longitude,
        pro.idUsuario,
        usu.idTipoUsuario,
        pro.profissionalCNS,
        pro.idConselho
     FROM ${this._table} as pro
     LEFT JOIN tb_usuario as usu ON (usu.id = pro.idUsuario) 
     WHERE pro.id = ?`, id);

    return profissional[0];
}

ProfissionalDAO.prototype.salvaSync = async function (profissional) {
    let profissionalResult = await this._connection.query(`INSERT INTO tb_profissional SET geom = POINT(?, ?), ?`, [profissional.longitude, profissional.latitude, profissional]);
    return profissionalResult;
}

ProfissionalDAO.prototype.atualizaSync = async function (profissional, id) {
    let profissionalResult = await this._connection.query(`UPDATE tb_profissional SET geom = POINT(?, ?), ? WHERE id= ?`, [profissional.longitude, profissional.latitude, profissional, id]);
    return profissionalResult;
}

ProfissionalDAO.prototype.carregaProfissionalPorMedicamento = async function (addFilter, material) {
    let where = "";
    let orderBy = "  ";

    if (addFilter != null) {
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined" && addFilter.idEstabelecimento != "null") {
            where += " AND rec.idEstabelecimento = " + addFilter.idEstabelecimento + "";
        }

        if (addFilter.idMaterial && addFilter.idMaterial != "undefined") {
            where += " AND item.idMaterial = " + addFilter.idMaterial + "";
        }

        if (addFilter.dataInicial && addFilter.dataFinal) {
            where += " AND rec.dataEmissao >= '" + addFilter.dataInicial + " 00:00:00' AND rec.dataEmissao <= '" + addFilter.dataFinal + " 23:59:59'";
        }

        if (addFilter.ordenadoPor) {
            orderBy += " order by " + addFilter.ordenadoPor + " asc";
        }
    }
    let medicamento;

    if (material) {
        medicamento = await this._connection.query(`select distinct mat.id idMaterial,
                                                            mat.codigo as codigoMaterial,
                                                            mat.descricao as nomeMaterial,
                                                        sum(item.qtdPrescrita) as totalQtdPrescrita,
                                                        sum(item.qtdDispAnterior) as totalQtdDispensada
                                                    from tb_receita as rec              
                                                        inner join tb_item_receita as item on rec.id=item.idReceita
                                                        inner join tb_estabelecimento as unid on rec.idEstabelecimento =unid.id
                                                        inner join tb_profissional as prof on rec.idProfissional=prof.id
                                                        inner join tb_material as mat on mat.id = item.idMaterial 
                                                    where 
                                                        prof.situacao=1 and
                                                        unid.situacao=1 and
                                                        mat.situacao=1 
                                                        ${where}                                                                                                                                                                 
                                                        group by mat.id
                                                        order by mat.descricao desc`);
    } else {
        medicamento = await this._connection.query(`select prof.nome nomeProfissional,
                                                        prof.crm inscricaoProfissional,
                                                        espec.nome nomeEspecialidade, 
                                                        sum(item.qtdPrescrita) as qtdPrescrita,
                                                        sum(item.qtdDispAnterior) as qtdDispensada,
                                                        max(rec.dataUltimaDispensacao) as dataUltimaDispensacao,
                                                        unid.nomeFantasia
                                                from tb_receita as rec              
                                                    inner join tb_item_receita as item on rec.id=item.idReceita
                                                    inner join tb_estabelecimento as unid on rec.idEstabelecimento =unid.id
                                                    inner join tb_profissional as prof on rec.idProfissional=prof.id
                                                    inner join tb_especialidade as espec on espec.id = prof.idEspecialidade 
                                                    inner join tb_material as mat on mat.id = item.idMaterial  
                                                    where 
                                                    prof.situacao=1 and
                                                    unid.situacao=1 and
                                                    mat.situacao=1 
                                                    ${where}                                                   
                                                group by prof.nome, prof.crm, espec.nome, unid.nomeFantasia                                                 
                                                ${orderBy} `);
    }


    return medicamento;
}

ProfissionalDAO.prototype.buscarProfissionalPorEstabelecimentoEsus = async function (id) {
    return await this._connection.query(`
        SELECT tp.id, tp.profissionalCNS, te.codigoCBO 
        FROM ${this._table} tp 
        INNER JOIN tb_estabelecimento_usuario as ep ON (tp.idUsuario = ep.idUsuario) 
        INNER JOIN tb_especialidade te ON (tp.idEspecialidade = te.id)
        WHERE ep.idEstabelecimento = ? AND tp.situacao = 1`, id);
}

ProfissionalDAO.prototype.buscaProfissionalSusPorUsuarioSync = async function (idUsuario) {
    let profissional = await this._connection.query(`SELECT *, te.codigoCBO FROM tb_profissional as p 
    INNER JOIN tb_especialidade te ON (p.idEspecialidade = te.id)
    WHERE p.idUsuario = ? AND p.situacao = 1`, [idUsuario]);

    return profissional[0];
}

module.exports = function () {
    return ProfissionalDAO;
};