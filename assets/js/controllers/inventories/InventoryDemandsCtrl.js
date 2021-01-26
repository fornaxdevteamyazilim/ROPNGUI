'use strict';
app.controller('InventoryDemandsCtrl', InventoryDemandsCtrl);
function InventoryDemandsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $translate, userService, $element) {
    $rootScope.uService.EnterController("InventoryDemandsCtrl");
    var id = this;
    userService.userAuthorizated();
    $scope.SelectedItem = null;
    id.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorydemands/edit/' + $scope.SelectedItem;
    };
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trSupplyStore  = $translate.instant('main.SUPPLYSTORE');        
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trDeliveryDate = $translate.instant('main.DELIVERYDATE');
        $scope.trInventoryRequirment = $translate.instant('main.INVENTORYREQUIRMENT');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (userService.userIsInRole("AREAMANAGER")) {
            var storesID = {}
            for (var i = 0; i < $rootScope.user.userstores.length; i++) {
                if (storesID.length > 0) {
                    storesID = storesID + $rootScope.user.userstores[i].id + ',';
                } else {
                    storesID = $rootScope.user.userstores[i].id + ',';
                }
            }
            var data = storesID.substring(0, storesID.length - 1);
            result.push("StoreID in (" + data + ")");
        }
        if (userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER")) {
            result.push("StoreID =" + $rootScope.user.StoreID);
        }
        return result;
    };
    id.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Date: 'desc'
        }
    },{
        getData: function ($defer, params) {
            Restangular.all('InventoryDemand').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items.length > 0) {
                    $scope.SelectedItem = items[0].id;
                    $defer.resolve(items);
                }                
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.InventoryRequirments = [];
    $scope.loadEntities('InventoryRequirment', 'InventoryRequirments');
    $scope.InventorySupplyStates = [];
    $scope.loadEntities('enums/InventorySupplyState', 'InventorySupplyStates');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("InventoryDemandsCtrl");
    });
};
