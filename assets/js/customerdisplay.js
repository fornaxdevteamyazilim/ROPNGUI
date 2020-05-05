var app = angular
  .module('ropngSSApp', ['dx', 'ngStorage'])
    .controller('SSAppCtrl', function ($scope, $localStorage, $interval) {
      $scope.$storage = $localStorage.$default({
          customerItems: []
      });
      $scope.bgIndex = 'page-idle';
      $interval(function () {
          $scope.bgIndex = $scope.bgIndex == 'page-idle' ? 'page-active' : 'page-idle';
      }, 10000);
    });
app.controller('MainController', function ($interval) {

    var controller = this;
    controller.date = new Date();
  
});