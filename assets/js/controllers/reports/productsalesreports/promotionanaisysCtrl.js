'use strict';
app.controller('promotionanaisysCtrl', promotionanaisysCtrl);
function promotionanaisysCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q, userService) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    //debugger;
    //DevExpress.localization.locale("tr");
    //Globalize.locale(navigator.language);
    //DevExpress.localization.locale(navigator.language);
    //Globalize.locale('tr');
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
            value: (new Date()).addDays(1)
           
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: (new Date()).addDays(1)
        }
    };
    $scope.VeiwHeader = {};
    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
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
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    };
    function formatTime(cellInfo) {
        var sec = cellInfo.value * 60 * 1000;
        var dateObj = new Date(sec);
        var hours = dateObj.getUTCHours();
        var minutes = dateObj.getUTCMinutes();
        var seconds = dateObj.getSeconds();
        var timeString = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
        return (cellInfo.value) ? timeString : "-";
    };
    var store = new DevExpress.data.CustomStore({
        key: "StoreID",
        load: function (loadOptions) {
            var params = {
                fromDate: $scope.DateRange.fromDate.value,
                toDate: $scope.DateRange.toDate.value
                
            };
            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/promotionanaisysreport", { params: params })
                .then(function (response) {
                    return {
                        data: response.data,
                        totalCount: 10
                    };
                }, function (response) {
                    return $q.reject("Data Loading Error");
                });
        },
        
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
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-promotionanaisys-storing"
        },
        groupPanel: { visible: true },
        grouping: { autoExpandAll: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            { caption: $translate.instant('promotionanaisys.Region'), dataField: "RegionManager", dataType: "string", visible: false },
            { caption: $translate.instant('promotionanaisys.Store'), dataField: "Store", dataType: "string", fixed: true },
            //{ caption: "Net Sales", dataField: "Sales", dataType: "number", format: "#,##0.00₺" },
            { caption: $translate.instant('promotionanaisys.StoreType'), dataField: "StoreType", dataType: "string", visible: false },// fixed: true ,groupIndex: 0 },
            { caption: $translate.instant('promotionanaisys.StoreFilter'), dataField: "StoreFilterType", dataType: "string", visible: false },// fixed: true ,groupIndex: 0 },
            { caption: $translate.instant('promotionanaisys.SalesNoDiscount'), dataField: "TotalSalesNoDiscount", dataType: "number", format: { type: "fixedPoint", precision: 2 }, visible: false },// fixed: true ,groupIndex: 0 },
            { caption: $translate.instant('promotionanaisys.TotalSales'), dataField: "TotalSales", dataType: "number", format: { type: "fixedPoint", precision: 2 }, visible: false },// fixed: true ,groupIndex: 0 },
            { caption: $translate.instant('promotionanaisys.TotalNetSales'), dataField: "TotalNetSales", dataType: "number", format: { type: "fixedPoint", precision: 2 }, visible: false },// fixed: true ,groupIndex: 0 },
            { caption: $translate.instant('promotionanaisys.OrderType'), dataField: "OrderType", dataType: "string" },
            { caption: $translate.instant('promotionanaisys.OrderSource'), dataField: "OrderSource", dataType: "string" },
            { caption: $translate.instant('promotionanaisys.ProductName'), dataField: "ProductName", dataType: "string" },
            { caption: $translate.instant('promotionanaisys.ChildName'), dataField: "ChildName", dataType: "string" },
            { caption: $translate.instant('promotionanaisys.Category'), dataField: "ProductCategory", dataType: "string" },
            { caption: $translate.instant('promotionanaisys.Count'), dataField: "ItemCount", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
            { caption: $translate.instant('promotionanaisys.TotalNetAmount'), dataField: "TotalAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('promotionanaisys.Cost'), dataField: "Cost", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('promotionanaisys.TotalQuantity'), dataField: "TotalQuantity", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
            { caption: $translate.instant('promotionanaisys.TotalCost'), dataField: "TotalCost", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('promotionanaisys.Ratio'), dataField: "Ratio", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: $translate.instant('promotionanaisys.OrdersCount'), dataField: "OrdersCount", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
        ],
        summary: {
            totalItems: [{ column: "StoreID", summaryType: "count", displayFormat: "{0}" },
            { column: "Count", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            //{ column: "TotalSalesNoDiscount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            //{ column: "TotalNetSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            { column: "TotalQuantity", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            { name: "Ratio", showInColumn: "Ratio", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "RatioNet", showInColumn: "Ratio", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "Net:{0}" },
            { column: "OrdersCount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "StoreID", summaryType: "count", displayFormat: "{0}" },
                { column: "Count", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
                // { column: "TotalSalesNoDiscount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
                // { column: "TotalNetSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
                { column: "TotalQuantity", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
                { name: "Ratio", showInColumn: "Ratio", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "OrdersCount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "Ratio") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.Cost = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.totalValue + options.value.TotalAmount;
                            options.Cost = options.Cost + options.value.TotalCost;
                            break;
                        case "finalize":
                            options.totalValue = options.Cost / options.totalValue;
                            break;
                    }
                }
                if (options.name === "RatioNet") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.Cost = 0;
                            break;
                        case "calculate":
                            options.totalValue = options.value.TotalNetSales;
                            options.Cost = options.Cost + options.value.TotalCost;
                            break;
                        case "finalize":
                            options.totalValue = options.Cost / options.totalValue;
                            break;
                    }
                }
            },
        },

        export: {
            enabled: true,
            fileName: "promotionanalisys",
        },
        scrolling: { mode: "virtual" },
        height: 600
    }

    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };

}