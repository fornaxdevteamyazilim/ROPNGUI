﻿'use strict';
app.controller('SOSReportCtrl', SOSReportCtrl);
function SOSReportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    DevExpress.localization.locale("tr");
    //Globalize.locale('tr');
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
        return (cellInfo.value)?timeString:"-";
    };
    var store = new DevExpress.data.CustomStore({
        key: "StoreID",
        load: function (loadOptions) {
            var params = {
                fromDate: $scope.DateRange.fromDate.value,
                toDate: $scope.DateRange.toDate.value
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/fsr/sos", { params: params })
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
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: {
            visible: true
        },
        headerFilter: {
            visible: true
        },
        searchPanel: {
            visible: true
        },
        groupPanel: {
            visible: true
        },
        grouping: {
            autoExpandAll: false
        },
        columnChooser: {
            enabled: false
        },
        columnFixing: {
            enabled: true
        },
        columns: [
            { dataField: "RegionManager", dataType: "string", width: 230, fixed: true  },
            { dataField: "Store", dataType: "string", width: 230, fixed: true },
            { dataField: "OrderSource", dataType: "string", fixed: true },
            { caption: "StoreType", dataField: "StoreFilterType", dataType: "string", fixed: true, groupIndex: 0 },
            { dataField: "OperationDate", dataType: "date", format: 'dd.MM.yyyy', fixed: true, },
            { dataField: "GC", dataType: "number" }, { dataField: "MakeU3", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "AvgMakeTable", dataType: "number", customizeText: formatTime },
            { dataField: "CutU11", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "AvgCutTable", dataType: "number", customizeText: formatTime},
            { caption: "AvgBOHTime", dataField: "AvgBOHTime", dataType: "number", customizeText: formatTime },
            { caption: "DLV GC",dataField: "DeliveryGC", dataType: "number", },
            { caption: "DLV GC %",dataField: "DeliveryGCPercent", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "DispatchU14", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "AvgDispatchTime", dataType: "number", customizeText: formatTime },
            { dataField: "AvgCutToDispatchTime", dataType: "number", customizeText: formatTime },
            //{ dataField: "DeliveryU30", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "AvgDeliveryTime", dataType: "number", customizeText: formatTime },
            { dataField: "AvgDriveTime", dataType: "number", customizeText: formatTime },
            { caption: "DLV 0-30 GC",dataField: "Delivery0_30GC", dataType: "number" },
            { caption: "Avg 0-30",dataField: "AvgDeliveryTime0_30", dataType: "number", customizeText: formatTime },
            { caption: "DLV 0-30 %", dataField: "Delivery0_30", dataType: "number", format: { type: "percent", precision: 2 }, skipEmptyValues :true },
            { caption: "DLV 30-40 GC",dataField: "Delivery30_40GC", dataType: "number" },
            { caption: "Avg 30-40",dataField: "AvgDeliveryTime30_40", dataType: "number", customizeText: formatTime },
            { caption: "DLV 30-40 %",dataField: "Delivery30_40", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "DLV 40-60 GC",dataField: "Delivery40_60GC", dataType: "number" },
            { caption: "Avg 40-60",dataField: "AvgDeliveryTime40_60", dataType: "number", customizeText: formatTime },
            { caption: "DLV 40-60 %",dataField: "Delivery40_60", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "DLV >60 GC",dataField: "Delivery60_GC", dataType: "number" },
            { caption: "Avg >60",dataField: "AvgDeliveryTime60_", dataType: "number", customizeText: formatTime },
            { caption: "DLV >60 %", dataField: "Delivery60_", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "Orders Per Dispach", dataField: "OrderOvelap", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "SingleDispatch",dataField: "SingleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "DoubleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "TripleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "MoreDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "YS Serving", dataField: "YS_Serving", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "YS Speed", dataField: "YS_Speed", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "YS Flavor", dataField: "YS_Flavor", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "YS Avg", dataField: "YS", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
        ],
        summary: {            
            totalItems: [{ column: "GC", summaryType: "sum", displayFormat: "{0}" },
                { column: "MakeU3", summaryType: "avg", valueFormat: { type: "percent", precision: 2 },displayFormat: "{0}" },
                { column: "AvgMakeTable", summaryType: "avg", customizeText: formatTime },
                { column: "CutU11", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}"},
                { column: "AvgCutTable", summaryType: "avg", customizeText: formatTime },
                { column: "AvgBOHTime", summaryType: "avg", customizeText: formatTime },
                { column: "DeliveryGC", summaryType: "sum", displayFormat: "{0}" },
                { column: "DeliveryGCPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "DispatchU14", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "AvgDispatchTime", summaryType: "avg", customizeText: formatTime },
                { column: "AvgCutToDispatchTime", summaryType: "avg", customizeText: formatTime },
                //{ column: "DeliveryU30", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "AvgDeliveryTime", summaryType: "avg", customizeText: formatTime },
                { column: "AvgDriveTime", summaryType: "avg", customizeText: formatTime },
                { column: "OrderOvelap", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}"},
                { column: "SingleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "DoubleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "TripleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "MoreDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { name: "Delivery0_30Summary", showInColumn: "Delivery0_30", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                //{ column: "Delivery0_30", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "AvgDeliveryTime0_30", summaryType: "avg", customizeText: formatTime },
                { column: "Delivery0_30GC", summaryType: "sum", displayFormat: "{0}" },
                { name: "Delivery30_40Summary", showInColumn: "Delivery30_40", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                //{ column: "Delivery30_40", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "AvgDeliveryTime30_40", summaryType: "avg", customizeText: formatTime },
                { column: "Delivery30_40GC", summaryType: "sum", displayFormat: "{0}" },
                { name: "Delivery40_60Summary", showInColumn: "Delivery40_60", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                //{ column: "Delivery40_60", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "AvgDeliveryTime40_60", summaryType: "avg", customizeText: formatTime },
                { column: "Delivery40_60GC", summaryType: "sum", displayFormat: "{0}" },
                { name: "Delivery60_Summary", showInColumn: "Delivery60_", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                //{ column: "Delivery60_", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
                { column: "AvgDeliveryTime60_", summaryType: "avg", customizeText: formatTime },
                { column: "Delivery60_GC", summaryType: "sum", displayFormat: "{0}" },
                { column: "YS_Serving", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "YS_Speed", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "YS_Flavor", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                { column: "YS", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [{ column: "GC", summaryType: "sum", displayFormat: "{0}" },
                { column: "MakeU3", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" ,alignByColumn:true},
                { column: "AvgMakeTable", summaryType: "avg", customizeText: formatTime, alignByColumn: true},
                { column: "CutU11", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                { column: "AvgCutTable", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
                { column: "AvgBOHTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
                { column: "DeliveryGC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "DeliveryGCPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                { column: "DispatchU14", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgDispatchTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true},
                { column: "AvgCutToDispatchTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true},
                //{ column: "DeliveryU30", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvgDeliveryTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true},
                { column: "AvgDriveTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true},
                { column: "OrderOvelap", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                { column: "SingleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                { column: "DoubleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                { column: "TripleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                { column: "MoreDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { name: "Delivery0_30Summary", showInColumn: "Delivery0_30", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "Delivery0_30", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "Delivery0_30GC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true  },
                { column: "AvgDeliveryTime0_30", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
                { name: "Delivery30_40Summary", showInColumn: "Delivery30_40", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "Delivery30_40", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "Delivery30_40GC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "AvgDeliveryTime30_40", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
                { name: "Delivery40_60Summary", showInColumn: "Delivery40_60", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "Delivery40_60", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "Delivery40_60GC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "AvgDeliveryTime40_60", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
                { name: "Delivery60_Summary", showInColumn: "Delivery60_", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                //{ column: "Delivery60_", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "Delivery60_GC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
                { column: "AvgDeliveryTime60_", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
                { column: "YS_Serving", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "YS_Speed", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "YS_Flavor", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "YS", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ],
            calculateCustomSummary: function (options) {
                if (options.name === "Delivery0_30Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.Delivery0_30GC) 
                                options.totalValue = options.totalValue + options.value.Delivery0_30GC;
                            options.dg = options.dg + options.value.DeliveryGC;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "Delivery30_40Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.Delivery30_40GC) 
                                options.totalValue = options.totalValue + options.value.Delivery30_40GC;
                            options.dg = options.dg + options.value.DeliveryGC;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "Delivery40_60Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.Delivery40_60GC) 
                                options.totalValue = options.totalValue + options.value.Delivery40_60GC;
                            options.dg = options.dg + options.value.DeliveryGC;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "Delivery60_Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.Delivery60_GC) 
                                options.totalValue = options.totalValue + options.value.Delivery60_GC;
                            options.dg = options.dg + options.value.DeliveryGC;
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
            }
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
                fileName: "SpeeOfServiceReport",
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