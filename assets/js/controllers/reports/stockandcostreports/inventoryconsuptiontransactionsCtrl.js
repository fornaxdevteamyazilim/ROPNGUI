'use strict';
app.controller('inventoryconsuptiontransactionsCtrl', inventoryconsuptiontransactionsCtrl);
function inventoryconsuptiontransactionsCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q, localStorageService) {
    var ctrl = this;
    $scope.VeiwHeader = {};
    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            var gridDS = dataGrid.getDataSource();
            dataGrid.clearFilter();
            gridDS.filter(getFilter());
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
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    };
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: (new Date()).addDays(-2),
            labelLocation: "top", // or "left" | "right"  

        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: (new Date()).addDays(-1),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
        }
    };
    function getFilter() { //"and",["!",["OrderType","=",""]]
        var fdate = new Date($scope.DateRange.fromDate.value.getFullYear(), $scope.DateRange.fromDate.value.getMonth(), $scope.DateRange.fromDate.value.getDate());
        var tdate = new Date($scope.DateRange.toDate.value.getFullYear(), $scope.DateRange.toDate.value.getMonth(), $scope.DateRange.toDate.value.getDate());
        if ($scope.StoreID) {
            return [[["TransactionDate", ">=", fdate], "and", ["TransactionDate", "<=", $tdate]]];
        }
        else {
            var s;// = BuildUserStoresArray($rootScope.user.userstores);
            if (s)
                return [["TransactionDate", ">=", fdate], "and", ["TransactionDate", "<=", tdate], [s]];
            else
                return [["TransactionDate", ">=", fdate], "and", ["TransactionDate", "<=", tdate]];
        }
    };
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxInventoryConsuptionTransaction",
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token
                    };
                }
            }
        }),
        remoteOperations: { groupPaging: true },
        //filterValue: getFilter(),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: {
            visible: true
        },
        //filterPanel: { visible: true },
        headerFilter: {
            visible: true
        },
        grouping: {
            autoExpandAll: false
        },
        searchPanel: {
            visible: true
        },
        groupPanel: {
            visible: true
        },
        columnChooser: {
            enabled: false
        },
        columnFixing: {
            enabled: true
        },
        remoteOperations: true,
        columns: [
            { dataField: "id" },
            { dataField: "TransactionDate", caption: $translate.instant('InventoryConsuptionTransactions.TransactionDate'), dataType: "date", format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },
            {
                caption: $translate.instant('InventoryConsuptionTransactions.InventoryID'), dataField: "InventoryID",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/cache/Inventory",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token,

                                    };
                                }
                            }
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            {
                caption: $translate.instant('InventoryConsuptionTransactions.InventoryUnitID'), dataField: "InventoryUnitID",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/cache/InventoryUnit",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token,

                                    };
                                }
                            }
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            {
                caption: $translate.instant('InventoryConsuptionTransactions.RepositoryID'), dataField: "RepositoryID",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/cache/Repository",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {
                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token,

                                    };
                                }
                            }
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            {
                dataField: "InventoryConsuptionTypeID", dataType: "number", caption: $translate.instant('InventoryConsuptionTransactions.InventoryConsuptionTypeID '), format: { type: "fixedPoint", precision: 2 },
                lookup: {
                    valueExpr: "Value",
                    displayExpr: "Name",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            key: "Value",
                            load: function () {
                                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/enums/InventoryConsuptionType")
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
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                }
            },
            { dataField: "UnitCount", dataType: "number", caption: $translate.instant('InventoryConsuptionTransactions.UnitCount '), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "UnitPrice", dataType: "number", caption: $translate.instant('InventoryConsuptionTransactions.UnitPrice '), format: { type: "fixedPoint", precision: 2 } },
            {
                dataField: "OrderTypeID", dataType: "number", caption: $translate.instant('InventoryConsuptionTransactions.OrderType '), format: { type: "fixedPoint", precision: 2 },
                lookup: {
                    valueExpr: "Value",
                    displayExpr: "Name",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            key: "Value",
                            load: function () {
                                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/enums/OrderType")
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
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                }
            },
            // {
            //     dataField: "OrderTypeID", dataType: "number", caption: $translate.instant('InventoryConsuptionTransactions.OrderTypeID '), format: { type: "fixedPoint", precision: 2 },
            //     lookup: {
            //         valueExpr: "Value",
            //         displayExpr: "Name",
            //         dataSource: OrderTypes,
            //         calculateSortValue: function (data) {
            //             var value = this.calculateCellValue(data);
            //             return this.lookup.calculateCellValue(value);
            //         }
            //     }
            // },
            {
                dataField: "PromotionFiterID", dataType: "number", caption: $translate.instant('InventoryConsuptionTransactions.PromotionFiterID '), format: { type: "fixedPoint", precision: 2 },
                lookup: {
                    valueExpr: "Value",
                    displayExpr: "Name",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            key: "Value",
                            load: function () {
                                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/enums/InventoryConsuptionPromotionFiter")
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
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                }
            },
            {
                dataField: "OrderSourceID", dataType: "number", caption: $translate.instant('InventoryConsuptionTransactions.OrderSourceID '), format: { type: "fixedPoint", precision: 2 },
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: new DevExpress.data.CustomStore({
                            key: "id",
                            //loadMode: "raw",
                            load: function () {
                                // Returns an array of objects that have the following structure:
                                // { id: 1, name: "John Doe" }
                                //return $.getJSON(NG_SETTING.apiServiceBaseUri + "/api/ordersource");
                                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/ordersource")
                                    .then(function (response) {
                                        return {
                                            data: response.data.Items,
                                            totalCount: 10
                                        };
                                    }, function (response) {
                                        return $q.reject("Data Loading Error");
                                    });
                            }
                        }),
                        sort: "name"
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                }
            },
        ],
        summary: {
            totalItems: [{ column: "id", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "UnitCount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            //{ column: "UnitPrice", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "id", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "UnitCount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}",alignByColumn: true },
            
            ]
        },
        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (e.data.Delta === true) {
                    //e.rowElement.addClass('place');
                    e.rowElement.css({ 'font-weight': 'bold', 'background': '#ebb3af' });
                }
                //else {
                //    e.data.place = "";
                //}
            }
        },
        export: {
            enabled: true,
            fileName: "InventoryConsuptionTransactions",
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
        scrolling: {
            mode: "virtual"
        },
        height: 600
        //scrolling: {
        //    columnRenderingMode: "virtual"
        //},
        //paging: {
        //    enabled: false
        //}
    };

    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };

}