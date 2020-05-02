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
                    swal("Güncellendi.", "Şifreniz Değişti. Lütfen Yeniden giriş Yapınız!", "success");
                    $location.path('/login/signin');
                }
            }, function (response) {
                toaster.pop('warning', "Sunucu Hatası", response);
            });
        } else {
            $scope.message = 'Girilen Değerleri Uyuşmuyor! Lütfen Tekrar Giriniz!';
        }
    };
      $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("changepasswordCtrl");
    });
};
