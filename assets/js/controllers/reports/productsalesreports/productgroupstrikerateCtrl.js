'use strict';
app.controller('productgroupstrikerateCtrl', productgroupstrikerateCtrl);
function productgroupstrikerateCtrl($scope, $filter, $modal, $log,  Restangular, $translate, SweetAlert, toaster, $window, $rootScope, $compile, $timeout, $location, userService, ngnotifyService, $element, NG_SETTING) {
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
    $scope.TableData = [];
    $scope.VeiwHeader = {};
    if (!$scope.DateFromDate) {
        $scope.DateFromDate = moment().add(-1, 'days').format('YYYY-MM-DD ');
    }
    if (!$scope.DateToDate) {
        $scope.DateToDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    }
    if (userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("MarketingDepartment") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
    };
    if (!$scope.StartDate) {
        $scope.StartDate = moment().add(-1, 'days').format('YYYY-MM-DD ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    // $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    // $scope.resetButtonOptions = {
    //     text: $scope.resetlayout,
    //     onClick: function () {
    //         $("#sales").dxPivotGrid("instance").getDataSource().state({});
    //     }
    // };
    $scope.chartOptions = {
        commonSeriesSettings: {
            type: "bar"
        },
        "export": {
            enabled: true
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1) ?
                    Globalize.formatCurrency(args.originalValue,
                        "USD", { maximumFractionDigits: 0 }) :
                    args.originalValue;

                return {
                    html: args.seriesName + "<div class='currency'>"
                        + valueText + "</div>"
                };
            }
        },
        size: {
            height: 320
        },
        adaptiveLayout: {
            width: 450
        },
        onInitialized: function (e) {
            $scope.chart = e.component;
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
        showColumnGrandTotals: false,
        showRowGrandTotals:false,
        showFilterFields: true,
        allowFieldDragging: true,
        //showColumnTotals: false,
        //showTotalsPrior: "rows",
        //rowHeaderLayout: "tree",
        //showTotalsPrior: "rows",
        visible: true,
        height: 600,
        showBorders: true,
        fieldChooser: {
            enabled: true,
            allowSearch: true
        },
        fieldPanel: {
            showColumnFields: true,
            showDataFields: true,
            showFilterFields: true,
            showRowFields: true,
            allowFieldDragging: true,
            visible: true
        },
        headerFilter: {
            allowSearch: true,
            showRelevantValues: true,
            width: 300,
            height: 400
        },
        "export": {
            enabled: true,
            fileName: "ProductGroupStrikeRate"
        },
        scrolling: {
            mode: "virtual"
        },
        stateStoring: {
            enabled: true,
            type: "localStorage",
            storageKey: "dx-productgroupstrikerate-storing"
        },
        onInitialized: function (e) {
            e.component.bindChart($scope.chart, {
                dataFieldsDisplayMode: "splitPanes",
                alternateDataFields: false
            });
        },
        dataSource: {
            remoteOperations: true,
            store: DevExpress.data.AspNet.createStore({
                key: "id",
                loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxProductGoupStrikeRate",
            }),
            filter: getFilter(),
            fields: [
                { caption: "ProductGroup", dataField: "ProductGroup", width: 250, expanded: true, sortBySummaryField: "StrikeRate", sortBySummaryPath: [], sortOrder: "desc", area: "column" },
                { caption: "Store", dataField: "Store", area: "row", sortBySummaryField: "StrikeRate", sortBySummaryPath: [], sortOrder: "desc", width: 250 },
                //{ caption: "Parent", dataField: "ParentName", area: "row", sortBySummaryField: "StrikeRate", sortBySummaryPath: [], sortOrder: "desc", width: 250 },
                //{ caption: "Date", dataField: "OperationDate", dataType: "date", area: "column" },
                //{ dataField: "Year", dataType: "number", area: "column" },
                //{ dataField: "MonthNumber", dataType: "number", area: "column" },
                //{ dataField: "Day", dataType: "number", area: "column" },
                {
                    caption: "StrikeRate", dataField: "StrikeRate", summaryType: "avg", format: { type: "fixedPoint", precision: 2 }, area: "data"
                },
                //{ caption: "OrdersCount", dataField: "OrdersCount", summaryType: "sum", format: "fixedPoint", area: "data" },
                //{ caption: "ProductsCount", dataField: "ProductsCount", summaryType: "sum", format: "fixedPoint", area: "data" },
                //{ caption: "Amount", dataField: "Amount", summaryType: "sum", format: "fixedPoint", area: "data" },
                //{ caption: "Store", dataField: "Store" }
            ]
        }
    };
    //$rootScope.user.userstores
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
    function getFilter() {
        if ($scope.StoreID) {
            return [[["OperationDate", ">=", $scope.DateFromDate], "and", ["OperationDate", "<=", $scope.EndDate]], "and", ["StoreID", "=", $scope.StoreID]];
        }
        else {
            var s = BuildUserStoresArray($rootScope.user.userstores);
            if (s)
                return [["OperationDate", ">=", $scope.DateFromDate], "and", ["OperationDate", "<=", $scope.EndDate], [s]];
            else
                return [["OperationDate", ">=", $scope.DateFromDate], "and", ["OperationDate", "<=", $scope.EndDate]];
        }
    }


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

    $scope.ProductSalesApiExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/extendedreports/productstatisticsxls?fromDate=' + $scope.DateFromDate + '&toDate=' + $scope.DateToDate + '&StoreID=' + $scope.StoreID;
    };

    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    //$scope.ordertypes = [];
    //$scope.loadEntities('enums/ordertype', 'ordertypes');
    //$scope.GetOrderType = function (data) {
    //    $scope.OrderTypeID = data;
    //};
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
            $scope.DateFromDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $scope.DateToDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.selecttag = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/reportspopup/selecttag.html',
            controller: 'selecttagCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.TagData = item;
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
    });
};
