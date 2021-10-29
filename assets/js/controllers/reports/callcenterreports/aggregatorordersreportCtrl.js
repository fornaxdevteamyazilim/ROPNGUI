'use strict';
app.controller('aggregatorordersreportCtrl', aggregatorordersreportCtrl);
function aggregatorordersreportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {

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
    };
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxAggregatorOrders",
            //onBeforeSend: function (method, ajaxOptions) {
            //    ajaxOptions.xhrFields = { withCredentials: true };
            //}
            //loadParams: {
            //    filter: JSON.stringify(getFilter()),
            //},
            //filter: getFilter(),
        
            remoteOperations: true,
        }),
        //filter: getFilter(),
        filterValue: getFilter(),
        remoteOperations: true,
        columns: [{
            dataField: "id",
            caption: "MapID",
        }, {
            dataField: "Aggregator"
        },
        {
            dataField: "MapDate",
            alignment: "right",
            dataType: "datetime",
            width: 180,
            format: "d/M/yyyy, HH:mm"
        }, {
            dataField: "OperationDate",
            alignment: "right",
            dataType: "date",
            width: 180,
            format: "d/M/yyyy"
        }, {
            dataField: "OrderID",
            caption: "Order ID",
        }, {
            dataField: "OrderNumber"
        }, {
            dataField: "StoreName",
            caption: "Store Name",
        }, {
            dataField: "TransferTimeMinutes",
            caption: "Transfer Time",
        }, {
            dataField: "CustomerMappingTime",
            caption: "Customer Mapping Time",
        }, {
            dataField: "AggregatorOrderID",
            caption: "Aggregator Order #",
        }, {
            dataField: "isCustomerMapRequired",
            caption: "Customer Map",
        }, {
            dataField: "Notes",
            caption: "Notes",
        }, {
            dataField: "OrderStatus",
            caption: "OrderStatus",
        }],
        filterRow: {
            visible: true
        },
        headerFilter: {
            visible: true
        },
        "export": {
            enabled: true,
            fileName: "YemekSepetiStatDetails",
        },
        scrolling: {
            mode: "virtual"
        },
        height: 600,
        showBorders: true,
        summary: {
            totalItems: [{
                column: "id",
                summaryType: "count"
            }]
        }
    };



    $scope.LoadData = function () {
        
    };
    //$scope.inittable();
    $scope.$on('$destroy', function () {
        $element.remove();
    });

    $scope.Back = function () {
        $window.history.back();
    };
};
