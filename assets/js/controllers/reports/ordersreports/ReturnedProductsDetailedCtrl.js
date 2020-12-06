'use strict';
app.controller('ReturnedProductsDetailedCtrl', ReturnedProductsDetailedCtrl);
function ReturnedProductsDetailedCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, Excel, $timeout, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("ReturnedProductsDetailedCtrl");
    var total = 0;
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList(
       {
           search: "number='004'"
       }
   ).then(function (result) {
       $scope.VeiwHeader = result[0];
   }, function (response) {
       toaster.pop('error', $translate.instant('Server.ServerError'), response);
   });
    }
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'Siparis Log Raporu');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    //    $scope.exportToExcel = function (tableId) {
    //    var blob = new Blob([document.querySelector(tableId).innerHTML], {
    //        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    //    });
    //    var downloadLink = angular.element('<a></a>');
    //    downloadLink.attr('href', window.URL.createObjectURL(blob));
    //    downloadLink.attr('download', 'Sipariş Log Raporu.xls');
    //    downloadLink[0].click();
    //};
    $scope.Time = ngnotifyService.ServerTime();
    $scope.ReportList = [];
    $scope.LoadData = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/demoreports/ReturnedProductsdetailed').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
                SourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
                OrderType: ($scope.OrderTypeID == null) ? '' : $scope.OrderTypeID
            }).then(function (result) {
                $scope.total = $scope.sumColumnJS(result, "ProductAmount");
                $scope.totalcount = $scope.sumColumnJS(result, "ProductCount");

                $scope.isWaiting = false;
                $scope.ReportList = result;
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
    }
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
                $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
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
    $scope.GetOrderType = function (data) {
        $scope.OrderTypeID = data;
        $scope.selectedType = $filter('filter')($scope.ordertypes, { Value: data });
    };
    $scope.GetOrderSource = function (data) {
        $scope.OrderSourceID = data;
        $scope.selectedSource = $filter('filter')($scope.ordersources, { id: data });
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.ToDate = function (item) {
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
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("ReturnedProductsDetailedCtrl");
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