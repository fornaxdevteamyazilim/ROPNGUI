'use strict';
app.controller('storecashcontrolCtrl', storecashcontrolCtrl);
function storecashcontrolCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, Excel, $timeout, NG_SETTING, ngnotifyService, $element) {
           $rootScope.uService.EnterController("storecashcontrolCtrl");

   if (!$scope.DateFromDate) {
        $scope.DateFromDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    } else {
        $scope.DateFromDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.Time = ngnotifyService.ServerTime();

    $scope.StoreCashControlResults = [];
    $scope.LoadStoreCashControlResults = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/storecashcontrol').getList(
            {
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                OperationDate: (FromValue) ? "" + FromValue + "" : "" + $scope.DateFromDate + "",
            }
        ).then(function (result) {
            $scope.VAT = 0;
            $scope.Amount = 0;
            $scope.PaymentsTotal = 0;
            $scope.Delta = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.VAT += result[i].VAT;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.Amount += result[i].Amount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.PaymentsTotal += result[i].PaymentsTotal;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.Delta += result[i].Delta;
            }
            $scope.isWaiting = false;
             $scope.total = result.length;
             $scope.totalPaymentsTotal = $scope.sumColumnJS(result, "PaymentsTotal");
             $scope.totalDelta = $scope.sumColumnJS(result, "Delta");
             $scope.totalVAT = $scope.sumColumnJS(result, "VAT");
             $scope.totalAmount = $scope.sumColumnJS(result, "Amount");
            return $scope.StoreCashControlResults = result;

        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.sumColumnJS = function sumColumnJS(array, col) {
        var sum = 0;
        array.forEach(function (value, index, array) {
            sum += value[col];
        });
        return sum;
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Kasa İcmal Raporu.xls');
        downloadLink[0].click();
    };
    $scope.LoadStoreCashxls = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/order/reports/StoreCashControlxls?OperationDate=' + $scope.DateFromDate + '&StoreID=' + $rootScope.user.StoreID;
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
            $scope.DateFromDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.Time = ngnotifyService.ServerTime();
    var stopTime;
    stopTime = $interval(function () { $scope.Timer(); }, 1000);
    $scope.Timer = function () {
        $scope.Time = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
    }

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
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.states = [];
    $scope.loadEntities('enums/orderstate', 'states');
    $scope.paymentstatus = [];
    $scope.loadEntities('enums/paymentstatus', 'paymentstatus');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $interval.cancel(stopTime);
        $element.remove();
        $rootScope.uService.ExitController("storecashcontrolCtrl");
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