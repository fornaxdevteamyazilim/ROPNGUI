app.controller('inventorysaleeditCtrl', inventorysaleeditCtrl);
function inventorysaleeditCtrl($scope, $filter, SweetAlert, Restangular, ngTableParams, $modal, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorysaleeditCtrl");
    var ise = this;
    $scope.item = {};
    $scope.item.Amount = 0;
    $scope.item.VAT = 0;
    $scope.item.Discount = 0;
    $scope.item.GrandTotal = 0;
    userService.userAuthorizated();
    if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.Name == "Admin") {
        $scope.ShowSentInventoryInvoiceButton = true;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trVATRatio = $translate.instant('main.VATRATIO');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trVat = $translate.instant('main.VAT');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.back = $translate.instant('main.BACK');
        $scope.documentnumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.documenttype = $translate.instant('main.DOCUMENTTYPE');
        $scope.companyy = $translate.instant('main.COMPANY');
        $scope.repository = $translate.instant('main.REPOSITORY');
        $scope.note = $translate.instant('main.NOTE');
        $scope.description = $translate.instant('main.DESCRIPTION');
        $scope.datetime = $translate.instant('main.DATETIME');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.addsaleitem = $translate.instant('main.ADDSALEITEM');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.amount = $translate.instant('main.AMOUNT₺');
        $scope.vat = $translate.instant('main.VAT₺');
        $scope.vatdiscount = $translate.instant('main.VATDISCOUNT%');
        $scope.discount = $translate.instant('main.DISCOUNT₺');
        $scope.grandtotal = $translate.instant('main.GRANDTOTAL');
        $scope.send = $translate.instant('main.SEND'); 
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.SendNetsisDeliveryInvoice = function () {
        $scope.isSpinner = true;
        Restangular.one('netsis/sendinventorysale').get({
            InventorySaleID: $stateParams.id,
        }).then(function (result) {
            $scope.isSpinner = false;
            toaster.pop('success',$translate.instant('invantories.BillTransferred') , '');
            $location.path('app/accountingintegration/inventorysale/list');
        }, function (response) {
            $scope.isSpinner = false;
            toaster.pop('Warning',$translate.instant('invantories.ProblemOccurred'), response.data.ExceptionMessage);
        });
    };
    $scope.InventorySaleID = $stateParams.id;
    if ($stateParams.id != 'new') {
        Restangular.one('inventorysale', $stateParams.id).
            get().then(function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
                $scope.InventorySaleID = restresult.id;
            })
    }else {
        $scope.item = {};
    }
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                         swal($translate.instant('invantories.Updated'), "Update$translate.instant('invantories.Updated')d.", "success");
                $location.path('app/inventory/inventorysale/list');
            }, function (response) {
                toaster.pop('warning', "Error!!!", response.data.ExceptionMessage);
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'inventorysale')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal("Saved!", "Data Successfully Saved!", "success");
                $location.path('app/inventory/inventorysale/edit/' + resp.id);
            }, function (response) {
                toaster.pop('error', "Error!!!", response.data.ExceptionMessage);
            });
        }
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    };
    ise.search = '';
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
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    }
    $scope.documenttypes = [];
    $scope.loadEntities('enums/DocumentType', 'documenttypes');
    $scope.item.DocumentTypeID = "0";
    $scope.BuildSearchString = function () {
        var result = [];
        if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.Name != "Admin") {
            result.push("StoreID='" + $rootScope.user.StoreID + "'");
        }
        return result;
    };
    $scope.repositories = [];
    $scope.loadrepository = function () {
        if (!$scope.repositories.length) {
            Restangular.all('repository').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                //search: $scope.BuildSearchString()
            }).then(function (result) {
                if (result && result.length > 0) {
                    if (result && result.length > 1) {
                        $scope.repositories = result;
                    } else {
                        $scope.repositories = result;
                        $scope.item.RepositoryID = result[0].id;       
                    }
                }
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadrepository();
    $scope.company = [];
    $scope.loadCompany = function () {
        if (!$scope.company.length) {
            Restangular.all('company').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: ''
            }).then(function (result) {
                $scope.company = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadCompany();    
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
                    $location.path('/app/inventory/inventorysale/list');
                });
            }
            else {
                SweetAlert.swal( $translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled') , "error");
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
            $scope.item.SaleDate = item;
        })
    };
    if (!$scope.item.SaleDate) {
        $scope.item.SaleDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    };
    $scope.ShowGrantTotal = function () {
        $scope.item.GrandTotal = $scope.item.Amount + $scope.item.VAT - $scope.item.Discount;
        return $scope.item.GrandTotal = $scope.item.Amount + $scope.item.VAT - $scope.item.Discount;
        $scope.item.Amount + $scope.item.Amount - $scope.item.Discount;
    };
    $scope.SetDiscount = function () {
        Restangular.restangularizeElement('', $scope.item, 'inventorysale')
        $scope.item.put().then(function (resp) {
            $scope.item = Restangular.copy(resp);
        });
    };
    $scope.$on('UpdateInventorySale', function (event, data) {
        $scope.item.Amount += data.Amount;
        $scope.item.VAT += data.VAT;
        $scope.item.Discount += data.Discount;
        $scope.item.GrandTotal += data.GrandTotal;
        Restangular.restangularizeElement('', $scope.item, 'inventorysale')
        $scope.item.put().then(function (resp) {
            $scope.item = resp;
        });
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorysaleeditCtrl");
    });
};
app.controller('inventorysaleitemCtrl', inventorysaleitemCtrl);
function inventorysaleitemCtrl($scope, $modal, $filter, SweetAlert,$translate,  Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $element) {
    $rootScope.uService.EnterController("inventorysaleitemCtrl");
    var isi = this;
    $scope.item = {};
    isi.tableParams = new ngTableParams({
        page: 1,
        count: 100,
    },{
        getData: function ($defer, params) {
            //if ($scope.InventorySaleID == 'new' && $stateParams.id == 'new') {
            //    $scope.InventorySaleID = 0;
            //}
            Restangular.all('inventorysaleitem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: "InventorySaleID='" + $scope.InventorySaleID + "'",
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
                $scope.item.Amount = 0;
                $scope.item.VAT = 0;
                $scope.item.Discount = 0;
                for (var i = 0; i < items.length; i++) {
                    $scope.item.Amount += items[i].Amount;
                    $scope.item.VAT += items[i].VAT;
                    $scope.item.Discount += items[i].Discount;
                }
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
        });
    $scope.GetInventoryUnitFreePrice = function (InventoryUnitID) {
        Restangular.one('inventoryunit', InventoryUnitID).get().then(function (restresult) {
            if (restresult.EnableFreePrice == true) {
                $scope.EditableInventoryUnitPrice = true;
            }
        })
    };
    $scope.GetInventoryUnitPrice = function (rowform, item) {
        $scope.GetInventoryUnitFreePrice(rowform.$data.InventoryUnitID);
        Restangular.one('inventorysale', $stateParams.id).get().then(function (restresult) {
            Restangular.one('inventoryunit/price').get({
                InventoryUnitID: rowform.$data.InventoryUnitID,
                StoreID: $rootScope.user.StoreID,
                ForDate: restresult.SaleDate
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
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.ShowObjectUnit = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName] + ' ' + $scope[Container][i]['Unit'];
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
    $scope.loadEntitiesInventoryUnits = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: "factor = 1",
            }).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].isActiveValue == true) {
                        $scope[Container].push(result[i]);
                    }
                }
                //$scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntitiesInventoryUnits('inventoryunit', 'inventoryunits');
    $scope.inventoryunitstoshow = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunitstoshow');
    $scope.saveData = function (data) {
        if (data.EnteredUnitPrice) {
            data.UnitPrice = data.EnteredUnitPrice;
        }
        data.Amount = data.UnitPrice * data.UnitCount;
        data.VAT = data.UnitPrice * data.UnitCount * $scope.GetInventoryVAT(data.InventoryUnitID);
        data.InventoryUnit = $scope.ShowObjectUnit('inventoryunitstoshow', 'id', data.InventoryUnitID, 'Inventory');
        data.GetVat = $scope.GetInventoryVAT(data.InventoryUnitID) * 100
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                $scope.$emit('UpdateInventorySale', $scope.item);
                toaster.pop('success',$translate.instant('invantories.Updated') ,$translate.instant('invantories.Updatedapplied'));
            });
        }else {
            Restangular.restangularizeElement('', data, 'inventorysaleitem')
            data.post().then(function (res) {
                $scope.$emit('UpdateInventorySale', $scope.item);
                toaster.pop('success',$translate.instant('invantories.Saved') ,$translate.instant('invantories.Savedserver'));
            });
        }
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            $scope.addItem();

        } if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!isi.tableParams.data[isi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(isi.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'),$translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
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
                if (isi.tableParams.data[index].fromServer) {
                    isi.tableParams.data[index].remove();
                }
                $scope.item.Amount = -1 * (isi.tableParams.data[index].Amount)
                $scope.$emit('UpdateInventorySale', $scope.item);
                isi.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
        isi.tableParams.reload();
    };
    $scope.cancelremove = function (index) {
        if (isi.tableParams.data[index].fromServer) {
            isi.tableParams.data[index].remove();
        }
        isi.tableParams.data.splice(index, 1);
    };
    $scope.GetInventoryVAT = function (InventoryUnitID) {
        if (InventoryUnitID && $scope.inventories.length) {
            var SelectInventory = $filter('filter')($scope.inventoryunits, { id: InventoryUnitID });
            var selected = $filter('filter')($scope.inventories, { id: SelectInventory[0].InventoryID });
            return selected.length ? selected[0].VATRatio : 0;
        } else {
            return 0;
        }
    };
    $scope.addItem = function () {
        isi.tableParams.data.push({ InventorySaleID: $stateParams.id, UnitPrice: 0, VATDiscount: 0, });
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
            $scope.FromDate = item;
        })
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventorysaleitemCtrl");
    });
};
app.directive('replacecomma', function () {
    return {
        require: 'ngModel',
        link: function (scope,$translate, element, attrs, ngModelCtrl) {
            scope.$watch(attrs.ngModel, function (newVal) {
                if (newVal !== undefined && newVal !== null) {
                    ngModelCtrl.$setViewValue(String(newVal).replace(/,/g, '.'));
                    element.val(String(newVal).replace(/,/g, '.'));
                }
            })

        }
    }
});
