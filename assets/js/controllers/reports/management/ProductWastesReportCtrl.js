'use strict';
app.controller('ProductWastesReportCtrl', ProductWastesReportCtrl);
function ProductWastesReportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {
    var ctrl = this;

    $scope.gridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProductWastes",
        }),
        remoteOperations: true,
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
            { dataField: "OperationDate", alignment: "right", dataType: "date", width: 180, format: 'dd.MM.yyyy' },
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
