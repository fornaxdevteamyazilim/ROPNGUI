app.controller('inventorydeliveryinvoiceeditCtrl', inventorydeliveryinvoiceeditCtrl);
function inventorydeliveryinvoiceeditCtrl($scope, $filter, SweetAlert, Restangular, ngTableParams, $modal, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorydeliveryinvoiceeditCtrl");
    //userService.userAuthorizated();
    var idr = this;
    $scope.item = {};
    $scope.Back = function () {
        $location.path('app/inventory/inventorydeliveryinvoice/list');
    };
    $scope.translate = function () {
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trDocumentNumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.trDocumentType = $translate.instant('main.DOCUMENTTYPE');
        $scope.trPaymentTerm = $translate.instant('main.PAYMENTTERM');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trNotes = $translate.instant('main.NOTE');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trVAT = $translate.instant('main.VAT');
        $scope.trVATRatio = $translate.instant('main.VATRATIO');
        $scope.trDiscount = $translate.instant('main.DISCOUNT');
        $scope.trVATDiscount = $translate.instant('main.VATDISCOUNT%');
        $scope.trIntegrationId = $translate.instant('main.INTEGRATIONID');
        $scope.trisAccounted = $translate.instant('main.ISACCOUNT');
        $scope.trGrandTotal = $translate.instant('main.GRANDTOTAL');
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.adddeliveryitem = $translate.instant('main.ADDDELIVERYITEM');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.refresh = $translate.instant('main.REFRESH');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.amount = $translate.instant('main.AMOUNT₺');
        $scope.vat = $translate.instant('main.VAT₺');
        $scope.vatdiscount = $translate.instant('main.VATDISCOUNT%');
        $scope.discount = $translate.instant('main.DISCOUNT₺');
        $scope.inventorydelivery = $translate.instant('main.INVENTORYDELIVERY');
        $scope.trSerino = $translate.instant('main.SERIAL');
        $scope.send = $translate.instant('main.SEND');        
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.SendNetsisDeliveryInvoice = function () {
        $scope.isSpinner = true;
        if ($scope.item.DocumentNumber) {
            data = 'test';
        }
        Restangular.one('netsis/senddeliveryinvoice').get({
            InventoryDeliveryInvoiceID: $stateParams.id,
        }).then(function (result) {
            $scope.isSpinner = false;
            toaster.pop('success',  $translate.instant('invantories.BillTransferred'), '');
            $location.path('app/accountingintegration/inventorydeliveries/list');
            //$location.path('app/inventory/inventorydeliveryinvoice/edit/' + $stateParams.id);
        }, function (response) {
            $scope.isSpinner = false;
            toaster.pop('Warning',$translate.instant('invantories.ProblemOccurred'), response.data.ExceptionMessage);
        });
    };
    $scope.InventoryDeliveryInvoiceID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('inventorydeliveryinvoice', $stateParams.id).
            get().then(function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
                $scope.InventoryDeliveryInvoiceID = restresult.id;
            })
    else {
        $scope.item = {};
    }
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                //$location.path('app/inventory/inventorydeliveryinvoice/list');
                toaster.pop('success',$translate.instant('invantories.Saved') ,$translate.instant('invantories.SuccessfullySaved'));
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'inventorydeliveryinvoice')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal($translate.instant('invantories.Saved'),$translate.instant('invantories.SuccessfullySaved'), "success");
                $location.path('app/inventory/inventorydeliveryinvoice/edit/' + resp.id);
            });
        }
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    };
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
                toaster.pop('Warning', "Error!", response);
            });
        }
    };
    $scope.store = [];
    $scope.loadEntitiesCache('cache/Store', 'store');
    $scope.item.DocumentTypeID = "0";
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
                toaster.pop('Warning', "Error", response.data.ExceptionMessage);
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
                    SweetAlert.swal( $translate.instant('invantories.Deleted'),  $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('/app/inventory/inventorydeliveryinvoice/list');
                });
            }
            else {
                SweetAlert.swal( $translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
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
            $scope.item.InvoiceDate = item;
        })
    };
    if (!$scope.item.InvoiceDate) {
        $scope.item.InvoiceDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.$on('UpdateInventoryDelivery', function (event, data) {
        $scope.item.Amount = data.Amount;
        $scope.item.VAT = data.VAT;
        $scope.item.Discount = data.Discount;
        $scope.item.GrandTotal = data.GrandTotal;
        //
        Restangular.restangularizeElement('', $scope.item, 'inventorydeliveryinvoice')
        $scope.item.put().then(function (resp) {
            $scope.item = Restangular.copy(resp);
        });
        //
    });
    $scope.GetInventoryDelivery = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/inventories/inventorydeliveryinvoicerelation.html',
            controller: 'inventorydeliveryinvoicerelationCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = {};
            for (var i = 0; i < item.length; i++) {
                Restangular.one('InventoryDelivery/assigntoinvoice').get({
                    InventoryDeliveryID: item[i].id,
                    InvoiceDocumentNumber: $scope.item.DocumentNumber,
                    InvoiceDate: $filter('date')($scope.item.InvoiceDate, 'yyyy-MM-dd'),
                }).then(function (result) {
                    Restangular.one('inventorydeliveryinvoice', $stateParams.id).
                        get().then(function (restresult) {
                            $scope.item = Restangular.copy(restresult);
                            idr.tableParams.reload();
                            $scope.$broadcast('inventorydeliveryinvoiceItemreload', "Add");
                        });                   
                }, function (response) {
                    idr.tableParams.reload();
                    toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        })
    };
    idr.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
        getData: function ($defer, params) {
            if ($stateParams.id != 'new') {
                Restangular.all('InventoryDeliveryInvoiceRelation').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: 'InventoryDeliveryInvoiceID=' + $stateParams.id
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        }
    });
    $scope.removeUnasSigned = function (SelectItem) {
        SelectItem.remove().then(function () {
            idr.tableParams.reload();
            $scope.$broadcast('inventorydeliveryinvoiceItemreload', "Remove");
            toaster.pop('error', $translate.instant('invantories.DataRemove'));
        }, function (response) {
            toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorydeliveryinvoiceeditCtrl");
    });
};
app.controller('inventorydeliveryinvoiceitemCtrl', inventorydeliveryinvoiceitemCtrl);
function inventorydeliveryinvoiceitemCtrl($scope, $modal, $filter, SweetAlert,$translate, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $element) {
    $rootScope.uService.EnterController("inventorydeliveryinvoiceitemCtrl");
    var idii = this;
    $scope.RelatedItems = [];
    $scope.item = {};
    $scope.SelectItem = function (id) {
        if ($scope.SelectedItem == id) {
            $scope.ShowDetail = !$scope.ShowDetail;
        }
        else
            $scope.ShowDetail = true;
        if ($scope.ShowDetail)
            $scope.SelectedItem = id;
    };
    var deregistration3 = $scope.$on('inventorydeliveryinvoiceItemreload', function (event, data) {
        idii.tableParams.reload();
        if (data == "Remove") {            
            $scope.$emit('UpdateInventoryDelivery', $scope.item); 
        }
        if (data == "Add") {
            $scope.$emit('UpdateInventoryDelivery', $scope.item); 
        }
    });
    idii.tableParams = new ngTableParams({
        page: 1,
        count: 100,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('inventorydeliveryinvoiceItem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: "InventoryDeliveryInvoiceID='" + $stateParams.id + "'",
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
                $scope.item.Amount = 0;
                $scope.item.VAT = 0;
                $scope.item.Discount = 0;
                for (var i = 0; i < items.length; i++) {
                    $scope.item.Amount += items[i].UnitCount * items[i].UnitPrice;
                    $scope.item.VAT += items[i].VAT;
                    $scope.item.Discount += items[i].Discount;
                }
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.GetInventoryUnitPrice = function (rowform, item) {
        Restangular.one('inventorydelivery', $stateParams.id).get().then(function (restresult) {
            Restangular.one('inventoryunit/price').get({
                InventoryUnitID: rowform.$data.InventoryUnitID,
                StoreID: $rootScope.user.StoreID,
                ForDate: restresult.DeliveryDate
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
    //$scope.ShowObject = function (Container, idName, idvalue, resName) {
    //    for (var i = 0; i < $scope[Container].length; i++) {
    //        if ($scope[Container][i][idName] == idvalue)
    //            return $scope[Container][i][resName];
    //    }
    //    return idvalue || 'Not set';
    //};
    $scope.ShowObjectUnit = function (Container, idName, idvalue, resName) {
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
    $scope.inventoryunitstoshow = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunitstoshow');
    $scope.saveData = function (data) {
        data.Amount = data.UnitPrice * data.UnitCount;
        data.VAT = data.UnitPrice * data.UnitCount * $scope.GetInventoryVAT(data.InventoryUnitID);
        data.InventoryUnit = $scope.ShowObjectUnit('inventoryunitstoshow', 'id', data.InventoryUnitID, 'Inventory');
        data.GetVat = $scope.GetInventoryVAT(data.InventoryUnitID) * 100
        if (data.restangularized) {
            data.put().then(function (res) {
                $scope.$emit('UpdateInventoryDelivery', $scope.item);
                toaster.pop('success',$translate.instant('invantories.Updated') ,$translate.instant('invantories.Updatedapplied') );
            });
        } else {
            Restangular.restangularizeElement('', data, 'inventorydeliveryinvoiceItem')
            data.post().then(function (res) {
                $scope.$emit('UpdateInventoryDelivery', $scope.item);
                toaster.pop('success',$translate.instant('invantories.Saved') ,$translate.instant('invantories.Savedserver'));
            });
        }
    };
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
        if (!idii.tableParams.data[idii.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(idii.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
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
           confirmButtonText:    $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:   $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (idii.tableParams.data[index].fromServer) {
                    idii.tableParams.data[index].remove();
                }
                idii.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'),$translate.instant('invantories.RecordDeleted'));
            }
        });
        idii.tableParams.reload();
    };
    $scope.cancelremove = function (index) {
        if (idii.tableParams.data[index].fromServer) {
            idii.tableParams.data[index].remove();
        }
        idii.tableParams.data.splice(index, 1);
    };
    $scope.ShowGrantTotal = function () {
        $scope.item.GrandTotal = $scope.item.Amount + $scope.item.VAT - $scope.item.Discount;
        return $scope.item.GrandTotal = $scope.item.Amount + $scope.item.VAT - $scope.item.Discount;
        $scope.item.Amount + $scope.item.Amount - $scope.item.Discount;
    };
    $scope.ShowVATDiscoun = function () {
        $scope.item.VATDiscount = ($scope.item.Discount * 100) / ($scope.item.Amount + $scope.item.VAT);
    };
    $scope.SetDiscount = function () {
        $scope.$emit('UpdateInventoryDelivery', $scope.item);
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
        idii.tableParams.data.push({ InventoryDeliveryInvoiceID: $stateParams.id, UnitPrice: 0, VATDiscount: 0, });
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
        deregistration3();
        $element.remove();
        $rootScope.uService.ExitController("inventorydeliveryinvoiceitemCtrl");
    });
};
