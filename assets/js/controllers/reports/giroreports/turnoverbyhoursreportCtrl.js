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
app.controller('turnoverbyhoursreportCtrl', turnoverbyhoursreportCtrl);
function turnoverbyhoursreportCtrl($scope, $filter, $modal, $log, Restangular, $translate, ngTableParams, SweetAlert, toaster, $window, $rootScope, $compile, Excel, $timeout, userService, ngnotifyService, $element) {
           $rootScope.uService.EnterController("turnoverbyhoursreportCtrl");

   $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    userService.userAuthorizated();
    var ctrl = this;
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var sortAs = $.pivotUtilities.sortAs;
    var tpl = $.pivotUtilities.aggregatorTemplates;
    var sum = $.pivotUtilities.aggregatorTemplates.sum;
    var numberFormat = $.pivotUtilities.numberFormat;
    var renderers = $.extend($.pivotUtilities.renderers);
    var intFormat = numberFormat({ digitsAfterDecimal: 2, thousandsSep: ".", decimalSep: "," });
    $scope.Time = ngnotifyService.ServerTime();
    if (!$scope.DateFromDate) {
        $scope.DateFromDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.DateToDate) {
        $scope.DateToDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    } else {
        Restangular.all('report').getList(
      {
          search: "number='016'"
      }
  ).then(function (result) {
      $scope.VeiwHeader = result[0];
      $scope.GetLayout(result[0].id)
  }, function (response) {
      toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
  });
        if ($rootScope.user.UserRole.Name == "Admin" || $rootScope.user.UserRole.Name == "CCMANAGER" || $rootScope.user.UserRole.Name == "LC" || $rootScope.user.UserRole.Name == "AREAMANAGER" || $rootScope.user.UserRole.Name == "ACCOUNTING" || $rootScope.user.UserRole.Name == "PH") {
            $scope.StoreID = '';
            $scope.ShowStores = true;
        } else {
            $scope.StoreID = $rootScope.user.StoreID;
        }
    }
    $scope.exportToExcel = function (tableId) {
        $scope.exportHref = Excel.tableToExcel(tableId, 'Order List');
        $timeout(function () { location.href = $scope.exportHref }, 1);
    };
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
    };
    $scope.GetLayout = function (ReportID) {
        Restangular.all('reportlayout').getList(
       {
           search: "ReportID='" + ReportID + "'"
       }
    ).then(function (result) {
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
        toaster.pop('error', $translate.instant('Server.ServerError'), response);
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
            toaster.pop('success',$translate.instant('orderfile.Saved'),$translate.instant('orderfile.Saved'));
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
            toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
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
    $scope.LoadData = function () {
        $scope.isWaiting = true;
        Restangular.all('extendedreports/productstatistics').post(
                {
                    ProductCategoryTagID: $scope.TagData,
                    StartDate: ($scope.DateFromDate) ? "" + $scope.DateFromDate + "" : "" + $scope.NewDate + "",
                    EndDate: ($scope.DateToDate) ? "" + $scope.DateToDate + "" : "" + $scope.NewDate + "",
                    StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                    SourceID: ($scope.SourceID == null) ? '' : $scope.SourceID,
                    OrderType: ($scope.OrderTypeID == null) ? -1 : $scope.OrderTypeID
                }
            ).then(function (orders) {
                ctrl.table.data = orders.plain();
                $scope.TableData = orders.plain();
                $scope.ShowReport();
                $scope.isWaiting = false;
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                $scope.isWaiting = false;
            });
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
    };
    $scope.LoadPivotData = function () {
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
                        "day name": dateFormat("OperationDate", "%w", true),
                        "Hours": dateFormat("OperationDate", "%h", true),
                        "Minutes": dateFormat("OperationDate", "%M", true)
                    },
                    sorters: function (attr) {
                        if (attr == "month name") {
                            return sortAs(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
                        }
                        if (attr == "day name") {
                            return sortAs(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
                        }
                        if (attr == "Hours") {
                            return sortAs(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]);
                        }
                    },
                    rows: ["Store", "OperationDate", "OrderType"],
                    cols: ["Hours"],
                    aggregatorName: "Sum",
                    aggregator: sum(intFormat)(["Amount"]),
                    vals: ["Amount"],
                    rendererName: "Heatmap",
                    renderer: renderers["Heatmap"]
                },
                editMode: false
            };
        }
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
    $scope.ordersourceies = [];
    $scope.loadEntities('ordersource', 'ordersourceies');
    $scope.GetOrderType = function (data) {
        $scope.OrderTypeID = data;
    };
    $scope.ShowReport = function (edit) {
        if (edit != undefined) {
            $scope.ShowSaveButton = edit;
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
        $rootScope.uService.ExitController("turnoverbyhoursreportCtrl");
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