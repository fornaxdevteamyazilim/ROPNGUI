'use strict';
app.controller('inventoryrecipelistCtrl', inventoryrecipelistCtrl);
function inventoryrecipelistCtrl($rootScope, $scope, $log, $modal, SweetAlert, Restangular, ngTableParams, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("inventoryrecipelistCtrl");
    var ir = this;
    $scope.objectType = 'inventoryrecipe';
    $scope.SelectedItem = null;
    ir.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventoryrecipe/edit/' + $scope.SelectedItem;
    };
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trDefinition = $translate.instant('main.DEFINITION');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trOutputQuantity = $translate.instant('main.OUTPUTQUANTITY');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ir.tableParams.data[ir.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ir.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    ir.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },{
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: (ir.search.length > 0) ? "name like '%" + ir.search + "%'" : "",
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.cancelremove = function (index) {
        if (ir.tableParams.data[index].fromServer) {
            ir.tableParams.data[index].remove();
        }
        ir.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(ir, function () {
        return ir.search;
    }), function (value) {
        ir.tableParams.reload();
    });
    $scope.open = function (ObjectID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
            controller: 'TagModalCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectID: function () {
                    return ObjectID;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.result = selectedItem;
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("inventoryrecipelistCtrl");
    });
};

