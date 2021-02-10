'use strict';
app.controller('menuincomCtrl', menuincomCtrl);
function menuincomCtrl($scope, $modal, $filter, SweetAlert,$translate, Restangular, toaster, $window, Excel, $timeout, $stateParams, $rootScope, $location, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("menuincomCtrl");
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList().then(function (result) {
            $scope.VeiwHeader = result[0];
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.ReportData = [];
    $scope.Time = ngnotifyService.ServerTime();
    $scope.LoadRepor = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('PoductSaleAnalisys/MenuIncome').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                SourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
                OrderType: ($scope.OrderTypeID == null) ? '' : $scope.OrderTypeID,
                ProductListGroup: ''//'Güncel Promosyonlar'
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.ReportData = result;
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
        $scope.exportHref = Excel.tableToExcel(tableId, 'Menu Satis Geliri');
        $timeout(function () { location.href = $scope.exportHref }, 1);
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
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.GetOrderSource = function (data) {
        $scope.OrderSourceID = data;
        $scope.selectedSource = $filter('filter')($scope.ordersources, { id: data });
    };
    $scope.GetOrderType = function (data) {
        $scope.OrderTypeID = data;
        $scope.selectedType = $filter('filter')($scope.ordertypes, { Value: data });
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
        $rootScope.uService.ExitController("menuincomCtrl");
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