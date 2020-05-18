var app = require('./config/custom-express')();
var config = require("config");
var jwt = require('jsonwebtoken');

var server = app.listen(config.get('apiPort'), function(){
    console.log('Server listen at '+config.get('apiPort'));

    setTimeout(() => {
        const connection = app.dao.ConnectionFactory();
        const cache = new app.cache.DimCache(connection);
        cache.configurar()
        .then(result =>{
            console.log('ok');
        });
    }, 2000);
});



var io = require('socket.io').listen(server);
app.set('io', io);

io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, app.settings.superSecret, function(err, decoded) {
        if(err) return next(new Error('Authentication error'));
        socket.decoded = decoded;
        next();
    });
  } else {
      next(new Error('Authentication error'));
  }    
});




io.on('connection', function(socket){
    console.log('>> Usuário conectou');
    socket.on('disconnect', function(){
        console.log('<< Usuário desconectou');
    });
    
    /*setInterval(()=>{
        socket.emit(
            'message',
            { apelido: 'HHHHAAAAAAAA', time: Date.now() }
        );
        socket.emit(
            'notificationss',
            { apelido: 'VAI', time: Date.now() }
        );
    },5000);

    setInterval(()=>{
        socket.emit(
            'notification',
            { apelido: 'VAI', time: Date.now() }
        );
    },4000);*/
    
});


/*const CronJob = require('cron').CronJob;
let servico = new app.cron.Cron();

console.log('Before job instantiation');
const job = new CronJob('0 * 17 * * *', function() {
	
    servico.geraFatura(function (response) {
        console.log(response);
        const d = new Date();
        console.log('onTick:', d);
    });
    



});
console.log('After job instantiation');
job.start();*/