'use strict';
app.controller('poductsalesccoreboardCtrl', poductsalesccoreboardCtrl);
function poductsalesccoreboardCtrl($scope, $filter, $modal, $log, Restangular, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, ngnotifyService, $element, NG_SETTING) {
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = moment().add(-1, 'days').format('YYYY-MM-DD ');//$filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    $scope.Time = ngnotifyService.ServerTime();
    $scope.TableData = [];
    $scope.VeiwHeader = {};
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    }

    $scope.resetlayout = $translate.instant('main.RESETLAYOUT');
    $scope.resetButtonOptions = {
        text: $scope.resetlayout,
        onClick: function () {
            $("#sales").dxPivotGrid("instance").getDataSource().state({});
        }
    };
    $scope.chartOptions = {
        commonSeriesSettings: {
            type: "bar"
        },
        tooltip: {
            enabled: true,
            customizeTooltip: function (args) {
                var valueText = (args.seriesName.indexOf("Total") != -1) ?
                    Globalize.formatCurrency(args.originalValue,
                        "", { maximumFractionDigits: 2 }) :
                    args.originalValue;

                return {
                    html: args.seriesName + "<div class='currency'>"
                        + valueText + "</div>"
                };
            }
            //format: {
            //    type: 'fixedPoint',
            //    precision: 2
            //}
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
            fileName: "ProductSalesScoreboard"
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
            storageKey: "dx-poductsalesccoreboard-storing"
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
                { caption: $translate.instant('poductsalesccoreboard.Agent'), dataField: "Agent", area: "row" },
                { caption: $translate.instant('poductsalesccoreboard.ProductGroup'), dataField: "ProductGroup", area: "column" },
                { caption: $translate.instant('poductsalesccoreboard.Product'), dataField: "Product", area: "column" },
                { caption: $translate.instant('poductsalesccoreboard.Quantity'), dataField: "Quantity", dataType: "number", summaryType: "sum", area: "data" },
                { caption: $translate.instant('poductsalesccoreboard.OperationDate'), dataField: "OperationDate", dataType: "date" },
                //{ groupName: 'OperationDate', groupInterval: 'month', },
                //{ groupName: 'OperationDate', groupInterval: 'quarter' },
                //{ groupName: 'OperationDate', groupInterval: 'day', },
                //{ groupName: 'OperationDate', groupInterval: 'dayOfWeek' }


            ],
            store: DevExpress.data.AspNet.createStore({
                key: "id",
                loadUrl: NG_SETTING.apiServiceBaseUri + "/api/dxPoductSalesScoreboard",
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
    }
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
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };

    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
    });
};
