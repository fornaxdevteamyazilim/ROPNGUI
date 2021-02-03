'use strict';
app.controller('weeklycolCtrl', weeklycolCtrl);
function weeklycolCtrl($scope, Restangular, toaster, $interval, $http, NG_SETTING, $q, $rootScope, $location, $translate, $timeout, $element, userService) {
    $rootScope.uService.EnterController("weeklycolCtrl");
    //userService.userAuthorizated();
    var promise;

    $scope.translate = function () {
        $scope.trREPORT = $translate.instant('main.REPORT');
        $scope.trEXCEL = $translate.instant('main.EXCEL');
        $scope.trPRINT = $translate.instant('main.PRINT');
    };

    function ISO8601_week_no(dt) {
        var tdt = new Date(dt.valueOf());
        var dayn = (dt.getDay() + 6) % 7;
        tdt.setDate(tdt.getDate() - dayn + 3);
        var firstThursday = tdt.valueOf();
        tdt.setMonth(0, 1);
        if (tdt.getDay() !== 4) {
            tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - tdt) / 604800000);
    }
    var cYeaar = parseInt(((new Date()).getFullYear()));
    $scope.startYear = cYeaar;
    $scope.endYear = cYeaar;
    var minYear = parseInt(cYeaar - 4);
    var maxYear = parseInt(cYeaar);
    var vNumber = ISO8601_week_no((new Date()));
    $scope.startWeek = parseInt(vNumber - 2);
    $scope.endWeek = parseInt(vNumber - 1);
    $scope.VeiwHeader = {};
    $scope.startYearButton = {
        bindingOptions: {
            value: "startYear"
        },
        min: minYear,
        max: maxYear,
        showSpinButtons: true
    };
    $scope.startWeekButton = {
        bindingOptions: {
            value: "startWeek"
        },
        min: 1,
        max: 53,
        showSpinButtons: true
    };

    $scope.endWeekButton = {
        bindingOptions: {
            value: "endWeek"
        },
        min: 1,
        max: 53,
        showSpinButtons: true
    };
    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#advgridContainer').dxDataGrid('instance');
            dataGrid.refresh();
        }
    };


    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.sumColumnJS = function sumColumnJS(array, col) {
        var sum = 0;
        array.forEach(function (value, index, array) {
            sum += value[col];
        });
        return sum;
    }

    $scope.TrendsGridOptions = {
        dataSource: new DevExpress.data.CustomStore({
            key: "id",
            load: function (loadOptions) {
                var params = {
                    theYear: $scope.startYear,
                    theWeek: $scope.endWeek
                };

                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/Weeklycol", { params: params })
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
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnReordering: true,
        //filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: false,
        repaintChangesOnly: true,
        highlightChanges: true,
        hoverStateEnabled: true,
        twoWayBindingEnabled: false,
        repaintChangesOnly: true,
        loadPanel: { enabled: true },
        // stateStoring: {
        //     enabled: true,
        //     type: "localStorage",
        //     storageKey: "dx-weeklycolGrid"
        // },
        columns: [
            { dataField: "Store", caption: $translate.instant('weeklycol.Store'), visibleIndex: 0, fixed: true, dataType: "string", sortIndex: 0, sortOrder: "asc" },
            { dataField: "RegionManager", caption: $translate.instant('weeklycol.RegionManager'), fixed: true, dataType: "string" },
            {
                caption: $translate.instant('weeklycol.Sales'), name: "Sales",
                columns: [
                    { dataField: "ProjectedSales", dataType: "number", caption: $translate.instant('weeklycol.ProjectedSales'), name: "ProjectedSales", format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "AcualSales", caption: $translate.instant('weeklycol.Actual'), format: { type: "fixedPoint", precision: 0 } },
                    {
                        caption: $translate.instant('weeklycol.Variance'),
                        name: "SalesVariance",
                        //visibleIndex: 12,
                        calculateCellValue: function (data) {
                            return data.AcualSales / data.ProjectedSales - 1;
                        },
                        format: "percent"
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycol.TotalCOL'), name: "TotalCOL",
                columns: [
                    { dataField: "TotalProjectedCOL", caption: $translate.instant('weeklycol.Projected'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "TotalActualCOL", caption: $translate.instant('weeklycol.Actual'), format: { type: "fixedPoint", precision: 0 } },
                    {
                        caption: $translate.instant('weeklycol.Variance'),
                        name: "TotalCOLVariance",
                        calculateCellValue: function (data) {
                            return data.TotalActualCOL / data.TotalProjectedCOL - 1;
                        },
                        format: "percent"
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycol.TotalCOL%'),
                columns: [
                    {
                        caption: $translate.instant('weeklycol.Projected'),
                        name: "TotalProjectedPercent",
                        calculateCellValue: function (data) {
                            return data.TotalProjectedCOL / data.ProjectedSales;
                        },
                        format: "percent"
                    },
                    {
                        caption: $translate.instant('weeklycol.TotalActualPercent'),
                        name: "TotalActualPercent",
                        calculateCellValue: function (data) {
                            return data.TotalActualCOL / data.AcualSales;
                        },
                        format: "percent"
                    },
                    {
                        caption: $translate.instant('weeklycol.Variance'),
                        name: "TotalVariancePercent",
                        calculateCellValue: function (data) {
                            return (data.TotalActualCOL / data.AcualSales) - (data.TotalProjectedCOL / data.ProjectedSales);
                        },
                        format: "percent"
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycol.OverTime'), name: "OverTimeHours",
                columns: [
                    { dataField: "ActualOwertimeHours", caption: $translate.instant('weeklycol.Hours'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "ActualOwertimeCOL", caption: $translate.instant('weeklycol.Cost'), format: { type: "fixedPoint", precision: 0 } },
                    {
                        caption: $translate.instant('weeklycol.Variance'),
                        name: "OvertimeVariance",
                        calculateCellValue: function (data) {
                            return data.ActualOwertimeCOL / data.AcualSales;
                        },
                        format: "percent"
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycol.Delivery'), name: "Delivery",
                columns: [
                    { dataField: "DeliveredOrders", caption: $translate.instant('weeklycol.Orders'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "DriveCost", caption: $translate.instant('weeklycol.DriveCost'), name: "DriveCost", format: { type: "fixedPoint", precision: 0 } },
                ]
            },
        ],
        summary: {
            totalItems: [{ column: "Store", summaryType: "count", displayFormat: "{0}" },
            { column: "ProjectedSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "AcualSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "SalesVariance", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "ProjectedCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "ActualCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "COLVariance", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "ActualPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "ProjectedPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "VariancePercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalProjectedCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TotalActualCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TotalCOLVariance", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalActualPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalProjectedPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalVariancePercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "ActualOwertimeCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "ActualOwertimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "OvertimeVariance", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "DeliveredOrders", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "DriveCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "Store", summaryType: "count", displayFormat: "{0}" },
                { column: "ProjectedSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AcualSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "SalesVariance", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ProjectedCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "COLVariance", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ProjectedPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "VariancePercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalProjectedCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalActualCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalCOLVariance", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalActualPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalProjectedPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalVariancePercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualOwertimeCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualOwertimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "OvertimeVariance", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DeliveredOrders", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DriveCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
            ],
        },
        onCellPrepared: function (options) {
            if (options.rowType == 'data') {
                var fieldData = options.value;
                if (options.rowType == 'data' && options.column.name && options.column.name.length > 5 && options.column.name == "TodayIncome") {
                    var fieldData = options.value;
                    var fieldHtml = "";
                    if (options.row.data["TodayIncome"] != options.row.data["PrewWeekIncome"]) {
                        options.cellElement.addClass((options.row.data["TodayIncome"] > options.row.data["PrewWeekIncome"]) ? "inc" : "dec");
                        fieldHtml += "<div class='current-value'>" +
                            "</div> <div class='diff'>" +
                            parseInt(fieldData).toLocaleString() +
                            "  </div>";
                    }
                    /* else {
                        fieldHtml = fieldData.value;
                    } */
                    options.cellElement.html(fieldHtml);
                }
                // if (options.column.name && options.column.name == "TodayIncome") {
                //     if (options.row.data["TodayIncome"] != options.row.data["PrewWeekIncome"]) {

                //         if (options.row.data["TodayIncome"] < options.row.data["PrewWeekIncome"])
                //             options.cellElement.css({ 'color': '#f00' });
                //         else
                //             options.cellElement.css({ 'color': '#2ab71b' });
                //     }

                // }
                if (options.column.name && options.column.name == "TodayTC") {
                    if (options.row.data["TodayTC"] != options.row.data["PrewWeekTC"]) {

                        if (options.row.data["TodayTC"] < options.row.data["PrewWeekTC"])
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
                if (options.column.name && options.column.name == "HitRate") {
                    if (options.row.data["HitRate"] != 0) {

                        if (options.row.data["HitRate"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }
            }
        },
        onRowClick: function (rowInfo) {
            //    location.href = '#/app/specialoperations/shiftplanedit2/' + rowInfo.key;
            //rowInfo.component.editRow(rowInfo.rowIndex);  
            //$rootScope.SelectedData = {id:rowInfo.key,name:rowInfo.data.Store};
            //$location.path('/app/dashboard');
            //$location.href = '#/app/dashboard';
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true,
            fileName: "Weekly COL Report",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                var fieldData = options.value;
                if (!gridCell) {
                    return;
                }
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "TodayIncome")
                    if (gridCell.data && gridCell.data["TodayIncome"] != gridCell.data["PrewWeekIncome"])
                        if (gridCell.data["TodayIncome"] > gridCell.data["PrewWeekIncome"])
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "TodayTC")
                    if (gridCell.data && gridCell.data["TodayTC"] != gridCell.data["PrewWeekTC"])
                        if (gridCell.data["TodayTC"] > gridCell.data["PrewWeekTC"])
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "HitRate")
                    if (gridCell.data && gridCell.data["HitRate"] != 0)
                        if (gridCell.data["HitRate"] > 0)
                            options.font.color = '#008000';
                        else
                            options.font.color = '#FF0000';
            }


        },
        scrolling: { mode: "virtual" },
        //height: 600
    };


    $scope.$on('$destroy', function () {
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("weeklycolCtrl");
    });
};
