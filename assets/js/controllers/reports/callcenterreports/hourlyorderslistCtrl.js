'use strict';
app.controller('hourlyorderslistCtrl', hourlyorderslistCtrl);
function hourlyorderslistCtrl($scope, $log, $modal, $timeout, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $location, $translate, Excel, ngnotifyService, $rootScope, $element) {
    $rootScope.uService.EnterController("hourlyorderslistCtrl");
    var stopTime;
    $scope.OnRefresh = true;
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.Time = ngnotifyService.ServerTime();
    $scope.HourlyOrdersList = [];
    $scope.LoadHourlyOrdersList = function () {
        $scope.isWaiting = true;
        Restangular.all('ccstats/hourlyorderslist').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
            }
        ).then(function (result) {
            $scope.OrderHour = 0;
            $scope.OrdersCount = 0;
            $scope.OrdersAmount = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.OrderHour += result[i].OrderHour;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersCount += result[i].OrdersCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersAmount += result[i].OrdersAmount;
            }
            $scope.isWaiting = false;
            $scope.HourlyOrdersList = result;
            $scope.start();
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadHourlyOrdersList();
    $scope.SelectStartDate = function (item) {
        $scope.stop();
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
            $scope.OnRefresh = false;
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'CM Hourly Order List.xls');
        downloadLink[0].click();
    };
    $scope.SelectEndDate = function (item) {
        $scope.stop();
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
            $scope.OnRefresh = false;
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.RefreshData = function () {
        $scope.LoadHourlyOrdersList();
        $scope.start();
    };
    $scope.start = function () {
        $scope.stop();
        if ($scope.OnRefresh == true) {
            stopTime = $timeout(function () { $scope.RefreshData(); }, 60000);
        }
    };
    $scope.stop = function () {
        $timeout.cancel(stopTime);
    };
    $scope.$on('$destroy', function () {
        $scope.stop();
    });
    $scope.$watch(angular.bind($scope.OnRefresh, function () {
        return $scope.OnRefresh;
    }), function (value) {
        if (value == false) {
            $scope.stop();
        }
        if (value == true) {
            $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
            $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
            $scope.start();
        }
    });
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("hourlyorderslistCtrl");
    });
};
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
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