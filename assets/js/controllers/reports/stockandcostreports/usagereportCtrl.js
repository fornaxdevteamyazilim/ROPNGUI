﻿'use strict';
app.controller('usagereportCtrl', usagereportCtrl);
function usagereportCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, Excel, $timeout, $translate, NG_SETTING, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("usagereportCtrl");
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList(
       {
           search: "number='014'"
       }).then(function (result) {
       $scope.VeiwHeader = result[0];
   }, function (response) {
       toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
   });
    }
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
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
    $scope.Time = ngnotifyService.ServerTime();
    $scope.UsageReportResults = [];
    $scope.LoadUsageReportResults = function () {
        $scope.isWaiting = true;
        Restangular.all('reports/inventoryconsuptioncontrol').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                InventoryID: ($scope.InventoryID) ? "" + $scope.InventoryID + "" : "",
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                InventoryGroupTagID: ($scope.TagData) ? $scope.TagData.id : ''
            }).then(function (result) {
            $scope.isWaiting = false;
            $scope.UsageReportResults = result;
            $scope.TotalUnit = 0;
            $scope.TotalUnitCount = 0;
            $scope.ProductCount = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.TotalUnitCount += (result[i].UnitCount * result[i].UnitPrice);
            }
            for (var i = 0; i < result.length; i++) {
                $scope.ProductCount += result[i].ProductCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.TotalUnit += result[i].UnitCount;
            }}, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'Uretim Kontrol Raporu');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    $scope.GetInventory = function (InventoryID) {
        $scope.InventoryID = InventoryID;
        $scope.selectedInventory = $filter('filter')($scope.inventories, { id: InventoryID });

    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
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
    $scope.UsagereportExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/reports/inventoryconsuptioncontrolxls?StoreID=' + $rootScope.user.StoreID + '&startDate=' + $scope.StartDate + '&endDate=' + $scope.EndDate
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
    $scope.Time = ngnotifyService.ServerTime();
    var stopTime;
    stopTime = $interval(function () { $scope.Timer(); }, 1000);
    $scope.Timer = function () {
        $scope.Time = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
    }
    $scope.$on('$destroy', function () {
        $interval.cancel(stopTime);
    });
    $scope.selecttag = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/reportspopup/selecttag.html',
            controller: 'selecttagCtrl',
            size: '',
            backdrop: '',
            resolve: {
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
        $rootScope.uService.ExitController("usagereportCtrl");
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