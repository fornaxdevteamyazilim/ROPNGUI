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
                    swal("Updated.", "Your Password Has Changed. Please log in again!", "success");
                    $location.path('/login/signin');
                }
            }, function (response) {
                toaster.pop('warning', "Server Error", response);
            });
        } else {
            $scope.message = 'The Values Entered Do Not Match! Please Enter Again!';
        }
    };
      $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("changepasswordCtrl");
    });
};
