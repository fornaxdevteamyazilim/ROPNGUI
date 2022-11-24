app.controller('inventorydeliveryeditCtrl', inventorydeliveryeditCtrl);
function inventorydeliveryeditCtrl($scope, $filter, SweetAlert, Restangular, NG_SETTING, $http, $q, ngTableParams, $modal, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorydeliveryeditCtrl");
    var de = this;
    $scope.item = {};
    $scope.item.Amount = 0;
    $scope.item.VAT = 0;
    $scope.item.Discount = 0;
    $scope.item.GrandTotal = 0;
    userService.userAuthorizated();
    $scope.item = {};
    if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.MemberID == "111679600561") {
        $scope.ShowInventoryInvoiceButton = true;
    }
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
        $scope.trEnteredUnitPrice = $translate.instant('main.ENTEREDUNITPRICE');
        $scope.trVat = $translate.instant('main.VAT');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.documentnumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.documenttype = $translate.instant('main.DOCUMENTTYPE');
        $scope.companyy = $translate.instant('main.COMPANY');
        $scope.repository = $translate.instant('main.REPOSITORY');
        $scope.note = $translate.instant('main.NOTE');
        $scope.paymentterm = $translate.instant('main.PAYMENTTERM');
        $scope.description = $translate.instant('main.DESCRIPTION');
        $scope.datetime = $translate.instant('main.DATETIME');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.adddeliveryitem = $translate.instant('main.ADDDELIVERYITEM');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.refresh = $translate.instant('main.REFRESH');
        $scope.amount = $translate.instant('main.AMOUNT₺');
        $scope.vat = $translate.instant('main.VAT₺');
        $scope.vatdiscount = $translate.instant('main.VATDISCOUNT%');
        $scope.discount = $translate.instant('main.DISCOUNT₺');
        $scope.grandtotal = $translate.instant('main.GRANDTOTAL');
        $scope.assigntoinvoice = $translate.instant('main.ASSIGNTOINVOICE');
        $scope.send = $translate.instant('main.SEND');
        $scope.ispaid = $translate.instant('main.ISPAID');
        $scope.trNotes = $translate.instant('main.NOTE');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.SendNetsisDeliveryInvoice = function () {
        $scope.isSpinner = true;
        Restangular.one('netsis/senddelivery').get({
            InventoryDeliveryID: $stateParams.id,
        }).then(function (result) {
            $scope.isSpinner = false;
            toaster.pop('success', $translate.instant('invantories.BillTransferred'), '');
            $location.path('app/accountingintegration/inventorydeliveryinvoice/list');
        }, function (response) {
            $scope.isSpinner = false;
            toaster.pop('Warning', $translate.instant('invantories.ProblemOccurred'), response.data.ExceptionMessage);
        });
    };
    $scope.InventoryDeliveryID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('inventorydelivery', $stateParams.id).
            get().then(function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
                $scope.InventoryDeliveryID = restresult.id;

            })
    else {
        $scope.item = {};
    }

    // $scope.SaveData = function () {
    //     $scope.SaveButtonActive = false;
    //     if ($scope.item.restangularized && $scope.item.id) {
    //         $scope.item.put().then(function (resp) {
    //             swal($translate.instant('invantories.Updated'),$translate.instant('invantories.Updated'), "success");
    //             $rootScope.allowNavigation();
    //             $location.path('app/inventory/inventorydeliveries/list');
    //             $scope.SaveButtonActive = true;
    //         }, function (response) {
    //             toaster.pop('warning', "Error!!!", response.data.ExceptionMessage);
    //         });
    //     }
    //     else {
    //         Restangular.restangularizeElement('', $scope.item, 'inventorydelivery')
    //         $scope.item.post().then(function (resp) {
    //             $scope.item.id = resp.id;
    //             swal("Saved!", $translate.instant('invantories.SuccessfullySaved'), "success");
    //             $location.path('app/inventory/inventorydeliveries/edit/' + resp.id);
    //             $rootScope.preventNavigation();
    //             $scope.SaveButtonActive = true;
    //         }, function (response) {
    //             toaster.pop('error', "Error!!!", response.data.ExceptionMessage);
    //         });
    //     }
    // };
    // $scope.SaveData = function () {
    //     if ($scope.item.restangularized && $scope.item.id) {
    //         $scope.item.put().then(function (resp) {
    //             toaster.pop('success', $translate.instant('invantories.Updated'), $translate.instant('invantories.Updatedapplied'));
    //            // location.href = '#/app/inventory/inventorydeliveries/list';
    //         });
    //     }
    //     else {
    //         Restangular.restangularizeElement('', $scope.item, 'inventorydelivery')
    //         $scope.item.post().then(function (resp) {
    //             toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Savedserver'));
    //            // location.href = '#/app/inventory/inventorydeliveries/list';
    //         });
    //     }
    // };
    $scope.SaveData = function () {
        $scope.isWaiting = true;
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.ShowObject = true;
            $scope.item.put().then(function (resp) {
                $rootScope.allowNavigation();
                $location.path('app/inventory/inventorydeliveries/list');
              
            },
                function (response) {
                    $scope.ShowObject = false; 
                    $scope.isWaiting = false;    
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
        } else {
            $scope.ShowObject = true;

            Restangular.restangularizeElement('', $scope.item, 'inventorydelivery')
            $scope.item.post().then(function (resp) {
                $location.path('app/inventory/inventorydeliveries/edit/' + resp.id);
                $rootScope.allowNavigation();
            }, function (response) {
                $scope.ShowObject = false;    
                $scope.isWaiting = false; 
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);

            });
        }
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    };
    de.search = '';
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    }
    $scope.documenttypes = [];
    $scope.loadEntities('enums/DocumentType', 'documenttypes');
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadCompany();
    $scope.repositories = [];
    $scope.loadrepository = function () {
        if (!$scope.repositories.length) {
            Restangular.all('repository').getList({
                pageNo: 1,
                pageSize: 1000,
                //search: "StoreID='" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                if (result && result.length > 0) {
                    $scope.repositories = result;
                    $scope.item.RepositoryID = result[0].id;
                }
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadrepository();
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: $translate.instant('invantories.Sure'),
            text: $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('invantories.confirmButtonText'),
            cancelButtonText: $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal($translate.instant('invantories.Deleted'), $translate.instant('invantories.RecordDeleted'), "success");
                    $location.path('/app/inventory/inventorydeliveries/list');
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
            $scope.item.DeliveryDate = item;

        })
    };
    if (!$scope.item.DeliveryDate) {
        $scope.item.DeliveryDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.CreatInvoice = function (item) {
        Restangular.one('InventoryDelivery/assigntoinvoice').get({
            InventoryDeliveryID: item.id,
            InvoiceDocumentNumber: (item.DocumentNumber) ? item.DocumentNumber : '',
            InvoiceDate: item.DeliveryDate
        }).then(function (result) {
            $location.path('app/inventory/inventorydeliveryinvoice/edit/' + result.id);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.ShowGrantTotal = function () {
        $scope.item.GrandTotal = $scope.item.Amount + $scope.item.VAT - $scope.item.Discount;
        return $scope.item.GrandTotal = $scope.item.Amount + $scope.item.VAT - $scope.item.Discount;
        $scope.item.Amount + $scope.item.Amount - $scope.item.Discount;
    };
    $scope.SetDiscount = function () {
        Restangular.restangularizeElement('', $scope.item, 'inventorydelivery')
        $scope.item.put().then(function (resp) {
            $scope.item = Restangular.copy(resp);
        });
    };
    $scope.$on('UpdateInventoryDelivery', function (event, data) {
        $scope.item.Amount += data.Amount;
        $scope.item.VAT += data.VAT;
        $scope.item.Discount += data.Discount;
        $scope.item.GrandTotal += data.GrandTotal;
        Restangular.restangularizeElement('', $scope.item, 'inventorydelivery')
        $scope.item.put().then(function (resp) {
            $scope.item = resp;
        });
    });


    // app.controller('inventorydeliveryitemCtrl', inventorydeliveryitemCtrl);
    // function inventorydeliveryitemCtrl($scope, $modal, $filter, SweetAlert,NG_SETTING, $http,$q, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $element,$translate) {
    //     $rootScope.uService.EnterController("inventorydeliveryitemCtrl");
    //     var idi = this;
    //     $scope.item = {};
    //     idi.tableParams = new ngTableParams({
    //         page: 1,
    //         count: 100,
    //         sorting: {
    //         }
    //     },{
    //         getData: function ($defer, params) {
    //             Restangular.all('inventorydeliveryitem').getList({
    //                 pageNo: params.page(),
    //                 pageSize: params.count(),
    //                 search: "InventoryDeliveryID='" + $stateParams.id + "'",
    //                 sort: params.orderBy()
    //             }).then(function (items) {
    //                 params.total(items.paging.totalRecordCount);
    //                 $defer.resolve(items);
    //                 $scope.item.Amount = 0;
    //                 $scope.item.VAT = 0;
    //                 $scope.item.Discount = 0;
    //                 for (var i = 0; i < items.length; i++) {
    //                     $scope.item.Amount += items[i].Amount;
    //                     $scope.item.VAT += items[i].VAT;
    //                     $scope.item.Discount += items[i].Discount;
    //                 }
    //             }, function (response) {
    //                 toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    //             });
    //         }
    //     });

    var params = {
        page: 1,
        count: 10000,
        search: "InventoryDeliveryID='" + $stateParams.id + "'",
    };
    $http.get(NG_SETTING.apiServiceBaseUri + "/api/inventorydeliveryitem", { params: params })
        .then(function (result) {
            $scope.item.items = result.data.Items;
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.option("dataSource", $scope.item.items);
        }, function (response) {
            return $q.reject("Data Loading Error");
        });
    GetInventoryUnitPrice = function (inventoryUnitID, rowData) {
        Restangular.one('inventoryunit/price').get({
           // InventoryDeliveryID: InventoryDeliveryID,
            InventoryUnitID: inventoryUnitID,
            StoreID: $scope.item.StoreID,
            ForDate: $scope.item.DateTime
        }).then(function (result) {
            if (result && result) {
                console.log("GetInventoryUnitPrice result:" + result);
                rowData.UnitPrice = result;
            }
            else {
                console.log("GetInventoryUnitPrice result not found!");
                rowData.UnitPrice = 0;
            }
        }, function (response) {
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.dataGridOptions = {
        dataSource: $scope.item.items,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        keyExpr: "id",
        showBorders: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        showBorders: true,
        //noDataText:  $translate.instant('InventoryRequirmentItem.Calculatingrequirments'),
        paging: {
            enabled: false
        },
        editing: {
            mode: "inline",
            allowAdding: true, //inventorydeliveryItem_add
            allowUpdating: true, //inventorydeliveryItem_update
            allowDeleting: ($rootScope.user.restrictions.inventorydeliveryItem_delete == 'Enable'), //inventorydeliveryItem_delete
            allowInserting: ($rootScope.user.restrictions.inventorydeliveryItem_insert == 'Enable') //inventorydeliveryItem_insert
        },
        columns: [

            //{ caption: $translate.instant('inventorydeliveryItem.InventoryUnit'), dataField: "InventoryUnit", dataType: "string", allowEditing: false, visibleIndex: 1 },

            {
                dataField: "InventoryUnitID", caption: $translate.instant('inventorydeliveriesedit.InventoryUnit'), //fixed: true,width: 200,    
                lookup: {
                    valueExpr: "InventoryUnitID",
                    displayExpr: "InventoryUnitName",
                    searchMode: "contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "InventoryUnitID",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryUnits"
                        }),
                        sort: "InventoryUnitName",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    },

                },
                setCellValue: function (rowData, value) {
                    return Restangular.one('inventoryunit/price').get({
                        InventoryDeliveryID: $stateParams.id,
                        InventoryUnitID: value,
                        StoreID: $scope.item.StoreID,
                        ForDate: $scope.item.DateTime
                    }).then(function (result) {
                        rowData.InventoryUnitID = value;
                        //data.VAT = data.UnitPrice * data.UnitCount * $scope.GetInventoryVAT(data.InventoryUnitID);
                        //data.GetVat = $scope.GetInventoryVAT(data.InventoryUnitID) * 100;
                        if (result && result) {
                            console.log("GetInventoryUnitPrice result:" + result);
                            rowData.UnitPrice = result;
                        }
                        else {
                            console.log("GetInventoryUnitPrice result not found!");
                            rowData.UnitPrice = 0;
                        }
                    }, function (response) {
                        toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                    });
                },
            },
            {
                caption: $translate.instant('inventorydeliveriesedit.VAT'), dataField: "VAT", dataType: "number", format: { type: "fixedPoint", precision: 2 }, allowEditing: false, visibleIndex: 2,
                calculateCellValue: function (data) { return data.VAT = data.UnitPrice * data.UnitCount * $scope.GetInventoryVAT(data.InventoryUnitID); },
            },
            {
                caption: $translate.instant('inventorydeliveriesedit.UnitCount'), dataField: "UnitCount", dataType: "number", format: { type: "fixedPoint", precision: 0 }, allowEditing: true, visibleIndex: 2,


            },
            {
                caption: $translate.instant('inventorydeliveriesedit.Notes'), dataField: "Notes", dataType: "string", allowEditing: true, visibleIndex: 2,


            },
            { caption: $translate.instant('inventorydeliveriesedit.UnitPrice'), dataField: "UnitPrice", dataType: "number", format: { type: "fixedPoint", precision: 2 }, displayFormat: "%{0}", allowEditing: false, visibleIndex: 3, },
            { caption: $translate.instant('inventorydeliveriesedit.Total'), dataField: "Total", calculateCellValue: function (data) { return data.UnitCount * data.UnitPrice; }, allowEditing: false, format: { type: "fixedPoint", precision: 2 }, visibleIndex: 4 },
        ],
        summary: {
            totalItems: [
                { column: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "VAT", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                //{ name: "UnitCustom", showInColumn: "UnitCustom", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                //{ name: "UnitCustom", showInColumn: "UnitCustom", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "Total", showInColumn: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "VAT", showInColumn: "VAT", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
        },
        // onContentReady(e) {
        //     document.querySelector('.dx-datagrid-rowsview').before(document.querySelector('.dx-datagrid-total-footer'));
        //     }
        export: {
            enabled: true,
            fileName: "inventorydelivery",
        }
    };
    $scope.GetInventoryUnitFreePrice = function (InventoryUnitID) {
        Restangular.one('inventoryunit', InventoryUnitID).get().then(function (restresult) {
            if (restresult.EnableFreePrice == true) {
                $scope.EditableInventoryUnitPrice = true;
            }
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.loadEntities2 = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 100000,
                //search: "factor = 1",
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesInventoryUnits = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 100000,
                //search: "factor = 1",
            }).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].isActiveValue == true) {
                        $scope[Container].push(result[i]);
                    }
                }
                //$scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    // $scope.GetInventoryUnitsByDelivery = function (CompanyID) {
    //     Restangular.one('inventoryunit/delivery').get({
    //         DeliveryID: $stateParams.id
    //     }).then(function (result) {
    //         $scope.inventoryunits = result;
    //     }, function (response) {
    //         toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    //     });
    // };
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    //$scope.loadEntitiesInventoryUnits('inventoryunit', 'inventoryunits');
    //$scope.GetInventoryUnitsByDelivery();
    $scope.inventoryunitstoshow = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunitstoshow');
    // $scope.saveData = function (data) {
    //     if (data.EnteredUnitPrice) {
    //         data.UnitPrice = data.EnteredUnitPrice;
    //     }
    //     data.Amount = data.UnitPrice * data.UnitCount;
    //     data.VAT = data.UnitPrice * data.UnitCount * $scope.GetInventoryVAT(data.InventoryUnitID);
    //     data.InventoryUnit = $scope.ShowObjectUnit('inventoryunitstoshow', 'id', data.InventoryUnitID, 'Inventory');
    //     data.GetVat = $scope.GetInventoryVAT(data.InventoryUnitID) * 100
    //     if (data.restangularized) {
    //         data.put().then(function (res) {
    //             $scope.$emit('UpdateInventoryDelivery', $scope.item);
    //             toaster.pop('success', $translate.instant('invantories.Updated'),$translate.instant('invantories.Updatedapplied'));
    //         });
    //     } else {
    //         Restangular.restangularizeElement('', data, 'inventorydeliveryitem')
    //         data.post().then(function (res) {
    //             $scope.$emit('UpdateInventoryDelivery', $scope.item);
    //             toaster.pop('success', $translate.instant('invantories.Saved'),$translate.instant('invantories.Savedserver'));
    //         });
    //     }
    // };
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
        if (!idi.tableParams.data[idi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(idi.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('invantories.Sure'),
            text: $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('invantories.confirmButtonText'),
            cancelButtonText: $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (idi.tableParams.data[index].fromServer) {
                    idi.tableParams.data[index].remove();
                }
                $scope.item.Amount = -1 * (idi.tableParams.data[index].Amount)
                $scope.$emit('UpdateInventoryDelivery', $scope.item);
                idi.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('invantories.RecordDeleted'));
            }
        });
        idi.tableParams.reload();
    };
    $scope.cancelremove = function (index) {
        if (idi.tableParams.data[index].fromServer) {
            idi.tableParams.data[index].remove();
        }
        idi.tableParams.data.splice(index, 1);
    };
    $scope.GetInventoryVAT = function (InventoryUnitID) {
        if (InventoryUnitID && $scope.inventories.length) {
            var SelectInventory = $filter('filter')($scope.inventoryunitstoshow, { id: InventoryUnitID });
            var selected = $filter('filter')($scope.inventories, { id: SelectInventory[0] });
            return selected.length ? selected[0].VATRatio : 0;
        } else {
            return 0;
        }
    };
    $scope.addItem = function () {
        $scope.EditableInventoryUnitPrice = false;
        idi.tableParams.data.push({ InventoryDeliveryID: $stateParams.id, UnitPrice: 0, VATDiscount: 0, });
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
    // $scope.$on('$destroy', function () {
    //     $element.remove();
    //     $rootScope.uService.ExitController("inventorydeliveryitemCtrl");
    // });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorydeliveryeditCtrl");
    });
};
app.directive('replacecomma', function () {
    return {
        require: 'ngModel',
        link: function (scope, $translate, element, attrs, ngModelCtrl) {
            scope.$watch(attrs.ngModel, function (newVal) {
                if (newVal !== undefined && newVal !== null) {
                    ngModelCtrl.$setViewValue(String(newVal).replace(/,/g, '.'));
                    element.val(String(newVal).replace(/,/g, '.'));
                }
            })

        }
    }
});
