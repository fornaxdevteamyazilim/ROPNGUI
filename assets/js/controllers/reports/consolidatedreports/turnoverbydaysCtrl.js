app.directive('pivot', [function () {
    return {
        restrict: 'AE',
        scope: {
            data: '=',
            config: '=',
            editMode: '='
        },
        link: function (scope, elem, attr) {
            var renderers = $.extend($.pivotUtilities.renderers);
            var tpl = $.pivotUtilities.aggregatorTemplates;
            scope.renderPivotTable = function () {
                $(elem).pivot(scope.data, {
                    renderers: renderers,
                    rendererName: scope.config.rendererName,
                    cols: scope.config.cols,
                    rows: scope.config.rows,
                    vals: scope.config.vals,
                    derivedAttributes: scope.config.derivedAttributes,
                    sorters: scope.config.sorters,
                    aggregator: scope.config.aggregator,
                    aggregatorName: scope.config.aggregatorName,
                });
            };
            scope.renderPivotUITable = function () {
                $(elem).pivotUI(scope.data, {
                    renderers: renderers,
                    rendererName: scope.config.rendererName,
                    cols: scope.config.cols,
                    rows: scope.config.rows,
                    vals: scope.config.vals,
                    derivedAttributes: scope.config.derivedAttributes,
                    sorters: scope.config.sorters,
                    aggregatorName: scope.config.aggregatorName,
                    onRefresh: function (config) {
                        var config_copy = JSON.parse(JSON.stringify(config));
                        delete config_copy["aggregators"];
                        delete config_copy["renderers"];
                        delete config_copy["derivedAttributes"];
                        delete config_copy["rendererOptions"];
                        delete config_copy["localeStrings"];
                        scope.config = config_copy;
                        scope.$apply();
                    }
                });
            };
            scope.$watch('scope.editMode', function (newValue, oldValue) {
                console.log("watch" + scope.editMode);
                if (newValue) {
                    if (scope.editMode) {
                        scope.renderPivotUITable();
                    } else {
                        scope.renderPivotTable();
                    }
                }
            }, true);

            if (scope.editMode) {
                scope.renderPivotUITable();
            } else {
                scope.renderPivotTable();
            }
        }
    };
}]);
'use strict';
app.controller('turnoverbydaysCtrl', turnoverbydaysCtrl);
function turnoverbydaysCtrl($scope, $filter, $modal, $log, Restangular, ngTableParams, $translate, SweetAlert, toaster, $window, $compile, ngnotifyService, $rootScope, $element) {
    $rootScope.uService.EnterController("turnoverbydaysCtrl");

    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var ctrl = this;
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var sortAs = $.pivotUtilities.sortAs;
    var tpl = $.pivotUtilities.aggregatorTemplates;
    var sum = $.pivotUtilities.aggregatorTemplates.sum;
    var numberFormat = $.pivotUtilities.numberFormat;
    var renderers = $.extend($.pivotUtilities.renderers);
    var intFormat = numberFormat({ digitsAfterDecimal: 2, thousandsSep: ".", decimalSep: "," });
    $scope.LoadData = function () {
        Restangular.all('extendedreports/productstatistics').post(
                {
                    ProductCategoryTagID: $scope.TagData,
                    StartDate: ($scope.DateFromDate) ? "" + $scope.DateFromDate + "" : "" + $scope.NewDate + "",
                    EndDate: ($scope.DateToDate) ? "" + $scope.DateToDate + "" : "" + $scope.NewDate + "",
                    OrderType: ($scope.OrderTypeID == null) ? -1 : $scope.OrderTypeID
                }
            ).then(function (orders) {
                for (var i = 0; i < orders.length; i++) {
                    orders[i].OperationDate = $filter('date')(orders[i].OperationDate, 'yyyy-MM-dd');
                }
                ctrl.table.data = orders;
                $scope.ShowReport();
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    ctrl.table = {
        data: [],
        config: {
            derivedAttributes: {
                "year": dateFormat("OperationDate", "%y", true),
                "month": dateFormat("OperationDate", "%m", true),
                "day": dateFormat("OperationDate", "%d", true),
                "month name": dateFormat("OperationDate", "%n", true),
                "day name": dateFormat("OperationDate", "%w", true)
            },
            sorters: function (attr) {
                if (attr == "month name") {
                    return sortAs(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
                }
                if (attr == "day name") {
                    return sortAs(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
                }
            },
            rows: ["Store"],
            cols: ["month", "day", "day name"],
            aggregatorName: "Sum",
            aggregator: sum(intFormat)(["Amount"]),
            vals: ["Amount"],
            rendererName: "Heatmap",
            renderer: renderers["Heatmap"]
        },
        editMode: false
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
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.GetOrderType = function (data) {
        $scope.OrderTypeID = data;
    };
    $scope.ShowReport = function (edit) {
        if (edit != undefined) {
            ctrl.table.editMode = edit;
        }
        if (!ctrl.table.editMode) {
            ctrl.table.config.aggregator = sum(intFormat)(["Amount"]);
        }
        var newElement = angular.element("<pivot  data='ctrl.table.data' config='ctrl.table.config' edit-mode='ctrl.table.editMode'></pivot>");
        $compile(newElement)($scope);
        $('#report').html(newElement);
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
        $rootScope.uService.ExitController("turnoverbydaysCtrl");
    });
};
