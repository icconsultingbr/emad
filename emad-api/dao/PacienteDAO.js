function PacienteDAO(connection) {
    this._connection = connection;
    this._table = "tb_paciente";
}

PacienteDAO.prototype.salva = function (paciente, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET geom = POINT(?, ?), ?`, [paciente.longitude, paciente.latitude, paciente], callback);
}

PacienteDAO.prototype.atualiza = function (paciente, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET geom = POINT(?, ?), ? WHERE id= ?`, [paciente.longitude, paciente.latitude, paciente, id], callback);
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
            pac.idSap
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
    idSap
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
    p.idSap
    FROM ${this._table} p 
    INNER JOIn tb_municipio m ON(p.idMunicipio = m.id) WHERE p.id = ?`, id, callback);
}

PacienteDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

PacienteDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
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
            ROUND(ST_Distance_Sphere(e.geom, p.geom)) AS distancia
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