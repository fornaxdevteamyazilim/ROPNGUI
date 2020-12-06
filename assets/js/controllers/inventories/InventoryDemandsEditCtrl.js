'use strict';
app.controller('InventoryDemandsEditCtrl', InventoryDemandsEditCtrl);
function InventoryDemandsEditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element) {
    $rootScope.uService.EnterController("InventoryDemandsEditCtrl");
    $scope.item = {};
    var ida = this;
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trCalculatedCount = $translate.instant('main.CALCULATEDCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.back = $translate.instant('main.BACK');
        $scope.note = $translate.instant('main.NOTE');
        $scope.trApprovedDate = $translate.instant('main.DATE');
        $scope.datetime = $translate.instant('main.DATETIME');
        $scope.save = $translate.instant('main.SAVE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.print = $translate.instant('main.PRINT');
        $scope.adddemanditem = $translate.instant('main.ADDDEMANDITEM');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.trApproved = $translate.instant('main.STATE');
        $scope.trApproveDate = $translate.instant('main.DATE');
        $scope.trUser = $translate.instant('main.USER');
        $scope.trOrderIndex = $translate.instant('main.ORDERINDEX');
        $scope.trDemandCount = $translate.instant('main.DEMANDCOUNT');
        $scope.demandedinventorylist = $translate.instant('main.DEMANDEDINVENTORYLIST');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.checkInventoryDemandApproval = function (itemID, State) {
        Restangular.one('InventorySupply/approvedemand').get(
            {
                InventoryDemandApprovalID: itemID,
                toState: State
            }
            ).then(function (restresult) {
                ida.tableParams.reload();
                toaster.pop('success',  $translate.instant('invantories.Saved'));
                $location.path('app/inventory/inventorydemands/list');
            }, function (response) {
                toaster.pop('warning',$translate.instant('invantories.warning ') , response.data.ExceptionMessage);
            });
    };
    ida.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            Restangular.all('InventoryDemandApproval').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryDemandID='" + $stateParams.id + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.InventoryDemandID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('InventoryDemand', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            $scope.item = Restangular.copy(restresult);
            $location.path('app/inventory/inventorydemands/edit/' + restresult.id);
        })
    else {
        $scope.item = {};
    }
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
                    $location.path('app/inventory/inventorydemands/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
            }
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
            $scope.item.Date = item;
        })
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
    $scope.users = [];
    $scope.loadEntities('user', 'users');
    $scope.InventorySupplyStates = [];
    $scope.loadEntities('enums/InventorySupplyState', 'InventorySupplyStates');
    $scope.InventoryApproveStates = [];
    $scope.loadEntities('enums/InventoryApproveState', 'InventoryApproveStates');
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("InventoryDemandsEditCtrl");
    });
};
'use strict';
app.controller('InventoryDemandItemsCtrl', InventoryDemandItemsCtrl);
function InventoryDemandItemsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("InventoryDemandItemsCtrl");
    var idi = this;
    $scope.item = {};
    $scope.saveItemData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                toaster.pop('success', $translate.instant('invantories.Updated'),$translate.instant('invantories.Updatedapplied'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'InventoryDemandItem')
            data.post().then(function (resp) {
                $scope.item.id = resp.id;
                toaster.pop('success',  $translate.instant('invantories.Saved'), $translate.instant('invantories.Savedserver') );
            });
        }
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    idi.search = '';
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
        if (!idi.tableParams.data[idi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(idi.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'),$translate.instant('difinitions.Editcancelled'));
        }
    };
    idi.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },
    {
        getData: function ($defer, params) {
            Restangular.all('InventoryDemandItem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryDemandID='" + $stateParams.id + "'"
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
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.inventoryunits = [];
    $scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
    $scope.GetInventoryUnitPrice = function (item) {
        Restangular.one('InventoryDemand', $stateParams.id).get().then(function (restresult) {
            Restangular.one('InventoryUnit/price').get({
                InventoryUnitID: item.InventoryUnitID,
                StoreID: $rootScope.user.StoreID,
                ForDate: restresult.Date
            }).then(function (result) {
                if (result)
                    item.UnitPrice = result;
                else
                    item.UnitPrice = 0;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        })
    };
    $scope.removeItem = function (index) {
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
                if (idi.tableParams.data[index].fromServer) {
                    idi.tableParams.data[index].remove();
                }
                idi.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (idi.tableParams.data[index].fromServer) {
            idi.tableParams.data[index].remove();
        }
        idi.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        idi.tableParams.data.push({ InventoryDemandID: $stateParams.id, UnitCount: 1, UnitPrice: 1 });
    };
    $scope.Back = function () {
        $window.history.back();
    };
     $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("InventoryDemandItemsCtrl");
    });
};