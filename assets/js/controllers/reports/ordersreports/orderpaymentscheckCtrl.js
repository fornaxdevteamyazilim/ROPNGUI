'use strict';
app.controller('orderpaymentscheckCtrl', orderpaymentscheckCtrl);
function orderpaymentscheckCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
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

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/orderpaymentscheck", { params: params })
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
            storageKey: "dx-orderpaymentscheck-storing"
        },
        columns: [
            // { dataField: "StoreID", dataType: "string", fixed: true },//, groupIndex: 0 },
            { caption:$translate.instant('reportfields.OrderID'), dataField: "OrderID", dataType: "string", fixed: true, visible: false },//, groupIndex: 0 },
            { caption: $translate.instant('reportfields.Store'), dataField: "Store", dataType: "string", width: 230, fixed: true },//, groupIndex: 0 },
            { caption: $translate.instant('reportfields.RegionManager'), dataField: "RegionManager", dataType: "string", width: 230, fixed: true, visible: false },
            { caption: $translate.instant('reportfields.StoreFilterType'), dataField: "StoreFilterType", dataType: "string", visible: false },//, groupIndex: 0 },
            { caption: $translate.instant('reportfields.StoreType'), dataField: "StoreType", dataType: "string", visible: false },
            { caption: $translate.instant('reportfields.OrderDate'), dataField: "OrderDate", dataType: "date", format: 'dd.MM.yyyy HH:mm' },
            { caption: $translate.instant('reportfields.OrderNumber'),  dataField: "OrderNumber", dataType: "string" },
            { caption: $translate.instant('reportfields.User'),dataField: "User", dataType: "string" },
            { caption: $translate.instant('reportfields.OrderAmount'), dataField: "OrderAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('reportfields.PaymentAmount'), dataField: "PaymentAmount", dataType: "number", format: { type: "fixedPoint", precision: 2 } },
            { caption: $translate.instant('reportfields.DeclaredPayment'), dataField: "DeclaredPaymntType", dataType: "string" },
            { caption: $translate.instant('reportfields.ActualPayment'), dataField: "ActualPaymentType", dataType: "string" },
            { caption: $translate.instant('reportfields.isAutomatic'),dataField: "isAutomaticPayment", displayFormat: "bool", },
            { caption: $translate.instant('reportfields.isDfferent'), dataField: "isDfferent", displayFormat: "bool",visible: false },
            { caption: $translate.instant('reportfields.Driver'),dataField: "Driver", dataType: "string" },
            { caption: $translate.instant('reportfields.OutDate'), dataField: "OutDate", dataType: "date", format: 'HH:mm:ss' },
            { caption: $translate.instant('reportfields.PaymentDate'), dataField: "PaymentDate", dataType: "date", format: 'HH:mm:ss' },
            
        ],
        summary: {
            totalItems: [{ column: "OrderID", summaryType: "count", displayFormat: "{0}" },
            { column: "PaymentAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            { name: "OrderAmountSummary", showInColumn: "OrderAmount", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [{ column: "OrderID", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
            { column: "PaymentAmount", summaryType: "sum", displayFormat: "{0}", alignByColumn: true },
            { name: "OrderAmountSummary", showInColumn: "OrderAmount", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
            calculateCustomSummary: function (options) {
                if (options.name === "OrderAmountSummary") {
                    switch (options.summaryProcess) {
                        case "start":
                            options.totalValue = 0;
                            options.ids = [];
                            break;
                        case "calculate":
                            if (options.ids.indexOf(options.value.OrderID) == -1) {
                                options.totalValue = options.totalValue + options.value.OrderAmount;
                                options.ids.push(options.value.OrderID);
                            }
                            break;
                        case "finalize":
                            //options.totalValue = options.totalValue / options.dg;
                            break;
                    }
                }
            },
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