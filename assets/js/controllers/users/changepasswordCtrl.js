app.controller('changepasswordCtrl', changepasswordCtrl);
function changepasswordCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("changepasswordCtrl");
    userService.userAuthorizated();
    $scope.message = "";
    $scope.ChangePassword = function (item) {        
        if (item.NewPassword == item.AgenNewPassword) {
            Restangular.one('User/ChangePassword').get({
                OldPassword: item.Password,
                NewPassword: item.NewPassword
            }).then(function (result) {
                if (result == true) {
                    swal( $translate.instant('userfile.Updated'),  $translate.instant('userfile.YourPasswordHasChangedPleaseloginagain '), "success");
                    $location.path('/login/signin');
                }
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        } else {
            $scope.message =   $translate.instant('userfile.TheValuesEnteredNotMatchPleaseEnterAgain ');
        }
    };
      $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("changepasswordCtrl");
    });
};
