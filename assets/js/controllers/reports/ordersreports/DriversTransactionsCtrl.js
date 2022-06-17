'use strict';
app.controller('DriversTransactionsCtrl', DriversTransactionsCtrl);
function DriversTransactionsCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});

    //DevExpress.localization.locale("tr");
    //Globalize.locale('tr');
    $scope.DateRange = {
        StartDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.StartDate.value"
            },
            value: new Date()
        },
        EndDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.EndDate.value"
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
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    };    
    var store = new DevExpress.data.CustomStore({
        //key: "StoreID",
        load: function () {
            var params = {
                StartDate: $scope.DateRange.StartDate.value,
                EndDate: $scope.DateRange.EndDate.value
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/DriversTransactions", { params: params })
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
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        grouping: { autoExpandAll: false },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-DriversTransactions-storing"
        },
        columns: [
            // { dataField: "StoreID", dataType: "string", fixed: true },//, groupIndex: 0 },
            { caption:$translate.instant('DriversTransactions.DriverName'), dataField: "DriverName", dataType: "string", fixed: true, visible: true },//, groupIndex: 0 },
            { caption: $translate.instant('DriversTransactions.StaffPositionName'), dataField: "StaffPositionName", dataType: "string", width: 230, fixed: true },//, groupIndex: 0 },
            { caption: $translate.instant('DriversTransactions.Phone'), dataField: "Phone", dataType: "number" },//, groupIndex: 0 },
            { caption: $translate.instant('DriversTransactions.CitizenshipID'),dataField: "CitizenshipID",dataType: "number" },//displayFormat: "bool" }, 
            { caption: $translate.instant('DriversTransactions.Store'), dataField: "Store", dataType: "string" },//, groupIndex: 0 },
            { caption: $translate.instant('DriversTransactions.UndeliveredOrders'), dataField: "UndeliveredOrders", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
            { caption: $translate.instant('DriversTransactions.TotalDeliveredOrders'), dataField: "TotalDeliveredOrders", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
            { caption: $translate.instant('DriversTransactions.SingleDispatchCount'), dataField: "SingleDispatchCount", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
            { caption: $translate.instant('DriversTransactions.DoubleDispatchCount'),dataField: "DoubleDispatchCount", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
            { caption: $translate.instant('DriversTransactions.SingleDispatchAmount'), dataField: "SingleDispatchAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('DriversTransactions.DoubleDispatchAmount'), dataField: "DoubleDispatchAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('DriversTransactions.TotalDispatchAmount'), dataField: "TotalDispatchAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('DriversTransactions.DailyRawAmount'), dataField: "DailyRawAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('DriversTransactions.TotalAmount'), dataField: "TotalAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('DriversTransactions.TotalDays'), dataField: "TotalDays", dataType: "number", format: { type: "fixedPoint", precision: 0 } },
        ],
        summary: {
            totalItems: [
                { column: "UndeliveredOrders", summaryType: "sum", displayFormat: "{0}" },
            { column: "TotalDeliveredOrders", summaryType: "sum", displayFormat: "{0}" },
            { column: "SingleDispatchCount", summaryType: "sum", displayFormat: "{0}" },
            { column: "DoubleDispatchCount", summaryType: "sum", displayFormat: "{0}" },
            { column: "SingleDispatchAmount",  summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "DoubleDispatchAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalDispatchAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "DailyRawAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
           
            ],
            groupItems: [
                { column: "UndeliveredOrders", summaryType: "sum", displayFormat: "{0}" },
            { column: "TotalDeliveredOrders", summaryType: "count", displayFormat: "{0}" },
            { column: "SingleDispatchCount", summaryType: "count", displayFormat: "{0}" },
            { column: "DoubleDispatchCount", summaryType: "count", displayFormat: "{0}" },
            { column: "SingleDispatchAmount",  summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "DoubleDispatchAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 },displayFormat: "{0}", alignByColumn: true },
            { column: "TotalDispatchAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "TotalAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "DailyRawAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            
            ],
            
        },

        onRowPrepared: function (e) {
            if (e.rowType === 'data') {
                if (e.data.isDfferent) {
                    //e.rowElement.addClass('place');
                    e.rowElement.css({ 'color': 'red' });
                }
                //else {
                //    e.data.place = "";
                //}
            }
        },
        export: {
            enabled: true,
            fileName: "DriversTransactions",
            customizeExcelCell: (options) => {
                var gridCell = options.gridCell;
                if (!gridCell) {
                    return;
                }
                if (gridCell.rowType === 'data') {
                    if (gridCell.data.isDfferent === true) {
                        //options.font.bold = true;
                        options.backgroundColor = '#FFBB00';
                    }
                }
            }
        },
        scrolling: {
            mode: "virtual"
        },
        height: 600,
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