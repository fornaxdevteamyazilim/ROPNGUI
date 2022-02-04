'use strict';
app.controller('declaredrevenueelistCtrl', declaredrevenueelistCtrl);
function declaredrevenueelistCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING, localStorageService) {

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
            value: (new Date()).addDays(0),
            labelLocation: "top", // or "left" | "right"  

        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: (new Date()).addDays(0),
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
    $scope.inittable = function () {
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
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxdeclaredrevenue",
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
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        keyExpr: "id",
        columnChooser: { enabled: true },
        showBorders: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        searchPanel: { visible: true },
        showBorders: true,
        //noDataText:  $translate.instant('InventoryRequirmentItem.Calculatingrequirments'),
        paging: {
            enabled: false
        },
        // stateStoring: {
        //     enabled: true,
        //     type: "localStorage",
        //     storageKey: "dx-declaredrevenue"
        // },
        columns: [
            { type: "buttons", width: 50, buttons: [{ hint: "edit", icon: "edit", onClick: function (e) { location.href = '#/app/reports/giroreports/declaredrevenuee/' + e.row.data.id; } }] },
            { dataField: "id", caption:"id" },
            { dataField: "OperationDate", alignment: "right", dataType: "date", width: 100, format: "d/M/yyyy", caption: $translate.instant('declaredrevenuelist.OperationDate') },
             //{ dataField: "fk_ObjectUpdate_id", caption: $translate.instant('declaredrevenuelist.fk_ObjectUpdate_id') }, 
            {
                dataField: "StoreID", caption: $translate.instant('declaredrevenuelist.StoreID'),
                lookup: {
                    valueExpr: "id",
                    displayExpr: "name",
                    searchMode: "contains",
                    dataSource: {
                        store: DevExpress.data.AspNet.createStore({
                            key: "id",
                            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStore"
                        }),
                        sort: "name",
                        headerFilter: { allowSearch: true }
                    },
                    calculateSortValue: function (data) {
                        var value = this.calculateCellValue(data);
                        return this.lookup.calculateCellValue(value);
                    }
                },
            },
            { dataField: "DeclaredAmount", caption: $translate.instant('declaredrevenuelist.DeclaredAmount'),format: { type: "fixedPoint", precision: 2 } },
            { dataField: "ActualAmount", caption: $translate.instant('declaredrevenuelist.ActualAmount'),format: { type: "fixedPoint", precision: 2 } },
            { dataField: "TotalCash", caption: $translate.instant('declaredrevenuelist.TotalCash'),format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Notes", caption: $translate.instant('declaredrevenuelist.Notes'),minWidth:300, },
            { dataField: "isCharged", caption: $translate.instant('declaredrevenuelist.isCharged') },
            { dataField: "isOk", caption: $translate.instant('declaredrevenuelist.isOk') },
            { dataField: "SendDate", caption: $translate.instant('declaredrevenuelist.SendDate') }
            
        ],

        filterRow: {
            visible: true
        },
        headerFilter: {
            visible: true
        },
        "export": {
            enabled: true,
            fileName: "declaredrevenuelist",
        },
        scrolling: {
            mode: "virtual"
        },
        height: 600,
        showBorders: true,
        // summary: {
        //     totalItems: [
        //         { column: "DeclaredAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
        //         { column: "ActualAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
        //     ],
        //     groupItems: [
        //         { name: "DeclaredAmount", showInColumn: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //         { name: "ActualAmount", showInColumn: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
        //     ],
        // },
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
