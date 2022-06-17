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
    $scope.params = userService.getParameter('actualvstheoriticalreport',
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
            $("#gridContainer").dxDataGrid("instance").state({});
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
            { caption: $translate.instant('actualvstheoritical.Region'), dataField: "Region", dataType: "string", visible: false },
            { caption: $translate.instant('actualvstheoritical.Store'), dataField: "Store", dataType: "string", fixed: true, groupIndex: 0 },
            { caption: $translate.instant('actualvstheoritical.NetSales'), dataField: "Sales", dataType: "number", format: "#,##0.00₺" },
            { caption: $translate.instant('actualvstheoritical.StoreType'), dataField: "StoreFilterType", dataType: "string", visible: false },// fixed: true ,groupIndex: 0 },
            { caption: $translate.instant('actualvstheoritical.RealToTheoric'), dataField: "RealToTheoricUsage", dataType: "boolean", visible: false },
            { caption: $translate.instant('actualvstheoritical.ItemCode'), dataField: "ItemCode", dataType: "string", fixed: true },
            { caption: $translate.instant('actualvstheoritical.c.Name'), dataField: "InventoryUnitName", dataType: "string", fixed: true },
            { caption: $translate.instant('actualvstheoritical.BaseUnit'), dataField: "BaseUnit", dataType: "string" },
            { caption: $translate.instant('actualvstheoritical.Group'), dataField: "InventoryGroup", dataType: "string" },
            { caption: $translate.instant('actualvstheoritical.CountType'), dataField: "CountType", dataType: "string" },
            { caption: $translate.instant('actualvstheoritical.CostType'), dataField: "CostType", dataType: "string", groupIndex: 1 },
            { caption: $translate.instant('actualvstheoritical.Beg.Inv.'), dataField: "FistCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.Purchase'), dataField: "DeliveredUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.TransferIn'), dataField: "InTransferUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.TransformUnits'), dataField: "TransformUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.Sold'), dataField: "SouldUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.TransferOut'), dataField: "OutTransferUnits", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.RawWaste'), dataField: "RawWasteUntis", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.AutoWaste'), dataField: "AutoWasteUsageCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.ItemWaste'), dataField: "WasteUsageCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.End.Inv.'), dataField: "LasCount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.Availible(Theoric)'), dataField: "TheoricAvailible", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('actualvstheoritical.UnitCost'), dataField: "Price", dataType: "number", format: "#,##0.00₺" },
            { caption: $translate.instant('actualvstheoritical.Cost'), dataField: "Amount", dataType: "number", format: "#,##0.00₺" },
            {
                caption: $translate.instant('actualvstheoritical.Usage(Units)'),
                columns: [
                    { caption: $translate.instant('actualvstheoritical.Actual'), dataField: "RealUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { caption: $translate.instant('actualvstheoritical.Theory'), dataField: "TheoriticalUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { caption: $translate.instant('actualvstheoritical.TheoryWaste'), dataField: "TheoriticalAndWasteUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { caption: $translate.instant('actualvstheoritical.Variance'), dataField: "DeltaUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                ]
            },
            {
                caption: $translate.instant('actualvstheoritical.Usage(Amount)'),
                columns: [
                    { caption: $translate.instant('actualvstheoritical.Actual'), dataField: "RealUsageAmount", dataType: "number", format: "#,##0.00₺" },
                    { caption: $translate.instant('actualvstheoritical.Theory'), dataField: "TheoriticalUsageAmount", dataType: "number", format: "#,##0.00₺" },
                    { caption: $translate.instant('actualvstheoritical.TheoryWaste'), dataField: "TheoriticalAndWasteAmount", dataType: "number", format: "#,##0.00₺" },
                    { caption: $translate.instant('actualvstheoritical.Variance'), dataField: "DeltaAmount", dataType: "number", format: "#,##0.00₺" },
                ]
            },
            {
                caption: $translate.instant('actualvstheoritical.Usage(%)'),
                columns: [
                    { caption: $translate.instant('actualvstheoritical.Actual'), dataField: "RealUsagePercent", dataType: "number", format: { type: "percent", precision: 2 } },
                    { caption: $translate.instant('actualvstheoritical.Theory'), dataField: "TheoriticalUsagePercent", dataType: "number", format: { type: "percent", precision: 2 } },
                    { caption: $translate.instant('actualvstheoritical.TheoryWaste'), dataField: "TheoriticalAndWastePercent", dataType: "number", format: { type: "percent", precision: 2 } },
                    { caption: $translate.instant('actualvstheoritical.Variance'), dataField: "DeltaPercent", dataType: "number", format: { type: "percent", precision: 2 } },
                ]
            },
            {
                caption: $translate.instant('actualvstheoritical.Staff'),
                columns: [
                    { caption: $translate.instant('actualvstheoritical.StaffTheoriticalUsage'), dataField: "StaffTheoriticalUsage", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    { caption: $translate.instant('actualvstheoritical.StaffTheoriticalUsageAmount'), dataField: "StaffTheoriticalUsageAmount", dataType: "number", format: "#,##0.00₺" },
                    { caption: $translate.instant('actualvstheoritical.StaffTheoriticalUsagePercent'), dataField: "StaffTheoriticalUsagePercent", dataType: "number", format: { type: "percent", precision: 2 } },
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
            { column: "StaffTheoriticalUsage", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "StaffTheoriticalUsageAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺" },
            { column: "StaffTheoriticalUsagePercent", summaryType: "sum", valueFormat: { type: "percent", precision: 4 }, displayFormat: "{0}" },
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
                { column: "StaffTheoriticalUsage", summaryType: "sum",  valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "StaffTheoriticalUsageAmount", summaryType: "sum",  valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}₺", alignByColumn: true },
                { column: "StaffTheoriticalUsagePercent", summaryType: "sum", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true }, 
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
                if (e.column.dataField == 'StaffTheoriticalUsage' || e.column.dataField == 'StaffTheoriticalUsageAmount' || e.column.dataField == 'StaffTheoriticalUsagePercent') {
                    e.cellElement.addClass('StaffPercent');
                }

                if (e.data.LasCount == null) {
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
        //height: 600
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