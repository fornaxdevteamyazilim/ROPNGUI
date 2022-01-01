'use strict';
app.controller('orderroutedCtrl', orderroutedCtrl);
function orderroutedCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    //var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
    //    $scope.translate();
    //});
    //DevExpress.localization.locale("tr");
    //Globalize.locale('tr');
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
            value: (new Date()).addDays(-1),
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: (new Date()).addDays(0),
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
            $("#gridContainer").dxPivotGrid("instance").getDataSource().state({});
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
    function getFilter() { //"and",["!",["OrderType","=",""]]
        var s = BuildUserStoresArray($rootScope.user.userstores);
        if (s)
            return [["OperationDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["OperationDate", "<=", $rootScope.ReportParameters.EndDate], [s]];
        else
            return [["OperationDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["OperationDate", "<=", $rootScope.ReportParameters.EndDate]];               
    }
    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var params = {
                StartDate: $scope.DateRange.fromDate.value,
                EndDate: $scope.DateRange.toDate.value
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/order/reports/routedorders", { params: params })
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
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        //remoteOperations: true,
        filter: getFilter(),
        columns: [
            { caption:$translate.instant('orderrouted.OrderID'), dataField: "id", dataType: "number",},
            { caption: $translate.instant('orderrouted.OperationDate'), dataField: "OperationDate", dataType: "date", format: 'dd.MM.yyyy' },
            { caption: $translate.instant('orderrouted.FromStoreID'),dataField: "FromStoreID", dataType: "number", visible: false }, 
            { caption: $translate.instant('orderrouted.ToStoreID'), dataField: "ToStoreID", dataType: "number"  ,visible: false},
            { caption: $translate.instant('orderrouted.FromStore'), dataField: "FromStore", dataType: "number" },
            { caption: $translate.instant('orderrouted.ToStore'), dataField: "ToStore",  dataType: "string"},
            { caption: $translate.instant('orderrouted.AddressID'), dataField: "AddressID", dataType: "number", visible: false },
            { caption: $translate.instant('orderrouted.customername'),dataField: "PersonName", dataType: "string" }, 
            { caption: $translate.instant('orderrouted.customerphone'), dataField: "PersonPhone", dataType: "number" },
            { caption: $translate.instant('orderrouted.StreetAddress'), dataField: "StreetAddress",  dataType: "string"},
            { caption: $translate.instant('orderrouted.QuarterName'), dataField: "QuarterName", dataType: "string" },
            { caption: $translate.instant('orderrouted.SubcityName'), dataField: "SubcityName",  dataType: "string"},
            { caption: $translate.instant('orderrouted.TownName'), dataField: "TownName",  dataType: "string"},

                    
        ],

       
        export: {
            enabled: true,
            fileName: "routedorders",
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