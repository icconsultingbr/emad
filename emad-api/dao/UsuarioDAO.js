function UsuarioDAO(connection) {
    this._connection = connection;
    this._table = "tb_usuario";
}

UsuarioDAO.prototype.salva = function (usuario, callback) {
    var query = this._connection.query("INSERT INTO " + this._table + " SET ?", usuario, callback);
    console.log(query.sql);
}

UsuarioDAO.prototype.atualiza = async function (usuario, id) {

   return await this._connection.query(`UPDATE ${this._table} SET ? where id= ?`, [usuario, id]);
}

UsuarioDAO.prototype.atualizaToken = async function (usuario, id) {

    return await this._connection.query(`UPDATE ${this._table} SET 

    token = '${usuario.token}', 
    dataToken = current_timestamp(), 
    dataAtividade = current_timestamp(), 
    ultimoLogin = current_timestamp(), 
    tentativasSenha = 0 
    
    where id= ?`, id);
}

UsuarioDAO.prototype.atualizaTentativa = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " SET tentativasSenha = (tentativasSenha+1), dataTentativa = current_timestamp() where id= ?", id, callback);
}

UsuarioDAO.prototype.atualizaSituacaoUsuario = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " SET situacao = 0 where id= ?", id, callback);
}



UsuarioDAO.prototype.hashSenha = function (usuario, callback) {
    this._connection.query("UPDATE " + this._table + " SET senha = ? , dataAtualizacaoSenha = CURRENT_TIMESTAMP() WHERE id = ?", [usuario.senha, usuario.id], callback);
}

UsuarioDAO.prototype.lista = function (addFilter, callback) {

    let where = "";

    if (addFilter != null) {
        if (addFilter.situacao) {
            where += " AND u.situacao =" + addFilter.situacao;
        }
    }

    this._connection.query(`
    SELECT 
        u.id, 
        u.nome, 
        u.cpf, 
        u.nomeMae, 
        u.dataNascimento, 
        u.email, 
        u.foto, 
        IF(STRCMP(u.sexo,'M')=0, 'Masculino', 'Feminino') as sexo, 
        u.celular, 
        tu.nome as idTipoUsuario, 
        CASE  
        WHEN u.situacao = 0  THEN 'Inativo'  
        WHEN u.situacao =  1 THEN 'Ativo'  
        END as situacao, 
        u.dataCriacao 
    FROM  ${this._table} as u 
    INNER JOIN tb_tipo_usuario as tu ON(u.idTipoUsuario = tu.id)
    ${where}  ORDER BY nome ASC, u.idTipoUsuario DESC`, callback);
}


UsuarioDAO.prototype.buscaPorId = function (id, callback) {

    this._connection.query(`select 
        id, 
        nome, 
        cpf, 
        nomeMae, 
        DATE_FORMAT(dataNascimento,'%d/%m/%Y') as dataNascimento, 
        email, 
        foto, 
        celular, 
        idTipoUsuario, 
        senha, 
        sexo, 
        situacao 
        FROM ${this._table} WHERE id = ?`, [id], callback);
}

UsuarioDAO.prototype.listaPorEmpresa = function (id, callback) {
    this._connection.query(`select 
        id, 
        nome, 
        cpf, 
        nomeMae, 
        DATE_FORMAT(dataNascimento,'%d/%m/%Y') as dataNascimento, 
        email, 
        foto, 
        celular, 
        idTipoUsuario, 
        senha, 
        sexo, 
        situacao 
        FROM ${this._table} WHERE id = ?`, [id], callback);
}

UsuarioDAO.prototype.buscaPorEmail = async function (usuario) {

    let where = "";

    if(usuario.email.length == 11) 
        where += " AND u.cpf = ? ";
    else
        where += " AND u.email = ? ";

    if (typeof (usuario.id) != 'undefined') {
        where += "AND u.id <> ?";
    }

    return await this._connection.query(`
        SELECT u.*, 
        IF((DATE_ADD(IFNULL(u.dataAtualizacaoSenha,u.dataCriacao),  INTERVAL tu.periodoSenha DAY)) <= CURRENT_TIMESTAMP(), 1,0) as expiredPassword,
        tu.bloqueioTentativas 
        
        FROM ${this._table} as u 
        INNER JOIN tb_tipo_usuario as tu ON(u.idTipoUsuario = tu.id) 
        WHERE u.situacao = true AND tu.situacao = true ${where}`, [usuario.email, usuario.id]);
}

UsuarioDAO.prototype.buscaPorToken = function (token, callback) {
    this._connection.query("select u.* FROM " + this._table + " as u \
    INNER JOIN tb_tipo_usuario as tu ON(u.idTipoUsuario = tu.id) \
    WHERE u.situacao = true AND tu.situacao = true AND token = ?", token, callback);
}

UsuarioDAO.prototype.buscaPorCPF = async function (usuario) {

    let where = " AND u.cpf = ? ";

    if (typeof (usuario.id) != 'undefined') {
        where += "AND u.id <> ?";
    }

    return await this._connection.query(`select u.* from ${this._table} as u 
    WHERE 1=1 ${where}`, [usuario.cpf, usuario.id]);
}

UsuarioDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " set situacao = 0 WHERE id = ? ", id, callback);
}

UsuarioDAO.prototype.addActivity = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " set dataAtividade = current_timestamp() WHERE id = ? ", id, callback);
}

UsuarioDAO.prototype.buscaUsuario = function (usuario, callback) {

    this._connection.query(`select 
        TIMESTAMPDIFF(MINUTE, IF(u.dataAtividade = NULL, current_timestamp(), u.dataAtividade), current_timestamp()) as diff, 
        u.*,   
        IF((DATE_ADD(IFNULL(u.dataAtualizacaoSenha,u.dataCriacao),  INTERVAL tu.periodoSenha DAY)) <= CURRENT_TIMESTAMP(), 1,0) as ep 
    from ${this._table} as u INNER JOIN tb_tipo_usuario as tu ON(u.idTipoUsuario = tu.id) WHERE u.situacao = 1 AND u.id = ? `, usuario.id, callback);
}

UsuarioDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

UsuarioDAO.prototype.listaUsuarioSemProfissional = function(idProfissional, idEstabelecimento, callback) {    
    let where = "";

    if (idProfissional > 0) {
        where += " and tp.id <> " + idProfissional;
    }

    this._connection.query(`select tu.id, tu.nome FROM ${this._table} tu WHERE tu.situacao = 1  and tu.idTipoUsuario <> 3
    and not exists (select 1 from tb_profissional tp where tp.idUsuario = tu.id ${where}) 
    and exists (select 1 from tb_estabelecimento_usuario eu where eu.idUsuario = tu.id and eu.idEstabelecimento = ?) ORDER BY tu.nome ASC`,idEstabelecimento, callback);
}

UsuarioDAO.prototype.listaPorTipoUsuario = function (idTipoUsuario, callback) {
    this._connection.query(`select 
        id, 
        nome
        FROM ${this._table} WHERE idTipoUsuario = ?`, [idTipoUsuario], callback);
}


UsuarioDAO.prototype.buscaPorCPFSync = async function (usuario) {

    let where = " AND u.cpf = ? ";

    if (typeof (usuario.id) != 'undefined') {
        where += "AND u.id <> ?";
    }

    let usuarioResult =  await this._connection.query(`select u.* from ${this._table} as u WHERE 1=1 ${where}`, [usuario.cpf, usuario.id]);
    return usuarioResult;
}

UsuarioDAO.prototype.buscaPorEmailSync = async function (usuario) {

    let where = " AND u.email = ? ";

    if (typeof (usuario.id) != 'undefined') {
        where += "AND u.id <> ?";
    }

    let usuarioResult =  await this._connection.query(`
        SELECT u.*, 
        IF((DATE_ADD(IFNULL(u.dataAtualizacaoSenha,u.dataCriacao),  INTERVAL tu.periodoSenha DAY)) <= CURRENT_TIMESTAMP(), 1,0) as expiredPassword,
        tu.bloqueioTentativas 
        
        FROM ${this._table} as u 
        INNER JOIN tb_tipo_usuario as tu ON(u.idTipoUsuario = tu.id) 
        WHERE u.situacao = true AND tu.situacao = true ${where}`, [usuario.email, usuario.id]);

    return usuarioResult;
}

UsuarioDAO.prototype.salvaSync = async function (usuario) {
    let usuarioResult =  await this._connection.query("INSERT INTO " + this._table + " SET ?", usuario);
    return usuarioResult;
}

UsuarioDAO.prototype.atualizaSync = async function (usuario, id) {
    let usuarioResult =  await this._connection.query(`UPDATE ${this._table} SET ? where id= ?`, [usuario, id]);
    return usuarioResult;
}

module.exports = function () {
    return UsuarioDAO;
};