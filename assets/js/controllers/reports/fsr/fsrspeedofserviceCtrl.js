'use strict';
app.controller('fsrSpeedOfServiceCtrl', fsrSpeedOfServiceCtrl);
function fsrSpeedOfServiceCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    DevExpress.localization.locale("tr");
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
    $scope.startYear = cYeaar;
    $scope.endYear = cYeaar;
    var minYear = parseInt(cYeaar - 4);
    var maxYear = parseInt(cYeaar);
    var vNumber = ISO8601_week_no((new Date()));
    $scope.startWeek = parseInt(vNumber - 1);
    $scope.endWeek = parseInt(vNumber);
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
        max: 52,
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
        max: 52,
        showSpinButtons: true
    };
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
                secondWeek: $scope.endWeek
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
            { dataField: "Store", caption: "MGT Turkey",dataType: "string", width: 230, fixed: true },
            { dataField: "RegionManager",caption: "Area", dataType: "string", width: 230, fixed: true },
            {
                caption: "YemekSepeti",
                columns: [
                    {
                        caption: "Week " + $scope.startWeek,
                        columns: [
                            { caption: "Time", dataField: "YSserviceTime", dataType: "number", format: "fixedPoint", },
                            { caption: "Score", dataField: "YS", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: "Speed", dataField: "YS_Speed", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: "Service", dataField: "YS_Serving", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: "Taste", dataField: "YS_Flavor", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                        ]
                    },
                    {
                        caption: "Week " + $scope.endWeek,
                        columns: [
                            { caption: "Time", dataField: "YSserviceTime2", dataType: "number", format: "fixedPoint", },
                            { caption: "Score", dataField: "YS2", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: "Speed", dataField: "YS_Speed2", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: "Service", dataField: "YS_Serving2", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                            { caption: "Taste", dataField: "YS_Flavor2", dataType: "number", format: { type: "fixedPoint", precision: 2 }, },
                        ]
                    }],
                fixed: true
            },
            {
                caption: "Bump Time",
                columns: [
                    {
                        caption: "Week " + $scope.startWeek,
                        columns: [
                            { caption: "Make Table", dataField: "AvgMakeTable", dataType: "number", customizeText: formatTime },
                            { caption: "Cut Table", dataField: "AvgCutTable", dataType: "number", customizeText: formatTime },
                            { caption: "Dispatch", dataField: "AvgDispatchTime", dataType: "number", customizeText: formatTime },
                            { caption: "Delivery", dataField: "AvgDeliveryTime", dataType: "number", customizeText: formatTime },                                                    ]
                    },
                    {
                        caption: "Week " + $scope.endWeek,
                        columns: [
                            { caption: "Make Table", dataField: "AvgMakeTable2", dataType: "number", customizeText: formatTime },
                            { caption: "Cut Table", dataField: "AvgCutTable2", dataType: "number", customizeText: formatTime },
                            { caption: "Dispatch", dataField: "AvgDispatchTime2", dataType: "number", customizeText: formatTime },
                            { caption: "Delivery", dataField: "AvgDeliveryTime2", dataType: "number", customizeText: formatTime }, 
                        ]
                    }],
                fixed: true
            },
            
        ],
        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (e.data.Summary === true) {
                    //e.rowElement.addClass('place');
                    e.rowElement.css({ 'font-weight': 'bold' }); 
                }
                //else {
                //    e.data.place = "";
                //}
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
                if (gridCell.rowType === 'data') {
                    if (gridCell.data.Summary === true) {
                        options.font.bold = true;
                        options.backgroundColor = '#FFBB00';
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
    };

}