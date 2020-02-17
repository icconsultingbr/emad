function ClientCEP(){
}

ClientCEP.prototype.consultaCep = function(cep,callback){
   var Client = require('node-rest-client').Client;

   var client = new Client();
    
   var args = {
       path: {"cep": cep}
   };

   client.get("https://viacep.com.br/ws/${cep}/json", args,callback);
}

module.exports = function(){
    return ClientCEP;
}
