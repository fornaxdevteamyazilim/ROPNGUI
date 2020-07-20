﻿'use strict';
app.controller('inventorytransactionsCtrl', inventorytransactionsCtrl);
function inventorytransactionsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $timeout, Excel, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q, localStorageService) {
    $rootScope.uService.EnterController("inventorytransactionsCtrl");
    $scope.Time = ngnotifyService.ServerTime();

    if ($rootScope.user.userstores && $rootScope.user.userstores.length > 1) {
        $scope.selectStore = true;
        $scope.StoreID = '';
    }
    else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: new Date(),
            labelLocation: "top", // or "left" | "right"   
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: new Date(),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
        }
    };
    $scope.VeiwHeader = {};
    $scope.reportButtonOptions = {
        text: "Get Data",
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
        }
    };
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#sales").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    $scope.StoreID;
    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var params = {
                StartDate: $scope.DateRange.fromDate.value,
                EndDate: $scope.DateRange.toDate.value,
                StoreId: $scope.StoreID,
                RepositoryID: '',
                InventoryGroupTagID: ($scope.TagData) ? $scope.TagData.id : '',
                TransactionType: ($scope.TransactionType) ? $scope.TransactionType : '',
                InventoryID: ($scope.InventoryID) ? $scope.InventoryID : ''
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/reports/inventorytransactions", { params: params })
                .then(function (response) {
                    if (response.data)
                        for (var i = 0; i < response.data.length; i++) {
                            response.data[i].Amount = response.data[i].UnitCount * response.data[i].UnitPrice;
                            response.data[i].id = i;
                        }
                    return {
                        data: response.data,
                        totalCount: 10
                    };
                }, function (response) {
                    return $q.reject("Data Loading Error");
                });
        }
    });
    $scope.dataGridOptions = {
        dataSource: store,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        //keyExpr: "id",
        showBorders: true,
        //selection: {
        //    mode: "single"
        //},
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        grouping: { autoExpandAll: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            //{ dataField: "id", dataType: "number"},
            { dataField: "TransactionDate", dataType: "Date" },
            { dataField: "Inventory.ItemCode", caption: "Code", dataType: "string" },
            { dataField: "Inventory.name", caption: "Inventory", dataType: "string" },
            { dataField: "InventoryUnit.name", caption: "UnitName", dataType: "string" },
            { caption: "Units", dataField: "UnitCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "Price", dataField: "UnitPrice", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "Amount", dataField: "Amount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Repository", dataType: "string" },
            //{ dataField: "Store", dataType: "string" },
            {
                dataField: "StoreID", caption: "Store",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "Store",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStoreWithRegions",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token,
                                        'Content-type': 'application/json'
                                    };
                                }
                            }
                        }),
                        sort: "Store",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            { dataField: "StoreType", caption: "StoreType" },
            { dataField: "TransactionType", dataType: "string" },
            { dataField: "TransactionDetail", dataType: "string" },
            { dataField: "InventoryGroup", dataType: "string" },
        ],
        summary: {
            totalItems: [{ column: "Inventory.name", summaryType: "count", displayFormat: "{0}" },
            { column: "Units", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            ],
        },
        export: {
            enabled: true,
            fileName: "InventoryTransactions",
        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.selectBox = {
        dataSourceUsage: {
            dataSource: new DevExpress.data.ArrayStore({
                data: $filter('orderBy')($rootScope.user.userstores, 'name'),
                key: "id"
            }),
            displayExpr: "name",
            valueExpr: "id",
            placeholder: "Select Store...",
            value: $rootScope.user.StoreID,
            bindingOptions: {
                value: "StoreID"
            }
        },
    };
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventorytransactionsCtrl");
    });
};
