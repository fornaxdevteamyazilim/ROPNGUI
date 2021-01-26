'use strict';
app.controller('InventorySuppliesEditCtrl', InventorySuppliesEditCtrl);
function InventorySuppliesEditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element) {
    $rootScope.uService.EnterController("InventorySuppliesEditCtrl");
    $scope.item = {};
    userService.userAuthorizated();
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trInventoryCalcultionMethod = $translate.instant('main.INVENTORYCALCULTIONMETHOD');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trisDefault = $translate.instant('main.ISDEFAULT');
        $scope.trMaxUnit = $translate.instant('main.MAXUNITS');
        $scope.trMinUnit = $translate.instant('main.MINUNITS');
        $scope.trInventoryAuditType = $translate.instant('main.INVENTORYAUDITTYPE');
        $scope.trInventorySupplyMethodID = $translate.instant('main.INVENTORYSUPPLYMETHOD');
        $scope.trDelta = $translate.instant('main.DELTA');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.back = $translate.instant('main.BACK');
        $scope.trMultipliyer = $translate.instant('main.MULTIPLAYER');
        $scope.save = $translate.instant('main.SAVE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.trPrice = $translate.instant('main.PRICE');
        $scope.addsuppliesitem = $translate.instant('main.ADDSUPPLIES');
        $scope.trincludeRepositoryUnits = $translate.instant('main.INCLUDERESPOSITORYUNITS');
        $scope.templatename = $translate.instant('main.TEMPLATENAME');
        $scope.ObjectTags = $translate.instant('main.TAG');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trBrand = $translate.instant('main.BRAND');
        $scope.trUser = $translate.instant('main.USER');
        $scope.trUserRole = $translate.instant('main.USERROLE');
        $scope.trCriticalStockLevel = $translate.instant('main.CRITICALSTOCKLEVEL');
        $scope.trDeliveryDays = $translate.instant('main.DELIVERYDATE');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trStoreGroup = $translate.instant('main.STOREGROUP');
        $scope.trAprove = $translate.instant('main.ADD');
        $scope.trMinAmount = $translate.instant('main.MINAMOUNT');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.InventorySupplyID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('InventorySupply', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            $scope.item = Restangular.copy(restresult);
            $location.path('app/inventory/inventorysupplies/edit/' + restresult.id);
        })
    else {
        $scope.item = {};
    }
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal($translate.instant('invantories.Updated'),$translate.instant('invantories.Updated'), "success");
                $location.path('app/inventory/inventorysupplies/list');
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'InventorySupply')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                $scope.InventorySupplyID = resp.id;
                swal($translate.instant('invantories.Saved'), $translate.instant('invantories.Saved'), "success");
                $location.path('app/inventory/inventorysupplies/edit/' + resp.id);
            });
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
                    SweetAlert.swal(  $translate.instant('invantories.Deleted'),  $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('app/inventory/inventorysupplies/list');
                });
            }
            else {
                SweetAlert.swal(  $translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
            }
        });
    };
    $scope.loadEntities3 = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.storegroups = [];
    $scope.loadEntities3('cache/storegroup', 'storegroups');
    $scope.stores = [];
    $scope.loadEntities3('cache/store', 'stores');
    $scope.deliveryDaysDatePopup = function (item) {
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
            $scope.item.DeliveryDays = item;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("InventorySuppliesEditCtrl");
    });
};
'use strict';
app.controller('InventorySuppliesItemsCtrl', InventorySuppliesItemsCtrl);
function InventorySuppliesItemsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("InventorySuppliesItemsCtrl");
    var isi = this;
    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.statuses = [{value: true, text: 'Evet'},{ value: false, text: 'Hayır' },];
    $scope.saveItemData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                toaster.pop('success',$translate.instant('invantories.Updated'),$translate.instant('invantories.Updatedapplied') );
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'InventorySupplyItem')
            data.post().then(function (resp) {
                $scope.item.id = resp.id;
                toaster.pop('success',$translate.instant('invantories.Saved'),$translate.instant('invantories.Updated'));
            });
        }
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    isi.search = '';
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
        if (!isi.tableParams.data[isi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(isi.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    isi.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            Restangular.all('InventorySupplyItem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "InventorySupplyID='" + $stateParams.id + "'"
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
            }).then(function (result) {
               var resresult = [];
                for (var i = 0; i < result.length; i++) {
                    if (result[i].factor == 1)
                        resresult.push(result[i])
                }
                $scope[Container] = resresult;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.inventoryunits = [];
    $scope.loadEntities2('cache/inventoryunit', 'inventoryunits');
    $scope.inventorycalculationmethods = [];
    $scope.loadEntities('enums/InventoryCalcultionMethod', 'inventorycalculationmethods');
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
                if (isi.tableParams.data[index].fromServer) {
                    isi.tableParams.data[index].remove();
                }
                isi.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (isi.tableParams.data[index].fromServer) {
            isi.tableParams.data[index].remove();
        }
        isi.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        isi.tableParams.data.push({ InventorySupplyID: $stateParams.id, MinAmount:1, MaxAmount:1, Multipliyer:1, Price:1 });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("InventorySuppliesItemsCtrl");
    });
};