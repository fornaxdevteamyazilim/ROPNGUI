'use strict';
app.controller('InventorySupplyAuditsCtrl', InventorySupplyAuditsCtrl);
function InventorySupplyAuditsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("InventorySupplyAuditsCtrl");
    var isau = this;
    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.saveItemData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                toaster.pop('success', "Update.", 'Data update applied to server.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'InventorySupplyAudit')
            data.post().then(function (resp) {
                $scope.item.id = resp.id;
                toaster.pop('success', "Saved.", 'Saved data to server.');
            });
        }
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
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
        if (!isau.tableParams.data[isau.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(isau.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    isau.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            Restangular.all('InventorySupplyAudit').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventorySupplyID='" + $stateParams.id + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.users = [];
    $scope.loadEntities('user', 'users');
    $scope.inventoryAuditTypes = [];
    $scope.loadEntities('enums/inventoryAuditType', 'inventoryAuditTypes');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: "ARE YOU SURE ?",
            text: "Are you sure you want to delete the record ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Delete !",
            cancelButtonText: "No, Deletion !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (isau.tableParams.data[index].fromServer) {
                    isau.tableParams.data[index].remove();
                }
                isau.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (isau.tableParams.data[index].fromServer) {
            isau.tableParams.data[index].remove();
        }
        isau.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        isau.tableParams.data.push({ InventorySupplyID: $stateParams.id, MinAmount: 1 });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("InventorySupplyAuditsCtrl");
    });
};