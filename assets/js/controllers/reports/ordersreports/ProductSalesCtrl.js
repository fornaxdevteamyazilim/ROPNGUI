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
app.controller('ProductSalesCtrl', ProductSalesCtrl);
function ProductSalesCtrl($scope, $filter, $modal, $log, Restangular, ngTableParams, toaster, $window, $rootScope, $compile, $timeout, $location, $translate, Excel, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("ProductSalesCtrl");
    userService.userAuthorizated();
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.Time = ngnotifyService.ServerTime();
    var ctrl = this;
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var sortAs = $.pivotUtilities.sortAs;
    var tpl = $.pivotUtilities.aggregatorTemplates;
    var sum = $.pivotUtilities.aggregatorTemplates.sum;
    var numberFormat = $.pivotUtilities.numberFormat;
    var renderers = $.extend($.pivotUtilities.renderers);
    var intFormat = numberFormat({ digitsAfterDecimal: 0, thousandsSep: ".", decimalSep: "," });
    $scope.isWaiting = false;
    $scope.TableData = [];
    $scope.VeiwHeader = {};
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    } else {
        Restangular.all('report').getList(
            {
                search: "number='025'"
            }).then(function (result) {
                $scope.VeiwHeader = result[0];
                $scope.GetLayout(result[0].id)
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    }
    $scope.GetLayout = function (ReportID) {
        Restangular.all('reportlayout').getList(
            {
                search: "ReportID='" + ReportID + "'"
            }).then(function (result) {
                if (result && result.length > 0) {
                    $scope.ReportLayout = result;
                    $scope.BindLayoutData = result[0];
                    $scope.LoadPivotData();
                } else {
                    $scope.ReportLayout = [];
                    $scope.BindLayoutData = { name: "" };
                    $scope.LoadPivotData();
                }
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.NewLayoutData = function (configdata) {
        var config_copy = JSON.parse(JSON.stringify(configdata));
        delete config_copy["aggregators"];
        delete config_copy["renderers"];
        delete config_copy["derivedAttributes"];
        delete config_copy["rendererOptions"];
        delete config_copy["localeStrings"];
        var dataconfig = JSON.stringify(config_copy);
        var data = { ReportID: $scope.VeiwHeader.id, name: $scope.BindLayoutData.name, LayoutData: dataconfig }
        Restangular.restangularizeElement('', data, 'reportlayout')
        data.post().then(function (res) {
            $scope.GetLayout($scope.VeiwHeader.id);
            toaster.pop('success', $translate.instant('orderfile.Saved'),$translate.instant('orderfile.Saved'));
        });
    };
    $scope.EditLayoutData = function (configdata) {
        var config_copy = JSON.parse(JSON.stringify(configdata));
        delete config_copy["aggregators"];
        delete config_copy["renderers"];
        delete config_copy["derivedAttributes"];
        delete config_copy["rendererOptions"];
        delete config_copy["localeStrings"];
        var dataconfig = JSON.stringify(config_copy);
        var data = { id: $scope.BindLayoutData.id, ReportID: $scope.BindLayoutData.ReportID, name: $scope.BindLayoutData.name, LayoutData: dataconfig }
        Restangular.restangularizeElement('', data, 'reportlayout')
        data.put().then(function (res) {
            toaster.pop('success', $translate.instant('orderfile.Updated'),  $translate.instant('orderfile.Updated'));
        });
    };
    $scope.ChangeLayout = function (SelectedTemplateID) {
        for (var i = 0; i < $scope.ReportLayout.length; i++) {
            if ($scope.ReportLayout[i].id == SelectedTemplateID) {
                $scope.BindLayoutData = $scope.ReportLayout[i];
                $scope.LoadPivotData();
            }
        }
    };
    $scope.SetStoreTypeID = function (FromValue) {
        $scope.StoreTypeID = FromValue;
        $scope.selectedStoreType = $filter('filter')($scope.storetypes, { id: FromValue });
    };
    $scope.StoreTypeID = -1;
    $scope.LoadData = function () {
        $scope.isWaiting = true;
        Restangular.all('order/demoreports/ProductSales').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID == null) ? '' : $scope.StoreID,
                SourceID: ($scope.SourceID == null) ? '' : $scope.SourceID,
                OrderType: ($scope.OrderType == null) ? '' : $scope.OrderType,
                StoreTypeID: $scope.StoreTypeID

            }
        ).then(function (orders) {
            ctrl.table.data = orders;  //6
            $scope.TableData = orders;
            $scope.ShowReport();
            $scope.isWaiting = false;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Urun Satis Listesi.xls');
        downloadLink[0].click();
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.LoadPivotData = function () {//5
        if ($scope.BindLayoutData && $scope.BindLayoutData.LayoutData) {
            ctrl.table = {
                data: $scope.TableData,
                config: JSON.parse($scope.BindLayoutData.LayoutData),
                editMode: false
            };
            if ($scope.isWaiting == false) {
                $scope.ShowReport();
            }
        } else {
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
                    cols: ["Store"],
                    rows: ["ProductGroup", "Product"],
                    aggregatorName: "Sum",
                    aggregator: sum(intFormat)(["ProductCount"]),
                    vals: ["ProductCount"],
                    rendererName: "Heatmap",
                    renderer: renderers["Heatmap"]
                },
                editMode: false
            };
        }
    };
    $scope.ShowReport = function (edit) {//1
        if (edit != undefined) {
            $scope.ShowSaveButton = edit;
            ctrl.table.editMode = edit;
        }
        if (!ctrl.table.editMode) {
            ctrl.table.config.aggregator = sum(intFormat)(["ProductCount"]);
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
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
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
    $scope.ordersourceies = [];
    $scope.loadEntities('ordersource', 'ordersourceies');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.storetypes = [];
    $scope.loadEntities('enums/storetype', 'storetypes');
    $scope.StoreType = "-1";
    $scope.GetStoreType = function (data) {
        $scope.StoreTypeID = data;
        $scope.selectedType = $filter('filter')($scope.storetypes, { Value: data });
    };

    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("ProductSalesCtrl");
    });
};
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
    return {
        tableToExcel: function (tableId, worksheetName) {
            var table = document.querySelector(tableId),
                ctx = { worksheet: worksheetName, table: table.innerHTML },
                href = uri + base64(format(template, ctx));
            return href;
        }
    };
})