'use strict';
app.controller('cashreportCtrl', cashreportCtrl);
function cashreportCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, Excel, $timeout, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("cashreportCtrl");

    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    if ($location.$$path == "/app/reports/giroreports/maincashreport") {
        $scope.selectDate = false
    }
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList(
            {
                search: "number='001'"
            }
        ).then(function (result) {
            $scope.VeiwHeader = result[0].name;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    }
    $scope.DateFromDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    //$scope.GetSoreID = function (data) {
    //    $scope.StoreID = data;
    //    $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    //};
    $scope.CashReportResults = [];
    $scope.LoadCashReportResults = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('reports/cashreport').getList(
            {
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                OperationDate: (FromValue) ? "" + FromValue + "" : "" + $scope.DateFromDate + "",
            }
        ).then(function (result) {
            var thedate = ($rootScope.user.StoreID == $scope.StoreID) ? $rootScope.user.Store.OperationDate : $scope.DateFromDate;
            var storeOpdate = $filter('date')(ngnotifyService.ServerTime(thedate), 'yyyy-MM-dd');
            var serverDate = $filter('date')(ngnotifyService.ServerOperationDate(), 'yyyy-MM-dd');
            $scope.Tittle = "";
            if (serverDate != storeOpdate)
                $scope.Tittle = "-***Günsonu***";
            if (storeOpdate == "0NaN-NaN-NaN")
                $scope.Tittle = "-***Günsonu***";
            $scope.isWaiting = false;
            return $scope.CashReportResults = result;
        }, function (response) {
            $scope.Tittle = "";
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
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.exportToExcel = function (tableId) {
        $scope.exportHref = Excel.tableToExcel(tableId, 'Order List');
        $timeout(function () { location.href = $scope.exportHref }, 1);
    };
    $scope.CalcTotalAmount = function (data) {
        var Total = 0;
        for (var i = 0; i < data.length; i++)
            Total += data[i].Value;
        return Total;
    };
    $scope.SelectItem = function (id) {
        if ($scope.CashReportResults[0].DeclaredRevenue && $scope.CashReportResults[0].DeclaredRevenue.CanChangeRevenue) {
            location.href = '#/app/reports/giroreports/declaredrevenuee/' + id;
        }
        else
        {
            toaster.pop('error', $translate.instant('Server.ServerError'), $translate.instant('Unable to edit declared revenue!'));
        }
    };
    Array.prototype.sum = function (prop) {
        var total = 0
        for (var i = 0, _len = this.length; i < _len; i++) {
            total += this[i][prop]
        }
        return total
    }
    $scope.CalcTotalIncome = function (items) {
        var TotalIncome = 0;
        for (var i = 0; i < items.length; i++)
            TotalIncome += items[i].Value;
        return TotalIncome;
    };
    $scope.CalcTotalDiscount = function (data) {
        var Total = 0;
        for (var i = 0; i < data.length; i++)
            Total += data[i].DiscountAmount;
        return Total;
    };
    $scope.CalcTotalQuantity = function (items) {
        var TotalQuantity = 0;
        for (var i = 0; i < items.length; i++)
            TotalQuantity += items[i].Quantity;
        return TotalQuantity;
    };
    $scope.CalcTotalPercent = function (items) {
        var TotalPercent = 0;
        for (var i = 0; i < items.length; i++)
            TotalPercent += items[i].Percent;
        return TotalPercent;
    };
    $scope.CalcTotalTransactions = function (items) {
        var TotalTransactions = 0;
        for (var i = 0; i < items.length; i++)
            TotalTransactions += items[i].Amount;
        return TotalTransactions;
    };
    $scope.CalcTotalVat = function (data) {
        var TotalVat = 0;
        for (var i = 0; i < data.length; i++)
            TotalVat += data[i].VAT;
        return TotalVat;
    };
    $scope.CalcTotalInvoice = function (items) {
        var TotalInvoice = 0;
        for (var i = 0; i < items.length; i++)
            TotalInvoice += items[i].Amount;
        return TotalInvoice;
    };

    $scope.CalcTotalPaymentQuantity = function (items) {
        var TotalPaymentQuantity = 0;
        for (var i = 0; i < items.length; i++)
            TotalPaymentQuantity += items[i].Value;
        return TotalPaymentQuantity;
    };
    $scope.CalcTotalPaymentAmount = function (items) {
        var TotalPaymentAmount = 0;
        for (var i = 0; i < items.length; i++)
            TotalPaymentAmount += items[i].Value;
        return TotalPaymentAmount;
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
    $scope.paymenttypes = [];
    $scope.loadEntitiesCache('paymenttype', 'paymenttypes');

    $scope.Back = function () {
        $window.history.back();
    };
    $scope.Time = ngnotifyService.ServerTime();
    var stopTime;
    stopTime = $interval(function () { $scope.Timer(); }, 1000);
    $scope.Timer = function () {
        $scope.Time = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
    }
    //$scope.$on('$destroy', function () {
    //    $interval.cancel(stopTime);
    //});

    $scope.$on('$destroy', function () {
        $interval.cancel(stopTime);
        $element.remove();
        $rootScope.uService.ExitController("cashreportCtrl");
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