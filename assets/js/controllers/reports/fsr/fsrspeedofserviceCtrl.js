'use strict';
app.controller('fsrSpeedOfServiceCtrl', fsrSpeedOfServiceCtrl);
function fsrSpeedOfServiceCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    //DevExpress.localization.locale("tr");
    //Globalize.locale('tr');
    //$scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
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
    var vNumber = ISO8601_week_no((new Date()));
    $scope.startYear = vNumber-2<=0? cYeaar-1:cYeaar;
    $scope.endYear = vNumber-1<=0? cYeaar-1:cYeaar;
    var minYear = parseInt(cYeaar - 4);
    var maxYear = parseInt(cYeaar);
    $scope.startWeek = vNumber-2<=0?parseInt(vNumber - 2+52):parseInt(vNumber - 2);
    $scope.endWeek = vNumber-1<=0?parseInt(vNumber - 1+52):parseInt(vNumber - 1);
    $scope.VeiwHeader = {};
    $scope.startYearButton = {
        bindingOptions: {
            value: "startYear"
        },
        min: minYear,
        max: maxYear,
        showSpinButtons: true
    };
    $scope.weekCaption1 = $translate.instant('fsrspeedofservice.Week') + " " + $scope.startWeek;
    $scope.weekCaption2 = $translate.instant('fsrspeedofservice.Week') + " " + $scope.endWeek;
    $scope.startWeekButton = {
        bindingOptions: {
            value: "startWeek"
        },
        min: 1,
        max: 53,
        showSpinButtons: true
    };
    $scope.endYearButton = {
        bindingOptions: {
            value: "endYear"
        },
        min: minYear,
        max: maxYear,
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
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.refresh();
            $scope.weekCaption1 = "Week " + $scope.startWeek;
            $scope.weekCaption2 = "Week " + $scope.endWeek;
            dataGrid.columnOption("week1bump", 'caption', $scope.weekCaption1);
            dataGrid.columnOption("week1ys", 'caption', $scope.weekCaption1);
            dataGrid.columnOption("week2bump", 'caption', $scope.weekCaption2);
            dataGrid.columnOption("week2ys", 'caption', $scope.weekCaption2);
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
                firstYear: $scope.startYear,
                firstWeek: $scope.startWeek,
                secondYear: $scope.endYear,
                secondWeek: $scope.endWeek,
                //IncludeTotals:false
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/speedofservice", { params: params })
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
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        grouping: { autoExpandAll: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        scrolling: { mode: "virtual" },
        
        columns: [
            { caption: $translate.instant('fsrspeedofservice.StoreFilterType'), dataField: "StoreFilterType", dataType: "string", fixed: true },
            { dataField: "Store", caption: $translate.instant('fsrspeedofservice.Store'), dataType: "string", width: 230, fixed: true },
            { dataField: "RegionManager", caption: $translate.instant('fsrspeedofservice.RegionManager'), dataType: "string", width: 230, fixed: true },
            {
                caption: "YemekSepeti",visible:false,
                columns: [
                    {
                        caption: $scope.weekCaption1,
                        name: "week1ys",
                        columns: [
                            { caption: $translate.instant('fsrspeedofservice.Time'), dataField: "YSserviceTime", dataType: "number", format: "fixedPoint", },
                            { caption: $translate.instant('fsrspeedofservice.Score'), dataField: "YS", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: $translate.instant('fsrspeedofservice.Speed'), dataField: "YS_Speed", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: $translate.instant('fsrspeedofservice.Service'), dataField: "YS_Serving", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: $translate.instant('fsrspeedofservice.Taste'), dataField: "YS_Flavor", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                        ]
                    },
                    {
                        caption: $scope.weekCaption2,
                        name: "week2ys",
                        columns: [
                            { caption: $translate.instant('fsrspeedofservice.Time'), dataField: "YSserviceTime2", dataType: "number", format: "fixedPoint", },
                            { caption: $translate.instant('fsrspeedofservice.Score'), dataField: "YS2", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: $translate.instant('fsrspeedofservice.Speed'), dataField: "YS_Speed2", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: $translate.instant('fsrspeedofservice.Service'), dataField: "YS_Serving2", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: $translate.instant('fsrspeedofservice.Taste'), dataField: "YS_Flavor2", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                        ]
                    }],
                fixed: false
            },
            {
                caption: $translate.instant('fsrspeedofservice.BumpTime'),
                columns: [
                    {
                        caption: $scope.weekCaption1,
                        name: "week1bump",
                        columns: [
                            { caption: $translate.instant('fsrspeedofservice.MakeTable'), dataField: "AvgMakeTable", dataType: "number", customizeText: formatTime },
                            { caption: $translate.instant('fsrspeedofservice.CutTable'), dataField: "AvgCutTable", dataType: "number", customizeText: formatTime },
                            { caption: $translate.instant('fsrspeedofservice.Dispatch'), dataField: "AvgDispatchTime", dataType: "number", customizeText: formatTime },
                            { caption: $translate.instant('fsrspeedofservice.Delivery'), dataField: "AvgDeliveryTime", dataType: "number", customizeText: formatTime },
                            { caption: "U30", dataField: "DeliveryU30", dataType: "number", format: { type: "percent", precision: 2 } },
                            { caption: $translate.instant('fsrspeedofservice.U30Count'), dataField: "DeliveryU30Count", dataType: "number", format: { type: "fixedPoint", precision: 0 },},
                            { caption:  $translate.instant('fsrspeedofservice.DeliveryCount2'), dataField: "DeliveryCount", dataType: "number", format: { type: "fixedPoint", precision: 0 },},
                        ]
                    },
                    {
                        caption: $scope.weekCaption2,
                        name: "week2bump",
                        columns: [
                            { caption: $translate.instant('fsrspeedofservice.MakeTable'), dataField: "AvgMakeTable2", dataType: "number", customizeText: formatTime },
                            { caption: $translate.instant('fsrspeedofservice.CutTable'), dataField: "AvgCutTable2", dataType: "number", customizeText: formatTime },
                            { caption: $translate.instant('fsrspeedofservice.Dispatch'), dataField: "AvgDispatchTime2", dataType: "number", customizeText: formatTime },
                            { caption: $translate.instant('fsrspeedofservice.Delivery'), dataField: "AvgDeliveryTime2", dataType: "number", customizeText: formatTime },
                            { caption: "U30", dataField: "DeliveryU302", dataType: "number", format: { type: "percent", precision: 2 } },
                            { caption: $translate.instant('fsrspeedofservice.U30Count'), dataField: "DeliveryU30Count2", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
                            { caption: $translate.instant('fsrspeedofservice.DeliveryCount2'), dataField: "DeliveryCount2", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
                        ]
                    }],
                fixed: false
            },

        ],
        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (e.data.Summary === true) {
                    //e.rowElement.addClass('place');
                    e.rowElement.css({ 'font-weight': 'bold', 'background': '#dcdcdc' });
                }
                //else {
                //    e.data.place = "";
                //}
            }
        },
        onCellPrepared: function (options) {
            var fieldData = options.value;
            var ColoredFileds = ["YS2", "YS_Speed2", "YS_Serving2", "YS_Flavor2", "DeliveryU302"];
            if (fieldData && ColoredFileds.indexOf(options.column.dataField) > -1) {
                if (options.value != options.row.data[options.column.dataField.substring(0, options.column.dataField.length - 1)])
                    if (options.value < options.row.data[options.column.dataField.substring(0, options.column.dataField.length - 1)])
                        options.cellElement.css({ 'color': '#f00' });
                    else
                        options.cellElement.css({ 'color': '#2ab71b' });
            }
            var ColoredFiledsInvert = ["YSserviceTime2", "AvgMakeTable2", "AvgCutTable2", "AvgDispatchTime2", "AvgDeliveryTime2"];
            if (fieldData && ColoredFiledsInvert.indexOf(options.column.dataField) > -1) {
                if (options.value != options.row.data[options.column.dataField.substring(0, options.column.dataField.length - 1)])
                    if (options.value > options.row.data[options.column.dataField.substring(0, options.column.dataField.length - 1)])
                        options.cellElement.css({ 'color': '#f00' });
                    else
                        options.cellElement.css({ 'color': '#2ab71b' });
            }
        },
        export: {
            enabled: true,
            fileName: "FSR Speed Of Service",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                var ColoredFileds = ["YS2", "YS_Speed2", "YS_Serving2", "YS_Flavor2", "DeliveryU302"];
                if (ColoredFileds.indexOf(gridCell.column.dataField) > -1) {
                    if (gridCell.data && gridCell.data[gridCell.column.dataField] != gridCell.data[gridCell.column.dataField.substring(0, gridCell.column.dataField.length - 1)])
                        if (gridCell.data[gridCell.column.dataField] < gridCell.data[gridCell.column.dataField.substring(0, gridCell.column.dataField.length - 1)])
                            options.font.color = '#FF0000';
                        else
                            options.font.color = '#008000';
                }
                var ColoredFiledsInvert = ["YSserviceTime2", "AvgMakeTable2", "AvgCutTable2", "AvgDispatchTime2", "AvgDeliveryTime2"];
                if (ColoredFiledsInvert.indexOf(gridCell.column.dataField) > -1) {
                    if (gridCell.data && gridCell.data[gridCell.column.dataField] != gridCell.data[gridCell.column.dataField.substring(0, gridCell.column.dataField.length - 1)])
                        if (gridCell.data[gridCell.column.dataField] > gridCell.data[gridCell.column.dataField.substring(0, gridCell.column.dataField.length - 1)])
                            options.font.color = '#FF0000';
                        else
                            options.font.color = '#008000';
                }
                if (gridCell.rowType === 'data') {
                    if (gridCell.data.Summary === true) {
                        options.font.bold = true;
                        options.backgroundColor = '#DCDCDC';
                    }
                }
            }
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
        var oldCaption1 = $scope.weekCaption1;
        var oldCaption1 = $scope.weekCaption2;
        $scope.weekCaption1 = "Week " + $scope.startWeek;
        $scope.weekCaption2 = "Week " + $scope.endWeek;
        dataGrid.columnOption(oldCaption1, 'caption', $scope.weekCaption1);
        dataGrid.columnOption(oldCaption2, 'caption', $scope.weekCaption2);

    };

}