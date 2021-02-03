'use strict';
app.controller('productcostgroupsCtrl', productcostgroupsCtrl);
function productcostgroupsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $timeout, $translate, Excel, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("productcostgroupsCtrl");
    $scope.ProductCostGroups = [];

    if ($rootScope.user.UserRole.Name == "Admin" || $rootScope.user.UserRole.Name == "CCMANAGER" || $rootScope.user.UserRole.Name == "LC" || $rootScope.user.UserRole.Name == "AREAMANAGER" || $rootScope.user.UserRole.Name == "ACCOUNTING" || $rootScope.user.UserRole.Name == "PH" || $rootScope.user.UserRole.Name == "MarketingDepartment" || $rootScope.user.UserRole.Name == "PHAdmin" || $rootScope.user.UserRole.Name == "OperationDepartment" || $rootScope.user.UserRole.Name == "FinanceDepartment") {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }

    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
    };

    $scope.Time = ngnotifyService.ServerTime();
    $scope.LoadProductCostGroups = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('reports/productcostgroups').getList(
            {
                ProductID: ($scope.ProductID) ? $scope.ProductID : '',
                StoreID: $scope.StoreID,
                PeriodID: ($scope.PeriodID),
                OrderTypeID: ($scope.OrderTypeID == null) ? -1 : $scope.OrderTypeID,

            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.GeneralTotal = 0;
                $scope.TotalAmount = 0;
                for (var i = 0; i < result.length; i++) {
                    $scope.TotalAmount += result[i].ItemCost;
                }
                $scope.GeneralTotal += $scope.TotalAmount;
                $scope.ProductCostGroups = result;
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };

    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'UrunMaliyetListesi.xls');
        downloadLink[0].click();
    };


    $scope.GetProducts = function (data) {
        $scope.ProductID = data;
        $scope.selectedProduct = $filter('filter')($scope.products, { id: data });
    };
    $scope.GetPeriods = function (data) {
        $scope.PeriodID = data;
        $scope.selectedPeriod = $filter('filter')($scope.periods, { id: data });
    };
    $scope.GetOrderType = function (data) {
        $scope.OrderTypeID = data;
        $scope.selectedType = $filter('filter')($scope.ordertypes, { Value: data });
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

    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.periods = [];
    $scope.loadEntities('period', 'periods');


    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productcostgroupsCtrl");
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
app.controller('AccordionDemoCtrl', AccordionDemoCtrl);
function AccordionDemoCtrl($rootScope, $scope) {
    $rootScope.uService.EnterController("townCtrl");
    $scope.oneAtATime = true;
    $scope.groups = [{
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
    }, {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
    }];
    $scope.items = ['Item 1', 'Item 2', 'Item 3'];
    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };
    $scope.status = {
        isFirstOpen: false,
        isFirstDisabled: false
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("dispatcherCtrl");
    });
};