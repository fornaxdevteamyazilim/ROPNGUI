app.controller('inventoryadjusteditCtrl', inventoryadjusteditCtrl);
function inventoryadjusteditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventoryadjusteditCtrl");
    var ia = this;
    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trTotal = $translate.instant('main.TOTAL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.back = $translate.instant('main.BACK');
        $scope.inventoryadjustitem = $translate.instant('main.INVENTORYADJUSTITEM');
        $scope.adjustnote = $translate.instant('main.ADJUSTNOTE');
        $scope.adjusttype = $translate.instant('main.ADJUSTTYPE');
        $scope.repository = $translate.instant('main.REPOSITORY');
        $scope.datetime = $translate.instant('main.DATETIME');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.addadjustitem = $translate.instant('main.ADDADJUSTITEM');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.trUnit = $translate.instant('main.UNIT');
        $scope.trName = $translate.instant('main.NAME');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.InventoryAdjustID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('inventoryadjust', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            $scope.item = Restangular.copy(restresult);
        })
    else {
        $scope.item = {};
    }
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal( $translate.instant('invantories.Updated'), $translate.instant('invantories.Updated'), "success");
                $location.path('app/inventory/inventoryadjust/list');
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'inventoryadjust')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                $scope.InventoryAdjustID = resp.id;
                swal( $translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'), "success");
            });
        }
        $scope.item.get();
    }
    $scope.LoadInventorySpecificUnits = function (InvID) {
        $scope.inventoryunits = [];
        $scope.loadEntities('inventoryunit', 'inventoryunits', "InventoryID='" + InvID + "'");
    }
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
    $scope.SaveItem = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                ia.tableParams.reload();
                toaster.pop('success',$translate.instant('invantories.Updated'),$translate.instant('invantories.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'inventoryadjustitem')
            this.item.post().then(function (res) {
                ia.tableParams.reload();
                toaster.pop('success',$translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'));
            });
            this.item.get();
        }
    }
    $scope.repositories = [];
    $scope.loadRepository = function () {
        if (!$scope.repositories.length) {
            Restangular.all('repository').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                //search: "StoreID='" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                $scope.repositories = result;
                $scope.item.RepositoryID = result[0].id;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadRepository();
    $scope.adjusttypes = [];
    $scope.loadAdjustTypes = function () {
        if (!$scope.adjusttypes.length) {
            Restangular.all('enums/InventoryAdjustType').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
            }).then(function (result) {
                $scope.adjusttypes = result;
                $scope.item.InventoryAdjustTypeID = result[1].Value;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadAdjustTypes();
    $scope.savetoaster = function () {
        toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'));
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            $scope.addItem();
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ia.tableParams.data[ia.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ia.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'),  $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    ia.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            Restangular.all('inventoryadjustitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryAdjustID='" + (($scope.InventoryAdjustID != 'new') ? $scope.InventoryAdjustID : "") + "'"
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
    $scope.inventories = [];
    $scope.loadEntities('inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunits');
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
                    $location.path('app/inventory/inventoryadjust/list');
                });
            }
            else {
                SweetAlert.swal(  $translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled') , "error");
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
                if (ia.tableParams.data[index].fromServer) {
                    ia.tableParams.data[index].remove();
                }
                ia.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ia.tableParams.data[index].fromServer) {
            ia.tableParams.data[index].remove();
        }
        ia.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ia.tableParams.data.push({ InventoryAdjustID: $scope.InventoryAdjustID });
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
            $scope.item.AdjustDate = item;
        })
    };
    if (!$scope.item.AdjustDate) {
        $scope.item.AdjustDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventoryadjusteditCtrl");
    });
};
app.directive('replacecomma', function () {
    return {
        require: 'ngModel',
        link: function (scope, element,$translate, attrs, ngModelCtrl) {
            scope.$watch(attrs.ngModel, function (newVal) {
                if (newVal !== undefined && newVal !== null) {
                    ngModelCtrl.$setViewValue(String(newVal).replace(/,/g, '.'));
                    element.val(String(newVal).replace(/,/g, '.'));
                }
            })

        }
    }
});