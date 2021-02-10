'use strict';
app.controller('storeordersCtrl', storeordersCtrl);
function storeordersCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, $translate, toaster, $window, $stateParams, $location, Excel, $timeout, NG_SETTING, ngnotifyService, $rootScope, $element) {
        $rootScope.uService.EnterController("storeordersCtrl");  
  if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.Time = ngnotifyService.ServerTime();
    $scope.AgentOrders = [];
    $scope.LoadAgentOrders = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('ccstats/storeorders').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
            }
        ).then(function (result) {
            $scope.isWaiting = false;
            $scope.TotalOrders = 0;
            $scope.TotalAmount = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.TotalOrders += result[i].OrdersCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.TotalAmount += result[i].OrdersAmount;
            }
            $scope.AgentOrders = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadAgentOrders();
    $scope.StoreOrdersExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/ccstats/storeordersxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate;
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'CM Restoran Raporu.xls');
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
        $rootScope.uService.ExitController("storeordersCtrl");
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


