'use strict';
app.controller('inventorytransfereditCtrl', inventorytransfereditCtrl);
function inventorytransfereditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element,userService) {
    $rootScope.uService.EnterController("inventorytransfereditCtrl");
    var vm = this;
    $scope.item = {};
    vm.items = {};
    $scope.repositories = [];
    $scope.NGUserRoleID = '';
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.BottonDblcilik = function () { };
    $scope.LoadInventorySpecificUnits = function (InvID) {
        $scope.inventoryunits = [];
        $scope.loadEntities('inventoryunit', 'inventoryunits', "InventoryID='" + InvID + "'");
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.back = $translate.instant('main.BACK');
        $scope.documentnumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.note = $translate.instant('main.NOTE');
        $scope.description = $translate.instant('main.DESCRIPTION');
        $scope.fromrepository = $translate.instant('main.FROMREPOSITORY');
        $scope.torepository = $translate.instant('main.TOREPOSITORY');
        $scope.datetime = $translate.instant('main.DATETIME');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE');
        $scope.trIsCheck = $translate.instant('main.ISPCHECK');
        $scope.trIsCheckbk = $translate.instant('main.ISPCHECKBK');
        $scope.trIsCheckStore = $translate.instant('main.STOREISPCHECK');
        $scope.trApprove = $translate.instant('main.APPROVE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.print = $translate.instant('main.PRINT');
        $scope.addtransferitem = $translate.instant('main.ADDTRANSFERITEM');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.trReject = $translate.instant('main.ISPREJECT');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.InventoryTransferID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('inventorytransfer', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            $scope.item = Restangular.copy(restresult);
            $scope.InventoryTransferApproval();
        })
    else {
        //Restangular.all('repository/cache/Repositories').getList({
        Restangular.all('repository').getList({
            pageNo: 1,
            pageSize: 1000,
            sort: 'id',
            search: userService.isAdmin()?"":"StoreID='" + $rootScope.user.StoreID + "'",
            //calcparameters: userService.isAdmin()?null:"SelectAll"
        }).then(function (result) {
            $scope.item.FromRepositoryID = result[0].id;
        }, function (response) {
            toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
        $scope.item = {};
    }
    $scope.InventoryTransferApproval = function () {
        Restangular.all('InventoryTransferApproval').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "InventoryTransferID='" + $stateParams.id + "'"
        }).then(function (result) {
            $scope.item.ApproveState = result[0].ApproveState
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
    $scope.checkInventoryTransferApproval = function (itemID,State) {
        if (userService.isAdmin() || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("Bolge Kocu") || userService.userIsInRole("PHAdmin") ) {
        $scope.isWaiting = true;
        Restangular.one('/InventorySupply/approvetransfer').get(
            {
                InventoryTrasferID: itemID,
                ToState:State,
            }
        ).then(function (restresult) {
            $scope.isWaiting = false;
            $location.path('app/inventory/inventorytransfer/list');
            toaster.pop('success', $translate.instant('invantories.Saved'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    }
    };
    $scope.EditCountDisabled = function () {
        return $stateParams.id != 'new';
    }
    $scope.DeliverTransfer = function () {
        $scope.item.InventorySupplyState = 3;
        $scope.SaveData();
    }
    $scope.SaveData = function () {
        $scope.SaveButtonActive = false;
        $scope.item.items = vm.tableParams.data;
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal( $translate.instant("invantories.Updated"), $translate.instant("invantories.Updated"), "success");
                $location.path('app/inventory/inventorytransfer/list');
                $scope.SaveButtonActive = true;
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('warning', "warning...", response.data.ExceptionMessage);
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'inventorytransfer')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal($translate.instant("invantories.Saved"),  $translate.instant("invantories.Saved"), "success");
                $location.path('app/inventory/inventorytransfer/list');
                $scope.SaveButtonActive = true;
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('warning', "warning...", response.data.ExceptionMessage);
            });
        }
    }
    $scope.showtoaster = function () {
        if ($scope.addoredit == 'add')
            toaster.pop('success', $translate.instant('invantories.DataAdded '), $translate.instant('invantories.DataSaved '));
        else
            toaster.pop('success', $translate.instant('invantories.DataAdded '), $translate.instant('invantories.DataSaved '));
    }
    $scope.savetoaster = function () {
        toaster.pop('success', $translate.instant('invantories.DataAdded '), $translate.instant('invantories.DataSaved '));
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    vm.search = '';
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
        if (!vm.tableParams.data[vm.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(vm.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'),$translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 500,
    }, {
        getData: function ($defer, params) {
            if ($scope.InventoryTransferID == 'new' && $stateParams.id == 'new') {
                $scope.InventoryTransferID = 0;
            }
            Restangular.all('inventorytransferitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryTransferID='" + $scope.InventoryTransferID + "'"
            }).then(function (items) {
                $scope.groupTotal = 0;
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
                if (items && items.length) {
                    for (var i = 0; i < items.length; i++) {
                        $scope.groupTotal += items[i].UnitCount * items[i].UnitPrice
                    }
                }
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }

    });
    $scope.loadRepository = function () {
        if (!$scope.repositories.length) {
            Restangular.all('repository').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: "", //"StoreID='" + $rootScope.user.StoreID + "'"
                calcparameters: "SelectAll"
            }).then(function (result) {
                $scope.repositories = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadRepository();
    $scope.GetInventoryUnitPrice = function (rowform, item) {
        Restangular.one('InventoryUnit/lastcount').get({
            InventoryUnitID: rowform.$data.InventoryUnitID,
            StoreID: $rootScope.user.StoreID,
        }).then(function (result) {
            item.UnitPrice = result.UnitPrice;
        }, function (response) {
            toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
                pageSize: 100000,
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
                pageSize: 100000,
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
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunits');
    $scope.inventorysupplystate = [];
    $scope.loadEntities('enums/inventorysupplystate', 'inventorysupplystate');
    $scope.InventoryApproveState = [];
    $scope.loadEntities('enums/InventoryApproveState', 'InventoryApproveState');
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: $translate.instant('invantories.Sure'),
            text: $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('invantories.confirmButtonText'),
            cancelButtonText: $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal($translate.instant('invantories.Deleted'), $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('app/inventory/inventorytransfer/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
            }
        });
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('invantories.Sure'),
            text: $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('invantories.confirmButtonText'),
            cancelButtonText: $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (vm.tableParams.data[index].fromServer) {
                    vm.tableParams.data[index].remove();
                }
                vm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (vm.tableParams.data[index].fromServer) {
            vm.tableParams.data[index].remove();
        }
        vm.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        vm.tableParams.data.push({ UnitPrice: 0 });
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
    if (!$scope.item.TransferDate) {
        $scope.item.TransferDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
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
            $scope.item.TransferDate = item;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorytransfereditCtrl");
    });
};
