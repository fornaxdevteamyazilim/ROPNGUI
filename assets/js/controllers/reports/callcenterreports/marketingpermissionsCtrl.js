'use strict';
app.controller('marketingpermissionsCtrl', marketingpermissionsCtrl);
function marketingpermissionsCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, $http, $q) {
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
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
    var BonusTransactionEventDS = {
        store: new DevExpress.data.CustomStore({
            key: "Value",
            load: function () {
                return $http.get(NG_SETTING.apiServiceBaseUri + "/api/enums/MarketingPermissionType")
                    .then(function (response) {
                        return {
                            data: response.data,
                            totalCount: 10
                        };
                    }, function (response) {
                        return $q.reject("Data Loading Error");
                    });
            }
        }),
        sort: "Value"
    }
    $scope.gridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "PersonID",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxMarketingPermissions",
            //onBeforeSend: function (method, ajaxOptions) {
            //    ajaxOptions.xhrFields = { withCredentials: true };
            //}
        }),
        remoteOperations: { groupPaging: true },
        //filterValue: getFilter(),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnReordering: true,
        filterRow: {
            visible: true
        },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        //remoteOperations: true,     
        columns: [{ dataField: "PersonID", caption: $translate.instant('MarketingPermissions.PersonID'),dataType: "number" },
        { dataField: "PersonName", caption: $translate.instant('MarketingPermissions.PersonName'), dataType: "string", width: 150 },
        { dataField: "Phone", caption: $translate.instant('MarketingPermissions.Phone'),dataType: "number" },
        { dataField: "SMSOk", caption: $translate.instant('MarketingPermissions.SMSOk'), },
        { dataField: "EmailOk", caption: $translate.instant('MarketingPermissions.EmailOk'), },
        { dataField: "KVKKOk", caption: $translate.instant('MarketingPermissions.KVKKOk'), },
        { dataField: "PromotionsOk", caption: $translate.instant('MarketingPermissions.PromotionsOk'), },
        { dataField: "DeliveredOrders", caption: $translate.instant('MarketingPermissions.DeliveredOrders'),dataType: "number",format: { type: "fixedPoint", precision: 0 },visible:false },
        { dataField: "FirstDeliveredOrder", caption: $translate.instant('MarketingPermissions.FirstDeliveredOrder'),dataType: "date", format: 'dd.MM.yyyy' ,visible:false},
        { dataField: "LastDeliveredOrder", caption: $translate.instant('MarketingPermissions.LastDeliveredOrder'),dataType: "date", format: 'dd.MM.yyyy',visible:false },
        { dataField: "DeliveredOrdersAmount", caption: $translate.instant('MarketingPermissions.DeliveredOrdersAmount'),dataType: "number",format: { type: "fixedPoint", precision: 2 },visible:false },
        { dataField: "TotalOrders", caption: $translate.instant('MarketingPermissions.TotalOrders'),dataType: "number",format: { type: "fixedPoint", precision: 0 } ,visible:false},
        { dataField: "FirstOrder", caption: $translate.instant('MarketingPermissions.FirstOrder'),dataType: "date", format: 'dd.MM.yyyy',visible:false },
        { dataField: "LastOrder", caption: $translate.instant('MarketingPermissions.LastOrder'),dataType: "date", format: 'dd.MM.yyyy',visible:false },
        {
            dataField: "MarketingPermissionTypeID",caption: $translate.instant('MarketingPermissions.MarketingPermissionType'),visible:false , 
            lookup: {
                valueExpr: "Value",
                displayExpr: "Name",
                dataSource: BonusTransactionEventDS,
                calculateSortValue: function (data) {
                    var value = this.calculateCellValue(data);
                    return this.lookup.calculateCellValue(value);
                }
            }
            
        },
        ], summary: {
            totalItems: [
                { column: "PersonID", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
                { column: "UserName", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
                { column: "DeliveredOrders", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalOrders", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
            groupItems: [
                { column: "PersonID", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "UserName", summaryType: "count", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DeliveredOrders", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "DeliveredOrdersAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalOrders", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "MarketingPermissionTypeID", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ]
        }, onRowPrepared: function (e) {
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

        filterRow: {
            visible: true
        },
        headerFilter: {
            visible: true
        },
        "export": {
            enabled: true,
            fileName: "marketingpermissions",
        },
        scrolling: {
            mode: "virtual"
        },
        height: 600,
        showBorders: true,
        // summary: {
        //     totalItems: [{
        //         column: "id",
        //         summaryType: "count"
        //     }]
        // }
    };



    $scope.LoadData = function () {

    };




    $scope.$on('$destroy', function () {
        $element.remove();
    });

}