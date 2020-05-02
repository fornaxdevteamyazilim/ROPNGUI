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
                toaster.pop('success', "Giriş Başarılı.");
            } else {
                $scope.cancel();
                toaster.pop('error', "Giriş  Başarısız !", 'Özel Şifrenizin Doğru Olduğundan Emin Olup Tekrar Deneyiniz !');
            }
        }, function (response) {
            $scope.cancel();
            toaster.pop('error', "Giriş  Başarısız !", 'Özel Şifrenizin Doğru Olduğundan Emin Olup Tekrar Deneyiniz !');
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