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
app.controller('doughchartdataCtrl', doughchartdataCtrl);
function doughchartdataCtrl($scope, $filter, $modal, $log, Restangular, ngTableParams, SweetAlert, $timeout, toaster, $window, $rootScope, $compile, $location, $translate, Excel, ngnotifyService, $element) {
    $rootScope.uService.EnterController("doughchartdataCtrl");
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    var dc = this;
    var dateFormat = $.pivotUtilities.derivers.dateFormat;
    var sortAs = $.pivotUtilities.sortAs;
    var tpl = $.pivotUtilities.aggregatorTemplates;
    var sum = $.pivotUtilities.aggregatorTemplates.sum;
    var numberFormat = $.pivotUtilities.numberFormat;
    var renderers = $.extend($.pivotUtilities.renderers);
    var intFormat = numberFormat({ digitsAfterDecimal: 0, thousandsSep: ".", decimalSep: "," });
    $scope.Time = ngnotifyService.ServerTime();
    $scope.TableData = [];
    $scope.VeiwHeader = {};
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    } else {
        Restangular.all('report').getList(
            {
                search: "number='030'"
            }).then(function (result) {
                $scope.VeiwHeader = result[0];
                $scope.GetLayout(result[0].id)
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    }

    if ($rootScope.user.UserRole.Name == "Admin" || $rootScope.user.UserRole.Name == "CCMANAGER" || $rootScope.user.UserRole.Name == "LC" || $rootScope.user.UserRole.Name == "AREAMANAGER" || $rootScope.user.UserRole.Name == "ACCOUNTING") {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }

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
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.exportToExcel = function (tableId) {
        $scope.exportHref = Excel.tableToExcel(tableId, 'HamurAcmaTablosu');
        $timeout(function () { location.href = $scope.exportHref }, 1);
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
            toaster.pop('success',  $translate.instant('orderfile.Saved'),  $translate.instant('orderfile.Saved'));
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
            toaster.pop('success',  $translate.instant('orderfile.Updated'),  $translate.instant('orderfile.Updated'));
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
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
    };
    $scope.LoadData = function () {
        $scope.isWaiting = true;
        Restangular.all('reports/operational/doughchartdata').getList(
            {
               
                StoreID: $scope.StoreID,
                ForDate: $scope.ForDate,
            }
        ).then(function (orders) {
            dc.table.data = orders.plain();
            $scope.TableData = orders.plain();
            $scope.ShowReport();
            $scope.isWaiting = false;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            $scope.isWaiting = false;
        });
    };
    $scope.LoadPivotData = function () {
        if ($scope.BindLayoutData && $scope.BindLayoutData.LayoutData) {
            dc.table = {
                data: $scope.TableData,
                config: JSON.parse($scope.BindLayoutData.LayoutData),
                editMode: false
            };
            if ($scope.isWaiting == false) {
                $scope.ShowReport();
            }
        } else {
            dc.table = {
                data: [],
                config: {
                    derivedAttributes: {
                        "year": dateFormat("DeliveryDate", "%y", true),
                        "month": dateFormat("DeliveryDate", "%m", true),
                        "day": dateFormat("DeliveryDate", "%d", true),
                        "month name": dateFormat("DeliveryDate", "%n", true),
                        "day name": dateFormat("DeliveryDate", "%w", true),
                        "Hours": dateFormat("DeliveryDate", "%H", true)
                    },
                    sorters: function (attr) {
                        //if (attr == "month name") {
                        //    return sortAs(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
                        //}
                        if (attr == "WeekDay") {
                            return sortAs(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
                        }
                        //if (attr == "Hours") {
                        //    return sortAs(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"]);
                        //}
                        if (attr == "name") {
                            return sortAs(["K", "O", "B", "I.O", "I.B", "U"]);
                        }
                    },
                    rows: ["Hour"],
                    cols: ["WeekDay", "name"],
                    aggregatorName: "Count",
                    aggregator: sum(intFormat)(["Count"]),
                    vals: ["Count"],
                    rendererName: "Heatmap",
                    renderer: renderers["Heatmap"]
                },
                editMode: false
            };
        }
    };

    $scope.SelectForDate = function (item) {
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
            $scope.ForDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };

    $scope.ShowReport = function (edit) {
        if (edit != undefined) {
            $scope.ShowSaveButton = edit;
            dc.table.editMode = edit;
        }
        if (!dc.table.editMode) {
            dc.table.config.aggregator = sum(intFormat)(["Count"]);
        }
        var newElement = angular.element("<pivot  data='dc.table.data' config='dc.table.config' edit-mode='dc.table.editMode'></pivot>");
        $compile(newElement)($scope);
        $('#report').html(newElement);
    };

    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("doughchartdataCtrl");
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