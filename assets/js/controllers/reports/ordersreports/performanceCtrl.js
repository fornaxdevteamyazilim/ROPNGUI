'use strict';
app.controller('performanceCtrl', performanceCtrl);
function performanceCtrl($scope, $log, $modal, $timeout, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $location, $translate, Excel, NG_SETTING, userService, ngnotifyService, $element) {
            $rootScope.uService.EnterController("performanceCtrl");
    userService.userAuthorizated();
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(new Date(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.Time = new Date();
    $scope.Orders = [];
    $scope.formatTimeFromSeconds = function (cellInfo) {
        var sec = cellInfo * 1000;
        var dateObj = new Date(sec);
        var hours = dateObj.getUTCHours();
        var minutes = dateObj.getUTCMinutes();
        var seconds = dateObj.getSeconds();
        var timeString = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
        return (cellInfo) ? timeString : "-";
    };
    $scope.LoadOrders = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/deliveryperformance').getList(
            {
                EndDate: $scope.EndDate,
                StartDate: $scope.StartDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
            }).then(function (result) {
                $scope.linage = result.length;
                $scope.TotalExit = 0;
                $scope.ExitAvarage = 0;
                $scope.lineaverage = 0;
                $scope.PreparinDuration = 0;
                $scope.PreparinDurationMakeTable = 0;
                $scope.PreparinDurationCutTable = 0;
                $scope.Greater30Munite = 0;
                $scope.Greater45Munite = 0;
                $scope.isWaiting = false;
                $scope.Orders = angular.copy(result);
                for (var i = 0; i < result.length; i++) {
                    $scope.lineaverage += result[i].DeliveryPeriod;
                    $scope.TotalExit += result[i].OrderOutPeriod;
                    $scope.ExitAvarage = ($scope.TotalExit / $scope.linage) / 60;
                    $scope.PreparinDuration += result[i].PeparingDuration;
                    $scope.PreparinDurationMakeTable += result[i].PeparingMakeTableDuration;
                    $scope.PreparinDurationCutTable += result[i].PeparingCutTableDuration;
                    if ((result[i].DeliveryPeriod / 60) > 30 && (result[i].DeliveryPeriod / 60) < 45)
                        $scope.Greater30Munite += 1;
                    if ((result[i].DeliveryPeriod / 60) > 45)
                        $scope.Greater45Munite += 1;
                }
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
                $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.PerformanceExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/order/reports/deliveryperformancexls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate + '&StoreID=' + $scope.StoreID;
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Siparis Performanslari.xls');
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
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("performanceCtrl");
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