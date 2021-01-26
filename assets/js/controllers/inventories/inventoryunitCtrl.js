'use strict';
app.controller('inventoryunitCtrl', inventoryunitCtrl);
function inventoryunitCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("inventoryunitCtrl");
    var iu = this;
    $scope.item = {};
    $scope.LoadInventorySpecificUnits = function (InvID) {
        $scope.units = [];
        $scope.loadEntities('unit', 'units', "InventoryID='" + InvID + "'");
    };
    $scope.objectType = 'inventoryunit';
    iu.search = '';
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) { iu.tableParams.reload(); toaster.pop('success', $translate.instant('invantories.Updated'), $translate.instant('invantories.Updated')); });
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(function (res) { iu.tableParams.reload(); toaster.pop('success',$translate.instant('invantories.Updated'), $translate.instant('invantories.Updated')); });
            data.get();
        }
    };
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trBrand = $translate.instant('main.BRAND');
        $scope.trUnit = $translate.instant('main.UNIT');
        $scope.trFactor = $translate.instant('main.FACTOR');
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trBarcode = $translate.instant('main.BARCODE');
        $scope.trBarcodeUnitRegex = $translate.instant('main.BARCODEUNITREGEX');
        $scope.trIsActive = $translate.instant('main.ISACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
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
        if (!iu.tableParams.data[iu.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(iu.tableParams.data.length - 1, 1);
            toaster.pop('warning',  $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled') );
        } else {
            toaster.pop('warning',  $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    iu.tableParams = new ngTableParams({
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
                search: (iu.search.length > 0) ? "name like '%" + iu.search + "%'" : "",
                sort: params.orderBy()
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
    $scope.SelectInventoryUnit = function (item,InventoryID) {
        for (var i = 0; i < $scope.inventories.length; i++) {
            if ($scope.inventories[i].id == InventoryID)
                item.UnitID = $scope.inventories[i].UnitID;
        }            
    };
    $scope.loadEntities = function (EntityType, Container , filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search : filter,
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
    $scope.Brands = [];
    $scope.loadEntities('brand', 'Brands');
    $scope.unitstoshow = [];
    $scope.loadEntities('enums/units', 'unitstoshow');
    $scope.unit = [];
    $scope.loadEntities('enums/units', 'unit');
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    };       
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
                if (iu.tableParams.data[index].fromServer) {
                    iu.tableParams.data[index].remove();
                }
                iu.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (iu.tableParams.data[index].fromServer) {
            iu.tableParams.data[index].remove();
        }
        iu.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        iu.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(iu, function () {
        return iu.search;
    }), function (value) {
        iu.tableParams.reload();
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
        $rootScope.uService.ExitController("inventoryunitCtrl");
    });
};
