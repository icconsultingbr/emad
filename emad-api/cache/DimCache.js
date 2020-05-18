'use strict';

const cache = require('memory-cache');
const ParametroSegurancaDAO = require('../dao/ParametroSegurancaDAO');

function DimCache(connection) {
    this.host = '';
    this.port = 0;
    this.username = '';
    this.password = '';
    this.database = '';
    this.connection = connection;

    this.obterCache();
}

DimCache.prototype.configurar = function(connection) {
    const self = this;

    return new Promise((resolve, reject) => {
        if(connection){
            self.connection = connection;
        }

        self.obterCache();

        if (this.configurado()) {
            resolve();

            return;
        }
        
        self.obterDb()
        .then(result => {
            resolve();
        })
        .catch(error => {
            reject(error);
        });
    });
}

DimCache.prototype.configurado = function () {
    return this.host
        && this.username
        && this.password
        && this.database;
}

DimCache.prototype.obterCache = function () {
    this.host = cache.get('ECARE_HOST');
    this.port = cache.get('ECARE_PORT');
    this.username = cache.get('ECARE_USERNAME');
    this.password = cache.get('ECARE_PASSWORD');
    this.database = cache.get('ECARE_DATABASE');
}

DimCache.prototype.obterDb = function () {
    const self = this;

    return new Promise((resolve, reject) => {
        const parametroSegurancaDAO = ParametroSegurancaDAO();

        const repository = new parametroSegurancaDAO(self.connection);
    
        repository.obterConexaoDim(function (exception, result) {
            if(exception){
                reject(exception);
            }

            console.log(result);
            self.salvarCache(result);

            resolve();
        });
    });
}

DimCache.prototype.salvarCache = function(result) {
    if (!result) {
        return;
    }


    this.host = result.find(x => x.nome === 'ECARE_HOST').valor;
    this.port = result.find(x => x.nome === 'ECARE_PORT').valor;
    this.username = result.find(x => x.nome === 'ECARE_USERNAME').valor;
    this.password = result.find(x => x.nome === 'ECARE_PASSWORD').valor;
    this.database = result.find(x => x.nome === 'ECARE_DATABASE').valor;

    cache.put('ECARE_HOST', this.host);
    cache.put('ECARE_PORT', this.port);
    cache.put('ECARE_USERNAME', this.username);
    cache.put('ECARE_PASSWORD', this.password);
    cache.put('ECARE_DATABASE', this.database);
}

module.exports = function(){
    return DimCache
}