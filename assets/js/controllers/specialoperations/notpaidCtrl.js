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
               toaster.pop('success', "SAVED!!", 'SAVED');
               SweetAlert.swal("Success", "Your Order Is Marked As Non-Payment", "success");
               $scope.ok();
           }, function (response) {
               toaster.pop('error', "Insufficient Limit!", "error");
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
            toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
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
   
