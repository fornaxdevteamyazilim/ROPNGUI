'use strict';
app.controller('staffcostdetailCtrl', staffcostdetailCtrl);
function staffcostdetailCtrl($scope, NG_SETTING, $rootScope, $translate, $element, localStorageService) {
    $rootScope.uService.EnterController("staffcostdetailCtrl");
    $scope.translate = function () {
        $scope.trREPORT = $translate.instant('main.REPORT');
        $scope.trEXCEL = $translate.instant('main.EXCEL');
        $scope.trPRINT = $translate.instant('main.PRINT');
    };

    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
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
    $scope.VeiwHeader = {};
    $scope.reportButtonOptions = {
        text: $translate.instant('reportcommands.GetData'),
        onClick: function () {
            var dataGrid = $('#advgridContainer').dxDataGrid('instance');
            var filtr = getFilter();
            dataGrid.clearFilter();
            dataGrid.filter(filtr);
            dataGrid.refresh();
        }
    };
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#advgridContainer").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    $scope.TrendsGridOptions = {
        dataSource: DevExpress.data.AspNet.createStore({
            key: "id",
            loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffCosts",
            onBeforeSend: function (method, ajaxOptions) {
                var authData = localStorageService.get('authorizationData');
                if (authData) {

                    ajaxOptions.headers = {
                        Authorization: 'Bearer ' + authData.token
                    };
                }
            },
            //filter: getFilter(),            
        }),
        filterValue: getFilter(),
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        allowColumnReordering: true,
        filterRow: { visible: true },
        //filterPanel: { visible: true },
        headerFilter: { visible: true },
        grouping: { autoExpandAll: false },
        searchPanel: { visible: true },
        groupPanel: { visible: true },
        columnChooser: { enabled: true },
        columnFixing: { enabled: true },
        remoteOperations: true,
        //repaintChangesOnly: true,
        //highlightChanges: true,
        hoverStateEnabled: true,
        twoWayBindingEnabled: false,
        loadPanel: { enabled: true },
        filterSyncEnabled: 'auto',
        // stateStoring: {
        //     enabled: true,
        //     type: "localStorage",
        //     storageKey: "dx-weeklycolGrid"
        // },
        columns: [
            { dataField: "Store", caption: $translate.instant('staffcostdetail.Store'), visibleIndex: 0, fixed: true, dataType: "string" },
            { dataField: "UserName", caption: $translate.instant('staffcostdetail.UserName'), dataType: "string", fixed: true },
            { dataField: "RegionManager", caption: $translate.instant('staffcostdetail.Region'), fixed: true, dataType: "string" },
            { dataField: "StaffPossition", caption: $translate.instant('staffcostdetail.StaffPossition'), fixed: true, dataType: "string" },
            { dataField: "OperationDate", caption: $translate.instant('staffcostdetail.OperationDate'), dataType: "date", format: 'dd.MM.yyyy' },
            { dataField: "StoreID", caption: $translate.instant('staffcostdetail.StoreID'), dataType: "string", visible: false },
            { dataField: "WorkingHours", dataType: "number", caption: $translate.instant('staffcostdetail.WorkingHours'), name: "WorkingHours", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "OvertimeHours", dataType: "number", caption: $translate.instant('staffcostdetail.OvertimeHours'), name: "OvertimeHours", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "ActualWorkingHours", dataType: "number", caption: $translate.instant('staffcostdetail.TotalHours'), name: "ActualWorkingHours", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Wage", dataType: "number", caption: $translate.instant('staffcostdetail.Wage'), name: "Wage", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "Cost", dataType: "number", caption: $translate.instant('staffcostdetail.Cost'), name: "Cost", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "OvertimeCost", dataType: "number", caption: $translate.instant('staffcostdetail.OvertimeCost'), name: "OvertimeCost", format: { type: "fixedPoint", precision: 2 } },
            { dataField: "TotalCost", dataType: "number", caption: $translate.instant('staffcostdetail.TotalCost'), name: "TotalCost", format: { type: "fixedPoint", precision: 2 } },


        ],
        summary: {
            totalItems: [{ column: "Store", summaryType: "count", displayFormat: "{0}" },
            { column: "ActualWorkingHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "WorkingHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "OvertimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "Cost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "OvertimeCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            { column: "TotalCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}" },
            ],
            groupItems: [
                { column: "Store", summaryType: "count", displayFormat: "{0}" },
                { column: "ActualWorkingHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "WorkingHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "OvertimeHours", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "Cost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "OvertimeCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalCost", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 0 }, displayFormat: "{0}", alignByColumn: true },

            ],
        },
        onDataErrorOccurred: function (e) {
            console.log(e.error);
        },
        export: {
            enabled: true,
            fileName: "Staff Cost Details Report",
        },
        scrolling: { mode: "virtual" },
        //height: 600
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
    };
    function getFilter() { //"and",["!",["OrderType","=",""]]
        var fdate = new Date($scope.DateRange.fromDate.value.getFullYear(), $scope.DateRange.fromDate.value.getMonth(), $scope.DateRange.fromDate.value.getDate());
        var tdate = new Date($scope.DateRange.toDate.value.getFullYear(), $scope.DateRange.toDate.value.getMonth(), $scope.DateRange.toDate.value.getDate());
        if ($scope.StoreID) {
            return [[["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", $tdate]], "and", ["StoreID", "=", $scope.StoreID]];
        }
        else {
            var s = BuildUserStoresArray($rootScope.user.userstores);
            if (s)
                return [["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", tdate], [s]];
            else
                return [["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", tdate]];
        }
    };

    $scope.LoadData = function () {
        var pivot = $("#sales").dxPivotGrid('instance');
        var pivotDS = pivot.getDataSource();
        if ($scope.StoreID) {
            pivotDS.filter(getFilter());
        }
        else {
            pivotDS.filter(getFilter());
        }
        pivotDS.reload();
        //$('#sales').dxPivotGrid('instance').getDataSource().reload();
    };

    $scope.$on('$destroy', function () {
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("staffcostdetailCtrl");
    });
};
