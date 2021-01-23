'use strict';
app.controller('bonustransactionsCtrl', bonustransactionsCtrl);
function bonustransactionsCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q, localStorageService) {
    var ctrl = this;
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
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: (new Date()).addDays(-2),
            labelLocation: "top", // or "left" | "right"  

        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: (new Date()).addDays(-1),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
        }
    };
    function getFilter() { //"and",["!",["OrderType","=",""]]
        var fdate = new Date($scope.DateRange.fromDate.value.getFullYear(), $scope.DateRange.fromDate.value.getMonth(), $scope.DateRange.fromDate.value.getDate());
        var tdate = new Date($scope.DateRange.toDate.value.getFullYear(), $scope.DateRange.toDate.value.getMonth(), $scope.DateRange.toDate.value.getDate());
        if ($scope.StoreID) {
            return [[["TransactionDate", ">=", fdate], "and", ["TransactionDate", "<=", $tdate]]];
        }
        else {
            var s;// = BuildUserStoresArray($rootScope.user.userstores);
            if (s)
                return [["TransactionDate", ">=", fdate], "and", ["TransactionDate", "<=", tdate], [s]];
            else
                return [["TransactionDate", ">=", fdate], "and", ["TransactionDate", "<=", tdate]];
        }
    };

    $scope.dataGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusTransactions", //dxPunchCardTransactions
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token
                    };
                }
            }
        }),        
        remoteOperations: { groupPaging: true },
        //filterValue: getFilter(),
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
        //filterPanel: { visible: true },
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
            { dataField: "id" },
<<<<<<< HEAD
            "PersonID",
=======
>>>>>>> 073d7b492605d9899b582e654c846965f5bb5425
            "PersonName",
            "RuleName",
            { dataField: "TransactionDate", caption: "TransactionDate", dataType: "date", format: 'dd.MM.yyyy' },
            { dataField: "Earned", dataType: "number", caption: "Earned",  format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Spended", dataType: "number", caption: "Spended",  format: { type: "fixedPoint", precision: 2 } },
            "Store",
            "StoreType",
            { dataField: "OrderAmount", dataType: "number", caption: "OrderAmount",  format: { type: "fixedPoint", precision: 2 } },
            //{ dataField: "OrderAmount", dataType: "number", name:"AvgOrderAmount", caption: "AvgOrderAmount",  format: { type: "fixedPoint", precision: 2 } },
            "OrderID",
            "OrderType",
            "OrderNumber",
            "OrderSource",
            "Confirmed"
        ],
        summary: {
            totalItems: [{ column: "id", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "PersonName", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
             { column: "Earned", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
             { column: "Spended", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
             { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
             //{ column: "OrderAmount", name:"OrderAmount",showInColumn: "AvgOrderAmount" ,summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" }
               // { column: "InTime", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
               // { column: "WorkingHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true }
            ],
            groupItems: [
                { column: "id", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "PersonName", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "Earned", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                { column: "Spended", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                { column: "OrderAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true},
                //{ column: "OrderAmount", summaryType: "avg", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true}
                //{ column: "InTime", summaryType: "count", displayFormat: "{0}", alignByColumn: true },
                //{ column: "WorkingHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true}
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
            fileName: "bonustransactions",
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