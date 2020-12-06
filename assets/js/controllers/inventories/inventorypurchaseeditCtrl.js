app.controller('inventorypurchaseeditCtrl', inventorypurchaseeditCtrl);
function inventorypurchaseeditCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element, userService) {
    $rootScope.uService.EnterController("inventorypurchaseeditCtrl");
    var ipi = this;
    $scope.item = {};
    if (userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("DRIVER") || userService.userIsInRole("STOREKITCHENUSER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STOREUSER")) {
        $scope.addnewPurchaseItem = false;
    } else {
        $scope.addnewPurchaseItem = true;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.LoadInventorySpecificUnits = function (InvID) {
        $scope.inventoryunits = [];
        $scope.loadEntities('inventoryunit', 'inventoryunits', "InventoryID='" + InvID + "'");
    };
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                toaster.pop('success', translate="invantories.Updated",translate="invantories.Updatedapplied");
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'inventorypurchase')
            data.post().then(function (resp) {
                location.href = '#/app/inventory/inventorypurchase/edit/' + resp.id;
                toaster.pop('success', translate="invantories.Saved",  translate="invantories.Savedserver");
            });
        }
    };
    $scope.saveItem = function (data) {
        if (data.restangularized) {
            data.put().then(function (resp) {
                toaster.pop('success',  translate="invantories.Updated",translate="invantories.Updatedapplied");
            });
        }
        else {
            data.InventoryPurchaseID= $scope.InventoryPurchaseID
            Restangular.restangularizeElement('', data, 'inventorypurchaseitem')
            data.post().then(function (resp) {
                toaster.pop('success', translate="invantories.Saved",  translate="invantories.Savedserver");
            });
        }
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trTotal = $translate.instant('main.TOTAL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trApproved = $translate.instant('main.STATE');
        $scope.trApproveDate = $translate.instant('main.DATE');
        $scope.trUser = $translate.instant('main.USER');
        $scope.trApproveDate = $translate.instant('main.DATE');
        $scope.trOrderIndex = $translate.instant('main.ORDERINDEX');
        $scope.inventorypurchaseitem = $translate.instant('main.INVENTORYPURCHASEITEM');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.creatDelivery = function () {
        Restangular.one('InventorySupply/createdelivery').get({
            InventoryPurchaseID: $stateParams.id
        }).then(function (restresult) {
            toaster.pop('success', translate="invantories.Saved");
            location.href = '#/app/inventory/inventorydeliveries/edit/' + restresult.id;
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
    $scope.checkInventoryDemandApproval = function (itemID, State) {
        Restangular.one('InventorySupply/approvepurchase').get({
            InventoryPurchaseApprovalID: itemID,
            toState: State
        }).then(function (restresult) {
            toaster.pop('success', translate="invantories.Saved");
            $scope.tableParams.reload();
            $location.path('app/inventory/inventorypurchase/list');
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
    $scope.getInventoryPurchaseApprovals = function () {
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
        }, {
            getData: function ($defer, params) {
                Restangular.all('InventoryPurchaseApproval').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "InventoryPurchaseID='" + $stateParams.id + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    };
    $scope.InventoryPurchaseID = $stateParams.id;
    if ($stateParams.id != 'new') {
        Restangular.one('inventorypurchase', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            $scope.item = Restangular.copy(restresult);
        })
        $scope.getInventoryPurchaseApprovals()
    } else {
        $scope.item = {};
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    ipi.search = '';
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
        if (!ipi.tableParams.data[ipi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ipi.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    ipi.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            Restangular.all('inventorypurchaseitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryPurchaseID='" + $scope.InventoryPurchaseID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntities2 = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: "factor = 1",
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
    $scope.users = [];
    $scope.loadEntities('user', 'users');
    $scope.userroles = [];
    $scope.loadEntities('nguserrole', 'userroles');
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunits');
    $scope.InventorySupplyStates = [];
    $scope.loadEntities('enums/InventorySupplyState', 'InventorySupplyStates');
    $scope.InventoryApproveStates = [];
    $scope.loadEntities('enums/InventoryApproveState', 'InventoryApproveStates');
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title:  $translate.instant('invantories.Sure') ,
            text:  $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:   $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal( $translate.instant('invantories.Deleted'),  $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('app/inventory/inventorypurchase/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled') , "error");
            }
        });
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('invantories.Sure') ,
            text:  $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:  $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ipi.tableParams.data[index].fromServer) {
                    ipi.tableParams.data[index].remove();
                }
                ipi.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ipi.tableParams.data[index].fromServer) {
            ipi.tableParams.data[index].remove();
        }
        ipi.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ipi.tableParams.data.push({ UnitCount: 1, UnitPrice: 0 });
    };
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
    $scope.datepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.item.DateTime = item;
        })
    };
    $scope.deliverydatepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.item.DeliveryDate = item;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorypurchaseeditCtrl");
    });
};
