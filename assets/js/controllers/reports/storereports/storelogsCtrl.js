'use strict';
app.controller('storelogsCtrl', storelogsCtrl);
function storelogsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, toaster, $window, $stateParams, $rootScope, $location, $translate, Excel, $timeout, NG_SETTING, ngnotifyService, $element) {
    $rootScope.uService.EnterController("storelogsCtrl");
    if (!$scope.ReportParameters.StartDate) {
        $scope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.ReportParameters.EndDate) {
        $scope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
        $scope.Time = ngnotifyService.ServerTime();

    $scope.StoreLogs = [];
    $scope.LoadStoreLogs = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('storereports/storehistory').getList(
            {
                StartDate: $scope.ReportParameters.StartDate,
                EndDate: $scope.ReportParameters.EndDate,
                StoreID: $rootScope.user.StoreID
            }).then(function (result) {
            $scope.StoreLogs = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.StoreLogsExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/storereports/storehistoryxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate + '&StoreID=' + $rootScope.user.StoreID;
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Restoran Logları.xls');
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
            $scope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd ');
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
            $scope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };
        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storelogsCtrl");
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