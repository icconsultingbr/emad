function WebUser() {
}

WebUser.prototype.buscaPorToken = function(app, token) {
    var q = require('q');
    var d = q.defer();
    var connection = app.dao.ConnectionFactory();
    var usuarioDAO = new app.dao.UsuarioDAO(connection);
    usuarioDAO.buscaPorToken(token, function(exception, result) {
        if (exception) {
            d.reject(exception);
        } else {
            d.resolve(result);
        }
    });
    return d.promise;
}

WebUser.prototype.unauthorized = function(res) {
    errors = [];
    errors = customError(errors, "header", "Não autorizado", "");
    res.status(401).json(errors); 
}

function customError(errors, field, message, value){
    if(errors == false){
        errors = [];
    }
    var error = {};
    error.location = "body";
    error.param = field;
    error.msg =  message;
    error.value = value;
    errors.push(error);
    return errors;
}

module.exports = function(){
    return WebUser;
}