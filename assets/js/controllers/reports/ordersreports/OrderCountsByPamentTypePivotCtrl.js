'use strict';
app.controller('OrderCountsByPamentTypePivotCtrl', OrderCountsByPamentTypePivotCtrl);
function OrderCountsByPamentTypePivotCtrl($scope, $modal, $filter, Restangular, toaster, $window, $rootScope, $location, Excel, $timeout, $translate, NG_SETTING, userService, ngnotifyService, $element) {
            $rootScope.uService.EnterController("OrderCountsByPamentTypePivotCtrl");
    userService.userAuthorizated();
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.Orders = [];
    $scope.LoadOrderCountsByPamentTypePivot = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/OrderCountsByPamentTypePivot').getList(
    {
        EndDate: $scope.EndDate,
        StartDate: $scope.StartDate,
        StoreID: $rootScope.user.StoreID,
        OrderSourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
        PaymentTypeID: ($scope.PaymentTypeID == null) ? '' : $scope.PaymentTypeID
    }).then(function (result) {
        $scope.isWaiting = false;
        $scope.Orders = result.plain();
        $scope.gridOptions = { data: 'Orders' };
        $scope.grid = true;
    }, function (response) {
        $scope.isWaiting = false;
        toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    });
    };
    $scope.GetOrderSourceID = function (data) {
        $scope.OrderSourceID = data;
    };
    $scope.GetExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/order/reports/OrderCountsByPamentTypePivotxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate + '&OrderSourceID=&PaymentTypeID=';
    };
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'sheet name');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    $scope.exportData = function () {
        var blob = new Blob([document.getElementById('report').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');

    $scope.Back = function () {
        $window.history.back();
    };


    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'sheet name');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    }
    $scope.exportData = function () {
        var blob = new Blob([document.getElementById('report').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Report.xls");
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("OrderCountsByPamentTypePivotCtrl");
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