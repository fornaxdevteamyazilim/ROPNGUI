'use strict';
app.controller('yemeksepetistatsdetailCtrl', yemeksepetistatsdetailCtrl);
function yemeksepetistatsdetailCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {

    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();

    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    }
    $scope.gridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxYemekSepetiStats",
            //onBeforeSend: function (method, ajaxOptions) {
            //    ajaxOptions.xhrFields = { withCredentials: true };
            //}
        }),
        remoteOperations: true,
        columns: [{
            dataField: "id",
            caption: "MapID",
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
            dataField: "YemekSepetiOrderID",
            caption: "YemekSepeti #",
        }, {
                dataField: "isCustomerMapRequired",
                caption: "Customer Map",
        }, {
            dataField: "Notes",
            caption: "Notes",
            }, {
                dataField: "OrderStatus",
                caption: "OrderStatus",
            }, {
                dataField: "CustomerMapBy",
                caption: "CustomerMapBy",
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




    $scope.$on('$destroy', function () {
        $element.remove();
    });
};
