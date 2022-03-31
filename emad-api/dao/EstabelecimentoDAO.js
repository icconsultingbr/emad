function EstabelecimentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_estabelecimento";
}

EstabelecimentoDAO.prototype.salva = function (estabelecimento, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET geom = POINT(?, ?), ?`, [estabelecimento.longitude, estabelecimento.latitude, estabelecimento], callback);
}

EstabelecimentoDAO.prototype.atualiza = function (estabelecimento, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET geom = POINT(?, ?), ? WHERE id= ?`, [estabelecimento.longitude, estabelecimento.latitude, estabelecimento, id], callback);
}

EstabelecimentoDAO.prototype.listaPorUsuario = function (id) {

    return this._connection.query(`SELECT 
        e.id,
        e.cnes,
        e.cnpj,
        e.razaoSocial,
        e.nomeFantasia,
        e.cep,
        e.logradouro,
        e.numero,
        e.complemento,
        e.bairro,
        m.id as idMunicipio,
        u.id as idUf,
        e.telefone1,
        e.telefone2, 
        e.email,
        e.cnpjMantedora,
        e.grauDependencia,
        e.terceiros,
        tu.nome as idTipoUnidade,
        e.esferaAdministradora,
        e.situacao, 
        e.dataCriacao,
        e.latitude,
        e.longitude,
        e.idUnidadeCorrespondenteDim,
        e.idUnidadePesquisaMedicamentoDim,
        e.idUnidadeRegistroReceitaDim,
        e.nivelSuperior,
        e.idEstabelecimentoNivelSuperior,
        e.cnsProfissionaleSus, 
        e.obrigaCpfNovoPaciente,
        e.obrigaCartaoSusNovoPaciente,
        e.obrigaValidarPacienteAtendimento,
        e.celularDefaultNovoPaciente
    FROM 
        tb_estabelecimento AS e
    INNER JOIN 
        tb_estabelecimento_usuario as eu ON(e.id = eu.idEstabelecimento)  
    INNER JOIN 
        tb_municipio as m ON(e.idMunicipio = m.id) 
    INNER JOIN 
        tb_uf as u ON(e.idUf = u.id) 
    INNER JOIN
        tb_especialidade es ON(e.cboProfissionalEsus = es.id)
    INNER JOIN 
        tb_tipo_unidade as tu ON(e.idTipoUnidade = tu.id) WHERE eu.idUsuario = ? ORDER BY e.nomeFantasia ASC`, id);


}

EstabelecimentoDAO.prototype.listaEstabelecimentosNivelSuperior = function (id, callback) {
    this._connection.query(`select e.id, e.razaoSocial as nome FROM ${this._table} as e     
    WHERE e.situacao = 1 and nivelSuperior = 1 and e.id <> ? ORDER BY e.nomeFantasia ASC`, id, callback);
}

EstabelecimentoDAO.prototype.lista = async function (addFilter) {
    let where = "";

    if (addFilter != null) {

        if (addFilter.idUf) {
            where += " AND u.id =" + addFilter.idUf;
        }

        if (addFilter.idMunicipio) {
            where += " AND u.uf =" + addFilter.uf;
        }

        if (addFilter.cnes) {
            where += ` AND e.cnes = ${addFilter.cnes}`;
        }

        if (addFilter.razaoSocial) {
            where += ` AND UPPER(e.razaoSocial) LIKE '%${addFilter.razaoSocial.toUpperCase()}%'`;
        }

        if (addFilter.idTipoUnidade) {
            where += ` AND e.idTipoUnidade = ${addFilter.idTipoUnidade}`;
        }
    }

    return await this._connection.query(`SELECT 
        e.id,
        e.cnes,
        e.cnpj,
        e.razaoSocial,
        e.nomeFantasia,
        e.cep,
        e.logradouro,
        e.numero,
        e.complemento,
        e.bairro,
        m.i as idMunicipio,
        u.i as idUf,
        e.telefone1,
        e.telefone2, 
        e.email,
        e.cnpjMantedora,
        e.grauDependencia,
        e.terceiros,
        tu.nome as idTipoUnidade,
        e.esferaAdministradora,
        e.situacao, 
        e.dataCriacao,
        e.latitude,
        e.longitude,
        e.idUnidadeCorrespondenteDim,
        e.idUnidadePesquisaMedicamentoDim,
        e.idUnidadeRegistroReceitaDim,
        e.nivelSuperior,
        e.idEstabelecimentoNivelSuperior,
        e.cnsProfissionaleSus, 
        e.obrigaCpfNovoPaciente,
        e.obrigaCartaoSusNovoPaciente
    FROM 
        tb_estabelecimento AS e 
    INNER JOIN 
        tb_municipio as m ON(e.idMunicipio = m.id) 
    INNER JOIN 
        tb_uf as u ON(e.idUf = u.id) 
    INNER JOIN
        tb_especialidade es ON(e.cboProfissionalEsus = es.id)
    INNER JOIN 
        tb_tipo_unidade as tu ON(e.idTipoUnidade = tu.id) WHERE e.situacao = 1 ORDER BY e.nomeFantasia ASC ${where} `);
}

EstabelecimentoDAO.prototype.buscaPorId = async function (id, callback) {

    return await this._connection.query(`SELECT 
            e.id,
            e.cnes,
            e.cnpj,
            e.razaoSocial,
            e.nomeFantasia,
            e.cep,
            e.logradouro,
            e.numero,
            e.complemento,
            e.bairro,
            m.id as idMunicipio,
            u.id as idUf,
            e.telefone1,
            e.telefone2, 
            e.email,
            e.cnpjMantedora,
            e.grauDependencia,
            e.terceiros,
            tu.id as idTipoUnidade,
            e.esferaAdministradora,
            e.situacao, 
            e.dataCriacao,
            e.latitude,
            e.longitude,
            e.idUnidadeCorrespondenteDim,
            e.idUnidadePesquisaMedicamentoDim,
            e.idUnidadeRegistroReceitaDim,
            e.nivelSuperior,
            e.idEstabelecimentoNivelSuperior,
            e.cboProfissionalEsus, 
            e.cnsProfissionaleSus, 
            e.obrigaCpfNovoPaciente,
            e.obrigaCartaoSusNovoPaciente,
            e.obrigaValidarPacienteAtendimento,
            e.celularDefaultNovoPaciente
        FROM 
            tb_estabelecimento AS e
        INNER JOIN 
            tb_municipio as m ON(e.idMunicipio = m.id) 
        INNER JOIN 
            tb_uf as u ON(e.idUf = u.id) 
        INNER JOIN
        	tb_especialidade es ON(e.cboProfissionalEsus = es.id)
        INNER JOIN 
            tb_tipo_unidade as tu ON(e.idTipoUnidade = tu.id) WHERE e.id = ?`, id, callback);
}

EstabelecimentoDAO.prototype.buscaCidadePorIdEstabelecimento = function (id, callback) {
    this._connection.query(`select te.idUf , idMunicipio , CONCAT(mun.nome,'/',uf.uf) textoCidade
                            from tb_estabelecimento te 
                            inner join tb_uf uf on uf.id = te.idUf 
                            inner join tb_municipio mun on mun.id = te.idMunicipio where te.id=?`, id, callback);
}

EstabelecimentoDAO.prototype.buscaDominio = function (callback) {
    this._connection.query("select id, razaoSocial as nome FROM " + this._table, callback);
}

EstabelecimentoDAO.prototype.dominio = function (callback) {
    this._connection.query("select id, razaoSocial as nome FROM " + this._table + " WHERE situacao = 1", callback);
}

EstabelecimentoDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " set situacao = 0 WHERE id = ? ", id, callback);
}

EstabelecimentoDAO.prototype.buscarPacientes = function (id, raio, idModalidade, sexo, idadeDe, idadeAte, callback) {
    let where = "";

    if (idModalidade != 0) {
        where += ` AND pac.idModalidade = ${idModalidade}`
    }

    if (sexo != 0) {
        where += ` AND pac.sexo = '${sexo}'`
    }

    if (idadeDe != -1) {
        where += ` AND TIMESTAMPDIFF(YEAR, pac.dataNascimento, CURDATE()) >= ${idadeDe}`
    }

    if (idadeAte != -1) {
        where += ` AND TIMESTAMPDIFF(YEAR, pac.dataNascimento, CURDATE()) <= ${idadeAte}`
    }

    this._connection.query(`
        SELECT
            pac.id,
            pac.cartaoSus,
            pac.nome,
            pac.nomeSocial,
            pac.nomeMae,
            pac.nomePai,
            DATE_FORMAT(pac.dataNascimento,'%d/%m/%Y') as dataNascimento,
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
            ROUND(ST_Distance_Sphere(pac.geom, est.geom)) AS distancia,
        FROM tb_paciente pac
        INNER JOIN tb_nacionalidade nac ON (pac.idNacionalidade = nac.id)
        INNER JOIN tb_uf nat ON (pac.idNaturalidade = nat.id)
        INNER JOIN tb_municipio mun ON (pac.idMunicipio = mun.id)
        INNER JOIN tb_uf uf ON (pac.idUf = uf.id)
        INNER JOIN tb_modalidade md ON (pac.idModalidade = md.id) 
        INNER JOIN tb_estabelecimento est ON (est.id = ? AND ROUND(ST_Distance_Sphere(pac.geom, est.geom)) <= ?)
        WHERE pac.situacao = 1 
        ${where}`,
        [id, raio],
        callback
    );
}

EstabelecimentoDAO.prototype.carregaPorId = async function (id) {
    let result = await this._connection.query(`SELECT * FROM ${this._table} where id=?`, [id]);
    return result ? result[0] : null;
}

EstabelecimentoDAO.prototype.buscaEstabelecimentoESus = async function (id) {
    let result = await this._connection.query(`SELECT tm.codigo, te.cnes, te.cnpj, te.cnpj, te.nomeFantasia, te.cnsProfissionaleSus, es.codigoCBO FROM ${this._table} te
                                                INNER JOIN tb_municipio tm ON (te.idMunicipio = tm.id)
                                                LEFT JOIN tb_especialidade es ON(te.cboProfissionalEsus = es.id)
                                                where te.id = ?`, [id]);
    return result ? result[0] : null;
}

EstabelecimentoDAO.prototype.buscarTipoFichaEstabelecimento = function (idEstabelecimento) {
    return this._connection.query(`SELECT ttf.id, ttf.nome FROM 
                                                     tb_estabelecimento_ficha tef 
                                                  INNER JOIN 
                                                     tb_tipo_ficha ttf ON ttf.id = tef.idTipoFicha  
                                                 WHERE 
                                                    ttf.situacao = 1 AND
                                                    tef.idEstabelecimento =?`, [idEstabelecimento] + " ORDER BY ttf.id ASC");

}

module.exports = function () {
    return EstabelecimentoDAO;
};