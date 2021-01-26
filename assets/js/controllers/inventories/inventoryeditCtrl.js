app.controller('inventoryeditCtrl', inventoryeditCtrl);
function inventoryeditCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, userService, $timeout, $stateParams, $element, $location) {
    $rootScope.uService.EnterController("inventoryeditCtrl");
    var inved = this;
    $scope.item = {};
    $scope.itemindata = {};
    $scope.Back = function () {
        $location.path('/app/inventory/inventories/list');
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnit = $translate.instant('main.UNIT');
        $scope.trVATRatio = $translate.instant('main.VATRATIO');
        $scope.trQuantity = $translate.instant('main.QUANTITY');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trACItemCode = $translate.instant('main.ACITEMCOD');
        $scope.trACAccountCode = $translate.instant('main.ACACCOUNTCODE');
        $scope.trAcVatAccountCode = $translate.instant('main.ACVATACCOUNTCODE');
        $scope.trACConsuptionCode = $translate.instant('main.ACCONSUMPTIONACCOUNT');
        $scope.trACPromotionCode = $translate.instant('main.ACPROMOTIONACCOUNT');
        $scope.trACWasteAccount = $translate.instant('main.ACWASTEACCOUNT');
        $scope.trACStaffAccount = $translate.instant('main.ACSTAFFACCOUNT');
        $scope.trACCountDiffPlusAccount = $translate.instant('main.ACCOUNTDIFFPLUSACCOUNT');
        $scope.trACCountDiffMinusAccount = $translate.instant('main.ACCOUNTDIFFMINUSACCOUNT');
        $scope.trACSaleAccunt = $translate.instant('main.ACSALEACCOUNT');
        $scope.trACSaleVatAccount = $translate.instant('main.ACSALESVATACCOUNT');
        $scope.trSave = $translate.instant('main.SAVE');
        $scope.trDelete = $translate.instant('main.DELETE');
        $scope.trName = $translate.instant('main.NAME');
        $scope.trBrand = $translate.instant('main.BRAND');
        $scope.trUnit = $translate.instant('main.UNIT');
        $scope.trFactor = $translate.instant('main.FACTOR');
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trBarcode = $translate.instant('main.BARCODE');
        $scope.trBarcodeUnitRegex = $translate.instant('main.BARCODEUNITREGEX');
        $scope.trIsActive = $translate.instant('main.ISACTIVE');
        $scope.trWarehouseShelf = $translate.instant('main.WAREHOUSESHELF');
        $scope.trCriticalStockLevel = $translate.instant('main.CRITICALSTOCKLEVEL');
        $scope.trInventoryGroup = $translate.instant('main.INVENTORYGROUP');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trInventoryItemCode = $translate.instant('main.INVENTORYITEMCODE');
        $scope.filter = $translate.instant('main.FILTER');

    };
    $scope.translate();
    $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    if ($stateParams.id != 'new') {
        Restangular.one('inventory', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            $scope.item = Restangular.copy(restresult);
            $scope.Showtable = true;
        })
    } else {
        $scope.Showtable = false;
        $scope.item = {};
    }
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.ShowSpinnerObject = true;
            $scope.item.put().then(function (resp) {
                toaster.pop('success',$translate.instant('invantories.Updated') ,$translate.instant('invantories.Savedserver'));
                $location.path('/app/inventory/inventories/list');
                $scope.ShowSpinnerObject = false;
            }, function (response) {
                $scope.ShowSpinnerObject = false;
                toaster.pop('warning', "Error!", response.data.ExceptionMessage);
            });
        } else {
            $scope.item.MemberID = $rootScope.user.UserRole.MemberID
            $scope.ShowSpinnerObject = true;
            Restangular.restangularizeElement('', $scope.item, 'inventory')
            $scope.item.post().then(function (resp) {
                $location.path('app/inventory/inventories/edit/' + resp.id);
                toaster.pop('success',$translate.instant('invantories.Saved') ,$translate.instant('invantories.Savedserver'));
                inved.tableParams.reload();
                $scope.Showtable = true;
                $scope.$broadcast('Save Inventory');
                $scope.ShowSpinnerObject = false;
            }, function (response) {
                $scope.ShowSpinnerObject = false;
                toaster.pop('error', "Error!", response.data.ExceptionMessage);
            });
        }
    };
    $scope.SaveItem = function (item) {
        if (item.restangularized && item.id) {
            item.put().then(function (resp) {
                inved.tableParams.reload();
                toaster.pop('success',$translate.instant('invantories.Updated') ,$translate.instant('invantories.Savedserver'));
            }, function (response) {
                toaster.pop('warning', "Error!", response.data.ExceptionMessage);
            });
        } else {
            Restangular.restangularizeElement('', item, 'inventoryunit')
            item.post().then(function (resp) {
                toaster.pop('success',$translate.instant('invantories.Saved') ,$translate.instant('invantories.Savedserver'));
                inved.tableParams.reload();
            }, function (response) {
                toaster.pop('error', "Error!", response.data.ExceptionMessage);
            });
        }
    };
    inved.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },
    {
        getData: function ($defer, params) {
            Restangular.all('inventoryunit').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventoryID='" + $stateParams.id + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Error", response.data.ExceptionMessage);
            });
        }
    });
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
        if (!inved.tableParams.data[inved.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(inved.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.removedata = function (SelectItem) {
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
                $scope.item.remove().then(function () {
                    SweetAlert.swal(  $translate.instant('invantories.Deleted'),  $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('app/inventory/inventories/list');
                }, function (response) {
                    toaster.pop('warning', "Operation Failed!", response.data.ExceptionMessage);
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
                if (inved.tableParams.data[index].fromServer) {
                    inved.tableParams.data[index].remove();
                }
                inved.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (inved.tableParams.data[index].fromServer) {
            inved.tableParams.data[index].remove();
        }
        inved.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        inved.tableParams.data.push({ name: $scope.item.name, InventoryID: $stateParams.id, MemberID: $rootScope.user.UserRole.MemberID });
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, params) {
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
    $scope.EnumsUnits = [];
    $scope.loadEntities('enums/units', 'EnumsUnits');
    $scope.Brands = [];
    $scope.loadEntities('brand', 'Brands');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');

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
        modalInstance.result.then(function (selectedItem) {});
    };
    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.$on('$destroy', function () {
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("inventoryeditCtrl");
    });
};
