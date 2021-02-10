﻿app.controller('orderlistreportCtrl', orderlistreportCtrl);
function orderlistreportCtrl($scope, $modal, $filter, SweetAlert,$translate, Restangular, toaster, $window, $rootScope, $location, Excel, $timeout, NG_SETTING, userService, ngnotifyService, $http, $element) {
            $rootScope.uService.EnterController("orderlistreportCtrl");
    userService.userAuthorizated();
    $scope.OrderStateID = '';
    if (!$rootScope.ReportParameters.StartDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    if (userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("MarketingDepartment") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
        $scope.selectedStore = $filter('filter')($scope.stores, { id: FromValue });

    };
    $scope.Time = ngnotifyService.ServerTime();
    $scope.OrderList = [];
    $scope.LoadOrderList = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/orderlist').getList(
            {
                StoreID: $scope.StoreID,
                StartDate: $rootScope.ReportParameters.StartDate,
                EndDate: $rootScope.ReportParameters.EndDate,
                OrderStateID: ($scope.OrderStateID) ? $scope.OrderStateID : '',
                OrderSourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
                OrderType: ($scope.OrderTypeID == null) ? '' : $scope.OrderTypeID,
            }).then(function (result) {
                $scope.TotalOrders = 0;
                $scope.TotalAmount = 0;
                $scope.isWaiting = false;
                angular.copy(result, $scope.OrderList);
                $scope.TotalOrders = result.length;
                for (var i = 0; i < result.length; i++) {
                    $scope.TotalAmount += result[i].Amount;
                }
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
  
    $scope.AgentOrdersExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/order/reports/orderlistxls?StoreID=' + $scope.StoreID + '&StartDate=' + $rootScope.ReportParameters.StartDate + '&EndDate=' + $rootScope.ReportParameters.EndDate + '&OrderStateID=' + $scope.OrderStateID;
    };
    $scope.exportToPdf = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/pdf;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'SiparisListesi');
        downloadLink[0].click();
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'SiparisListesi.xls');
        downloadLink[0].click();
    };
    $scope.RunOrderDetail = function (itemID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/others/orderlistreportdetail.html',
            controller: 'orderlistreportdetailCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                OrderID: function () {
                    return itemID;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
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
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
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
    $scope.orderstates = [];
    $scope.loadEntities('enums/orderstate', 'orderstates');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.OrderTypeID = "-1";
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.changeOrderState = function (StateID) {
        $scope.OrderStateID = StateID;
        //$scope.selectedState = $filter('filter')($scope.orderstates, { id: StateID });
    };
    $scope.GetOrderType = function (data) {
        $scope.OrderTypeID = data;
        $scope.selectedType = $filter('filter')($scope.ordertypes, { Value: data });
    };
    $scope.GetOrderSource = function (data) {
        $scope.OrderSourceID = data;
        $scope.selectedSource = $filter('filter')($scope.ordersources, { id: data });
    };
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("orderlistreportCtrl");
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