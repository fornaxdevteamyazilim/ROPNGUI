'use strict';
app.controller('notpaidCtrl', notpaidCtrl);
function notpaidCtrl($scope, $log, $modal, Restangular, SweetAlert, ngTableParams, toaster, $window, $rootScope, $location, $translate, $modalInstance, userService) {
    $rootScope.uService.EnterController("notpaidCtrl");
    $scope.Person = {};
    $scope.SaveNotPaids = function (data, PersonID) {
        // $scope.SaveOrder(data);
        Restangular.all('ordertools/FreeOrder').post(
               {
                   OrderID: data.id,
                   PersonID: data.persons[0].PersonID,                      
               }
           ).then(function (result) {
               toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
               SweetAlert.swal("Success", $translate.instant('orderfile.YourOrderMarkedNonPayment') , "success");
               $scope.ok();
           }, function (response) {
               toaster.pop('error',$translate.instant('orderfile.InsufficientLimit') , "error");
           });
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
       $rootScope.uService.ExitController("declaredrevenuelistCtrl");
    });
};
   
