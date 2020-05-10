'use strict';
app.controller('PodsReportCtrl', PodsReportCtrl);
function PodsReportCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, localStorageService) {
    var ctrl = this;

    $scope.gridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxPod",
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
            fileName: "PodsReport",
        },
        scrolling: {
            mode: "virtual"
        },
        height: 600,
        showBorders: true,
        columns: [ {
            dataField: "name",
            caption: "POD",
            }, {
                dataField: "StoreID",
                caption: "Store",                
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {                        
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {

                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token
                                    };
                                }
                            }
                        })
                    }
                }
            }, {
                dataField: "RoutedToStoreID",
                caption: "RoutedTo",
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore",
                            onBeforeSend: function (method, ajaxOptions) {
                                var authData = localStorageService.get('authorizationData');
                                if (authData) {

                                    ajaxOptions.headers = {
                                        Authorization: 'Bearer ' + authData.token
                                    };
                                }
                            }
                        })
                    }
                }
            }, {
                dataField: "isActive",
                caption: "Active",
            }, {
                dataField: "DeliveryTime",
                caption: "Delivery Time",
            }, {
                dataField: "MinAmount",
                caption: "MinAmount",
            },
            { dataField: "StartTime", alignment: "right", dataType: "datetime", format: 'HH:mm' },
            { dataField: "EndTime", alignment: "right", dataType: "datetime", format: 'HH:mm' }]        
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
