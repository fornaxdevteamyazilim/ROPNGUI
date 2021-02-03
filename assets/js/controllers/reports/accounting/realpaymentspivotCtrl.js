'use strict';
app.controller('realpaymentspivotCtrl', realpaymentspivotCtrl);
function realpaymentspivotCtrl($scope, $filter, $modal, $log, Restangular, ngTableParams, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {
    $rootScope.uService.EnterController("realpaymentspivotCtrl");
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    };
    $scope.StoreTypeID = -1;

    $scope.FromDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.ToDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.StoreType = "-1";
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.resetButtonOptions = {
        text: 'Reset',
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
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-turnoverbydaysreport-storing"
        },
        onInitialized: function (e) {
            e.component.bindChart($scope.chart, {
                dataFieldsDisplayMode: "splitPanes",
                alternateDataFields: false
            });
        },
        dataSource: {
            remoteOperations: true,
            fields: [
                { caption: $translate.instant('realpaymentspivot.Store'), width: 120, dataField: "Store", area: "row" },
                { caption: $translate.instant('realpaymentspivot.Year'), dataField: "Year", dataType: "number", area: "column" },
                { caption: $translate.instant('realpaymentspivot.MonthNumber'), dataField: "MonthNumber", dataType: "number", area: "column" },
                { caption: $translate.instant('realpaymentspivot.Day'), dataField: "Day", dataType: "number", area: "column" },
                { caption: $translate.instant('realpaymentspivot.GrossAmount'), dataField: "AmountWithVAT", dataType: "number", summaryType: "sum", format: "fixedPoint", area: "data", precision: 2 },
                { caption: $translate.instant('realpaymentspivot.Amount'), dataField: "Amount", dataType: "number", summaryType: "sum", format: "fixedPoint", precision: 2 },
                { caption: $translate.instant('realpaymentspivot.Count'), dataField: "id", dataType: "number", summaryType: "count", area: "data" },

            ],
            store: DevExpress.data.AspNet.createStore({
                key: "id",
                loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxRealpaymentStats",
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
        if ($scope.StoreID) {
            return [[["OperationDate", ">=", $scope.DateFromDate], "and", ["OperationDate", "<=", $scope.EndDate]], "and", ["StoreID", "=", $scope.StoreID]];
        }
        else {
            var s = BuildUserStoresArray($rootScope.user.userstores);
            if (s)
                return [["OperationDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["OperationDate", "<=", $rootScope.ReportParameters.EndDate], [s]];
            else
                return [["OperationDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["OperationDate", "<=", $rootScope.ReportParameters.EndDate]];
        }
    };

    $scope.StoreTypeID = -1;
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
        $element.remove();
        $rootScope.uService.ExitController("realpaymentspivotCtrl");
    });
};
