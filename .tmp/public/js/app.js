(function (angular) {
    "use strict";

    var app = angular.module('main', [])

    .controller('DashboardController', ['$scope', function($scope){
        $scope.step = 0;
    }])
})(window.angular);