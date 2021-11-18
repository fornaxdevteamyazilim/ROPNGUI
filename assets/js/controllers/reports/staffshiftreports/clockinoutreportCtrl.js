'use strict';
app.controller('clockinoutreportCtrl', clockinoutreportCtrl);
function clockinoutreportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q, localStorageService) {
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();

    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    }
    Date.prototype.addDays = Date.prototype.addDays || function (days) {
        return this.setTime(864E5 * days + this.valueOf()) && this;
    };
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: (new Date()).addDays(1),
            labelLocation: "top", // or "left" | "right"  

        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: (new Date()).addDays(1),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
        }
    };
    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            var gridDS = dataGrid.getDataSource();
            dataGrid.clearFilter();
            gridDS.filter(getFilter());
            dataGrid.refresh();
        }
    };
    $scope.inittable=function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        var gridDS = dataGrid.getDataSource();
        gridDS.filter(getFilter());
        dataGrid.refresh();
    }
    function isNotEmpty(value) {
        return value !== undefined && value !== null && value !== "";
    };
    function formatTime(cellInfo) {
        var sec = cellInfo.value * 60 * 1000 * 60;
        var dateObj = new Date(sec);
        var hours = dateObj.getUTCHours();
        var minutes = dateObj.getUTCMinutes();
        var seconds = dateObj.getSeconds();
        var timeString = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
        return timeString;
    };
    function BuildUserStoresArray(src) {
        var result = [];
        if (src) {
            for (var i = 0; i < src.length; i++) {
                result.push(["StoreID", "=", src[i].id]);
                if (src.length > 0)
                    result.push("or");
            }
        }
        else
            return null;
        return result;
    }
    function getFilter() { //"and",["!",["OrderType","=",""]]
        var fdate = new Date($scope.DateRange.fromDate.value.getFullYear(), $scope.DateRange.fromDate.value.getMonth(), $scope.DateRange.fromDate.value.getDate());
        var tdate = new Date($scope.DateRange.toDate.value.getFullYear(), $scope.DateRange.toDate.value.getMonth(), $scope.DateRange.toDate.value.getDate());

        if ($scope.StoreID) {
            return [[["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", tdate]], "and", ["StoreID", "=", $scope.StoreID]];
        }
        else {
            //var s= BuildUserStoresArray($rootScope.user.userstores);
            //if (s)
            //    return [["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", tdate], [s]];
            //else
                return [["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", tdate]];
        }
    };
    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxClockInOuts",
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token
                    };
                }
            }
        }),
        filterValue: getFilter(),
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
        filterPanel: { visible: true },
        headerFilter: {
            visible: true
        },
        grouping: {
            autoExpandAll: false
        },
        searchPanel: {
            visible: true
        },
        groupPanel: {
            visible: true
        },
        columnChooser: {
            enabled: false
        },
        columnFixing: {
            enabled: true
        },
        remoteOperations: true,
        columns: [
            {
                dataField: "StoreID", caption: $translate.instant('clockinoutreport.Store'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {

                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token
                                    };
                                }
                            }
                        })
                    }
                },
                fixed: true,
                //groupIndex: 0
            },
            {
                dataField: "NGUserID", caption: $translate.instant('clockinoutreport.User'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "FullName",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAllUsers",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {

                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token
                                    };
                                }
                            }
                        })
                    }
                },
                fixed: true,
                //groupIndex: 1
            },
            { caption: $translate.instant('clockinoutreport.OperationDate'), dataField: "OperationDate", dataType: "date", format: 'dd.MM.yyyy', fixed: true },
            { caption: $translate.instant('clockinoutreport.WorkingHours'), dataField: "WorkingHours", dataType: "number", customizeText: formatTime },
            { caption: $translate.instant('clockinoutreport.InTime'), dataField: "InTime", dataType: "datetime", format: 'HH:mm', sortOrder: "desc" },
            { caption: $translate.instant('clockinoutreport.OutTime'), dataField: "OutTime", dataType: "datetime", format: 'HH:mm' },
            { caption: $translate.instant('clockinoutreport.InIPAddress'), dataField: "InIPAddress" },
            { caption: $translate.instant('clockinoutreport.OutIPAddress'), dataField: "OutIPAddress" },
            { caption: $translate.instant('clockinoutreport.isActive'), dataField: "isActive" }
        ],
        summary: {
            totalItems: [{ column: "NGUserID", summaryType: "count", displayFormat: "{0}" },
            { column: "InTime", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
            { column: "WorkingHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true }],
            groupItems: [{ column: "NGUserID", summaryType: "count", displayFormat: "{0}" },
            { column: "InTime", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
            { column: "WorkingHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true }]
        },
        //columns: [
        //    { dataField: "RegionManager", dataType: "string", width: 230, fixed: true },
        //    { dataField: "Store", dataType: "string", width: 230, fixed: true },//, groupIndex: 0 },
        //    { dataField: "OperationDate", dataType: "date", format: 'dd.MM.yyyy', fixed: true, },
        //    { dataField: "GC", dataType: "number" }, { dataField: "MakeU3", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { dataField: "AvgMakeTable", dataType: "number", customizeText: formatTime },
        //    { dataField: "CutU11", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { dataField: "AvgCutTable", dataType: "number", customizeText: formatTime },
        //    { caption: "AvgBOHTime", dataField: "AvgBOHTime", dataType: "number", customizeText: formatTime },
        //    { dataField: "DeliveryGC", dataType: "number", },
        //    { dataField: "DispatchU14", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { dataField: "AvgDispatchTime", dataType: "number", customizeText: formatTime },
        //    { dataField: "AvgCutToDispatchTime", dataType: "number", customizeText: formatTime },
        //    { dataField: "DeliveryU30", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { dataField: "AvgDeliveryTime", dataType: "number", customizeText: formatTime },
        //    { dataField: "AvgDriveTime", dataType: "number", customizeText: formatTime },
        //    { dataField: "DeliveryA40", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { dataField: "DeliveryA60", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { caption: "Orders Per Dispach", dataField: "OrderOvelap", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
        //    { dataField: "SingleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { dataField: "DoubleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { dataField: "TripleDispatch", dataType: "number", format: { type: "percent", precision: 2 } },
        //    { dataField: "MoreDispatch", dataType: "number", format: { type: "percent", precision: 2 } }
        //],
        //summary: {
        //    totalItems: [{ column: "GC", summaryType: "sum", displayFormat: "{0}" },
        //    { column: "MakeU3", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
        //    { column: "AvgMakeTable", summaryType: "avg", customizeText: formatTime },
        //    { column: "CutU11", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },

        //    { column: "AvgCutTable", summaryType: "avg", customizeText: formatTime },
        //    { column: "AvgBOHTime", summaryType: "avg", customizeText: formatTime },
        //    { column: "DeliveryGC", summaryType: "sum", displayFormat: "{0}" },
        //    { column: "DispatchU14", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
        //    { column: "AvgDispatchTime", summaryType: "avg", customizeText: formatTime },
        //    { column: "AvgCutToDispatchTime", summaryType: "avg", customizeText: formatTime },
        //    { column: "DeliveryU30", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
        //    { column: "AvgDeliveryTime", summaryType: "avg", customizeText: formatTime },
        //    { column: "AvgDriveTime", summaryType: "avg", customizeText: formatTime },
        //    { column: "DeliveryA40", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
        //    { column: "DeliveryA60", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
        //    { column: "OrderOvelap", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
        //    { column: "SingleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
        //    { column: "DoubleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
        //    { column: "TripleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" },
        //    { column: "MoreDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}" }
        //    ],
        //    groupItems: [{ column: "GC", summaryType: "sum", displayFormat: "{0}" },
        //    { column: "MakeU3", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "AvgMakeTable", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
        //    { column: "CutU11", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

        //    { column: "AvgCutTable", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
        //    { column: "AvgBOHTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
        //    { column: "DeliveryGC", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
        //    { column: "DispatchU14", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "AvgDispatchTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
        //    { column: "AvgCutToDispatchTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
        //    { column: "DeliveryU30", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "AvgDeliveryTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
        //    { column: "AvgDriveTime", summaryType: "avg", customizeText: formatTime, alignByColumn: true },
        //    { column: "DeliveryA40", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "DeliveryA60", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "OrderOvelap", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "SingleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "DoubleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "TripleDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //    { column: "MoreDispatch", summaryType: "avg", valueFormat: { type: "percent", precision: 2 }, displayFormat: "{0}", alignByColumn: true }
        //    ]
        //},
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
            fileName: "ClockInOutData",
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