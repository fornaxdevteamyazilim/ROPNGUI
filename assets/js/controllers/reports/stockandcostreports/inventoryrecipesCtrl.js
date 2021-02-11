'use strict';
app.controller('inventoryrecipesCtrl', inventoryrecipesCtrl);
function inventoryrecipesCtrl($scope, $modal, $filter, SweetAlert,$translate, Restangular, toaster, $window, Excel, $timeout, $stateParams, $rootScope, $location, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventoryrecipesCtrl");
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList().then(function (result) {
            $scope.VeiwHeader = result[0];
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
    $scope.ReportData = [];
    $scope.Time = ngnotifyService.ServerTime();
    $scope.LoadReport = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('reports/inventoryecipes').getList(
            {
                PeriodID: ($scope.PeriodID),
                InventoryID: ($scope.InventoryID) ? $scope.InventoryID : ''
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.ReportData = result;
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.GetPeriods = function (data) {
        $scope.PeriodID = data;
        $scope.selectedPeriod = $filter('filter')($scope.periods, { id: data });
    };
    $scope.periods = [];
    if (!$scope.periods.length) {
        Restangular.all('period').getList({
            pageNo: 1,
            pageSize: 1000,
        }).then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].PeriodStateID == 0) {
                    $scope.StartDate = $filter('date')(angular.copy(result[i].StartDate), 'yyyy-MM-dd ');
                    $scope.EndDate = $filter('date')(angular.copy(result[i].EndDate), 'yyyy-MM-dd ');
                }
            }
            if (!$scope.StartDate && !$scope.EndDate) {
                $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
                $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
            }
        }, function (response) {
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
        });
    }
    $scope.GetInventories = function (data) {
        $scope.InventoryID = data;
        $scope.selectedInventory = $filter('filter')($scope.inventories, { id: data });
    };
    //$scope.exportToExcel = function (tableId) {
    //    $scope.exportHref = Excel.tableToExcel(tableId, 'Envanter Reçeteleri');
    //    $timeout(function () { location.href = $scope.exportHref }, 1);
    //};

        $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Envanter Reçeteleri.xls');
        downloadLink[0].click();
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
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.periods = [];
    $scope.loadEntities('period', 'periods');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');

    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventoryrecipesCtrl");
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