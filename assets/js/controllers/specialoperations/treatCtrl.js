﻿'use strict';
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
               toaster.pop('success', "Kaydedildi !", 'SAVED');
               SweetAlert.swal("Success", "Siparişiniz Ödenmez Olarak İşaretlendi", "success");
               $scope.ok();
           }, function (response) {
               toaster.pop('error', "Error", response.data.ExceptionMessage);
           });
    };
    $scope.SaveOrder = function (data) {
        data.PaymentStatusID = 3
        Restangular.restangularizeElement('', data, 'order')
        data.post().then(function (res) {
            toaster.pop('success', "Kaydedildi.", 'Saved.');
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
            toaster.pop('Warning', "Sunucu hatası", response.data.ExceptionMessage);
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
