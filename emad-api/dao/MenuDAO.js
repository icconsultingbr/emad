function MenuDAO(connection) {
    this._connection = connection;
    this._table = "tb_menu";
} 

MenuDAO.prototype.salva = function(menu,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", menu, callback);
}

MenuDAO.prototype.lista = function(callback) {
    this._connection.query(
        "select "+
            "m.id,"+ 
            "m.nome, "+
            "m2.nome as menuPai, "+
            "m.icone, m.ordem, "+
            "IF(m.situacao>0, 'Ativo', 'Inativo') as situacao, "+
            "m.rota from "+this._table+" as m "+
        "LEFT JOIN tb_menu as m2 ON(m.menuPai = m2.id) "+ 
        "WHERE m.invisivel = 0 "+
        "ORDER BY ordem ASC", callback);
} 


MenuDAO.prototype.listaDescricao = function(callback) {
    this._connection.query(
        `SELECT 
            m.id, 
            CASE 
                WHEN m2.nome IS NOT NULL THEN CONCAT(m2.nome, ' / ', m.nome) 
                ELSE m.nome 
            END  AS nome, 
            m.ordem, 
            m.menuPai  
        FROM tb_menu AS m 
        LEFT JOIN 
            tb_menu AS m2 
        ON ( 
            m.menuPai = m2.id) 
        WHERE 
            m.situacao = 1 
        ORDER BY 
            m.menuPai ASC, m2.nome ASC, m.nome ASC`, callback);
} 

MenuDAO.prototype.listaRotasPorTipoUsuario = function(idTipoUsuario, callback) {
    this._connection.query(
        "select m.rota from "+this._table+" as m INNER JOIN tb_tipo_usuario_menu tum ON(m.id = tum.idMenu) WHERE tum.idTipoUsuario = ? AND m.situacao = 1 ORDER BY ordem ASC", 
        idTipoUsuario, callback);
}

MenuDAO.prototype.listaOrdemMenuFilhoPorMenuPai = function(idMenuPai, callback) {

    if(idMenuPai>0){
        this._connection.query(
            `select a.id as id, a.nome from 
            (select ordem as id, CONCAT(@row_num:= @row_num + 1,'-',nome) nome from tb_menu tm, (SELECT @row_num:= 0 AS num) AS c where menuPai=?
            union
            select COALESCE(max(ordem),0)+1 as id, CONCAT(COUNT(*)+1, '- Vazio') nome from tb_menu tm where menuPai=?) a
            order by a.nome asc`, 
            [idMenuPai,idMenuPai], callback);
        }
    else{
            this._connection.query(
                `select a.id as id, a.nome from 
                (select ordem as id, CONCAT(@row_num:= @row_num + 1,'-',nome) nome from tb_menu tm, (SELECT @row_num:= 0 AS num) AS c where menuPai is null
                union
                select COALESCE(max(ordem),0)+1 as id, CONCAT(COUNT(*)+1, '- Vazio') nome from tb_menu tm where menuPai is null) a
                order by a.nome asc`, callback);
        }
}

MenuDAO.prototype.listaPorTipoUsuarioDescricao = function(idTipoUsuario, callback) {
    this._connection.query(
        "SELECT \
            m.id, \
            CASE \
                WHEN m2.nome IS NOT NULL THEN CONCAT(m2.nome, ' / ', m.nome) \
                ELSE m.nome \
            END  AS nome, \
            m.ordem, \
            m.menuPai  \
        FROM "+this._table+" as m \
        LEFT JOIN \
            tb_menu AS m2 \
        ON ( \
            m.menuPai = m2.id) \
        INNER JOIN tb_tipo_usuario_menu tum ON(m.id = tum.idMenu) \
        WHERE tum.idTipoUsuario = ? AND m.situacao = 1 \
        ORDER BY m.menuPai ASC, m2.nome ASC, m.nome ASC ",
        idTipoUsuario, callback);
}

MenuDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where  id = ?",id,callback);
}

MenuDAO.prototype.atualizaPorId = function (menu, id,callback) {

    if(menu.ordem && menu.menuPai)
        this._connection.query("UPDATE "+this._table+" SET ordem=ordem+1 where menuPai=? and ordem>= ?", [menu.menuPai, menu.ordem], callback);

    this._connection.query("UPDATE "+this._table+" SET ? where id= ?", [menu, id], callback);
}

MenuDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

MenuDAO.prototype.listaPorTipoUsuario = function(idUsuario, callback){
    this._connection.query(
        `SELECT 
            DISTINCT m1.nome,  
            m1.icone, 
            m1.id, 
            m1.menuPai, 
            CASE 
                WHEN            
                (SELECT count(*) FROM tb_menu WHERE menuPai = m1.id) > 0 THEN 1
                ELSE 0
            END as hasChildren,
            m1.rota, 
            m1.ordem, 
            m1.invisivel 
            FROM 
        ${this._table} AS m1 
        INNER JOIN tb_tipo_usuario_menu tum ON(m1.id = tum.idMenu) 
        LEFT JOIN tb_menu AS m2 ON m1.id=m2.menuPai 
        WHERE tum.idTipoUsuario = ? AND m1.situacao = 1  AND m1.invisivel = 0  
        ORDER BY m1.menuPai ASC, m1.ordem ASC`,idUsuario, callback
    );
}

module.exports = function(){
    return MenuDAO;
}; 


