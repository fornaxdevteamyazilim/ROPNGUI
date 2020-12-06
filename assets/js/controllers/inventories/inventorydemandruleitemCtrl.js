app.controller('inventorydemandruleitemCtrl', inventorydemandruleitemCtrl);
function inventorydemandruleitemCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element) {
    $rootScope.uService.EnterController("inventorydemandruleitemCtrl");
    var idri = this;
    $scope.item = {};
    $scope.inventoryunits = [];
    userService.userAuthorizated();
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trUnit = $translate.instant('main.UNIT');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.back = $translate.instant('main.BACK');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trMinUnits = $translate.instant('main.MINUNITS');
        $scope.trMaxUnits = $translate.instant('main.MAXUNITS');
        $scope.trDeliveryDays = $translate.instant('main.DELIVERYDAYS');
        $scope.trPaymentTerm = $translate.instant('main.PAYMENTTERM');
        $scope.trMultipliyer = $translate.instant('main.MULTIPLIER');
        $scope.trStore = $translate.instant('main.STORE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    if ($stateParams.id != 'new') {
        Restangular.one('inventorydemandrule', $stateParams.id).get().then(function (restresult) {
            $scope.item = Restangular.copy(restresult);
            if ($scope.item.items) {
            idri.tableParams.reload();
            }
        })
    } else {
        $scope.item = {};
        $scope.item.items = [];
        idri.tableParams = new ngTableParams({
            page: 1,
            count: 10,
        }, {
            getData: function ($defer, params) {
                if ($scope.item.items)
                    $defer.resolve($scope.item.items);
            }
        });
    }
    idri.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            if ($scope.item.items)
                $defer.resolve($scope.item.items);
        }
    });
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.ShowSpinnerObject = true;
            $scope.item.put().then(function (resp) {
                toaster.pop('success', $translate.instant('invantories.Updated') ,$translate.instant('invantories.Savedserver'));
                $location.path('/app/inventory/inventorydemandrule/list');
                $scope.ShowSpinnerObject = false;
            }, function (response) {
                $scope.ShowSpinnerObject = false;
                toaster.pop('warning', "Error!", response.data.ExceptionMessage);
            });
        } else {
            $scope.ShowSpinnerObject = true;
            Restangular.restangularizeElement('', $scope.item, 'inventorydemandrule')
            $scope.item.post().then(function (resp) {
                toaster.pop('success', $translate.instant('invantories.Saved') ,$translate.instant('invantories.Savedserver'));
                $location.path('/app/inventory/inventorydemandrule/list');
                $scope.item = Restangular.copy(resp);
                idri.tableParams.reload();
                $scope.ShowSpinnerObject = false;
            }, function (response) {
                $scope.ShowSpinnerObject = false;
                toaster.pop('error', "Error!", response.data.ExceptionMessage);
            });
        }
    };
    idri.search = '';
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
        if (!idri.tableParams.data[idri.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(idri.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'),$translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
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
                if (idri.tableParams.data[index].fromServer) {
                    idri.tableParams.data[index].remove();
                }
                idri.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (idri.tableParams.data[index].fromServer) {
            idri.tableParams.data[index].remove();
        }
    };
    $scope.addItem = function (item) {
        $scope.newItem = true;
        idri.tableParams.data.push({ InventoryDemandRulelID: $stateParams.id, InventoryDemandRule: '', InventoryUnitID: '', InventoryUnit: '', MinUnits: 0, MaxUnits: 0, DeliveryDays: 0, PaymentTerm: 0, Multipliyer: 0 });
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.StoreGroups = [];
    $scope.loadEntities('cache/inventoryunit', 'inventoryunits');
    $scope.StoreGroups = [];
    $scope.loadEntities('cache/storegroup', 'StoreGroups');
    $scope.Stores = [];
    $scope.loadEntities('cache/store', 'Stores');
    $scope.selectOnly1Or2 = function (item, selectedItems) {
        if (selectedItems !== undefined && selectedItems.length >= 20) {
            return false;
        } else {
            return true;
        }
    };
    $scope.selectOnly1Or22 = function (item, selectedItems) {
        if (selectedItems !== undefined && selectedItems.length >= 20) {
            return false;
        } else {
            return true;
        }
    };
    $scope.switchViewCallback = function (scopeObj) {
        if (scopeObj.switchViewLabel == 'test2') {
            scopeObj.switchViewLabel = 'test1';
            scopeObj.inputModel = $scope.Stores;;
            scopeObj.selectOnlyLeafs = true;
        } else {
            scopeObj.switchViewLabel = 'test2';
            scopeObj.inputModel = $scope.Stores;
            scopeObj.selectOnlyLeafs = false;
        }
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorydemandruleitemCtrl");
    });
};