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
app.controller('productsalesbyweeksCtrl', productsalesbyweeksCtrl);
function productsalesbyweeksCtrl($scope, $filter, $modal, $log, Restangular, ngTableParams, $translate, SweetAlert, toaster, $window, $compile, ngnotifyService, $rootScope, $element) {
           $rootScope.uService.EnterController("productsalesbyweeksCtrl");

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
                "year": dateFormat("DeliveryDate", "%y", true),
                "month": dateFormat("DeliveryDate", "%m", true),
                "day": dateFormat("DeliveryDate", "%d", true),
                "month name": dateFormat("DeliveryDate", "%n", true),
                "day name": dateFormat("DeliveryDate", "%w", true),
                "week name": dateFormat("DeliveryDate", "%t", true)
            },
            sorters: function (attr) {
                if (attr == "month name") {
                    return sortAs(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
                }
                if (attr == "day name") {
                    return sortAs(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
                }
                if (attr == "week name") {
                    return sortAs(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "1", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52"]);
                }
            },
            rows: ["ProductName"],
            cols: ["week name"],//weeks gelecek
            aggregatorName: "Sum",
            aggregator: sum(intFormat)(["Quantity"]),
            vals: ["Quantity"],
            rendererName: "Heatmap",
            renderer: renderers["Heatmap"]
        },
        editMode: false
    };
    $scope.ShowReport = function (edit) {
        if (edit != undefined) {
            ctrl.table.editMode = edit;
        }
        if (!ctrl.table.editMode) {
            ctrl.table.config.aggregator = sum(intFormat)(["Quantity"]);
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

            $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productsalesbyweeksCtrl");
    });
};
