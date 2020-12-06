'use strict';
app.controller('storesalesstatisticsCtrl', storesalesstatisticsCtrl);
function storesalesstatisticsCtrl($scope, $log, $modal, $timeout, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $location, $translate, Excel, NG_SETTING, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("storesalesstatisticsCtrl");
    var stopTime;
    $scope.Time = new Date();
    $scope.OnRefresh = true;
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.StoreSalesStatistics = [];
    $scope.LoadStoreSalesStatistics = function () {
        $scope.isWaiting = true;
        Restangular.all('salestatistics/storesalestatistics').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,

            }).then(function (result) {
                $scope.OrdersAmountNoVAT = 0;
                $scope.OrdersCount = 0;
                $scope.AC = 0;
                $scope.Group1ProductCount = 0;
                $scope.Group1ProductRatio = 0;
                $scope.Group2ProductCount = 0;
                $scope.Group2ProductRatio = 0;
                $scope.GroupsAmountNoVAT = 0;
                $scope.GroupsAmounRatioNoVAT = 0;
                for (var i = 0; i < result.length; i++) {
                    $scope.OrdersAmountNoVAT += result[i].OrdersAmountNoVAT;
                }
                for (var i = 0; i < result.length; i++) {
                    $scope.OrdersCount += result[i].OrdersCount;
                }
                for (var i = 0; i < result.length; i++) {
                    $scope.AC += result[i].AC;
                }
                for (var i = 0; i < result.length; i++) {
                    $scope.Group1ProductCount += result[i].Group1ProductCount;
                }
                for (var i = 0; i < result.length; i++) {
                    $scope.Group1ProductRatio += result[i].Group1ProductRatio;
                }
                for (var i = 0; i < result.length; i++) {
                    $scope.Group2ProductCount += result[i].Group2ProductCount;
                }
                for (var i = 0; i < result.length; i++) {
                    $scope.Group2ProductRatio += result[i].Group2ProductRatio;
                }
                for (var i = 0; i < result.length; i++) {
                    $scope.GroupsAmountNoVAT += result[i].GroupsAmountNoVAT;
                }
                for (var i = 0; i < result.length; i++) {
                    $scope.GroupsAmounRatioNoVAT += result[i].GroupsAmounRatioNoVAT;
                }
                $scope.isWaiting = false;
                $scope.StoreSalesStatistics = result;
                $scope.start();
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.exportToExcel = function (tableId) {
        $scope.exportHref = Excel.tableToExcel(tableId, 'Restaurant Sales Statistics');
        $timeout(function () { location.href = $scope.exportHref }, 1);
    };
    $scope.LoadStoreSalesStatistics();
    $scope.StoreSalesStatisticsExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/salestatistics/storesalestatisticsxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate + '&StoreID=' + $rootScope.user.StoreID;
    };
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
        $scope.LoadStoreSalesStatistics();
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
        $rootScope.uService.ExitController("storesalesstatisticsCtrl");
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