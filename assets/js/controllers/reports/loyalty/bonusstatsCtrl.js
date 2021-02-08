'use strict';
app.controller('bonusstatsCtrl', bonusstatsCtrl);
function bonusstatsCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q, localStorageService) {
    var ctrl = this;
    $scope.focusedRowKey = null;
    $scope.AddCustomBonusEnable= ($rootScope.user && $rootScope.user.restrictions && $rootScope.user.restrictions.addcustombonus == 'Enable');
    $scope.PersonName = "";
    $scope.focusedRowKeyOptions = { step: 0, bindingOptions: { value: 'focusedRowKey' }, readOnly: true };
    $scope.PersonNameOptions = { bindingOptions: { value: 'PersonName' }, readOnly: true, };
    $scope.Amount = 10;
    $scope.AmountOptions = {
        value: 10, min: 1, max: 100, showSpinButtons: true, step: 5, bindingOptions: { value: 'Amount' },
        onValueChanged: function (data) {
            $scope.Amount = data.value;
        }
    };
    $scope.rule = null;
    $scope.notes = null;
    $scope.notesOptions = {
        bindingOptions: { value: 'notes' }, placeholder: "Enter notes...",
        onValueChanged: function (data) {
            $scope.notes = data.value;
        }
    };
    $scope.AddCustomButtonOptions = {
        text: 'Add Bonus',
        onClick: function () {
            if (!$scope.rule)
                {
                    toaster.pop('error', "Select Rule!!!", "error");
                    return;
                }
            var data = {
                PersonID: $scope.focusedRowKey,
                BonusTransactionTypeID: 0,
                Amount: $scope.Amount,
                BounsRuleID: $scope.rule,
                TransactionDate: new Date(),
                Confirmed: true,
                Notes: $scope.notes
            }
            $http.post(NG_SETTING.apiServiceBaseUri + "/api/BonusTransaction", JSON.stringify(data)).then(function (response) {
                toaster.pop("success", "PointsAdded", "successfull");
                $('#gridContainer').dxDataGrid('instance').refresh();
            }, function (response) { toaster.pop('error', "Error", "error"); });
        }
    };
    $http.get(NG_SETTING.apiServiceBaseUri + "/api/dxBonusRules", { params: {} })
        .then(function (response) {
            $scope.rule = response.data[0];
        }, function (response) {
            return $q.reject("dxBonusRules Loading Error");
        });
    $scope.ruleOptions = {
        dataSource: new DevExpress.data.CustomStore({
            key: "id",
            load: function (loadOptions) {
                var params = {};
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/dxBonusRules", { params: params })
                    .then(function (response) {
                        return response.data;

                    }, function (response) {
                        return $q.reject("Data Loading Error");
                    });
            }
        }),
        displayExpr: "name",
        valueExpr: "id",
        //value: products[0].ID,
        bindingOptions: { value: 'rule' },
        onValueChanged: function (data) {
            $scope.rule = data.value;
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
    Date.prototype.addDays = function (days) {
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
            key: "PersonID",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxBonusStats", //dxPunchCardTransactions
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token
                    };
                }
            }
        }),
        onFocusedRowChanging: function (e) {
            var rowsCount = e.component.getVisibleRows().length,
                pageCount = e.component.pageCount(),
                pageIndex = e.component.pageIndex(),
                key = e.event && e.event.key;

            if (key && e.prevRowIndex === e.newRowIndex) {
                if (e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
                    e.component.pageIndex(pageIndex + 1).done(function () {
                        e.component.option("focusedRowIndex", 0);
                    });
                } else if (e.newRowIndex === 0 && pageIndex > 0) {
                    e.component.pageIndex(pageIndex - 1).done(function () {
                        e.component.option("focusedRowIndex", rowsCount - 1);
                    });
                }
            }
        },
        onFocusedRowChanged: function (e) {
            var rowData = e.row && e.row.data;
            if (rowData) {
                $scope.PersonName = rowData.PersonName;
                // $scope.taskDetailsHtml = rowData.Task_Description;
                // $scope.taskStatus = rowData.Task_Status;
                // $scope.taskProgress = rowData.Task_Completion ? rowData.Task_Completion + "%" : "";
            }
        },
        bindingOptions: {
            focusedRowKey: 'focusedRowKey',
            //autoNavigateToFocusedRow: 'autoNavigateToFocusedRow'
        },
        focusedRowEnabled: ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.restrictions.CustomBonusAdding == 'Enable' ),
        //keyExpr: "PeronID",
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
        masterDetail: {
            enabled: true,
            template: "detail"
        },
        columns: [
            { caption: $translate.instant('bonusstats.PersonID'), dataField: "PersonID" },
            { caption: $translate.instant('bonusstats.PersonName'), dataField: "PersonName" },
            { caption: $translate.instant('bonusstats.Phone'), dataField: "Phone" },
            { dataField: "EarnedBonus", dataType: "number", caption: $translate.instant('bonusstats.Earned'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "SpendedBonus", dataType: "number", caption: $translate.instant('bonusstats.Spended'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "TotalBonus", dataType: "number", caption: $translate.instant('bonusstats.TotalBonus'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "NonConfirmedBonus", dataType: "number", caption: $translate.instant('bonusstats.NonConfirmedBonus'), format: { type: "fixedPoint", precision: 2 } },
            { dataField: "AvailableBonus", dataType: "number", caption: $translate.instant('bonusstats.AvailableBonus'), format: { type: "fixedPoint", precision: 2 } }
        ],
        summary: {
            totalItems: [{ column: "PersonID", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "PersonName", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "EarnedBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "SpendedBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "TotalBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "NonConfirmedBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            { column: "AvailableBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },

            ],
            groupItems: [
                { column: "PersonID", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "PersonName", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "EarnedBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "SpendedBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "NonConfirmedBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "AvailableBonus", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ]
        },


        // onRowPrepared: function (e) {
        //     if (e.rowType === 'data') {
        //         if (e.data.Delta === true) {
        //             //e.rowElement.addClass('place');
        //             e.rowElement.css({ 'font-weight': 'bold', 'background': '#ebb3af' });
        //         }
        //         //else {
        //         //    e.data.place = "";
        //         //}
        //     }
        // },
        export: {
            enabled: true,
            fileName: "bonusstats",
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
    $scope.getDetailGridSettings = function (key) {
        return {
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
                },
                loadParams: { filter: JSON.stringify(["PersonID", "=", key]) },
                //filter: ["PersonID", "=", key]
            }),
            remoteOperations: true,
            columnAutoWidth: true,
            showBorders: true,
            scrolling: {
                mode: "virtual"
            },
            allowColumnResizing: true,
            columnAutoWidth: true,
            showColumnLines: false,
            showRowLines: true,
            rowAlternationEnabled: true,
            showBorders: true,
            allowColumnReordering: true,
            columns: [
                { dataField: "PersonID", visible: false },
                "PersonName",
                "RuleName",
                { dataField: "TransactionDate", caption: "TransactionDate", dataType: "date", format: 'dd.MM.yyyy', sortOrder: "asc" },
                { dataField: "Earned", dataType: "number", caption: "Earned", format: { type: "fixedPoint", precision: 2 } },
                { dataField: "Spended", dataType: "number", caption: "Spended", format: { type: "fixedPoint", precision: 2 } },
                "Store",
                "StoreType",
                { dataField: "OrderAmount", dataType: "number", caption: "OrderAmount", format: { type: "fixedPoint", precision: 2 } },
                //{ dataField: "OrderAmount", dataType: "number", name:"AvgOrderAmount", caption: "AvgOrderAmount",  format: { type: "fixedPoint", precision: 2 } },
                "OrderID",
                "OrderType",
                "OrderNumber",
                "OrderSource",
                { caption: $translate.instant('bonustransactions.Notes'), dataField: "Notes" },
                "Confirmed"
            ],
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
        };
    }
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };

}