'use strict';
app.controller('weeklycolsummaryCtrl', weeklycolsummaryCtrl);
function weeklycolsummaryCtrl($scope, Restangular, toaster, $interval, $http, NG_SETTING, $q, $rootScope, $location, $translate, $timeout, $element, userService) {
    $rootScope.uService.EnterController("weeklycolsummaryCtrl");
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

                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/Weeklycolsummary", { params: params })
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
        grouping: { autoExpandAll: false, contextMenuEnabled: true, expandMode: 'rowClick' },
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
            { dataField: "Store", caption: $translate.instant('weeklycolsummary.Store'), visibleIndex: 0, fixed: true, dataType: "string", sortIndex: 0, sortOrder: "asc", groupIndex: 0 },
            {
                dataField: "WeekDay", caption: $translate.instant('weeklycolsummary.WeekDay'), fixed: true, dataType: "string", sortIndex: 0, sortOrder: "asc",
                sortingMethod: function (a, b) {
                    var txtindex1 = 0;
                    var txtindex2 = 0;
                    var txt1 = a;
                    var txt2 = b;
                    switch (txt1) {
                        case "Monday":
                            txtindex1 = 1;
                            break;
                        case "Pazartesi":
                            txtindex1 = 1;
                            break;
                        case "Tuesday":
                            txtindex1 = 2;
                            break;
                        case "Salı":
                            txtindex1 = 2;
                            break;
                        case "Wednesday":
                            txtindex1 = 3;
                            break;
                        case "Çarşamba":
                            txtindex1 = 3;
                            break;
                        case "Thursday":
                            txtindex1 = 4;
                            break;
                        case "Perşembe":
                            txtindex1 = 4;
                            break;
                        case "Friday":
                            txtindex1 = 5;
                            break;
                        case "Cuma":
                            txtindex1 = 5;
                            break;
                        case "Saturday":
                            txtindex1 = 6;
                            break;
                        case "Cumartesi":
                            txtindex1 = 6;
                            break;
                        case "Sunday":
                            txtindex1 = 7;
                            break;
                        case "Pazar":
                            txtindex1 = 7;
                            break;
                    }
                    switch (txt2) {
                        case "Monday":
                            txtindex2 = 1;
                            break;
                        case "Pazartesi":
                            txtindex2 = 1;
                            break;
                        case "Tuesday":
                            txtindex2 = 2;
                            break;
                        case "Salı":
                            txtindex2 = 2;
                            break;
                        case "Wednesday":
                            txtindex2 = 3;
                            break;
                        case "Çarşamba":
                            txtindex2 = 3;
                            break;
                        case "Thursday":
                            txtindex2 = 4;
                            break;
                        case "Perşembe":
                            txtindex2 = 4;
                            break;
                        case "Friday":
                            txtindex2 = 5;
                            break;
                        case "Cuma":
                            txtindex2 = 5;
                            break;
                        case "Saturday":
                            txtindex2 = 6;
                            break;
                        case "Cumartesi":
                            txtindex2 = 6;
                            break;
                        case "Sunday":
                            txtindex2 = 7;
                            break;
                        case "Pazar":
                            txtindex2 = 7;
                            break;
                    }
                    if (txtindex1 < txtindex2)
                        return -1;
                    else if (txtindex1 > txtindex2)
                        return 1;
                    else
                        return 0;

                },
            },
            { dataField: "RegionManager", caption: $translate.instant('weeklycolsummary.Region'), fixed: true, dataType: "string", visible: false },
            {
                caption: $translate.instant('weeklycolsummary.Sales'), name: "Sales",
                columns: [
                    { dataField: "ProjectedSales", dataType: "number", caption: $translate.instant('weeklycolsummary.Projected'), name: "ProjectedSales", format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "AcualSales", dataType: "number", caption: $translate.instant('weeklycolsummary.Actual'), format: { type: "fixedPoint", precision: 0 } },
                    {
                        caption: $translate.instant('weeklycolsummary.Variance'),
                        name: "SalesVariance", dataType: "number",
                        //visibleIndex: 12,
                        calculateCellValue: function (data) {
                            return data.AcualSales - data.ProjectedSales;
                        },
                        format: { type: "fixedPoint", precision: 0 }
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycolsummary.TotalCOL'), name: "TotalCOL",
                columns: [
                    { dataField: "TotalProjectedCOL", caption: $translate.instant('weeklycolsummary.Projected'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "TotalActualCOL", caption: $translate.instant('weeklycolsummary.Actual'), format: { type: "fixedPoint", precision: 0 } },
                    {
                        caption: $translate.instant('weeklycolsummary.Variance'),
                        name: "TotalCOLVariance",
                        calculateCellValue: function (data) {
                            return data.TotalActualCOL - data.TotalProjectedCOL;
                        },
                        format: { type: "fixedPoint", precision: 0 }
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycolsummary.TotalCOL%'),
                columns: [
                    {
                        caption: $translate.instant('weeklycolsummary.Projected'),
                        name: "TotalProjectedPercent",
                        calculateCellValue: function (data) {
                            return data.TotalProjectedCOL / data.ProjectedSales;
                        },
                        format: { type: "percent", precision: 2 }
                    },
                    {
                        caption: $translate.instant('weeklycolsummary.Actual'),
                        name: "TotalActualPercent",
                        calculateCellValue: function (data) {
                            return data.TotalActualCOL / data.AcualSales;
                        },
                        format: { type: "percent", precision: 2 }
                    },
                    {
                        caption: $translate.instant('weeklycolsummary.Variance'),
                        name: "TotalVariancePercent",
                        calculateCellValue: function (data) {
                            return (data.TotalActualCOL / data.AcualSales) - (data.TotalProjectedCOL / data.ProjectedSales);
                        },
                        format: { type: "percent", precision: 2 }
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycolsummary.COL%'), name: "COLPercent",
                columns: [
                    {
                        caption: $translate.instant('weeklycolsummary.Manager'), name: "ManagerPercent",
                        columns: [
                            {
                                caption: $translate.instant('weeklycolsummary.Projected'),
                                name: "ProjectedManagerPercent",
                                calculateCellValue: function (data) {
                                    return data.ProjectedManagerCost / data.ProjectedSales;
                                },
                                format: { type: "percent", precision: 2 }
                            },
                            {
                                caption: $translate.instant('weeklycolsummary.Actual'),
                                name: "ActualManagerPercent",
                                calculateCellValue: function (data) {
                                    return data.ActualManagerCost / data.AcualSales;
                                },
                                format: { type: "percent", precision: 2 }
                            },
                        ]
                    },
                    {
                        caption: $translate.instant('weeklycolsummary.TeamMember'), name: "TeamMemberPercent",
                        columns: [
                            {
                                caption: $translate.instant('weeklycolsummary.Projected'),
                                name: "ProjectedTeamMemberPercent",
                                calculateCellValue: function (data) {
                                    return data.ProjectedTeamMemberCost / data.ProjectedSales;
                                },
                                format: { type: "percent", precision: 2 }
                            },
                            {
                                caption: $translate.instant('weeklycolsummary.Actual'),
                                name: "ActualTeamMemberPercent",
                                calculateCellValue: function (data) {
                                    return data.ActualTeamMemberCost / data.AcualSales;
                                },
                                format: { type: "percent", precision: 2 }
                            },
                        ]
                    },
                    {
                        caption: $translate.instant('weeklycolsummary.Driver'), name: "DriverPercent",
                        columns: [
                            {
                                caption: $translate.instant('weeklycolsummary.Projected'),
                                name: "ProjectedDriverPercent",
                                calculateCellValue: function (data) {
                                    return data.ProjectedDriverCost / data.ProjectedSales;
                                },
                                format: { type: "percent", precision: 2 }
                            },
                            {
                                caption: $translate.instant('weeklycolsummary.Actual'),
                                name: "ActualDriverPercent",
                                calculateCellValue: function (data) {
                                    return data.ActualDriverCost / data.AcualSales;
                                },
                                format: { type: "percent", precision: 2 }
                            },
                        ]
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycolsummary.OverTimeHours'), name: "OverTimeHours",
                columns: [
                    { dataField: "ProjectedOverTimeHours", caption: $translate.instant('weeklycolsummary.Projected'), format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "ActualOwertimeHours", caption: $translate.instant('weeklycolsummary.Actual'), format: { type: "fixedPoint", precision: 2 } },
                    {
                        caption: $translate.instant('weeklycolsummary.Variance'),
                        name: "OvertimeVariance",
                        calculateCellValue: function (data) {
                            return data.ActualOwertimeHours - data.ProjectedOverTimeHours;
                        },
                        format: { type: "fixedPoint", precision: 2 }
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycolsummary.WorkingHours'), name: "WorkingHours",
                columns: [
                    {
                        caption: $translate.instant('weeklycolsummary.Manager'), name: "ManagerHours",
                        columns: [
                            { dataField: "ProjectedManagerHours", caption: $translate.instant('weeklycolsummary.Projected'), format: { type: "fixedPoint", precision: 2 } },
                            { dataField: "ActualManagerHours", caption: $translate.instant('weeklycolsummary.Actual'), format: { type: "fixedPoint", precision: 2 } },
                        ]
                    },
                    {
                        caption: $translate.instant('weeklycolsummary.TeamMember'), name: "TeamMemberHours",
                        columns: [
                            { dataField: "ProjectedTeamMemberHours", caption: $translate.instant('weeklycolsummary.Projected'), format: { type: "fixedPoint", precision: 2 } },
                            { dataField: "ActualTeamMemberHours", caption: $translate.instant('weeklycolsummary.Actual'), format: { type: "fixedPoint", precision: 2 } },
                        ]
                    },
                    {
                        caption: $translate.instant('weeklycolsummary.Driver'), name: "DriverHours",
                        columns: [
                            { dataField: "ProjectedDriverHours", caption: $translate.instant('weeklycolsummary.Projected'), format: { type: "fixedPoint", precision: 2 } },
                            { dataField: "ActualDriverHours", caption: $translate.instant('weeklycolsummary.Actual'), format: { type: "fixedPoint", precision: 2 } },
                        ]
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycolsummary.OverTimeCost'), name: "OverTimeCost",
                columns: [
                    { dataField: "ProjectedOverTimeCOL", caption: $translate.instant('weeklycolsummary.Projected'), format: { type: "fixedPoint", precision: 2 } },
                    { dataField: "ActualOwertimeCOL", caption: $translate.instant('weeklycolsummary.Actual'), format: { type: "fixedPoint", precision: 2 } },
                    {
                        caption: $translate.instant('weeklycolsummary.Variance'),
                        name: "OvertimeCostVariance",
                        calculateCellValue: function (data) {
                            return data.ActualOwertimeCOL - data.ProjectedOverTimeCOL;
                        },
                        format: { type: "fixedPoint", precision: 2 }
                    },
                ]
            },
            {
                caption: $translate.instant('weeklycolsummary.Delivery'), name: "Delivery",
                columns: [
                    { dataField: "DeliveredOrders", caption: $translate.instant('weeklycolsummary.Orders'), format: { type: "fixedPoint", precision: 0 } },
                    { dataField: "DriveCost", caption: $translate.instant('weeklycolsummary.DriveCost'), name: "DriveCost", format: { type: "fixedPoint", precision: 0 } },
                ]
            },
            { dataField: "ProjectedPayedOffCOL", caption: $translate.instant('weeklycolsummary.PayedOffCOL'), name: "PayedOffCOL", format: { type: "fixedPoint", precision: 0 } }
        ],
        summary: {
            totalItems: [{ column: "Store", summaryType: "count", displayFormat: "{0}" },
            { column: "ProjectedSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "AcualSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "SalesVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            //{ column: "ProjectedCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            //{ column: "ActualCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            //{ column: "COLVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "ActualPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "ProjectedPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "VariancePercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalProjectedCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TotalActualCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TotalCOLVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            //{ column: "TotalActualPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "TotalActualPercent", showInColumn: "TotalActualPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "TotalProjectedPercent", showInColumn: "TotalProjectedPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "TotalVariancePercent", showInColumn: "TotalVariancePercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            //{ column: "TotalVariancePercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "ActualOwertimeCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "ActualOwertimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "ProjectedOverTimeCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "ProjectedOverTimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "OvertimeVariance", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "OvertimeCostVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "DeliveredOrders", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "DriveCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "PayedOffCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "ProjectedManagerHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "ActualManagerHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "ProjectedTeamMemberHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "ActualTeamMemberHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "ProjectedDriverHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "ActualDriverHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { name: "ProjectedManagerPercent", showInColumn: "ProjectedManagerPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "ActualManagerPercent", showInColumn: "ActualManagerPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "ProjectedTeamMemberPercent", showInColumn: "ProjectedTeamMemberPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "ActualTeamMemberPercent", showInColumn: "ActualTeamMemberPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "ProjectedDriverPercent", showInColumn: "ProjectedDriverPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "ActualDriverPercent", showInColumn: "ActualDriverPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "Store", summaryType: "count", displayFormat: "{0}" },
                { column: "ProjectedSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AcualSales", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "SalesVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "ProjectedCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "ActualCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "COLVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ProjectedPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "VariancePercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalProjectedCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalActualCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalCOLVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                // { column: "TotalActualPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                // { column: "TotalProjectedPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "TotalActualPercent", showInColumn: "TotalActualPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "TotalProjectedPercent", showInColumn: "TotalProjectedPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "TotalVariancePercent", showInColumn: "TotalVariancePercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualOwertimeCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualOwertimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ProjectedOverTimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ProjectedOverTimeCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "OvertimeVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "OvertimeCostVariance", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DeliveredOrders", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DriveCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "PayedOffCOL", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ProjectedManagerHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualManagerHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ProjectedTeamMemberHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualTeamMemberHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ProjectedDriverHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "ActualDriverHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "ProjectedManagerPercent", showInColumn: "ProjectedManagerPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "ActualManagerPercent", showInColumn: "ActualManagerPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "ProjectedTeamMemberPercent", showInColumn: "ProjectedTeamMemberPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "ActualTeamMemberPercent", showInColumn: "ActualTeamMemberPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "ProjectedDriverPercent", showInColumn: "ProjectedDriverPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "ActualDriverPercent", showInColumn: "ActualDriverPercent", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "TotalActualPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.TotalActualCOL;
                            options.TOTALSALES = options.TOTALSALES + options.value.AcualSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }
                if (options.name === "TotalActualPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.TotalActualCOL;
                            options.TOTALSALES = options.TOTALSALES + options.value.AcualSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }
                if (options.name === "TotalProjectedPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.TotalProjectedCOL;
                            options.TOTALSALES = options.TOTALSALES + options.value.ProjectedSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }
                if (options.name === "TotalVariancePercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            options.PTCOL = 0;
                            options.PTOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.TotalActualCOL;
                            options.TOTALSALES = options.TOTALSALES + options.value.AcualSales;
                            options.PTCOL = options.PTCOL + options.value.TotalProjectedCOL;
                            options.PTOTALSALES = options.PTOTALSALES + options.value.ProjectedSales;
                            //(data.TotalActualCOL / data.AcualSales) - (data.TotalProjectedCOL / data.ProjectedSales)
                            break;
                        case "finalize":
                            options.totalValue = (options.TCOL / options.TOTALSALES) - (options.PTCOL / options.PTOTALSALES);
                            break;
                    }
                }
                //TotalVariancePercent
                if (options.name === "ProjectedManagerPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.ProjectedManagerCost;
                            options.TOTALSALES = options.TOTALSALES + options.value.ProjectedSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }
                if (options.name === "ActualManagerPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.ActualManagerCost;
                            options.TOTALSALES = options.TOTALSALES + options.value.AcualSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }
                if (options.name === "ProjectedTeamMemberPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.ProjectedTeamMemberCost;
                            options.TOTALSALES = options.TOTALSALES + options.value.ProjectedSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }
                if (options.name === "ActualTeamMemberPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.ActualTeamMemberCost;
                            options.TOTALSALES = options.TOTALSALES + options.value.AcualSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }
                if (options.name === "ProjectedDriverPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.ProjectedDriverCost;
                            options.TOTALSALES = options.TOTALSALES + options.value.AcualSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }
                if (options.name === "ActualDriverPercent") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.TCOL = 0;
                            options.TOTALSALES = 0;
                            break;
                        case "calculate":
                            options.TCOL = options.TCOL + options.value.ActualDriverCost;
                            options.TOTALSALES = options.TOTALSALES + options.value.AcualSales;
                            break;
                        case "finalize":
                            options.totalValue = options.TCOL / options.TOTALSALES;
                            break;
                    }
                }


            },
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
        $rootScope.uService.ExitController("weeklycolsummaryCtrl");
    });
};
