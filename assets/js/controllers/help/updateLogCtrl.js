app.controller('updateLogCtrl', updateLogCtrl);
function updateLogCtrl($rootScope,$translate, $scope, Restangular, $location, $window, $element) {
    $rootScope.uService.EnterController("updateLogCtrl");
    var upl = this;
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("updateLogCtrl");
    });
};