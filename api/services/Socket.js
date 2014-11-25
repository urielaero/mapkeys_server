var net = require('net');

net.createServer(function(socket){
    socket.name = socket.remoteAddress;
   
    socket.on('data',function(data){
        var objs = data.toString();
        socket.write("OK");
        objs = JSON.parse(objs);
        console.log('json',objs);
        console.log('name',socket.name);
    });

    socket.on('end',function(){
        console.log('fuera');
    });


}).listen(1338);
