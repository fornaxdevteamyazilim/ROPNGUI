app.controller('accountbalancereportCtrl', accountbalancereportCtrl);
function accountbalancereportCtrl($scope, $modal, $filter, SweetAlert, Restangular, toaster,  $translate,$window, $rootScope, $location, Excel, $timeout, NG_SETTING, userService, ngnotifyService,$rootScope, $element) {
    $rootScope.uService.EnterController("accountbalancereportCtrl");
    userService.userAuthorizated();
    var Total = 0;
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
    $scope.AccountBalance = [];
    $scope.LoadAccountBalance = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('personreports/accountbalance').getList(
            {
                StoreID: $scope.StoreID,
            }
        ).then(function (result) {
            $scope.isWaiting = false;
            $scope.Total = $scope.sumColumnJS(result, "Current");
            angular.copy(result, $scope.AccountBalance);
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
    $scope.exportToExcel = function (tableId) {
        $scope.exportHref = Excel.tableToExcel(tableId, 'Cari Borç Durumu');
        $timeout(function () { location.href = $scope.exportHref }, 1);
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
    $scope.getPersonDetails = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/giroreports/accountbalancereportdeteail.html',
            controller: 'accountbalancereportdeteailCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };
        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("accountbalancereportCtrl");
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