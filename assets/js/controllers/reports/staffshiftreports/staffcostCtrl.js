'use strict';
app.controller('staffcostCtrl', staffcostCtrl);
function staffcostCtrl($scope, Restangular, toaster, $interval, $http, NG_SETTING, $q, $rootScope, $location, $translate, $timeout, $element, userService) {
    $rootScope.uService.EnterController("staffcostCtrl");
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
            var pivot = $("#sales").dxPivotGrid('instance');
            var pivotDS = pivot.getDataSource();
            if ($scope.StoreID) {
                pivotDS.filter(getFilter());
            }
            else {
                pivotDS.filter(getFilter());
            }
            pivotDS.reload();
        }
    };
    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#sales").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    $scope.pivotGridOptions = {
        allowSortingBySummary: true,
        allowSorting: true,
        allowFiltering: true,
        allowExpandAll: true,
        showDataFields: true,
        showRowFields: true,
        showColumnFields: true,
        showFilterFields: true,
        allowFieldDragging: true,
        rowHeaderLayout: 'tree',
        //showColumnTotals: false,
        showTotalsPrior: "rows",
        visible: true,
        height: 600,
        showBorders: true,
        fieldChooser: {
            enabled: true
        },
        "export": {
            enabled: true,
            fileName: "Payments"
        },
        scrolling: {
            mode: "virtual"
        },
        fieldPanel: {
            visible: true
        },
        // stateStoring: {
        //     enabled: true,
        //     type: "localStorage",
        //     storageKey: "dx-turnoverbydaysreport-storing"
        // },
        onInitialized: function (e) {
            e.component.bindChart($scope.chart, {
                dataFieldsDisplayMode: "splitPanes",
                alternateDataFields: false
            });
        },
        dataSource: {
            remoteOperations: true,
            fields: [
                { dataField: "StaffPossition", area: "column", area: "row", area: "filter" },
                { caption: $translate.instant('staffcost.Store'), width: 120, dataField: "Store", area: "row" },
                { caption: $translate.instant('staffcost.Year'), dataField: "OperationDate", dataType: "date", groupInterval: "year", area: "filter" },
                { caption: $translate.instant('staffcost.Month'), dataField: "OperationDate", dataType: "date", groupInterval: "month", area: "filter" },
                { caption: $translate.instant('staffcost.Day'), dataField: "OperationDate", dataType: "date", groupInterval: "day", area: "column" },
                { caption: $translate.instant('staffcost.TotalCost'), dataField: "TotalCost", dataType: "number", summaryType: "sum", format: "fixedPoint", area: "data", precision: 2 },
                { caption: $translate.instant('staffcost.Cost'), dataField: "Cost", dataType: "number", summaryType: "sum", format: "fixedPoint", precision: 2, area: "filter" },
                { caption: $translate.instant('staffcost.OvertimeCost'), dataField: "OvertimeCost", dataType: "number", summaryType: "sum", format: "fixedPoint", precision: 2, area: "filter" },
                { caption: $translate.instant('staffcost.WorkingHours'), dataField: "WorkingHours", dataType: "number", summaryType: "sum", format: "fixedPoint", precision: 0, area: "filter" },
                { caption: $translate.instant('staffcost.ActualWorkingHours'), dataField: "ActualWorkingHours", dataType: "number", summaryType: "sum", format: "fixedPoint", precision: 0, area: "filter" },
                { caption: $translate.instant('staffcost.OvertimeHours'), dataField: "OvertimeHours", dataType: "number", summaryType: "sum", format: "fixedPoint", precision: 0, area: "filter" },

            ],
            store: DevExpress.data.AspNet.createStore({
                key: "id",
                loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxStaffCosts",
            }),
            filter: getFilter(),
            //load: function (loadOptions) {
            //    var d = $.Deferred();
            //    Restangular.all('extendedreports/salestatistics').post(
            //        {
            //            StartDate: $rootScope.ReportParameters.StartDate,
            //            EndDate: $rootScope.ReportParameters.EndDate,
            //            StoreID: $rootScope.user.StoreID,
            //            OrderType: ($scope.OrderTypeID == null) ? -1 : $scope.OrderTypeID,
            //            StoreTypeID: $scope.StoreTypeID
            //        }
            //    ).then(function (orders) {
            //        $scope.AmountWithVAT = 0;
            //        d.resolve(orders.plain());                    
            //    }, function (response) {
            //        d.reject;
            //        toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            //    });
            //    return d.promise();
            //}
        }
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
            return [[["OperationDate", ">=", fdate], "and", ["OperationDate", "<=", tdate]], "and", ["StoreID", "=", $scope.StoreID]];
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
        $rootScope.uService.ExitController("staffcostCtrl");
    });
};
