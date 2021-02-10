'use strict';
app.controller('inventoryrecipeeditCtrl', inventoryrecipeeditCtrl);
function inventoryrecipeeditCtrl($scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("inventoryrecipeeditCtrl");
    var ire = this;
    $scope.item = {};
    $scope.original = {};
    $rootScope.InventoryRecipeID = 0;
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.description = $translate.instant('main.DESCRIPTION');
        $scope.name = $translate.instant('main.NAME');
        $scope.outputquantity = $translate.instant('main.OUTPUTQUANTITY');
        $scope.save = $translate.instant('main.SAVE');
        $scope.delete = $translate.instant('main.DELETE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    if ($stateParams.id != 'new') {
        Restangular.one('inventoryrecipe', $stateParams.id).get()
           .then(function (restresult) {
               $scope.original = restresult;
               $scope.item = Restangular.copy(restresult);
               $rootScope.InventoryRecipeID = restresult.id;
           },
           function (restresult) {
               toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
               swal("Error!", $translate.instant('Server.ServerError'), "Warning");
           })
    }
    else {
        $scope.item.OutputQuantity = 1;
    }
    $scope.saveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal($translate.instant('invantories.Updated'), $translate.instant('invantories.Updated'), "success");
                $rootScope.InventoryRecipeID = resp.id;
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'inventoryrecipe')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                $rootScope.InventoryRecipeID = resp.id;
                swal( $translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'), "success");
            });
        }
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    ire.search = '';
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
        if (!ire.tableParams.data[ire.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ire.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    //$scope.ShowObject = function (Container, idName, idvalue, resName) {
    //    for (var i = 0; i < $scope[Container].length; i++) {
    //        if ($scope[Container][i][idName] == idvalue)
    //            return $scope[Container][i][resName];
    //    }
    //    return idvalue || 'Not set';
    //};
    //$scope.loadEntitiesCache = function (EntityType, Container) {
    //    if (!$scope[Container].length) {
    //        Restangular.all(EntityType).getList({}).then(function (result) {
    //            $scope[Container] = result;
    //        }, function (response) {
    //            toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
    //        });
    //    }
    //};
    //$scope.inventories = [];
    //$scope.loadEntitiesCache('cache/inventory', 'inventories');
    //$scope.inventoryunits = [];
    //$scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
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
                    SweetAlert.swal($translate.instant('invantories.Deleted'),  $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('app/inventory/inventoryrecipe/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled') , "error");
            }
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventoryrecipeeditCtrl");
    });
};
app.controller('inventoryrecipeitemCtrl', inventoryrecipeitemCtrl);
function inventoryrecipeitemCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("inventoryrecipeitemCtrl");
    var iri = this;
    $scope.item = {};
    $scope.LoadInventorySpecificUnits = function (InvID) {
        $scope.inventoryunits = [];
        $scope.loadEntities('inventoryunit', 'inventoryunits', "InventoryID='" + InvID + "'");
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trWasteUnitPercent = $translate.instant('main.WASTEPERCENT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                iri.tableParams.reload();
                toaster.pop('success',$translate.instant('invantories.Updated'), $translate.instant('invantories.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'inventoryrecipeitem')
            this.item.post().then(function (res) {
                iri.tableParams.reload();
                toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'));
            });
            this.item.get();
        }
    };
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
        if (!iri.tableParams.data[iri.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(iri.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    iri.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('inventoryrecipeitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryRecipeID='" + $rootScope.InventoryRecipeID + "'"
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
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunits');
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
                if (iri.tableParams.data[index].fromServer) {
                    iri.tableParams.data[index].remove();
                }
                iri.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (iri.tableParams.data[index].fromServer) {
            iri.tableParams.data[index].remove();
        }
        iri.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        iri.tableParams.data.push({ InventoryRecipeID: $rootScope.InventoryRecipeID, WasteUnitPercent: 1 });
    };
    var deregistration1 = $scope.$watch(angular.bind(iri, function () {
        return $rootScope.InventoryRecipeID;
    }), function (value) {
        iri.tableParams.reload();
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
        $rootScope.uService.ExitController("inventoryrecipeitemCtrl");
    });
};
app.controller('inventoryrecipeoutputitemCtrl', inventoryrecipeoutputitemCtrl);
function inventoryrecipeoutputitemCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element) {
    $rootScope.uService.EnterController("inventoryrecipeoutputitemCtrl");
    var iro = this;
    $scope.item = {};
    $scope.LoadInventorySpecificUnits = function (InvID) {
        $scope.inventoryunits = [];
        $scope.loadEntities('inventoryunit', 'inventoryunits', "InventoryID='" + InvID + "'");
    }
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trPricePercent = $translate.instant('main.PRICEPERCENT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                iro.tableParams.reload();
                toaster.pop('success',$translate.instant('invantories.Updated'),  $translate.instant('invantories.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'inventoryrecipeoutputitem')
            this.item.post().then(function (res) {
                iro.tableParams.reload();
                toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'));
            });
            this.item.get();
        }
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
        if (!iro.tableParams.data[iro.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(iro.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    iro.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('inventoryrecipeoutputitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryRecipeID='" + $rootScope.InventoryRecipeID + "'"
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
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunits');
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
                if (iro.tableParams.data[index].fromServer) {
                    iro.tableParams.data[index].remove();
                }
                iro.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (iro.tableParams.data[index].fromServer) {
            iro.tableParams.data[index].remove();
        }
        iro.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        iro.tableParams.data.push({ InventoryRecipeID: $rootScope.InventoryRecipeID, UnitCount: 1, PricePercent: 1 });
    };
    var deregistration1 = $scope.$watch(angular.bind(iro, function () {
        return $rootScope.InventoryRecipeID;
    }), function (value) {
        iro.tableParams.reload();
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("inventoryrecipeoutputitemCtrl");
    });
};
