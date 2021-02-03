'use strict';
app.controller('orderpaymentsCtrl', orderpaymentsCtrl);
function orderpaymentsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, Excel, $timeout, NG_SETTING, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("orderpaymentsCtrl");
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.Time = new Date();
    $scope.OrderPayments = [];
    $scope.LoadOrderPayments = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/orderpayments').getList(
            {
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                PaymentTypeID: ($scope.PaymentTypeID) ? $scope.PaymentTypeID : ''
            }
        ).then(function (result) {
            $scope.isWaiting = false;
            $scope.totalorder = result.length;
            $scope.Total = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.Total += result[i].Amount;
            }
            $scope.TotalDiscount = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.TotalDiscount += result[i].Order.Discounts;
            }
            $scope.OrderPayments = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadOrderPayments();
    $scope.GetPayment = function (data) {
        $scope.PaymentTypeID = data;
        //$scope.selectedPaymentType = $filter('filter')($scope.storepaymenttypes, { id: data });
    };
    $scope.storepaymenttypes = [];
    $scope.loadStorePaymentTypes = function (StoreID) {
            Restangular.all('cache/storepaymenttype').getList({
                StoreID: (StoreID) ? StoreID : $rootScope.user.StoreID,
            }).then(function (result) {
                $scope.storepaymenttypes = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.Message);
            });
    };
    $scope.loadStorePaymentTypes();
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
        $scope.loadStorePaymentTypes(data);

    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'GerceklesenOdemeler.xls');
        downloadLink[0].click();
    };
    $scope.OrderPaymentsExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/order/reports/orderpaymentsxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate + '&StoreID=' + $rootScope.user.StoreID;
    };
    $scope.RunOrderDetail = function (itemID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/giroreports/orderpaymentdetails.html',
            controller: 'orderpaymentdetailsCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                OrderID: function () {
                    return itemID;
                }
            }
        });
        modalInstance.result.then(function (item) {

        })
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.ordertype = [];
    $scope.loadEntities('enums/ordertype', 'ordertype');
    $scope.paymentstatus = [];
    $scope.loadEntities('enums/paymentstatus', 'paymentstatus');
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("orderpaymentsCtrl");
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