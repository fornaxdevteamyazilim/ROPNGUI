'use strict';
app.controller('paymentmatchingCtrl', paymentmatchingCtrl);
function paymentmatchingCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $("#search").focus();
    $rootScope.uService.EnterController("paymentmatchingCtrl");
    var pm = this;
    $scope.translate = function () {
        $scope.trNGPaymentTypes = $translate.instant('main.NGPAYMENTTYPES');
        $scope.trRop6PaymentTypes = $translate.instant('main.ROP6PAYMENTTYPES');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.translate();
    $scope.item = {};
    pm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('externalobjectmap').getList({//todo  controller name
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: "ExternalObjectName='PaymentType'",
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        data.ExternalSystem = 'ROP';
        data.ExternalObjectName = 'PaymentType';
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                pm.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'externalobjectmap')
            data.post().then(function (res) {
                pm.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
            });
            data.get();
        }
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!pm.tableParams.data[pm.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pm.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled') );
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:   $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pm.tableParams.data[index].fromServer) {
                    pm.tableParams.data[index].remove();
                }
                pm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pm.tableParams.data[index].fromServer) {
            pm.tableParams.data[index].remove();
        }
        pm.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pm.tableParams.data.push({});
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.paymenttypes = [];
    $scope.loadEntities('paymenttype/', 'paymenttypes');
    $scope.rop6payments = [];
    $scope.loadEntities('rop6/payment', 'rop6payments');
    var deregistration1 = $scope.$watch(angular.bind(pm, function () {
        return pm.search;
    }), function (value) {
        pm.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("paymentmatchingCtrl");
    });
};

