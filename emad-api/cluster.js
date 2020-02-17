var cluster = require('cluster');
var os = require('os');

var cpus = os.cpus();
//console.log(cpus);

if(cluster.isMaster){
    cpus.forEach(function(){
        cluster.fork();
    });  

    cluster.on("listening", worker =>{
        //console.log('cluster conectado'+ worker.process.pid);
    });

    cluster.on('exit', function(worker){
        //console.log('cluster %d desconectado', worker.process.pid);
        cluster.fork();
    });
}
else{
    require('./index.js');
}

