﻿'use strict';
app.controller('SOSReportCtrl', SOSReportCtrl);
function SOSReportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    //DevExpress.localization.locale("tr");
    //Globalize.locale('tr');
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: new Date(Date.now())//new Date(Date.now() - 2 * 24*60*60*1000)
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: new Date(Date.now())//new Date(Date.now() - 1* 24*60*60*1000)
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
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        grouping: { autoExpandAll: false },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-sosreport-storing"
        },
        //columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        columns: [
            { caption: $translate.instant('sosreport.RegionManager'), dataField: "RegionManager", dataType: "string", width: 230, fixed: true },
            { caption: $translate.instant('sosreport.Store'), dataField: "Store", dataType: "string", width: 230, fixed: true },
            { caption: $translate.instant('sosreport.OrderSource'), dataField: "OrderSource", dataType: "string", fixed: true },
            { caption: $translate.instant('sosreport.StoreFilterType'), dataField: "StoreFilterType", dataType: "string", fixed: true, groupIndex: 0 },
            { caption: $translate.instant('sosreport.OperationDate'), dataField: "OperationDate", dataType: "date", format: 'dd.MM.yyyy', fixed: true, },
            { dataField: "GC", dataType: "number" },
            { dataField: "MakeU3", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "AvgMakeTable", dataType: "number", customizeText: formatTime },
            { dataField: "CutU11", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "AvgCutTable", dataType: "number", customizeText: formatTime },
            { caption: "AvgBOHTime", dataField: "AvgBOHTime", dataType: "number", customizeText: formatTime },
            { caption: "DLV GC", dataField: "DeliveryGC", dataType: "number", },
            { caption: "DLV GC %", dataField: "DeliveryGCPercent", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "DispatchU14", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "AvgDispatchTime", dataType: "number", customizeText: formatTime },
            { dataField: "AvgCutToDispatchTime", dataType: "number", customizeText: formatTime },
            //{ dataField: "DeliveryU30", dataType: "number", format: { type: "percent", precision: 2 } },
            { dataField: "AvgDeliveryTime", dataType: "number", customizeText: formatTime },
            { dataField: "AvgDriveTime", dataType: "number", customizeText: formatTime },
            { caption: "DLV 0-30 GC", dataField: "Delivery0_30GC", dataType: "number" },
            { caption: "Avg 0-30", dataField: "AvgDeliveryTime0_30", dataType: "number", customizeText: formatTime },
            { caption: "DLV 0-30 %", dataField: "Delivery0_30", dataType: "number", format: { type: "percent", precision: 2 }, skipEmptyValues: true },
            { caption: "DLV 30-40 GC", dataField: "Delivery30_40GC", dataType: "number" },
            { caption: "Avg 30-40", dataField: "AvgDeliveryTime30_40", dataType: "number", customizeText: formatTime },
            { caption: "DLV 30-40 %", dataField: "Delivery30_40", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "DLV 40-60 GC", dataField: "Delivery40_60GC", dataType: "number" },
            { caption: "Avg 40-60", dataField: "AvgDeliveryTime40_60", dataType: "number", customizeText: formatTime },
            { caption: "DLV 40-60 %", dataField: "Delivery40_60", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "DLV >60 GC", dataField: "Delivery60_GC", dataType: "number" },
            { caption: "Avg >60", dataField: "AvgDeliveryTime60_", dataType: "number", customizeText: formatTime },
            { caption: "DLV >60 %", dataField: "Delivery60_", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: $translate.instant('sosreport.OrdersPerDispach'), dataField: "OrderOvelap", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('sosreport.SingleDispatch'), dataField: "SingleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: $translate.instant('sosreport.DoubleDispatch'), dataField: "DoubleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: $translate.instant('sosreport.TripleDispatch'), dataField: "TripleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: $translate.instant('sosreport.MoreDispatch'), dataField: "MoreDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
            { caption: "YS Serving", dataField: "YS_Serving", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "YS Speed", dataField: "YS_Speed", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "YS Flavor", dataField: "YS_Flavor", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: "YS Avg", dataField: "YS", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
        ],
        summary: {
            totalItems: [{ column: "GC", summaryType: "sum", displayFormat: "{0}" },
            { column: "MakeU3", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "AvgMakeTable", summaryType: "avg", customizeText: formatTime },
            { column: "CutU11", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { column: "AvgCutTable", summaryType: "avg", customizeText: formatTime },
            { column: "AvgBOHTime", summaryType: "avg", customizeText: formatTime },
            { column: "DeliveryGC", summaryType: "sum", displayFormat: "{0}" },
            { column: "DeliveryGCPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "DispatchU14Summary", showInColumn: "DispatchU14", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "AvgDispatchTimeSummary", showInColumn: "AvgDispatchTime", summaryType: "custom", customizeText: formatTime },
            { name: "AvgCutToDispatchTimeSummary", showInColumn: "AvgCutToDispatchTime", summaryType: "custom", customizeText: formatTime },
            { name: "AvgDeliveryTimeSummary", showInColumn: "AvgDeliveryTime", summaryType: "custom", customizeText: formatTime },
            { name: "AvgDriveTimeSummary", showInColumn: "AvgDriveTime", summaryType: "custom", customizeText: formatTime },
            { column: "OrderOvelap", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { name: "SingleDispatchSummary", showInColumn: "SingleDispatch", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "DoubleDispatchSummary", showInColumn: "DoubleDispatch", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "TripleDispatchSummary", showInColumn: "TripleDispatch", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "MoreDispatchSummary", showInColumn: "MoreDispatch", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "Delivery0_30Summary", showInColumn: "Delivery0_30", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "AvgDeliveryTime0_30Summary", showInColumn: "AvgDeliveryTime0_30", summaryType: "custom", customizeText: formatTime },
            { column: "Delivery0_30GC", summaryType: "sum", displayFormat: "{0}" },
            { name: "Delivery30_40Summary", showInColumn: "Delivery30_40", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "AvgDeliveryTime30_40Summary", showInColumn: "AvgDeliveryTime30_40", summaryType: "custom", customizeText: formatTime },
            { column: "Delivery30_40GC", summaryType: "sum", displayFormat: "{0}" },
            { name: "Delivery40_60Summary", showInColumn: "Delivery40_60", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "AvgDeliveryTime40_60Summary", showInColumn: "AvgDeliveryTime40_60", summaryType: "custom", customizeText: formatTime },
            { column: "Delivery40_60GC", summaryType: "sum", displayFormat: "{0}" },
            { name: "Delivery60_Summary", showInColumn: "Delivery60_", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
            { name: "AvgDeliveryTime60_Summary", showInColumn: "AvgDeliveryTime60_", summaryType: "custom", customizeText: formatTime },
            { column: "Delivery60_GC", summaryType: "sum", displayFormat: "{0}" },
            { column: "YS_Serving", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "YS_Speed", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "YS_Flavor", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "YS", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [{ column: "GC", summaryType: "sum", displayFormat: "{0}" },
            { column: "MakeU3", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "AvgMakeTable", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
            { column: "CutU11", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "AvgCutTable", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
            { column: "AvgBOHTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
            { column: "DeliveryGC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "DeliveryGCPercent", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { name: "DispatchU14Summary", showInColumn: "DispatchU14", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { name: "AvgDispatchTimeSummary", showInColumn: "AvgDispatchTime", summaryType: "custom", customizeText: formatTime, alignByColumn: true },
            { name: "AvgCutToDispatchTimeSummary", showInColumn: "AvgCutToDispatchTime", summaryType: "custom", customizeText: formatTime, alignByColumn: true },
            { name: "AvgDeliveryTimeSummary", showInColumn: "AvgDeliveryTime", summaryType: "custom", customizeText: formatTime, alignByColumn: true },
            { name: "AvgDriveTimeSummary", showInColumn: "AvgDriveTime", summaryType: "custom", customizeText: formatTime, alignByColumn: true },
            { name: "OrderOvelapSummary", showInColumn: "OrderOvelap", summaryType: "custom", customizeText: formatTime, alignByColumn: true },
            { name: "SingleDispatchSummary", showInColumn: "SingleDispatch", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { name: "DoubleDispatchSummary", showInColumn: "DoubleDispatch", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { name: "TripleDispatchSummary", showInColumn: "TripleDispatch", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { name: "MoreDispatchSummary", showInColumn: "MoreDispatch", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { name: "Delivery0_30Summary", showInColumn: "Delivery0_30", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "Delivery0_30GC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { name: "AvgDeliveryTime0_30Summary", showInColumn: "AvgDeliveryTime0_30", summaryType: "custom", customizeText: formatTime, alignByColumn: true },
            { name: "Delivery30_40Summary", showInColumn: "Delivery30_40", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "Delivery30_40GC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "AvgDeliveryTime30_40", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
            { name: "Delivery40_60Summary", showInColumn: "Delivery40_60", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "Delivery40_60GC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { column: "AvgDeliveryTime40_60", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
            { name: "Delivery60_Summary", showInColumn: "Delivery60_", summaryType: "custom", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
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
                            if (options.value.Delivery0_30GC && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.Delivery0_30GC;
                                options.dg = options.dg + options.value.DeliveryGC;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "DispatchU14Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.DispatchU14 && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.DispatchU14;
                                options.dg = options.dg + 1;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "AvgDispatchTimeSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.AvgDispatchTime && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.AvgDispatchTime;
                                options.dg = options.dg + 1;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }

                if (options.name === "AvgCutToDispatchTimeSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.AvgCutToDispatchTime && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.AvgCutToDispatchTime;
                                options.dg = options.dg + 1;
                            }
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
                            if (options.value.Delivery30_40GC && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.Delivery30_40GC;
                                options.dg = options.dg + options.value.DeliveryGC;
                            }
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
                            if (options.value.Delivery40_60GC && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.Delivery40_60GC;
                                options.dg = options.dg + options.value.DeliveryGC;
                            }
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
                            if (options.value.Delivery60_GC && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.Delivery60_GC;
                                options.dg = options.dg + options.value.DeliveryGC;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "SingleDispatchSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.SingleDispatchCount && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.SingleDispatchCount;
                                options.dg = options.dg + options.value.DeliveryGC;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "DoubleDispatchSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.DoubleDispatchCount && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.DoubleDispatchCount;
                                options.dg = options.dg + options.value.DeliveryGC;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "TripleDispatchSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.TripleDispatchCount && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.TripleDispatchCount;
                                options.dg = options.dg + options.value.DeliveryGC;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "MoreDispatchSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.MoreDispatchCount && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.MoreDispatchCount;
                                options.dg = options.dg + options.value.DeliveryGC;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "AvgDeliveryTimeSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.AvgDeliveryTime && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.AvgDeliveryTime;
                                options.dg = options.dg + 1;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "OrderOvelapSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.OrderOvelap && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.OrderOvelap;
                                options.dg = options.dg + 1;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "AvgDeliveryTime0_30Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.AvgDeliveryTime0_30 && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.AvgDeliveryTime0_30;
                                options.dg = options.dg + 1;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "AvgDeliveryTime30_40Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.AvgDeliveryTime30_40 && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.AvgDeliveryTime30_40;
                                options.dg = options.dg + 1;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "AvgDeliveryTime40_60Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.AvgDeliveryTime40_60 && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.AvgDeliveryTime40_60;
                                options.dg = options.dg + 1;
                            }
                            break;
                        case "finalize":
                            options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
                if (options.name === "AvgDeliveryTime60_Summary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.dg = 0;
                            break;
                        case "calculate":
                            if (options.value.AvgDeliveryTime60_ && options.value.DeliveryGC > 0 && options.value.StoreFilterType == "DELIVERY") {
                                options.totalValue = options.totalValue + options.value.AvgDeliveryTime60_;
                                options.dg = options.dg + 1;
                            }
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