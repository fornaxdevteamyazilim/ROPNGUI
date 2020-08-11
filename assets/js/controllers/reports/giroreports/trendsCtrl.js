'use strict';
app.controller('trendsCtrl', trendsCtrl);
function trendsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, Excel, $timeout, NG_SETTING, ngnotifyService, $element, userService) {
    $rootScope.uService.EnterController("trendsCtrl");
    userService.userAuthorizated();
    var stopTime;
    $scope.mark = '+';
    $scope.SortData = '+Store';
    $scope.OnRefresh = true;
    $scope.Time = new Date();
    var totalToday = 0;
    var totalTodayTC = 0;
    var totalPrewWeekIncome = 0;
    var totalPrewWeekTC = 0;
    var totalLastDayIncome = 0;
    var totalLastDayTC = 0;
    var totalDailyIncome = 0;
    var totalTotalMonthlyIncome = 0;
    var totalMonthlyTC = 0;
    var totalTCTrend = 0;
    var totalIncomeTrend = 0;
    $scope.translate = function () {
        $scope.trREPORT = $translate.instant('main.REPORT');
        $scope.trEXCEL = $translate.instant('main.EXCEL');
        $scope.trPRINT = $translate.instant('main.PRINT');
        $scope.trTODAYINCOME = $translate.instant('main.TODAYINCOME');
        $scope.trTODAYTC = $translate.instant('main.TODAYTC');
        $scope.trPREWEEKINCOME = $translate.instant('main.PREWEEKINCOME');
        $scope.trPREWEEKTC = $translate.instant('main.PREWEEKTC');
        $scope.trPREWEEKAC = $translate.instant('main.PREWEEKAC');
        $scope.SALESTARGET = $translate.instant('main.PREWEEKAC');
        $scope.TCTARGET = $translate.instant('main.PREWEEKAC');
        $scope.ACTARGET = $translate.instant('main.PREWEEKAC');

    };
    $scope.ChangeSortData = function (data) {
        var datamark = $scope.SortData.substring(0, 1);
        var sortdata = $scope.SortData.substring(1, $scope.SortData.length);
        if (sortdata == data) {
            if (datamark == '+') {
                $scope.SortData = '-' + data;
                $scope.loadtrendsReport();
            }
            if (datamark == '-') {
                $scope.SortData = '+' + data;
                $scope.loadtrendsReport();
            }
        } else {
            $scope.SortData = '-' + data;
            $scope.loadtrendsReport();
        }
    };
    $scope.selectedStore = function (StoreID, Store) {
        var data = {};
        data.id = StoreID;
        data.name = Store;
        $rootScope.SelectedData = data;
        $location.path('/app/dashboard');
    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    if (!$scope.DateFromDate) {
        $scope.DateFromDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    } else {
        $scope.DateFromDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.trendresult = [];
    $scope.loadtrendsReport = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('extendedreports/trends').getList({}).then(function (result) {
            $scope.isWaiting = false;
            $scope.totalToday = $scope.sumColumnJS(result, "TodayIncome");
            $scope.totalTodayTC = $scope.sumColumnJS(result, "TodayTC");
            $scope.totalPrewWeekIncome = $scope.sumColumnJS(result, "PrewWeekIncome");
            $scope.totalPrewWeekTC = $scope.sumColumnJS(result, "PrewWeekTC");
            $scope.totalLastDayIncome = $scope.sumColumnJS(result, "LastDayIncome");
            $scope.totalLastDayTC = $scope.sumColumnJS(result, "LastDayTC");
            $scope.totalDailyIncome = $scope.sumColumnJS(result, "DailyIncome");
            $scope.totalTotalMonthlyIncome = $scope.sumColumnJS(result, "TotalMonthlyIncome");
            $scope.totalMonthlyTC = $scope.sumColumnJS(result, "MonthlyTC");
            $scope.totalTCTrend = $scope.sumColumnJS(result, "TCTrend");
            $scope.totalIncomeTrend = $scope.sumColumnJS(result, "IncomeTrend");
            $scope.totalPrevMonth = $scope.sumColumnJS(result, "TotalPrevMonthToDateIncome");
            $scope.totalPrevMonthTC = $scope.sumColumnJS(result, "PrevMonthToDateTC");
            $scope.totalSalesTarget = $scope.sumColumnJS(result, "SalesTarget");
            $scope.totalTcTarget = $scope.sumColumnJS(result, "TCTarget");

            $scope.$broadcast('$$rebind::refresh');
            $scope.trendresult = angular.copy(result);
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', "Server Error", response.data.ExceptionMessage);
        });
    };
    $scope.loadtrendsReport();
    //$rootScope.enableSessionTimeOut();
    $scope.sumColumnJS = function sumColumnJS(array, col) {
        var sum = 0;
        array.forEach(function (value, index, array) {
            sum += value[col];
        });
        return sum;
    }
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'Trend Raporu');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    $scope.LoadStoreCashxls = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/extendedreports/trends';
    };
    $scope.RefreshData = function () {
        $scope.loadtrendsReport();
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
        $scope.stop();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("trendsCtrl");
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
app.filter('abs', function () {
    return function (val) {
        return Math.abs(val);
    }
});