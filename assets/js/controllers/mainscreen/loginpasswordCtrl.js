app.directive('autoFocus', function ($timeout) {
    return {
        restrict: 'AC',
        link: function (_scope, _element) {
            $timeout(function () {
                _element[0].focus();
            }, 0);
        }
    };
});
app.controller('loginpasswordCtrl', loginpasswordCtrl);
function loginpasswordCtrl($rootScope, $scope, $modalInstance, $log, toaster, Restangular, $window) {
    $rootScope.uService.EnterController("loginpasswordCtrl");
    $scope.InpuntKey = function (data) {
        $scope.CardID = data;
        $scope.ok();
    };
    var idListener = $rootScope.$on('Identification', function (event, data) {
        $modalInstance.dismiss('cancel');
    });
    $scope.ok = function () {
        $modalInstance.close($scope.CardID);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("loginpasswordCtrl");
        idListener();
    });    
};