app.controller('inventorycostsummaryCtrl', inventorycostsummaryCtrl);
function inventorycostsummaryCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, NG_SETTING, $location, Excel, $timeout, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorycostsummaryCtrl");

    $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.Time = ngnotifyService.ServerTime();

    $scope.LoadResults = function () {
        $scope.isWaiting = true;
        Restangular.one('dashboard/inventorycostsummary').get(
            {
                PeriodID: ($scope.PeriodID),
                StoreID: $scope.StoreID,
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.item = Restangular.copy(result);
                $scope.getIdeal = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.item.CostTypes.length; i++) {
                        var ct = $scope.item.CostTypes[i];
                        total += (ct.Ideal);
                    }
                    return total;
                }
                $scope.getReal = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.item.CostTypes.length; i++) {
                        var ct = $scope.item.CostTypes[i];
                        total += (ct.Real);
                    }
                    return total;
                }
                $scope.getIdealPercent = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.item.CostTypes.length; i++) {
                        var ct = $scope.item.CostTypes[i];
                        total += (ct.IdealPercent);
                    }
                    return total;
                }
                $scope.getRealPercent = function () {
                    var total = 0;
                    for (var i = 0; i < $scope.item.CostTypes.length; i++) {
                        var ct = $scope.item.CostTypes[i];
                        total += (ct.RealPercent);
                    }
                    return total;
                }
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };

    //$scope.exportToExcel = function (tableId) {
    //    var blob = new Blob([document.querySelector(tableId).innerHTML], {
    //        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    //    });
    //    var downloadLink = angular.element('<a></a>');
    //    downloadLink.attr('href', window.URL.createObjectURL(blob));
    //    downloadLink.attr('download', 'MaliyetTablosu.xls');
    //    downloadLink[0].click();
    //};

        $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'MaliyetTablosu');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
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
                if (EntityType == "enums/ordertype") {
                    $scope[Container].push({ Value: -1, Name: "Tümü!", EnumValue: -1 })
                }
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
    $scope.periods = [];
    $scope.loadEntities('period', 'periods');
    $scope.SelectStartDate = function (item) {
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    $scope.SelectEndDate = function (item) {
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
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventorycostsummaryCtrl");
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