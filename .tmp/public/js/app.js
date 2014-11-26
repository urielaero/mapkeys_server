(function (angular) {
    "use strict";

    var app = angular.module('main', ['luegg.directives'])

    .controller('DashboardController', ['$scope', function($scope) {
        $scope.step = 0;
        $scope.counter = 0;

        io.socket.get('/key',function(data){
            console.log(data);
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
            console.log('obj',obj)
            if(obj.verb == 'updated'){
                console.log('obj update',obj)
                console.log('ips',$scope.ips)
                for(var i=0;i<$scope.ips.length;i++){
                    var ip = $scope.ips[i];
                    console.log('ip.id',ip.id)
                    console.log('obj.id',obj.id)
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
            $scope.counter += res ? 1 : 0;

            return res;
        }
    }])
})(window.angular);
