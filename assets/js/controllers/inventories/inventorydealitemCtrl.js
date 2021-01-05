app.controller('inventorydealitemCtrl', inventorydealitemCtrl);
function inventorydealitemCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element) {
    $rootScope.uService.EnterController("inventorydealitemCtrl");
    var ideali = this;
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
        $scope.trPrice = $translate.instant('main.PRICE');
        $scope.trMinUnits = $translate.instant('main.MINUNITS');
        $scope.trMaxUnits = $translate.instant('main.MAXUNITS');
        $scope.trDeliveryDays = $translate.instant('main.DELIVERYDAYS');
        $scope.trDiscount = $translate.instant('main.DISCOUNT');
        $scope.trMultipliyer = $translate.instant('main.MULTIPLIER');
        $scope.trStore = $translate.instant('main.STORE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    if ($stateParams.id != 'new') {
        Restangular.one('inventorydeal', $stateParams.id).get().then(function (restresult) {
            $scope.Showtable = true;
            $scope.item = Restangular.copy(restresult);            
            $scope.loadEntities3('SuppliyerInventoryUnits', 'inventoryunits', restresult.CompanyID);
            if ($scope.item.items.length > 0) {
                ideali.tableParams.reload();
            }
        })
    } else {
        $scope.Showtable = false;
        $scope.item = {};
    }
    ideali.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            if ($scope.item.items && $scope.item.items.length > 0)
                $defer.resolve($scope.item.items);
        }
    });
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.ShowSpinnerObject = true;
            $scope.item.put().then(function (resp) {
                toaster.pop('success',$translate.instant('invantories.Updated') ,$translate.instant('invantories.Savedserver'));
                $location.path('/app/inventory/inventorydeals/list');
                $scope.ShowSpinnerObject = false;
            }, function (response) {
                $scope.ShowSpinnerObject = false;
                toaster.pop('warning', "Error!", response.data.ExceptionMessage);
            });
        } else {
            $scope.ShowSpinnerObject = true;
            Restangular.restangularizeElement('', $scope.item, 'inventorydeal')
            $scope.item.post().then(function (resp) {
                toaster.pop('success', $translate.instant('invantories.Saved') ,$translate.instant('invantories.Savedserver'));
                $scope.Showtable = true;
                $scope.item = Restangular.copy(resp);
                ideali.tableParams.reload();
                $scope.ShowSpinnerObject = false;
                $scope.loadEntities3('SuppliyerInventoryUnits', 'inventoryunits', resp.CompanyID);
            }, function (response) {
                $scope.ShowSpinnerObject = false;
                toaster.pop('error', "Error!", response.data.ExceptionMessage);
            });
        }
    };
    ideali.search = '';
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
        if (!ideali.tableParams.data[ideali.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ideali.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), 'Insert cancelled !');
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), 'Edit cancelled !');
        }
    };
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
                    $location.path('app/inventory/inventorydeals/list');
                });
            }
            else {
                SweetAlert.swal( $translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
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
            cconfirmButtonText:  $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:  $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ideali.tableParams.data[index].fromServer) {
                    ideali.tableParams.data[index].remove();
                }
                ideali.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ideali.tableParams.data[index].fromServer) {
            ideali.tableParams.data[index].remove();
        }
    };
    $scope.addItem = function (item) {
        $scope.newItem = true;
        ideali.tableParams.data.push({ InventoryDealID: $stateParams.id, InventoryUnitID: '', InventoryUnit: '', CompanyID: (item.CompanyID) ? item.CompanyID : '', Company: (item.Company) ? item.Company : '', Price: 0, MinUnits: 0, MaxUnits: 0, DeliveryDays: 0, PaymentTerm: 0, ValidFrom: item.ValidFrom, Multipliyer: 0});
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
                toaster.pop('Warning', "Server Error", response);
            });
        }
    };
    $scope.loadEntities3 = function (EntityType, Container, CompanyID) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                CompanyID:CompanyID
            }).then(function (result) {
                resresult = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].factor == 1)
                        resresult.push(result[i])
                }
                $scope[Container] = resresult;
            }, function (response) {
                toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.companies = [];
    $scope.loadEntities('cache/company', 'companies');
    $scope.StoreGroups = [];
    $scope.loadEntities('cache/storegroup', 'StoreGroups');
    $scope.Stores = [];
    $scope.loadEntities('cache/store', 'Stores');
    $scope.DateValidFrom = function (item) {
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
            $scope.item.ValidFrom = item;
        })
    };
    $scope.DateValidTo = function (item) {
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
            $scope.item.ValidTo = item;
        })
    };
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
        $rootScope.uService.ExitController("inventorydealitemCtrl");
    });
};
app.directive('replacecomma', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            scope.$watch(attrs.ngModel, function (newVal) {
                if (newVal !== undefined && newVal !== null) {
                    ngModelCtrl.$setViewValue(String(newVal).replace(/,/g, '.'));
                    element.val(String(newVal).replace(/,/g, '.'));
                }
            })

        }
    }
});