'use strict';
app.controller('orderinvoiceCtrl', orderinvoiceCtrl);
function orderinvoiceCtrl($rootScope, $scope, $translate, $modalInstance, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window) {
    var oin = this;
    $rootScope.uService.EnterController("orderinvoiceCtrl");
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                oin.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'),$translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'OrderInvoice')
            this.item.post().then(function (res) {
                oin.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trTaxOffice = $translate.instant('main.TAXOFFICE');
        $scope.trTaxNumber = $translate.instant('main.TAXNUMBER');
        $scope.trTittle = $translate.instant('main.TITTLE');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trPhoneNumber = $translate.instant('main.NUMBER');
        $scope.trOrderID = $translate.instant('main.ORDER');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
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
        if (!oin.tableParams.data[oin.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(oin.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };

    oin.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('OrderInvoice').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    //search: "OrderID='" + $scope.OrderID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });

    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (oin.tableParams.data[index].fromServer) {
                    oin.tableParams.data[index].remove();
                }
                oin.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (oin.tableParams.data[index].fromServer) {
            oin.tableParams.data[index].remove();
        }
        oin.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        oin.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    var unbindWatcher = $scope.$watch(angular.bind(oin, function () {
        return $rootScope.PersonID;
    }), function (value) {
        oin.tableParams.reload();
    });
    $scope.ok = function () {
        $modalInstance.close('return');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        unbindWatcher();
        deregistration();
        $rootScope.uService.ExitController("orderinvoiceCtrl");
    });
};
