app.controller('inventorypurchaseeditCtrl', inventorypurchaseeditCtrl);
function inventorypurchaseeditCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element, userService, NG_SETTING, $http) {
    $rootScope.uService.EnterController("inventorypurchaseeditCtrl");
    var ipi = this;
    $scope.item = {};
    $scope.item.GrandTotal = 0;
    if (userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("DRIVER") || userService.userIsInRole("STOREKITCHENUSER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STOREUSER")) {
        $scope.addnewPurchaseItem = false;
    } else {
        $scope.addnewPurchaseItem = true;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.LoadInventorySpecificUnits = function (InvID) {
        $scope.inventoryunits = [];
        $scope.loadEntities('inventoryunit', 'inventoryunits', "InventoryID='" + InvID + "'");
    };
    $scope.saveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                toaster.pop('success', $translate.instant('invantories.Updated'), $translate.instant('invantories.Updatedapplied'));
                location.href = '#/app/inventory/inventorypurchase/list';
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'inventorypurchase')
            $scope.item.post().then(function (resp) {
                toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Savedserver'));
                location.href = '#/app/inventory/inventorypurchase/list';
            });
        }
    };
    // $scope.saveItem = function (data) {
    //     if (data.restangularized) {
    //         data.put().then(function (resp) {
    //             toaster.pop('success', $translate.instant('invantories.Updated'), $translate.instant('invantories.Updatedapplied'));
    //         });
    //     }
    //     else {
    //         data.InventoryPurchaseID = $scope.InventoryPurchaseID
    //         Restangular.restangularizeElement('', data, 'inventorypurchaseitem')
    //         data.post().then(function (resp) {
    //             toaster.pop('success', $translate.instant('invantories.Saved'), $translate.instant('invantories.Savedserver'));
    //         });
    //     }
    // };
    $scope.translate = function () {
        $scope.trInventory = $translate.instant('main.INVENTORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trTotal = $translate.instant('main.TOTAL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trApproved = $translate.instant('main.STATE');
        $scope.trApproveDate = $translate.instant('main.DATE');
        $scope.trUser = $translate.instant('main.USER');
        $scope.trApproveDate = $translate.instant('main.DATE');
        $scope.trOrderIndex = $translate.instant('main.ORDERINDEX');
        $scope.inventorypurchaseitem = $translate.instant('main.INVENTORYPURCHASEITEM');
        $scope.trEmailConfirmed = $translate.instant('main.EMAILCONFIRMED');
        $scope.trYes = $translate.instant('main.YES');
        $scope.trNo = $translate.instant('main.NO');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE');
        $scope.grandtotal = $translate.instant('main.GRANDTOTAL');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.creatDelivery = function () {
        Restangular.one('InventorySupply/createdelivery').get({
            InventoryPurchaseID: $stateParams.id
        }).then(function (restresult) {
            toaster.pop('success', $translate.instant('invantories.Saved'));
            location.href = '#/app/inventory/inventorydeliveries/edit/' + restresult.id;
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
    $scope.RepeatOrder = function () {
        Restangular.one('InventorySupply/sendinventorypurchase').get({
            InventoryPurchaseID: $stateParams.id
        }).then(function (restresult) {
            toaster.pop('success', $translate.instant('invantories.SENDAGAIN'));
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
    $scope.InventorySupplyState = function () {
        Restangular.one('InventorySupply/markpurchaseasundelivered').get({
            InventoryPurchaseID: $stateParams.id
        }).then(function (restresult) {
            toaster.pop('success', $translate.instant('invantories.itisapproved'));
            location.href = '#/app/inventory/inventorypurchase/list';
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
  

    $scope.CancelOrder = function (itemID) {
        SweetAlert.swal({
            title: $translate.instant('yemeksepetifile.CANCELORDER'),
            text: $translate.instant('yemeksepetifile.Areyousureyouwantcanceltheorder'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('yemeksepetifile.YesCanceled'),
            cancelButtonText: $translate.instant('yemeksepetifile.NoDontCancel'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                Restangular.one('InventorySupply/cancelinventorypurchase').get({
                    InventoryPurchaseID: $stateParams.id
                }).then(function (restresult) {
                    toaster.pop('success', $translate.instant('yemeksepetifile.CANCELORDERS'));
                }, function (response) {
                    toaster.pop('warning', "warning...", response.data.ExceptionMessage);
                });
            }
        });
    };
    $scope.checkInventoryDemandApproval = function (itemID, State) {
        Restangular.one('InventorySupply/approvepurchase').get({
            InventoryPurchaseApprovalID: itemID,
            toState: State
        }).then(function (restresult) {
            toaster.pop('success', $translate.instant('invantories.Saved'));
            $scope.tableParams.reload();
            $location.path('app/inventory/inventorypurchase/list');
        }, function (response) {
            toaster.pop('warning', "warning...", response.data.ExceptionMessage);
        });
    };
    $scope.getInventoryPurchaseApprovals = function () {
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
        }, {
            getData: function ($defer, params) {
                Restangular.all('InventoryPurchaseApproval').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "InventoryPurchaseID='" + $stateParams.id + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    };
    $scope.InventoryPurchaseID = $stateParams.id;
    if ($stateParams.id != 'new') {
        Restangular.one('inventorypurchase', $stateParams.id).get().then(function (restresult) {
            $scope.original = restresult;
            if (restresult.EmailConfirmed == true)
                restresult.EmailConfirmed = $scope.trYes;
            if (restresult.EmailConfirmed == false)
                restresult.EmailConfirmed = $scope.trNo;
            $scope.item = Restangular.copy(restresult);
        })
        $scope.getInventoryPurchaseApprovals()
    } else {
        $scope.item = {};
    }
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }



    var params = {
        page: 1,
        count: 10000,
        search: "InventoryPurchaseID='" + $scope.InventoryPurchaseID + "'"
    };
    $http.get(NG_SETTING.apiServiceBaseUri + "/api/InventoryPurchaseItem", { params: params })
        .then(function (result) {
            $scope.item.items = result.data.Items;
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.option("dataSource", $scope.item.items);
        }, function (response) {
            return $q.reject("Data Loading Error");
        });
    GetInventoryUnitPrice = function (inventoryUnitID, rowData) {
        Restangular.one('inventoryunit/price').get({
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
            allowAdding: ($rootScope.user.restrictions.InventoryPurchaseItem_add == 'Enable'), //InventoryPurchaseItem_add
            allowUpdating: ($rootScope.user.restrictions.InventoryPurchaseItem_update == 'Enable'), //InventoryPurchaseItem_update
            allowDeleting: ($rootScope.user.restrictions.InventoryPurchaseItem_delete == 'Enable'), //InventoryPurchaseItem_delete
            allowInserting: ($rootScope.user.restrictions.InventoryPurchaseItem_insert == 'Enable') //InventoryPurchaseItem_insert
        },
        columns: [

            //{ caption: $translate.instant('InventoryPurchaseItem.InventoryUnit'), dataField: "InventoryUnit", dataType: "string", allowEditing: false, visibleIndex: 1 },
            {
                dataField: "InventoryUnitID", caption: $translate.instant('InventoryPurchaseItem.InventoryUnit'), //fixed: true,width: 200,    
                lookup: {
                    valueExpr: "InventoryUnitID",
                    displayExpr: function (data) {
                        return "[" + data.ItemCode + "]" + data.InventoryUnitName;
                    },
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
                        InventoryUnitID: value,
                        StoreID: $scope.item.StoreID,
                        ForDate: $scope.item.DateTime
                    }).then(function (result) {
                        rowData.InventoryUnitID = value;
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
                caption: $translate.instant('InventoryPurchaseItem.UnitCount'), dataField: "UnitCustom", dataType: "number", format: { type: "fixedPoint", precision: 0 }, allowEditing: true, visibleIndex: 2,
                setCellValue: function (rowData, value, oldrow) {
                    rowData.UnitCustom = value;
                    rowData.Total = rowData.UnitCustom * oldrow.UnitPrice;
                },
            },
            { caption: $translate.instant('InventoryPurchaseItem.UnitPrice'), dataField: "UnitPrice", dataType: "number", format: { type: "fixedPoint", precision: 2 }, allowEditing: false, visibleIndex: 3, },
            { caption: $translate.instant('InventoryPurchaseItem.Total'), dataField: "Total", calculateCellValue: function (data) { return data.UnitCustom * data.UnitPrice; }, format: { type: "fixedPoint", precision: 2 }, visibleIndex: 4 },
        ],
        summary: {
            totalItems: [
                { column: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                //{ name: "UnitCustom", showInColumn: "UnitCustom", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                //{ name: "UnitCustom", showInColumn: "UnitCustom", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "Total", showInColumn: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
        },
        // onContentReady(e) {
        //     document.querySelector('.dx-datagrid-rowsview').before(document.querySelector('.dx-datagrid-total-footer'));
        //     }
        export: {
            enabled: true,
            fileName: "InventoryPurchase",
        }
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntities2 = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                //search: "factor = 1",
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
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

    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.companies = [];
    $scope.loadEntitiesCache('cache/company', 'companies');
    $scope.users = [];
    $scope.loadEntities('user', 'users');
    $scope.userroles = [];
    $scope.loadEntities('nguserrole', 'userroles');
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntities2('inventoryunit', 'inventoryunits');
    $scope.InventorySupplyStates = [];
    $scope.loadEntities('enums/InventorySupplyState', 'InventorySupplyStates');
    $scope.InventoryApproveStates = [];
    $scope.loadEntities('enums/InventoryApproveState', 'InventoryApproveStates');
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
                    $location.path('app/inventory/inventorypurchase/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
            }
        });
    };

    $scope.cancelremove = function (index) {
        if (ipi.tableParams.data[index].fromServer) {
            ipi.tableParams.data[index].remove();
        }
        ipi.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ipi.tableParams.data.push({ UnitCustom: 1, UnitPrice: 0 });
    };
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
            $scope.item.DateTime = item;
        })
    };
    $scope.deliverydatepopup = function (item) {
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
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorypurchaseeditCtrl");
    });
};
