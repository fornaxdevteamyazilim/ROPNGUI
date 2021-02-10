'use strict';
app.controller('dailytotalsCtrl', dailytotalsCtrl);
function dailytotalsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, $translate, ngTableParams, toaster, $window, $stateParams, $location, Excel, $timeout, NG_SETTING, ngnotifyService, $rootScope, $element) {
    $rootScope.uService.EnterController("dailytotalsCtrl");

    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.Time = ngnotifyService.ServerTime();
    $scope.DailyTotals = [];
    $scope.LoadDailyTotals = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/dailytotals').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
            }
        ).then(function (result) {
            $scope.OrdersCountTKW = 0;
            $scope.OrdersAmountTKW = 0;
            $scope.OrdersCountDelivery = 0;
            $scope.OrdersAmountDelivery = 0;
            $scope.OrdersCount = 0;
            $scope.OrdersAmount = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersCountTKW += result[i].OrdersCountTKW;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersAmountTKW += result[i].OrdersAmountTKW;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersCountDelivery += result[i].OrdersCountDelivery;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersAmountDelivery += result[i].OrdersAmountDelivery;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersCount += result[i].OrdersCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersAmount += result[i].OrdersAmount;
            }
            $scope.isWaiting = false;
            $scope.DailyTotals = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadDailyTotals();
    $scope.DailyTotalsExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/order/reports/dailytotalsxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate;
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'CM Günlük Toplamlar.xls');
        downloadLink[0].click();
    };
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };

    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("dailytotalsCtrl");
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