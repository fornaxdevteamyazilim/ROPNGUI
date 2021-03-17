'use strict';
app.controller('InventoryRequirmentsEditCtrl', InventoryRequirmentsEditCtrl);
function InventoryRequirmentsEditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element) {
    $rootScope.uService.EnterController("InventoryRequirmentsEditCtrl");
    $scope.item = {};
    $scope.item.Amount = 0;
    $scope.item.UnitCustom = 0;
    $scope.item.UnitPrice = 0;
    $scope.item.GrandTotal = 0;
    userService.userAuthorizated();
    $scope.Back = function () {
        $location.path('app/inventory/inventoryrequirments/list');
    };
    var deregistration = $scope.$on('isSipnner', function (event, data) {
        $scope.isSpinner = data;
    });
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trCalculatedCount = $translate.instant('main.CALCULATEDCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trDemandCount = $translate.instant('main.DEMANDCOUNT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trisProcesseed = $translate.instant('main.STATE');
        $scope.back = $translate.instant('main.BACK');
        $scope.note = $translate.instant('main.NOTE');
        $scope.datetime = $translate.instant('main.DATETIME');
        $scope.deliverydatetime = $translate.instant('main.DELIVERYDATE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.print = $translate.instant('main.PRINT');
        $scope.addrequirmentitem = $translate.instant('main.ADDREQUIRMENTITEM');
        $scope.trSupplyDescription = $translate.instant('main.DESCRIPTION');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.selectinventorygroup = $translate.instant('main.SELECTINVENTORYGROUP');
        $scope.amount = $translate.instant('main.AMOUNT₺');
        $scope.vat = $translate.instant('main.VAT₺');
        $scope.vatdiscount = $translate.instant('main.VATDISCOUNT%');
        $scope.discount = $translate.instant('main.DISCOUNT₺');
        $scope.grandtotal = $translate.instant('main.GRANDTOTAL');
        $scope.assigntoinvoice = $translate.instant('main.ASSIGNTOINVOICE');
        $scope.send = $translate.instant('main.SEND'); 
        $scope.ispaid = $translate.instant('main.ISPAID');
        $scope.trVATRatio = $translate.instant('main.VATRATIO');
        $scope.trVat = $translate.instant('main.VAT');
        $scope.trAmount = $translate.instant('main.AMOUNT'); 
        $scope.Processed = $translate.instant('main.PROCESSED');
        $scope.Process = $translate.instant('main.PROCESS'); 
        $scope.trfactor = $translate.instant('main.FACTOR');
        $scope.trBaseUnit = $translate.instant('main.BASEUNIT');
        $scope.trRequirment = $translate.instant('main.REQUIRMENTFACTOR');
        
    };
    $scope.translate();
    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.InventoryRequirmentID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('InventoryRequirment', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            if (restresult.isProcesseed == true)
                restresult.isProcesseed = $scope.Processed;
            if (restresult.isProcesseed == false)
                restresult.isProcesseed = $scope.Process;
            $scope.item = Restangular.copy(restresult);
            $location.path('app/inventory/inventoryrequirments/edit/' + restresult.id);
            $scope.$broadcast('newRequirmentData', restresult);
        })
    else {
        $scope.item = {};
        $scope.item.Date = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                $location.path('app/inventory/inventoryrequirments/list');
            });
        } else {
            $scope.ShowObject = true;
            Restangular.restangularizeElement('', $scope.item, 'InventoryRequirment')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                $scope.InventoryRequirmentID = resp.id;
                $location.path('app/inventory/inventoryrequirments/edit/' + resp.id);
                $scope.ShowObject = false;
                $scope.$broadcast('newRequirmentData', resp);
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                $scope.ShowObject = false;
            });
        }
    };
    $scope.processrequirment = function () {
        $scope.isSpinner = true;
        Restangular.all('InventorySupply/processrequirment').getList({
            InventoryRequirmentID: $stateParams.id
        }).then(function (result) {
            $scope.isSpinner = false;
            toaster.pop('success',$translate.instant('orderfile.Updated'));
            Restangular.one('InventoryRequirment', $stateParams.id).get().then(function (restresult) {
                $location.path('app/inventory/inventoryrequirments/list');
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
            })
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            $scope.isSpinner = false;
        });
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
                    SweetAlert.swal( $translate.instant('invantories.Deleted'),  $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('app/inventory/inventoryrequirments/list');
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
    // $scope.ShowGrantTotal = function ($defer, params) {
    //     Restangular.one('InventoryRequirmentItem').get({
    //         pageNo: params.page(),
    //         pageSize: params.count(),
    //         sort: params.orderBy(),
    //         search: "InventoryRequirmentID='" + $scope.InventoryRequirmentID + "'"
    //     }).then(function (items) {
    //         params.total(items.paging.totalRecordCount);
    //         $defer.resolve(items);
           
    //     }, function (response) {
    //         toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    //     });
    // };
    $scope.ShowGrantTotal = function () {
        $scope.item.GrandTotal = $scope.item.UnitCustom * $scope.item.UnitPrice;
        return $scope.item.GrandTotal = $scope.item.UnitCustom * $scope.item.UnitPrice;
        $scope.item.UnitCustom + $scope.item.UnitCustom - $scope.item.UnitPrice;
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("InventoryRequirmentsEditCtrl");
    });
};
'use strict';
app.controller('InventoryRequirmentItemsCtrl', InventoryRequirmentItemsCtrl);
function InventoryRequirmentItemsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("InventoryRequirmentItemsCtrl");
    var iri = this;
    $scope.dataitem = {};
    $scope.groupItem = [];
    $scope.requirment = [];
    $scope.requirmentItem = [];
    $scope.item = {};
    $scope.item.Amount = 0;
    $scope.item.UnitCustom = 0;
    $scope.item.UnitPrice = 0;
    $scope.item.GrandTotal = 0;
    var deregistration = $scope.$on('newRequirmentData', function (event, data) {
        $scope.requirmentData = data;
    });
    $scope.saveItem = function () {
        $scope.isSpinner = true;
        $scope.$emit('isSipnner', $scope.isSpinner);
        $scope.requirment = $scope.requirmentData;
        $scope.requirment.items = $scope.requirmentItem;
        Restangular.restangularizeElement('', $scope.requirment, 'InventoryRequirment')
        $scope.requirment.put().then(function (resp) {
            $scope.isSpinner = false;
            $scope.$emit('isSipnner', $scope.isSpinner);
            iri.tableParams.reload();
            toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Savedserver'));
        }, function (response) {
            $scope.isSpinner = false;
            $scope.$emit('isSipnner', $scope.isSpinner);
            toaster.pop('warning',$translate.instant('invantories.NotSaved') , response.data.ExceptionMessage);
        });
    };
    iri.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            $scope.ShowSpinnerObject = true;
            Restangular.all('InventoryRequirmentItem/defaultitems').getList({
                InventoryRequirmentID: $stateParams.id
            }).then(function (items) {
                $scope.requirmentItem = items;
                $scope.requirmentItem.Total = $scope.calculateTotal($scope.requirmentItem );
                params.total($scope.requirmentItem);
                $defer.resolve($scope.requirmentItem);
                $scope.ShowSpinnerObject = false;
            }, function (response) {
             $scope.ShowSpinnerObject = false;
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
    $scope.inventoryunits = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunits');
    $scope.GetInventoryUnitPrice = function (rowform, item) {
        Restangular.one('InventoryRequirment', $stateParams.id).get().then(function (restresult) {
            Restangular.one('InventoryUnit/price').get({
                InventoryUnitID: rowform.$data.InventoryUnitID,
                StoreID: $rootScope.user.StoreID,
                ForDate: restresult.Date
            }).then(function (result) {
                if (result && result)
                    item.UnitPrice = result;
                else
                    item.UnitPrice = 0;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        })
    };
    $scope.LoadTags = function (data) {
        Restangular.all('tag/array').getList({
            id: data
        }).then(function (result) {
            $scope.tags = Restangular.copy(result[0].item);
            $scope.groupItem.push({ name: '*Tümü', id: 1 });
            for (var i = 0; i < $scope.tags.children.length; i++) {
                $scope.groupItem.push({ name: $scope.tags.children[i].name, id: $scope.tags.children[i].id })
                if ($scope.tags.children[i].children) {
                    for (var j = 0; j < $scope.tags.children[i].children.length; j++) {
                        $scope.groupItem.push({ name: $scope.tags.children[i].children[j].name, id: $scope.tags.children[i].children[j].id })
                        if ($scope.tags.children[i].children[j].children) {
                            for (var k = 0; k < $scope.tags.children[i].children[j].children.length; k++) {
                                $scope.groupItem.push({ name: $scope.tags.children[i].children[j].children[k].name, id: $scope.tags.children[i].children[j].children[k].id })
                                if ($scope.tags.children[i].children[j].children) {
                                    for (var l = 0; l < $scope.tags.children[i].children[j].children[k].children.length; l++) {
                                        $scope.groupItem.push({ name: $scope.tags.children[i].children[j].children[k].children[l].name, id: $scope.tags.children[i].children[j].children[k].children[l].id })
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (var m = 0; m < $scope.groupItem.length; m++) {
                if ($scope.groupItem[m].name == 'Haftalık' || $scope.groupItem[m].name == 'Günlük') {
                    $scope.groupItem.splice(m, 1);
                    $scope.groupItem.splice(m, 1);
                }
            }
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response);
        });
    };
    $scope.LoadTags(20);
    $scope.getListGroup = function (dataID) {
        if (dataID == 1) {
            $scope.TagName = Restangular.copy({ name: '' });
        } else {
            var data = $filter('filter')($scope.groupItem, { id: dataID });
            $scope.TagName = Restangular.copy(data[0]);
        }
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    $scope.FormKeyPress = function (event, rowform, data, index) {
        $('.inputs').keydown(function (e) {
            if (e.which === 107) {
                var index = $('.inputs').index(this) - 1;
                $('.inputs').eq(index).focus().select();
            }
            if (e.which === 13) {
                var index = $('.inputs').index(this) + 1;
                $('.inputs').eq(index).focus().select();
            }
            if (e.which === 37) {
                var index = $('.inputs').index(this) - 1;
                $('.inputs').eq(index).focus().select();
            }
            if (e.which === 39) {
                var index = $('.inputs').index(this) + 1;
                $('.inputs').eq(index).focus().select();
            }
        });
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.requirmentItem.push(data)
            $scope.cancelForm(rowform);
        }
    };
    $scope.ReCalculateTotal = function () {
        $scope.requirmentItem.Total = $scope.calculateTotal($scope.requirmentItem);
    }
    $scope.calculateTotal = function (itemsArray) {
        var result = 0;
        itemsArray.forEach(element => {
            result += (element.UnitCustom * element.UnitPrice);
        });
        return result;
    }
    // $scope.$watchCollection('requirmentItem', function (requirmentItemArray) {
    //     $scope.requirmentItem.Total = 0;
    //     requirmentItemArray.forEach(element => {
    //         $scope.requirmentItem.Total += (element.UnitCustom * element.UnitPrice);
    //     });
    // });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("InventoryRequirmentItemsCtrl");
    });
};