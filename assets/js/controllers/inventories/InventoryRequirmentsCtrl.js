'use strict';
app.controller('InventoryRequirmentCtrl', InventoryRequirmentCtrl);
function InventoryRequirmentCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $translate, userService, ngnotifyService, $location, $element) {
    $rootScope.uService.EnterController("InventoryRequirmentCtrl");
    var ir = this;
    userService.userAuthorizated();
    $scope.SelectedItem = null;
    ir.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventoryrequirments/edit/' + $scope.SelectedItem;
    };
    $scope.newRequirment = function () {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/inventories/selectInventorySupply.html',
            controller: 'selectInventorySupplyCtrl',
            size: '',
            backdrop: '',
            resolve: {}
        });
        modalInstance.result.then(function (InventorySupplyID) {
            $scope.isWaiting = true;
            Restangular.one('InventorySupply/buildrequirment').get({
                StoreID: $rootScope.user.StoreID,
                ForDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
                InventorySupplyID: InventorySupplyID,
            }).then(function (result) {
                location.href = '#/app/inventory/inventoryrequirments/edit/' + result.id;
                $scope.isWaiting = false;
            }, function (response) {
                toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
                $scope.isWaiting = false;
            });
        });
    };
    $scope.newRequirmentStore = function () {
        var data = {};
        data.StoreID = $rootScope.user.StoreID,
        data.Date = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
        data.Notes = 'ROPNG ' + $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm') + ' İhtiyaç Listesi'
        Restangular.restangularizeElement('', data, 'InventoryRequirment')
        data.post().then(function (resp) {
            $location.path('app/inventory/inventoryrequirments/edit/' + resp.id);
            $scope.$broadcast('newRequirmentData', resp);
        }, function (response) {
            toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
        });
    };
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trDeliveryDate = $translate.instant('main.DELIVERYDATE');
        $scope.trInventoryRequirment = $translate.instant('main.INVENTORYREQUIRMENT');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE');
        $scope.trisProcesseed = $translate.instant('main.STATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (userService.userIsInRole("STOREMANAGER")) {
            result.push("StoreID =" + $rootScope.user.StoreID);
        }
        return result;
    };
    ir.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Date: 'desc'
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('InventoryRequirment').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items && items.length > 0)
                    $scope.SelectedItem = items[0].id;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
            });
        }
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
                toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu Hatası", response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.InventorySupplyStates = [];
    $scope.loadEntities('enums/InventorySupplyState', 'InventorySupplyStates');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("InventoryRequirmentCtrl");
    });
};
