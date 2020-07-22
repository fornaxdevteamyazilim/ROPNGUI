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
app.controller('authcodeCtrl', authcodeCtrl);
function authcodeCtrl($rootScope, $scope, $modalInstance, $log, toaster, Restangular, $window) {
    $rootScope.uService.EnterController("authcodeCtrl");
    $scope.InpuntAuthCode = function (AuthCode) {
        Restangular.one('User/CheckAuth').get({
            AuthCode: AuthCode
        }).then(function (result) {
            if (result == true) {
                $scope.ok();
                toaster.pop('success', "Login successful.");
            } else {
                $scope.cancel();
                toaster.pop('error', "Login Failed !", 'Make sure your private password is correct and try again !');
            }
        }, function (response) {
            $scope.cancel();
            toaster.pop('error', "Login Failed !", 'Make sure your private password is correct and try again !');
        });
    };
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("authcodeCtrl");
    });
};