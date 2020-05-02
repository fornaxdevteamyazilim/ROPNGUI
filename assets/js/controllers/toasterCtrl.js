'use strict';
/** 
  * controller for AngularJS-Toaster
*/
app.controller('ToasterDemoCtrl', ['$scope', 'toaster', function ($scope, toaster) {
    $scope.toaster = {
        type: 'warning',
        title: 'Title',
        text: 'Message'
    };
    $scope.pop = function () {
        toaster.pop($scope.toaster.type, $scope.toaster.title, $scope.toaster.text);
    };
}]);