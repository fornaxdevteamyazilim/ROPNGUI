'use strict';
app.controller('inventorypurchaselistCtrl', inventorypurchaselistCtrl);
function inventorypurchaselistCtrl($rootScope, $scope, $modal, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element, userService ,$filter,  $stateParams, $location) {
    $rootScope.uService.EnterController("inventorypurchaselistCtrl");
    userService.userAuthorizated();
    var ip = this;
    $scope.objectType = 'inventorypurchase';
    $scope.SelectedItem = null;
    ip.search = '';
    $scope.InventoryPurchaseApprovalData = [];
    if (userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("DRIVER") || userService.userIsInRole("STOREKITCHENUSER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STOREUSER")) {
        $scope.addnewPurchase = false;
    } else {
        $scope.addnewPurchase = true;
    }
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorypurchase/edit/' + $scope.SelectedItem;
    };
    $scope.translate = function () {
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trDeliveryDate = $translate.instant('main.DELIVERYDATE');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE')
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trEmailConfirmed = $translate.instant('main.EMAILCONFIRMED');
        $scope.trYes = $translate.instant('main.YES');
        $scope.trNo = $translate.instant('main.NO');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ip.tableParams.data[ip.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ip.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (ip.search && ip.search.length > 0) {
            result.push("Description like '%" + ip.search + "%'");
        }
        if (userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER")) {
            result.push("StoreID =" + $rootScope.user.StoreID);
        }
        if (userService.userIsInRole("AREAMANAGER")) {
            var storesID = {}
            for (var i = 0; i < $rootScope.user.userstores.length; i++) {
                if (storesID.length >0) {
                    storesID = storesID + $rootScope.user.userstores[i].id + ',';
                } else {
                    storesID = $rootScope.user.userstores[i].id + ',';
                }
            }
            var data  = storesID.substring(0, storesID.length - 1);
            result.push("StoreID in (" + data + ")");
        }
        return result;
    };
    ip.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            DateTime: 'desc'
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $scope.SelectedItem = (items[0]) ? items[0].id : null;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response);
            });
        }
    });
    $scope.cancelremove = function (index) {
        if (ip.tableParams.data[index].fromServer) {
            ip.tableParams.data[index].remove();
        }
        ip.tableParams.data.splice(index, 1);
    };

    var deregistration1 = $scope.$watch(angular.bind(ip, function () {
        return ip.search;
    }), function (value) {
        ip.tableParams.reload();
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
    $scope.companies = [];
    $scope.loadEntitiesCache('cache/company', 'companies');
    $scope.InventorySupplyStates = [];
    $scope.loadEntities('enums/InventorySupplyState', 'InventorySupplyStates');
    $scope.checkedData = function (data, itemID) {
        if (data.isSelected == true) {
            $scope.InventoryPurchaseApprovalData.push({ isSelected: data.isSelected, itemID: itemID })
        }
        if (data.isSelected == false) {
            for (var i = 0; i < $scope.InventoryPurchaseApprovalData.length; i++) {
                if ($scope.InventoryPurchaseApprovalData[i].itemID == itemID)
                    $scope.InventoryPurchaseApprovalData.splice($scope.InventoryPurchaseApprovalData[i], 1);
            }
        }
    };
    $scope.checkInventoryDemandApproval = function () {
        for (var i = 0; i < $scope.InventoryPurchaseApprovalData.length; i++) {
            if ($scope.InventoryPurchaseApprovalData[i].itemID) {
                Restangular.all('InventoryPurchaseApproval').getList({
                    search: "InventoryPurchaseID='" + $scope.InventoryPurchaseApprovalData[i].itemID + "'and ApproveState=0",
                    sort:"OrderIndex"
                }).then(function (items) {
                    Restangular.one('InventorySupply/approvepurchase').get({
                        InventoryPurchaseApprovalID: items[0].id,
                        toState: 1
                    }).then(function (restresult) {
                        toaster.pop('success', $translate.instant('invantories.Saved'));
                        ip.tableParams.reload();
                    }, function (response) {
                        toaster.pop('warning', response.data.ExceptionMessage);
                    });
                }, function (response) {
                    toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        }
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("inventorypurchaselistCtrl");
    });
};
