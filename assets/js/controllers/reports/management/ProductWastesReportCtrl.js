'use strict';
app.controller('ProductWastesReportCtrl', ProductWastesReportCtrl);
function ProductWastesReportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {
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
    $scope.gridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProductWastes",
        }),
        remoteOperations: true,
        filterValue: getFilter(),
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Search..."
        },
        filterRow: {
            visible: true
        },
        headerFilter: {
            visible: true
        },
        "export": {
            enabled: true,
            fileName: "ProductWastes",
        },
        scrolling: {
            mode: "virtual"
        },
        height: 600,
        showBorders: true,
        columns: [
            { dataField: "OperationDate", alignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy', sortIndex: 0,sortOrder: "desc" },
            //{ dataField: "OrderTypeID", caption: "OrderType ID", },
            { dataField: "OrderType", caption: "OrderType", },
            { dataField: "notes" }, { dataField: "ProductCount" },
            { dataField: "name", caption: "Product Name", },
            { dataField: "Store", },
            { dataField: "updateTime", alignment: "right", dataType: "datetime", width: 180, format: "dd.MM.yyyy, HH:mm" },
            { dataField: "UserName", caption: "User", },
            { dataField: "Cost", alignment: "right", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "TotalCost", alignment: "right", format: { type: "fixedPoint", precision: 2 } }
        ],
        summary: {
            totalItems: [
                { column: "OperationDate", summaryType: "count" },
                { column: "TotalCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 } }
            ]
        }
    };

    $scope.getMasterDetailGridSettings = function (order) {
        return {
            dataSource: DevExpress.data.AspNet.createStore({
                loadUrl: url + '/OrderDetails',
                loadParams: { orderID: order.OrderID },
                onBeforeSend: function (method, ajaxOptions) {
                    ajaxOptions.xhrFields = { withCredentials: true };
                }
            }),
            showBorders: true
        };
    };






    $scope.$on('$destroy', function () {
        $element.remove();
    });
};
