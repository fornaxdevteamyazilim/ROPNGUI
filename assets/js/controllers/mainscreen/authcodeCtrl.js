app.directive('autoFocus', function ($timeout,$translate) {
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
function authcodeCtrl($rootScope, $scope, $modalInstance, $translate, $log, toaster, Restangular, $window) {
    $rootScope.uService.EnterController("authcodeCtrl");
    $scope.InpuntAuthCode = function (AuthCode) {
        Restangular.one('User/CheckAuth').get({
            AuthCode: AuthCode
        }).then(function (result) {
            if (result == true) {
                $scope.ok();
                toaster.pop('success',$translate.instant('mainscreen.LoginSuccessful '));
            } else {
                $scope.cancel();
                toaster.pop('error', $translate.instant('mainscreen.LoginFailed '),$translate.instant('mainscreen.TryAgain '));
            }
        }, function (response) {
            $scope.cancel();
            toaster.pop('error',$translate.instant('mainscreen.LoginFailed '), $translate.instant('mainscreen.TryAgain '));
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