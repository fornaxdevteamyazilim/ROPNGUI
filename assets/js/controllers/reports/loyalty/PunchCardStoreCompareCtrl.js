'use strict';
app.controller('PunchCardStoreCompareCtrl', PunchCardStoreCompareCtrl);
function PunchCardStoreCompareCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {
    $rootScope.uService.EnterController("PunchCardStoreCompareCtrl");
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    }
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
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-PunchCardStoreCompare-storing"
        },
        texts:{
            grandTotal:"Toplam Kişi Sayısı"
        },
        onInitialized: function (e) {
            e.component.bindChart($scope.chart, {
                dataFieldsDisplayMode: "splitPanes",
                alternateDataFields: false
            });
        },
        onContextMenuPreparing: function (e) {
            var dataSource = e.component.getDataSource();
            if (e.field && e.field.dataField === "id") {
                $.each(summaryDisplayModes, function (_, summaryDisplayMode) {
                    var summaryDisplayModeValue = summaryDisplayMode.value;
    
                    e.items.push({
                        text: summaryDisplayMode.text,
                        selected: e.field.summaryDisplayMode === summaryDisplayModeValue,
                        onItemClick: function () {
                            var format,
                                caption = summaryDisplayModeValue === "none" ? "Kişi Sayısı" : "Dilim Oranı";
                            // if (summaryDisplayModeValue === "none"
                            //     || summaryDisplayModeValue === "absoluteVariation") {
                            //     format = "number";
                            // }
                            dataSource.field(e.field.index, {
                                summaryDisplayMode: summaryDisplayModeValue,
                                format: format,
                                caption: caption
                            });
    
                            dataSource.load();
                        }
                    });
                });
            }
        },
        dataSource: {
            remoteOperations: true,
            fields: [
                { caption: $translate.instant('PunchCardStoreCompare.Store'), width: 120, dataField: "Store", area: "row" },
                { caption: $translate.instant('PunchCardStoreCompare.PersonName'), width: 120, dataField: "PersonName", area: "row" },
                { caption: $translate.instant('PunchCardStoreCompare.EarnedFromSameStore'), dataField: "EarnedFromSameStore", dataType: "number", area: "column" },
                { caption: "Kişi Sayısı", dataField: "id", dataType: "number", summaryType: "count", area: "data" },
                
            ],
            store: DevExpress.data.AspNet.createStore({
                key: "id",
                loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxPunchCardStoreCompare",
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
            //        toaster.pop('error',Server Error, response.data.ExceptionMessage);
            //    });
            //    return d.promise();
            //}
        }
    };
    var summaryDisplayModes = [
        { text: "Kişi Sayısı", value: "none" },
        // { text: "Absolute Variation", value: "absoluteVariation" },
        // { text: "Percent Variation", value: "percentVariation" },
        // { text: "Percent of Column Total", value: "percentOfColumnTotal" },
        { text: "Dilim Oranları", value: "percentOfRowTotal" },
        /* { text: "Percent of Column Grand Total", value: "percentOfColumnGrandTotal" },
        { text: "Percent of Row Grand Total", value: "percentOfRowGrandTotal" },
        { text: "Percent of Grand Total", value: "percentOfGrandTotal" } */
    ];
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
    }
    function getFilter() { //"and",["!",["OrderType","=",""]]
        var s = BuildUserStoresArray($rootScope.user.userstores);
        if (s)
            return [["TransactionDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["TransactionDate", "<=", $rootScope.ReportParameters.EndDate], [s]];
        else
            return [["TransactionDate", ">=", $rootScope.ReportParameters.StartDate], "and", ["TransactionDate", "<=", $rootScope.ReportParameters.EndDate]];               
    }

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
