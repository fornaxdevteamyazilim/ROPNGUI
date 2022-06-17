'use strict';
app.controller('staffordersreportCtrl', staffordersreportCtrl);
function staffordersreportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
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
            $('#gridContainer').dxDataGrid('instance').state({});
        }
    };    
    var store = new DevExpress.data.CustomStore({
        key: "StoreID",
        load: function () {
            var params = {
                fromDate: $scope.DateRange.fromDate.value,
                toDate: $scope.DateRange.toDate.value
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/stafforders", { params: params })
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
            storageKey: "dx-staffordersr-storing"
        },
        columns: [
            // { dataField: "StoreID", dataType: "string", fixed: true },//, groupIndex: 0 },
            { caption:$translate.instant('reportfields.OrderID'), dataField: "id", dataType: "number", fixed: true, visible: true },//, groupIndex: 0 },
            { caption: $translate.instant('reportfields.Store'), dataField: "Store", dataType: "string", width: 230, fixed: true },//, groupIndex: 0 },
            { caption: $translate.instant('reportfields.StaffName'), dataField: "Alias", dataType: "string" },//, groupIndex: 0 },
            { caption: $translate.instant('reportfields.ShiftActive'),dataField: "ShiftActive", displayFormat: "bool" }, 
            { caption: $translate.instant('reportfields.UserRole'), dataField: "UserRole", dataType: "string" },//, groupIndex: 0 },
            { caption: $translate.instant('reportfields.OrderDate'), dataField: "OrderDate", dataType: "date", format: 'dd.MM.yyyy HH:mm', visible: false},
            { caption: $translate.instant('reportfields.OperationDate'), dataField: "OperationDate", dataType: "date", format: 'dd.MM.yyyy' },
            { caption: $translate.instant('reportfields.OrderItems'),dataField: "ois", dataType: "string" },
            { caption: $translate.instant('reportfields.OrderCost'), dataField: "OrderCost", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('reportfields.OrderAmount'), dataField: "OrderAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
                    
        ],
        summary: {
            totalItems: [{ column: "OrderID", summaryType: "count", displayFormat: "{0}" },
            { column: "OrderCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { name: "OrderAmount", showInColumn: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { column: "Alias", summaryType: "count", displayFormat: "{0}" },
            ],
            groupItems: [{ column: "OrderID", summaryType: "count", displayFormat: "{0}" },
            { column: "OrderCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 },displayFormat: "{0}", alignByColumn: true },
            { name: "OrderAmount", showInColumn: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "OrderID", summaryType: "count", displayFormat: "{0}" },
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
            fileName: "orderpaymentscheckReport",
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