function Cron() {
}

Cron.prototype.geraFatura = function (callback) {

   callback("TESTE");
}



module.exports = function () {
    return Cron;
}



