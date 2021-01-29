'use strict';
app.controller('callcenterordersCtrl', callcenterordersCtrl);
function callcenterordersCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
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
            $("#sales").dxPivotGrid("instance").getDataSource().state({});
        }
    };
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
    function getFilter() {
        return [["OperationDate", ">=", $scope.DateRange.fromDate.value], "and", ["OperationDate", "<=", $scope.DateRange.toDate.value]];
    }
    var store = new DevExpress.data.CustomStore({
        key: "StoreID",
        load: function (loadOptions) {
            var params = {
                StartDate: $scope.DateRange.fromDate.value,
                EndDate: $scope.DateRange.toDate.value
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/reports/callcenter/orders", { params: params })
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
        //filterValue: getFilter(),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: false,
        showRowLines: true,
        rowAlternationEnabled: true,
        showBorders: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        //remoteOperations: true,
        columns: [
            {
                dataField: "StoreID", caption: $translate.instant('callcenterorders.Store'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore"
                        })
                    }
                },
                fixed: true,
                //groupIndex: 0
            },
            { caption: $translate.instant('callcenterorders.OperationDate'), dataField: "OperationDate", dataType: "date", format: 'dd.MM.yyyy', fixed: true },
            { caption: $translate.instant('callcenterorders.OrderNumber'), dataField: "OrderNumber" },
            { caption: $translate.instant('callcenterorders.Amount'), dataField: "Amount", alignment: "right", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('callcenterorders.Phone'), dataField: "Phone" },
            { caption: $translate.instant('callcenterorders.Agent'), dataField: "Agent" },
            { caption: $translate.instant('callcenterorders.Person'), dataField: "Person" },
            { caption: $translate.instant('callcenterorders.Products'), dataField: "Products" },
        ],
        summary: {
            totalItems: [{ column: "id", summaryType: "count", displayFormat: "{0}" },
            { column: "OrderNumber", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
            { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true }
            ],
            groupItems: [{ column: "id", summaryType: "count", displayFormat: "{0}" },
            { column: "OrderNumber", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
            { column: "Amount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true }
            ]
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
            fileName: "callcenterorders",
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
        scrolling: { mode: "virtual" },
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