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
  
    dictBuffering = {};

    dictBuffering[socket.name] = '';

    socket.on('data',function(data){
        console.log('name',socket.name);
        var objs = data.toString();
        try{
            objs = JSON.parse(objs);
            socket.write("OK");
        }catch(e){
            dictBuffering[socket.name] += objs;
            var tmp = dictBuffering[socket.name];
            if(tmp.indexOf('[') != -1 && tmp.indexOf(']') != -1){
                console.log('intentando parcear',tmp);
                objs = JSON.parse(tmp);
                dictBuffering[socket.name] = '';
                socket.write("OK");
            }else{
                socket.write("F");
                return;
            }

        }
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

    /*socket.on('end',function(){
        console.log('fuera');
        User.findOne({ip:socket.name},function(err,u){
            u.online = false;
            User.publishCreate(u);
            u.save(function(err){
            
            });
        })
    });*/
    socket.on('end',end);
    socket.on('error',end);


}).listen(1338);

function end(){
    console.log('fuera');
    User.findOne({ip:socket.name},function(err,u){
        u.online = false;
        User.publishCreate(u);
        u.save(function(err){
        
        });
    });
}
