app.controller('gastropayCtrl', gastropayCtrl);
function gastropayCtrl($rootScope, $scope, $modalInstance, $stateParams, Order, userService, ngnotifyService, Restangular, toaster, $window, $translate, $filter, $log, $modal,PaymentRestangular, ngTableParams, SweetAlert, $location,) {
    $rootScope.uService.EnterController("gastropayCtrl");
    $scope.order = Order;
  //  $//scope.getcodes = {};
    $scope.SavePayment = function () {
        Restangular.one('gastropay/getcode').get(
            {
                //getcode: getcode,
                OrderID: $scope.order.id

            }
        ).then(function (result) {
            toaster.pop('success', $translate.instant('orderfile.PAYMENTSAVED'), $translate.instant('orderfile.PAYMENTSAVED'));
            $scope.ok();
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    // $scope.gastropay;
    // $scope.GastropayCheck = function (getcode) {
    //     Restangular.one('gastropay').get({
    //         getcode: getcode,
    //         OrderID: $scope.order.id
    //     }).then(function (result) {
    //         $scope.gastropay = result;
    //     }, function (response) {
    //         toaster.pop('warning', response.data.ExceptionMessage);
    //     });
    // };

    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("gastropayCtrl");
    });
};