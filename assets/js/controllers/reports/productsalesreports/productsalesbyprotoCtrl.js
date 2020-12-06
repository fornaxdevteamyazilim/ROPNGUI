'use strict';
app.controller('productsalesbyprotoCtrl', productsalesbyprotoCtrl);
function productsalesbyprotoCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, Excel, $timeout, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("productsalesbyprotoCtrl");
    if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
        $location.path('/login/signin');
    } else {
        if ($rootScope.user.UserRole.Name == "Admin" || $rootScope.user.UserRole.Name == "LC" || $rootScope.user.UserRole.Name == "AREAMANAGER" || $rootScope.user.UserRole.Name == "ACCOUNTING" || $rootScope.user.UserRole.Name == "PH") {
            $scope.StoreID = '';
            $scope.ShowStores = true;
        } else {
            $scope.StoreID = $rootScope.user.StoreID;
        }
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
    };
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
        $scope.Time = ngnotifyService.ServerTime();
    $scope.ProductUsageCounts = [];
    $scope.LoadProductUsageCounts = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('reports/productsalesbyproto').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                ProductPrototypeID: $scope.ProductPrototypeID,
                //ProductPrototypeID: ($scope.ProductPrototypeID) ? $scope.ProductPrototypeID : 200068815104,
                ProductPrototypeID: ($scope.ProductPrototypeID) ? $scope.ProductPrototypeID : 200068815104,
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.ProductUsageCounts = result;
                $scope.totalCount = $scope.sumColumnJS(result, "TotalCount");
                $scope.totalAmount = $scope.sumColumnJS(result, "TotalAmount");
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    //$scope.GetSoreID = function (data) {
    //    $scope.StoreID = data;
    //    $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });

    //};

    $scope.sumColumnJS = function sumColumnJS(array, col) {
        var sum = 0;
        array.forEach(function (value, index, array) {
            sum += value[col];
        });
        return sum;
    };

    $scope.GetPrototype = function (data) {
        $scope.ProductPrototypeID = data;
        $scope.selectedprototype = $filter('filter')($scope.productprototypes, { id: data });
    };


    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'UrunSatisListesi.xls');
        downloadLink[0].click();
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
                pageSize: 1000000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.productprototypes = [];
    $scope.loadEntities('productprototype', 'productprototypes');


    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productsalesbyprotoCtrl");
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