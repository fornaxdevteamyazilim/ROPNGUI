'use strict';
app.controller('ordertotalsCtrl', ordertotalsCtrl);
function ordertotalsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $location, $translate, Excel, $timeout, NG_SETTING, $rootScope, ngnotifyService, $element, userService) {
    $rootScope.uService.EnterController("ordertotalsCtrl");
    userService.userAuthorizated();
    $scope.OrderTypeArr = [];
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.Time = ngnotifyService.ServerTime();
    $scope.OrderTotals = [];
    $scope.LoadOrderTotals = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/ordertotals').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID
            }
        ).then(function (result) {
            $scope.isWaiting = false;
            $scope.Total = 0;
            $scope.CountTotal = 0;
            
            for (var i = 0; i < result.length; i++) {
                $scope.Total += result[i].amount;
                $scope.CountTotal += result[i].OrdersCount;
            }
            $scope.OrderTotals = result;
            $scope.GetDataList();
            $scope.GetOrderTypeList();
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.GetDataList = function () {
        $scope.group_to_values = $scope.OrderTotals.reduce(function (arr, item) {
            var found = 0;
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i].date == item.OperationDate) {
                    arr[i].Items.push(item);
                    arr[i].TotalAmount += item.amount;
                    arr[i].TotalCount += item.OrdersCount;
                    found = 1;
                }
            }
            if (found == 0)
                arr.push({ date: item.OperationDate, TotalCount: item.OrdersCount, TotalAmount: item.amount, Items: [item] });
            return arr;
        }, []);
    };  
    $scope.GetOrderTypeList = function () {
        $scope.group_counttotal_values = $scope.OrderTotals.reduce(function (arr, item) {
            var found = 0;
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i].OrderType == item.OrderType) {
                    arr[i].OrderTypeAmount += item.amount;
                    arr[i].OrderTypeCount += item.OrdersCount;
                    found = 1;
                }
            }
            if (found == 0)
                arr.push({ OrderType: item.OrderType, OrderTypeCount: item.OrdersCount, OrderTypeAmount: item.amount, });
            return arr;
        }, []);
    };
    $scope.GetStore = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.stores, { id: data });
    };
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'Siparis Toplamlari');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
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
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
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
        $rootScope.uService.ExitController("ordertotalsCtrl");
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
