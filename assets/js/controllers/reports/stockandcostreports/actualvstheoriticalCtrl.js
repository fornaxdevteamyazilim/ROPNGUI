'use strict';
app.controller('actualvstheoriticalCtrl', actualvstheoriticalCtrl);
function actualvstheoriticalCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q, userService) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    //debugger;
    //DevExpress.localization.locale("tr");
    //Globalize.locale(navigator.language);
    //DevExpress.localization.locale(navigator.language);
    //Globalize.locale('tr');
    $scope.params = userService.getParameter('inventorydeliverylist',
        {
            fromDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
            toDate: moment().add(1, 'days').format('YYYY-MM-DD')
        }
    ).Parameters;
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: new Date()
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: new Date()
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

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/actualvstheoritical", { params: params })
                .then(function (response) {
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
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-actualvstheoric-storing"
        },
        groupPanel: { visible: true },
        grouping: { autoExpandAll: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        columnChooser: { enabled: true, mode: "dragAndDrop" },
        columns: [
            //{ dataField: "id", dataType: "number", visible: false },
            { dataField: "Region", dataType: "string", visible: false },
            { dataField: "Store", dataType: "string", fixed: true, groupIndex: 0 },
            { caption: "Net Sales", dataField: "Sales", dataType: "number", format: "#,##0.00₺" },
            { caption: "StoreType", dataField: "StoreFilterType", dataType: "string", visible: false },// fixed: true ,groupIndex: 0 },
            { caption: "RealToTheoric", dataField: "RealToTheoricUsage", dataType: "boolean", visible: false },
            { caption: "ItemCode", dataField: "ItemCode", dataType: "string", fixed: true },
            { caption: "Name", dataField: "InventoryUnitName", dataType: "string", fixed: true },
            { caption: "BaseUnit", dataField: "BaseUnit", dataType: "string" },
            { caption: "Group", dataField: "InventoryGroup", dataType: "string" },
            { caption: "CountType", dataField: "CountType", dataType: "string" },
            { caption: "CostType", dataField: "CostType", dataType: "string",groupIndex: 1 },
            { caption: "Beg.Inv.", dataField: "FistCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "Purchase", dataField: "DeliveredUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "TransferIn", dataField: "InTransferUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "Sold", dataField: "SouldUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "TransferOut", dataField: "OutTransferUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "RawWaste", dataField: "RawWasteUntis", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "AutoWaste", dataField: "AutoWasteUsageCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "ItemWaste", dataField: "WasteUsageCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "End.Inv.", dataField: "LasCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "Unit Cost", dataField: "Price", dataType: "number", format: "#,##0.00₺" },
            { caption: "Cost", dataField: "Amount", dataType: "number", format: "#,##0.00₺" },
            {
                caption: "Usage (Units)",
                columns: [
                    { caption: "Actual", dataField: "RealUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { caption: "Theory", dataField: "TheoriticalUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { caption: "Theory+Waste", dataField: "TheoriticalAndWasteUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { caption: "Variance", dataField: "DeltaUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                ]
            },
            {
                caption: "Usage (Amount)",
                columns: [
                    { caption: "Actual", dataField: "RealUsageAmount", dataType: "number", format: "#,##0.00₺" },
                    { caption: "Theory", dataField: "TheoriticalUsageAmount", dataType: "number", format: "#,##0.00₺" },
                    { caption: "Theory+Waste", dataField: "TheoriticalAndWasteAmount", dataType: "number", format: "#,##0.00₺" },
                    { caption: "Variance", dataField: "DeltaAmount", dataType: "number", format: "#,##0.00₺" },
                ]
            },
            {
                caption: "Usage (%)",
                columns: [
                    { caption: "Actual", dataField: "RealUsagePercent", dataType: "number", format: { type: "percent", precision: 2 } },
                    { caption: "Theory", dataField: "TheoriticalUsagePercent", dataType: "number", format: { type: "percent", precision: 2 } },
                    { caption: "Theory+Waste", dataField: "TheoriticalAndWastePercent", dataType: "number", format: { type: "percent", precision: 2 } },
                    { caption: "Variance", dataField: "DeltaPercent", dataType: "number", format: { type: "percent", precision: 2 } },
                ]
            },
        ],
        summary: {
            totalItems: [{ column: "ItemCode", summaryType: "count", displayFormat: "{0}" },
            { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "RealUsageAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            { column: "TheoriticalUsageAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
                { column: "TheoriticalAndWasteAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            { column: "DeltaAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            { column: "RealUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "TheoriticalUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "TheoriticalAndWasteUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "DeltaUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "RealUsagePercent", summaryType: "sum", valueFormat: { type: "percent", precision: 4 }, displayFormat: "{0}" },
            { column: "TheoriticalUsagePercent", summaryType: "sum", valueFormat: { type: "percent", precision: 4 }, displayFormat: "{0}" },
                { column: "TheoriticalAndWastePercent", summaryType: "sum", valueFormat: { type: "percent", precision: 4 }, displayFormat: "{0}" },
            { column: "DeltaPercent", summaryType: "sum", valueFormat: { type: "percent", precision: 4 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "ItemCode", summaryType: "count", displayFormat: "{0}" },
                { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
                { column: "RealUsageAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
                { column: "TheoriticalUsageAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
                { column: "TheoriticalAndWasteAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
             { column: "DeltaAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "RealUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "TheoriticalUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TheoriticalAndWasteUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "DeltaUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "RealUsagePercent", summaryType: "sum", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "TheoriticalUsagePercent", summaryType: "sum", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TheoriticalAndWastePercent", summaryType: "sum", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "DeltaPercent", summaryType: "sum", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
        },
        onCellPrepared: function (e) {
            if (e.rowType == 'data' || e.rowType == 'group') {
                if (e.column.dataField == 'RealUsage' || e.column.dataField == 'TheoriticalUsage' || e.column.dataField == 'TheoriticalAndWasteUsage' || e.column.dataField == 'DeltaUsage') {
                    e.cellElement.addClass('clsUsage');
                }
                if (e.column.dataField == 'RealUsageAmount' || e.column.dataField == 'TheoriticalUsageAmount' || e.column.dataField == 'TheoriticalAndWasteAmount' || e.column.dataField == 'DeltaAmount') {
                    e.cellElement.addClass('clsAmount');
                }
                if (e.column.dataField == 'RealUsagePercent' || e.column.dataField == 'TheoriticalUsagePercent' || e.column.dataField == 'TheoriticalAndWastePercent' || e.column.dataField == 'DeltaPercent') {
                    e.cellElement.addClass('clsPercent');
                }

                if (e.data.LasCount==null) {
                    if (e.column.dataField === 'LasCount') {
                        e.cellElement.css({ 'background-color': '#FF6161', color: '#000000' });//({ 'font-weight': 'bold' });#FFBB00
                    }
                    //if (e.column.dataField === 'SaleAmount') {
                    //    e.cellElement.css({ 'background-color': '#FFBB00', color: '#000000' });
                    //}
                }
                if (e.data.FistCount == null) {
                    if (e.column.dataField === 'FistCount') {
                        e.cellElement.css({ 'background-color': '#FF6161', color: '#000000' });
                    }                    
                }
                if (e.data.LasCount == null || e.data.FistCount == null) {
                    if (e.column.dataField === 'RealUsage') {
                        e.cellElement.css({ color: '#FF0000' });
                    }
                    //RealUsageAmount
                    if (e.column.dataField === 'RealUsageAmount') {
                        e.cellElement.css({ color: '#FF0000' });
                    }

                }
            }
        },
        export: {
            enabled: true,
            fileName: "ActualVsTheoricReport",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                if (gridCell.rowType === 'data') {
                    if (gridCell.column.dataField === 'RealUsage' || gridCell.column.dataField == 'TheoriticalUsage' || gridCell.column.dataField == 'TheoriticalAndWasteUsage' || gridCell.column.dataField == 'DeltaUsage') {
                        options.backgroundColor = '#FFE4C4';
                    }
                    if (gridCell.column.dataField == 'RealUsageAmount' || gridCell.column.dataField == 'TheoriticalUsageAmount' || gridCell.column.dataField == 'TheoriticalAndWasteAmount' || gridCell.column.dataField == 'DeltaAmount') {
                        options.backgroundColor = '#C3B091';
                    }
                    if (gridCell.column.dataField == 'RealUsagePercent' || gridCell.column.dataField == 'TheoriticalUsagePercent' || gridCell.column.dataField == 'TheoriticalAndWastePercent' || gridCell.column.dataField == 'DeltaPercent') {
                        options.backgroundColor = '#40E0D0';
                    }   
                    if (gridCell.data.LasCount == null)
                        if (gridCell.column.dataField === 'LasCount') {
                            options.backgroundColor = '#FF6161';
                            options.font.color = '#000000';
                        }
                    if (gridCell.data.FistCount == null)
                        if (gridCell.column.dataField === 'FistCount') {
                            options.backgroundColor = '#FF6161';
                            options.font.color = '#000000';
                        }
                    if (gridCell.data.LasCount == null || gridCell.data.FistCount == null) {
                        if (gridCell.data.RealUsage == null || gridCell.column.dataField === 'RealUsage') {
                            options.font.color = '#FF0000';
                        }
                        if (gridCell.data.RealUsageAmount == null || gridCell.column.dataField === 'RealUsageAmount') {
                            options.font.color = '#FF0000';
                        }
                    }
                }
            }
        },
        scrolling: { mode: "virtual" },
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