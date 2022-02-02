'use strict';
app.controller('inventorypurchaselistCtrl', inventorypurchaselistCtrl);
function inventorypurchaselistCtrl($rootScope, $scope, $modal, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element, userService, $filter, $stateParams, $location, NG_SETTING, $http, localStorageService) {
    $rootScope.uService.EnterController("inventorypurchaselistCtrl");
    userService.userAuthorizated();
    var ip = this;
    $scope.objectType = 'inventorypurchase';
    $scope.SelectedItem = null;
    ip.search = '';
    $scope.InventoryPurchaseApprovalData = [];
    if (userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("DRIVER") || userService.userIsInRole("STOREKITCHENUSER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STOREUSER")) {
        $scope.addnewPurchase = false;
    } else {
        $scope.addnewPurchase = true;
    }
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorypurchase/edit/' + $scope.SelectedItem;
    };
    $scope.translate = function () {
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trDeliveryDate = $translate.instant('main.DELIVERYDATE');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE')
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trEmailConfirmed = $translate.instant('main.EMAILCONFIRMED');
        $scope.trYes = $translate.instant('main.YES');
        $scope.trNo = $translate.instant('main.NO');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trisSended = $translate.instant('main.PURCHASEISSENDED');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ip.tableParams.data[ip.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ip.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({ Calculate: false }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (ip.search && ip.search.length > 0) {
            result.push("Description like '%" + ip.search + "%'");
        }
        if (userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER")) {
            result.push("StoreID =" + $rootScope.user.StoreID);
        }
        if (userService.userIsInRole("AREAMANAGER")) {
            var storesID = {}
            for (var i = 0; i < $rootScope.user.userstores.length; i++) {
                if (storesID.length > 0) {
                    storesID = storesID + $rootScope.user.userstores[i].id + ',';
                } else {
                    storesID = $rootScope.user.userstores[i].id + ',';
                }
            }
            var data = storesID.substring(0, storesID.length - 1);
            result.push("StoreID in (" + data + ")");
        }
        return result;
    };
    $scope.resetlayout = $translate.instant('main.FILTERRESET');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    }; 
    var InventorySupplyStates = {
        store: new DevExpress.data.CustomStore({
            key: "Value",
            load: function () {
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/enums/InventorySupplyState")
                    .then(function (response) {
                        return {
                            data: response.data,
                            totalCount: 10
                        };
                    }, function (response) {
                        return $q.reject("Data Loading Error");
                    });
            }
        }),
        sort: "Value"
    }
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryPurchases",
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token
                    };
                }
            }
        }),
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
        // stateStoring: {
        //     enabled: true,
        //     type: "custom",
        //     customLoad: function () {
        //         return $scope.params.gridState;
        //     },
        //     customSave: function (state) {
        //         $scope.params.gridState = state;
        //     }
        // },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "Inv-Purc-list-Storage"
        },
        columns: [
            { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/inventory/inventorypurchase/edit/' + e.row.data.id; } }] },
            { dataField: "id", dataType: "number", visible: false },
            {
                caption: $translate.instant('inventorypurchase.CompanyID'), dataField: "CompanyID", dataType: "string",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxcompanies"
                        }),
                        sort: "Name"
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                }, visibleIndex: 1
            },
            {
                caption: $translate.instant('inventorypurchase.StoreID'), dataField: "StoreID", dataType: "string",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    searchMode:"contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore" 
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }  
                }, visibleIndex: 2
            },
            { caption: $translate.instant('inventorypurchase.DateTime'), dataField: "DateTime", alignment: "right", width: 100, dataType: "date", format: 'dd.MM.yyyy', visibleIndex: 3, sortIndex: 0, sortOrder: "desc" },
            { caption: $translate.instant('inventorypurchase.DeliveryDate'), dataField: "DeliveryDate", alignment: "right", width: 100, dataType: "date", format: 'dd.MM.yyyy', visibleIndex: 4 },
            { caption: $translate.instant('inventorypurchase.Amount'), dataField: "Amount", dataType: "number", format: { type: "fixedPoint", precision: 2 }, visibleIndex: 5 },
            {
                caption: $translate.instant('inventorypurchase.InventorySupplyState'), dataField: "InventorySupplyState", width: 70, dataType: "string",
                lookup: {
                    valueExpr: "Value",
                    displayExpr: "Name",
                    dataSource: InventorySupplyStates,
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                }, visibleIndex: 6
            },
            { caption: $translate.instant('inventorypurchase.Description'), dataField: "Description", dataType: "string", visibleIndex: 7 },
            {
                caption: $translate.instant('inventorypurchase.isSended'), dataField: "isSended", width: 60, dataType: "string",
                calculateCellValue: function (item) {
                    return (item.isSended && "evet" || "hayır")
                }, visibleIndex: 8
            },
            { caption: $translate.instant('inventorypurchase.Notes'), dataField: "Notes", dataType: "string", visibleIndex: 9 },


        ],
        export: {
            enabled: true,
            fileName: "inventorypurchase",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                if (gridCell.rowType === 'data') {
                    if (gridCell.data.Delta === true) {
                        options.font.bold = true;
                        options.backgroundColor = '#FFBB00';
                    }
                }
            }
        },
        scrolling: { mode: "virtual" },
        height: 600,
        paging: {
            enabled: true
        },
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorypurchaselistCtrl");
    });
};
