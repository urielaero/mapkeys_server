(function (angular) {
    "use strict";

    var app = angular.module('main', [])

    .controller('DashboardController', ['$scope', function($scope){
        $scope.step = 0;

        //socket.io
        io.socket.get('/key',function(data){
            if(data){
                for(var i=0;i<data.length;i++){
                    data[i].step = i;
                }
                $scope.step = 0
                $scope.ips = data;
                $scope.$apply();
                console.log($scope.step);
            }
        });

    }])
})(window.angular);
