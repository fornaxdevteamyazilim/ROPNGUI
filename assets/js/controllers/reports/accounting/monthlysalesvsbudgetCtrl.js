'use strict';
app.controller('monthlysalesvsbudgetCtrl', monthlysalesvsbudgetCtrl);
function monthlysalesvsbudgetCtrl($scope, Restangular, toaster, $interval, $http, NG_SETTING, $q, $rootScope, $location, $translate, $timeout, $element, userService, ngnotifyService) {
    $rootScope.uService.EnterController("monthlysalesvsbudgetCtrl");
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
        //$location.path('/app/dashboard');
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
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    };
    $scope.Time = ngnotifyService.ServerTime();
    var cYeaar = parseInt(((new Date()).getFullYear()));
    $scope.startYear = cYeaar;
    $scope.endYear = cYeaar;
    var minYear = parseInt(cYeaar - 4);
    var maxYear = parseInt(cYeaar);
    var vNumber = parseInt(((new Date()).getMonth()));
    $scope.startMonth = parseInt(vNumber - 1);
    $scope.endMonth = parseInt(vNumber);
    $scope.VeiwHeader = {};
    $scope.startYearButton = {
        bindingOptions: {
            value: "startYear"
        },
        min: minYear,
        max: maxYear,
        showSpinButtons: true
    };
  
    $scope.startMonthButton = {
        bindingOptions: {
            value: "startMonth"
        },
        min: 1,
        max: 12,
        showSpinButtons: true
    };


    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
            $scope.weekCaption1 = "Week " + $scope.startMonth;
       
        }
    };
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#gridContainer").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    }
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
                Year: $scope.startYear,
                Month: $scope.startMonth,
                //IncludeTotals:false
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/monthlysalesvsbudget", { params: params })
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
    $scope.MonthlysalesvsbudgetGridOptions = {
        dataSource: store,
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
            storageKey: "dx-monthlysalesvsbudgetGrid"
        },
        columns: [

            { dataField: "RegionManager", caption: $translate.instant('monthlysalesvsbudget.RegionManager'), dataType: "string", fixed: true, },
            { dataField: "Store", caption: $translate.instant('monthlysalesvsbudget.Store'), visibleIndex: 0, fixed: true, dataType: "string", sortIndex: 0, sortOrder: "asc" },

            // { dataField: "StoreFilterType", caption: $translate.instant('monthlysalesvsbudget.StoreFilterType'), fixed: false, dataType: "string", },
            // { dataField: "StoreType", caption: $translate.instant('monthlysalesvsbudget.regionRank'), fixed: false, dataType: "string", },

            { dataField: "Year", dataType: "number", caption: $translate.instant('monthlysalesvsbudget.Year'), dataType: "number" },
            { dataField: "Month", caption: $translate.instant('monthlysalesvsbudget.Month'), dataType: "number",  },
            { dataField: "TotalMonthlyIncome", caption: $translate.instant('monthlysalesvsbudget.TotalMonthlyIncome'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "SalesTarget", caption: $translate.instant('monthlysalesvsbudget.SalesTarget'), dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Ratio", caption: "%", dataType: "number", format: { type: "percent", precision: 2 } },




        ],
        summary: {
            totalItems: [{ column: "Store", summaryType: "count", displayFormat: "{0}" },
                { column: "TotalMonthlyIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
                { column: "SalesTarget", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
                //{ column: "Ratio", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { name: "RatioSummary", showInColumn: "Ratio", summaryType: "custom" , valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ],
            groupItems: [
                { column: "Store", summaryType: "count", displayFormat: "{0}" },
                { column: "TotalMonthlyIncome", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "SalesTarget", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "Ratio", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "RatioSummary", showInColumn: "Ratio", summaryType: "custom" , valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },


            ],
              calculateCustomSummary: function (options) {
                if (options.name === "RatioSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                                options.dg = options.dg + options.value.SalesTarget;
                                options.totalValue = options.totalValue + options.value.TotalMonthlyIncome;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg-1;
                            break;
                    }
                }
            }
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
                if (options.column.name && options.column.name == "Ratio") {
                    if (options.row.data["Ratio"] != 0) {

                        if (options.row.data["Ratio"] < 0)
                            options.cellElement.css({ 'color': '#f00' });
                        else
                            options.cellElement.css({ 'color': '#2ab71b' });
                    }

                }

            }
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true,
            fileName: "Monthly Sales vs Budget Report",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                var fieldData = options.value;
                if (!gridCell) {
                    return;
                }
                if (options.gridCell.rowType == 'data' && gridCell.column.name && gridCell.column.name == "Ratio")
                    if (gridCell.data && gridCell.data["Ratio"] != 0)
                        if (gridCell.data["Ratio"] > 0)
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
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
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
        $rootScope.uService.ExitController("monthlysalesvsbudgetCtrl");
    });
};
