'use strict';
app.controller('marketingpermissionsCtrl', marketingpermissionsCtrl);
function marketingpermissionsCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();

    $scope.gridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "PersonID",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMarketingPermissions",
            //onBeforeSend: function (method, ajaxOptions) {
            //    ajaxOptions.xhrFields = { withCredentials: true };
            //}
        }),
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        remoteOperations: true,
        columns: [{
            dataField: "PersonID",
            caption: $translate.instant('MarketingPermissions.PersonID'),
        }, {
            dataField: "PersonName",
            caption: $translate.instant('MarketingPermissions.PersonName'),
            width: 150

        }, {
            dataField: "Phone",
            caption: $translate.instant('MarketingPermissions.Phone'),
        }, {
            dataField: "DeliveredOrders",
            caption: $translate.instant('MarketingPermissions.DeliveredOrders'),
        }, {
            dataField: "FirstDeliveredOrder",
            caption: $translate.instant('MarketingPermissions.FirstDeliveredOrder'),
        }, {
            dataField: "LastDeliveredOrder",
            caption: $translate.instant('MarketingPermissions.LastDeliveredOrder'),
        }, {
            dataField: "DeliveredOrdersAmount",
            caption: $translate.instant('MarketingPermissions.DeliveredOrdersAmount'),
        }, {
            dataField: "TotalOrders",
            caption: $translate.instant('MarketingPermissions.TotalOrders'),
        }, {
            dataField: "FirstOrder",
            caption: $translate.instant('MarketingPermissions.FirstOrder'),
        }, {
            dataField: "LastOrder",
            caption: $translate.instant('MarketingPermissions.LastOrder'),
        }, {
            dataField: "SMSOk",
            caption: $translate.instant('MarketingPermissions.SMSOk'),
        }, {
            dataField: "EmailOk",
            caption: $translate.instant('MarketingPermissions.EmailOk'),
        }, {
            dataField: "KVKKOk",
            caption: $translate.instant('MarketingPermissions.KVKKOk'),
        }, {
            dataField: "PromotionsOk",
            caption: $translate.instant('MarketingPermissions.PromotionsOk'),
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

}