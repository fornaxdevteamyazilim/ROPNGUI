app.controller('inventoryCtrl', inventoryCtrl);
function inventoryCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, userService, $timeout, $element) {
    $rootScope.uService.EnterController("inventoryCtrl");
    var inv = this;
    $scope.objectType = 'inventory';
    inv.search = '';
    $scope.SelectedItem = null;
    inv.RepositoryID = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventories/edit/' + id;
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnit = $translate.instant('main.UNIT');
        $scope.trVatRatio = $translate.instant('main.VATRATIO');
        $scope.trQuantity = $translate.instant('main.QUANTITY');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trGlobalInventory = $translate.instant('main.GLOBALINVENTORY');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trInventoryItemCode = $translate.instant('main.INVENTORYITEMCODE');
        $scope.trisActive = $translate.instant('main.ISACTIVE');
      
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.newDealItem = function () {
        location.href = '#/app/inventory/Inventories/edit/new';
    };
    $scope.BuildSearchString = function () {
        var result = [];
        if (inv.search) {
            result.push("name like '%" + inv.search + "%'");
        }
        return result;
    };
    inv.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },{
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy(),
                CalcParameters: (inv.RepositoryID && inv.RepositoryID.length != null) ? "RepositoryID='" + inv.RepositoryID + "'" : "",
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    var deregistration1 = $scope.$watch(angular.bind(inv, function () {
        return inv.search;
    }), function (value) {
        inv.tableParams.reload();
    });
    var deregistration2 = $scope.$watch(angular.bind(inv, function () {
        return inv.RepositoryID;
    }), function (value) {
        inv.tableParams.reload();
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.EnumsUnits = [];
    $scope.loadEntities('enums/units', 'EnumsUnits');
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
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventoryCtrl");
    });
};