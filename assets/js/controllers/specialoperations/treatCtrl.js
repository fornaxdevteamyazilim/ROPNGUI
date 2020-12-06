'use strict';
app.controller('treatCtrl', treatCtrl);
function treatCtrl($scope, $log, $modal, Restangular, SweetAlert, ngTableParams, toaster, $window, $rootScope, $location, $translate, $modalInstance) {
    $rootScope.uService.EnterController("treatCtrl");
    $scope.Treat = function (data) {
        $scope.SaveOrder(data);
        Restangular.all('orderitemtools/compliment').post(
               {
                   OrderItemID: data.items[0].id,
               }
           ).then(function (result) {
               toaster.pop('success', $translate.instant('orderfile.Saved'),  $translate.instant('orderfile.Saved'));
               SweetAlert.swal("Success", $translate.instant('orderfile.YourOrderMarkedNonPayment'), "success");
               $scope.ok();
           }, function (response) {
               toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
           });
    };
    $scope.SaveOrder = function (data) {
        data.PaymentStatusID = 3
        Restangular.restangularizeElement('', data, 'order')
        data.post().then(function (res) {
            toaster.pop('success', $translate.instant('orderfile.Saved'),  $translate.instant('orderfile.Saved'));
        });
        data.get();
    };
    $scope.orders = [];
    $scope.loadOrders = function (data) {
        Restangular.all('order').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "PaymentStatusID = 0 and StoreID ='" + $rootScope.user.StoreID + "'"
        }).then(function (result) {
            $scope.orders = result;
        }, function (response) {
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.loadOrders();

    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("treatCtrl");
    });
};
