'use strict';
app.controller('trendsCtrl', trendsCtrl);
function trendsCtrl($scope, Restangular, toaster, $interval, $http, NG_SETTING, $q, $rootScope, $location, $translate, $timeout, $element, userService) {
    $rootScope.uService.EnterController("trendsCtrl");
    userService.userAuthorizated();
    var promise;

    $scope.translate = function () {
        $scope.trREPORT = $translate.instant('main.REPORT');
        $scope.trEXCEL = $translate.instant('main.EXCEL');
        $scope.trPRINT = $translate.instant('main.PRINT');
        $scope.trTODAYINCOME = $translate.instant('main.TODAYINCOME');
        $scope.trTODAYTC = $translate.instant('main.TODAYTC');
        $scope.trPREWEEKINCOME = $translate.instant('main.PREWEEKINCOME');
        $scope.trPREWEEKTC = $translate.instant('main.PREWEEKTC');
        $scope.trPREWEEKAC = $translate.instant('main.PREWEEKAC');
        $scope.SALESTARGET = $translate.instant('main.PREWEEKAC');
        $scope.TCTARGET = $translate.instant('main.PREWEEKAC');
        $scope.ACTARGET = $translate.instant('main.PREWEEKAC');

    };
    $scope.selectedStore = function (StoreID, Store) {
        var data = {};
        data.id = StoreID;
        data.name = Store;
        $rootScope.SelectedData = data;
        $location.path('/app/dashboard');
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
    $scope.resetlayout = $translate.instant('main.FILTERRESET');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $('#advgridContainer').dxDataGrid('instance').state({});
        }
    }; 
    $scope.TrendsGridOptions = {
        dataSource: new DevExpress.data.CustomStore({
            key: "StoreID",
            load: function (loadOptions) {
                var params = {
                    /* StoreID: $scope.item.StoreID,
                    theYear: $scope.item.PeriodYear,
                    theWeek: $scope.item.PeriodWeek */
                };

                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/extendedreports/trends", { params: params })
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
        filterRow: { visible: true },
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
        loadPanel: { enabled: false },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-trendsGrid"
        },
        columns: [
            { dataField: "Store", caption: $translate.instant('trends.Store'), visibleIndex: 0, fixed: true, dataType: "string", sortIndex: 0, sortOrder: "asc" },
            { dataField: "RegionManager", caption: $translate.instant('trends.Region'), visible: false, dataType: "string" },
            { dataField: "SalesRank", caption: $translate.instant('trends.Rank'), format: { type: "fixedPoint", precision: 0 } },
            { dataField: "RegionalSalesRank", caption: $translate.instant('trends.regionRank'), format: { type: "fixedPoint", precision: 0 } },
            {
                caption: $translate.instant('trends.today'), name: "Today",
                columns: [
                    { dataField: "TodayIncome", dataType: "number", caption: $translate.instant('trends.sales'), name: "TodayIncome", format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "TodayAC", caption: $translate.instant('trends.AC'), format: { type: "fixedPoint", precision: 2 }, visible: false },
                    { dataField: "TodayTC", caption: $translate.instant('trends.TC'), name: "TodayTC", format: { type: "fixedPoint", precision: 0 } },
                ]
            },
            {
                caption: $translate.instant('trends.prevweek'), name: "PrewWeek",
                columns: [
                    { dataField: "PrewWeekIncome", caption: $translate.instant('trends.sales'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "PrewWeekAC", caption: $translate.instant('trends.AC'), format: { type: "fixedPoint", precision: 2 }, visible: false },
                    { dataField: "PrewWeekTC", caption: $translate.instant('trends.TC'), name: "PrewWeekTC", format: { type: "fixedPoint", precision: 0 } },
                ]
            },
            {
                caption: $translate.instant('trends.prevDay'), name: "LastDay",
                columns: [
                    { dataField: "LastDayIncome", caption: $translate.instant('trends.sales'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "LastDayAC", caption: $translate.instant('trends.AC'), format: { type: "fixedPoint", precision: 2 }, visible: false },
                    { dataField: "LastDayTC", caption: $translate.instant('trends.TC'), format: { type: "fixedPoint", precision: 0 } },
                ]
            },
            {
                caption: $translate.instant('trends.prevMonth'), name: "PrevMonth", visible: false,
                columns: [
                    { dataField: "TotalPrevMonthToDateIncome", caption: $translate.instant('trends.sales'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "PrevMonthToDateAC", caption: $translate.instant('trends.AC'), format: { type: "fixedPoint", precision: 2 }, visible: false },
                    { dataField: "PrevMonthToDateTC", caption: $translate.instant('trends.TC'), format: { type: "fixedPoint", precision: 0 } },
                ]
            },
            {
                caption: $translate.instant('trends.monthlyTotal'), name: "Monthly",
                columns: [
                    { dataField: "TotalMonthlyIncome", caption: $translate.instant('trends.sales'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "MonthlyAC", caption: $translate.instant('trends.AC'), format: { type: "fixedPoint", precision: 2 }, visible: false },
                    { dataField: "MonthlyTC", caption: $translate.instant('trends.TC'), format: { type: "fixedPoint", precision: 0 } },
                ]
            },
            {
                caption: $translate.instant('trends.trends'), name: "Trends",
                columns: [
                    { dataField: "IncomeTrend", caption: $translate.instant('trends.sales'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "SalesTarget", caption: $translate.instant('trends.SalesTarget'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "TCTrend", caption: $translate.instant('trends.TC'), format: { type: "fixedPoint", precision: 0 }, visible: false },
                    { dataField: "TCTarget", caption: "TC Target", format: { type: "fixedPoint", precision: 0 }, visible: false },
                    { dataField: "HitRate", caption: "Hit %", name: "HitRate", format: { type: "fixedPoint", precision: 2 }, },
                ]
            },
            { dataField: "TodaySalesTarget", caption: $translate.instant('trends.dailyTarget'), format: { type: "fixedPoint", precision: 0 }, visible: false },

        ],
        summary: {
            totalItems: [{ column: "Store", summaryType: "count", displayFormat: "{0}" },
            { column: "TodayIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TodayTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TodayAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "PrewWeekIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "PrewWeekTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "PrewWeekAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "LastDayIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "LastDayTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "LastDayAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalPrevMonthToDateIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "PrevMonthToDateTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "PrevMonthToDateAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalMonthlyIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "MonthlyTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "MonthlyAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "IncomeTrend", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TCTrend", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "HitRate", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "SalesTarget", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TCTarget", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "Store", summaryType: "count", displayFormat: "{0}" },
                { column: "TodayIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TodayTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TodayAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "PrewWeekIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "PrewWeekTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "PrewWeekAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "LastDayIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "LastDayTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "LastDayAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalPrevMonthToDateIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "PrevMonthToDateTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "PrevMonthToDateAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalMonthlyIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "MonthlyTC", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "MonthlyAC", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "IncomeTrend", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TCTrend", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "HitRate", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "SalesTarget", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TCTarget", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },

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
            $rootScope.SelectedData = { id: rowInfo.key, name: rowInfo.data.Store };
            $location.path('/app/dashboard');
            //$location.href = '#/app/dashboard';
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true,
            fileName: "Trends Report",
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
    function numberWithCommas(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    var refreshData = function () {
        var dataGrid = $('#advgridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    }
    $scope.start = function () {
        $scope.stop();
        promise = $interval(refreshData, 30000);
    };

    $scope.stop = function () {
        $interval.cancel(promise);
    };
    $scope.start();

    $scope.$on('$destroy', function () {
        $scope.stop();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("trendsCtrl");
    });
};
