'use strict';
app.controller('inventorytransformeditCtrl', inventorytransformeditCtrl);
function inventorytransformeditCtrl($scope, $log, $modal, $filter, SweetAlert, $translate, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorytransformeditCtrl");
    var ite = this;
    $scope.item = {};
    $scope.original = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $rootScope.InventoryTransformID = null;
    if ($stateParams.id != 'new') {
        Restangular.one('inventorytransform', $stateParams.id).get()
           .then(function (restresult) {
               $scope.original = restresult;
               $scope.item = Restangular.copy(restresult);
               $rootScope.InventoryTransformID = restresult.id;
           },
           function (restresult) {
               toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
               swal("Error!", $translate.instant('Server.ServerError'), "Warning");
           }
           )
    } else {
        $scope.item.OutputFactor = 1;
    }
    $scope.saveData = function (data) {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal($translate.instant('invantories.Updated'), $translate.instant('invantories.Updated'), "success");
                $rootScope.InventoryTransformID = resp.id;
                $scope.$broadcast('ChangeData');
            });
        } else {
            Restangular.restangularizeElement('', $scope.item, 'inventorytransform')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                $rootScope.InventoryTransformID = resp.id;
                swal($translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'), "success");
                $scope.$broadcast('ChangeData');
            });
        }
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    ite.search = '';
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
        if (!ite.tableParams.data[ite.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ite.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
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
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
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
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
    $scope.inventoryrecipes = [];
    $scope.loadEntities('inventoryrecipe', 'inventoryrecipes');
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: $translate.instant('invantories.Sure') ,
            text: $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:  $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal( $translate.instant('invantories.Deleted'), $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('app/inventory/inventorytransform/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
            }
        });
    };
    if (!$scope.item.TransformDate) {
        $scope.item.TransformDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
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
            $scope.item.TransformDate = item;
        })
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventorytransformeditCtrl");
    });
};
app.controller('inventorytransformitemCtrl', inventorytransformitemCtrl);
function inventorytransformitemCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("inventorytransformitemCtrl");
    var iti = this;
    $scope.item = {};
    var deregistration = $scope.$on('ChangeData', function (event) {
        iti.tableParams.reload();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                iti.tableParams.reload();
                toaster.pop('success', $translate.instant('invantories.Updated'), $translate.instant('invantories.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'inventorytransformitem')
            this.item.post().then(function (res) {
                iti.tableParams.reload();
                toaster.pop('success',$translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'));
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trWasteUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trUnitCountActual = $translate.instant('main.UNITCOUNTACTUAL');
        $scope.trWasteUnit = $translate.instant('main.WASTEUNIT');
        $scope.trWasteUnitActual = $translate.instant('main.WASTEUNITACTUAL');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.GetInventoryTransformID = function () {
        return $rootScope.InventoryTransformID;
    }

    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            _update(rowform.$data, data);
            $scope.saveData(data);
            rowform.$cancel();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!iti.tableParams.data[iti.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(iti.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    iti.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('inventorytransformitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryTransformID='" + $scope.GetInventoryTransformID() + "'"
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
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
    $scope.inventorytransforms = [];
    $scope.loadEntities('inventorytransform', 'inventorytransforms');
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    }
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
    }

    $scope.cancelremove = function (index) {
        if (iti.tableParams.data[index].fromServer) {
            iti.tableParams.data[index].remove();
        }
        iti.tableParams.data.splice(index, 1);
    };
    var deregistration2 = $scope.$watch(angular.bind(iti, function () {
        return $rootScope.InventoryTransformID;
    }), function (value) {
        iti.tableParams.reload();
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
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("inventorytransformitemCtrl");
    });
};
app.controller('inventorytransformoutputitemsCtrl', inventoryrecipeoutputitemsCtrl);
function inventoryrecipeoutputitemsCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $stateParams, $filter, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorytransformoutputitemsCtrl");
    var ito = this;
    $scope.item = {};
    var deregistration = $scope.$on('ChangeData', function (event) {
        ito.tableParams.reload();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) { ito.tableParams.reload(); toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated')); });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'inventorytransformoutputitem')
            this.item.post().then(function (res) { ito.tableParams.reload(); toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved')); });
            this.item.get();
        }
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trWasteUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trUnitCountActual = $translate.instant('main.UNITCOUNTACTUAL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');

    }
    $scope.translate();
    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.GetInventoryTransformID = function () {
        return $rootScope.InventoryTransformID;
    }
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            _update(rowform.$data, data);
            $scope.saveData(data);
            rowform.$cancel();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ito.tableParams.data[ito.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ito.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    ito.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            Restangular.all('inventorytransformoutputitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryTransformID='" + $scope.GetInventoryTransformID() + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.date = ngnotifyService.ServerTime();
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
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
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
    $scope.inventoryrecipes = [];
    $scope.loadEntities('inventoryrecipe', 'inventoryrecipes');
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    }
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
    }
    $scope.cancelremove = function (index) {
        if (ito.tableParams.data[index].fromServer) {
            ito.tableParams.data[index].remove();
        }
        ito.tableParams.data.splice(index, 1);
    };
    var deregistration2 = $scope.$watch(angular.bind(ito, function () {
        return $rootScope.InventoryTransformID;
    }), function (value) {
        ito.tableParams.reload();
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
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("inventorytransformoutputitemsCtrl");
    });
};
