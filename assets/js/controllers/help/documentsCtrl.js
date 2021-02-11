app.controller('documentsCtrl', documentsCtrl);
function documentsCtrl($rootScope,$translate, $scope, Restangular, $location, $window, $element) {
    $rootScope.uService.EnterController("documentsCtrl");
    var dc = this;
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("documentsCtrl");
    });
};