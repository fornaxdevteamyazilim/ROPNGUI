'use strict';
app.controller('servicesareareportCtrl', servicesareareportCtrl);
function servicesareareportCtrl($scope, $filter, $window, $stateParams, $rootScope, $translate, userService, ngnotifyService, $element, NG_SETTING, $http, $q) {
    $rootScope.uService.EnterController("servicesareareportCtrl");
    $scope.Time = ngnotifyService.ServerTime();

    if ($rootScope.user.userstores && $rootScope.user.userstores.length > 1) {
        $scope.selectStore = true;
        $scope.StoreID = '';
    }
    else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.Back = function () {
        $window.history.back();
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
            $("#sales").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    $scope.StoreID;
    var store = new DevExpress.data.CustomStore({
        key: "id",
        load: function (loadOptions) {
            var params = {
                StoreId: $scope.StoreID,
               
            };

            return $http.get(NG_SETTING.apiServiceBaseUri + "/api/StoreReports/servicearea", { params: params })
                .then(function (response) {
                    if (response.data)
                        for (var i = 0; i < response.data.length; i++) {
                            response.data[i].Amount = response.data[i].UnitCount * response.data[i].UnitPrice;
                            response.data[i].id = i;
                        }
                    return {
                        data: response.data,
                        totalCount: 10
                    };
                }, function (response) {
                    return (response.data.ExceptionMessage) ? $q.reject(response.data.ExceptionMessage) : $q.reject("Data Loading Error");
                });
        }
    });
    $scope.dataGridOptions = {
        dataSource: store,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        //keyExpr: "id",
        showBorders: true,
        //selection: {
        //    mode: "single"
        //},
        hoverStateEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        headerFilter: { visible: true },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        grouping: { autoExpandAll: false },
        columnChooser: { enabled: false },
        columnFixing: { enabled: true },
        columnChooser: { enabled: true, mode: "dragAndDrop" },
        noDataText: $translate.instant('InventoryRequirmentItem.Calculatingrequirments'),
        columns: [
            //{ dataField: "id", dataType: "number"},
            { dataField: "Store", caption : $translate.instant('servicearea.Store'),dataType: "string" },
            { dataField: "TownName", caption: $translate.instant('servicearea.TownName'), dataType: "string" },
            { dataField: "SubcityName", caption: $translate.instant('servicearea.SubcityName'), dataType: "string" },
            { dataField: "QuarterName", caption: $translate.instant('servicearea.QuarterName'), dataType: "string" },

            { dataField: "AddressName", caption : $translate.instant('servicearea.AddressName'),dataType: "string" },
            { dataField: "StreetAddressTypeID", caption: $translate.instant('servicearea.StreetAddressTypeID'), dataType: "string" },
            { dataField: "Grid", caption: $translate.instant('servicearea.Grid'), dataType: "string" },
            { dataField: "WDT", caption: $translate.instant('servicearea.WDT'), dataType: "string" },
            { dataField: "DeliveryTime", caption: $translate.instant('servicearea.DeliveryTime'), dataType: "string" },

        ],
       
        export: {
            enabled: true,
            fileName: "servicesareareport",
        },
        scrolling: { mode: "virtual" },
        height: 600
    };
    $scope.selectBox = {
        dataSourceUsage: {
            dataSource: new DevExpress.data.ArrayStore({
                data: $filter('orderBy')($rootScope.user.userstores, 'name'),
                key: "id"
            }),
            displayExpr: "name",
            valueExpr: "id",
            placeholder: "Select Store...",
            value: $rootScope.user.StoreID,
            bindingOptions: {
                value: "StoreID"
            }
        },
    };
    $scope.LoadData = function () {
        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.refresh();
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("servicesareareportCtrl");
    });
};
