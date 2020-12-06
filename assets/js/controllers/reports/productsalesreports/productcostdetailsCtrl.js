'use strict';
app.controller('productcostdetailsCtrl', productcostdetailsCtrl);
function productcostdetailsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, Excel, $timeout, ngnotifyService, $element) {
            $rootScope.uService.EnterController("productcostdetailsCtrl");
    $scope.ProductCostDetails = [];
    $scope.LoadProductCostDetails = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('reports/productcostdetails').getList(
            {
                StoreID: $rootScope.user.StoreID,
                ProductID: $scope.ProductID,
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.GeneralTotal = 0;
                $scope.TotalAmount = 0;
                for (var i = 0; i < result.length; i++) {
                    $scope.TotalAmount += result[i].ItemCost;
                }
                $scope.GeneralTotal += $scope.TotalAmount;
                $scope.ProductCostDetails = result;
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.Time = ngnotifyService.ServerTime();
    $scope.GetProduct = function (data) {
        $scope.ProductID = data;
        $scope.selectedProduct = $filter('filter')($scope.products, { id: data });
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'Ürün Maliyet Raporu');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productcostdetailsCtrl");
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