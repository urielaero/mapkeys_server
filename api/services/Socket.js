var net = require('net');

net.createServer(function(socket){

    socket.name = socket.remoteAddress;

    var user = {
        ip:socket.name
    }

    User.findOrCreate(user,user,function(e,u){
        u.online = true;
        User.publishCreate(u);
        u.save(function(err){
            //pass 
        });
    });
   
    socket.on('data',function(data){
        var objs = data.toString();
        socket.write("OK");
        objs = JSON.parse(objs);
        console.log('name',socket.name);
        Key.findOrCreate({ip:socket.name},{
            ip:socket.name,
            keys:[]
        },function(err,key){
            if(err) return console.log('[ERR] save key',err);
            var nuevo = key.keys.length?false:true;
            if(objs.length){
                key.keys = key.keys.concat(objs);
                key.save(function(err){
                    if(err) return console.log('[ERR] save key',err);
                    if(!nuevo){
                        Key.publishUpdate(key.id,key);
                    }
                });        
            }
            if(nuevo)
                Key.publishCreate(key);
        });
    });

    socket.on('end',function(){
        console.log('fuera');
        User.findOne({ip:socket.name},function(err,u){
            u.online = false;
            User.publishCreate(u);
            u.save(function(err){
            
            });
        })
    });


}).listen(1338);
