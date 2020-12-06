app.controller('inventoryperiodiccostsCtrl', inventoryperiodiccostsCtrl);
function inventoryperiodiccostsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, NG_SETTING, $location, Excel, $timeout, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventoryperiodiccostsCtrl");
        $scope.Time = ngnotifyService.ServerTime();
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList(
       {
           search: "number='013'"
       }).then(function (result) {
           $scope.VeiwHeader = result[0];
       }, function (response) {
           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
       });
    }

    if ($rootScope.user.UserRole.Name == "Admin" || $rootScope.user.UserRole.Name == "CCMANAGER" || $rootScope.user.UserRole.Name == "LC" || $rootScope.user.UserRole.Name == "AREAMANAGER" || $rootScope.user.UserRole.Name == "ACCOUNTING" || $rootScope.user.UserRole.Name == "PH" || $rootScope.user.UserRole.Name == "MarketingDepartment" || $rootScope.user.UserRole.Name == "PHAdmin" || $rootScope.user.UserRole.Name == "OperationDepartment" || $rootScope.user.UserRole.Name == "FinanceDepartment") {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }

    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
    };

    $scope.SetStoreTypeID = function (FromValue) {
        $scope.StoreTypeID = FromValue;
        $scope.selectedStoreType = $filter('filter')($scope.storetypes, { id: FromValue });
    };
    $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.resresult = [];
    $scope.StoreTypeID = -1;
    $scope.LoadResults = function () {
        $scope.isWaiting = true;
        Restangular.all('dashboard/inventorycosts').getList(
            {
                fromDate: $scope.StartDate,
                toDate: $scope.EndDate,
                StoreID: $scope.StoreID,
                StoreType: $scope.StoreTypeID,
                ActiveStoresOnly:0
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.resresult = result;
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
        downloadLink.attr('download', 'DonemselMaliyetler.xls');
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

    $scope.storetypes = [];
    $scope.loadEntities('enums/storetype', 'storetypes');

    $scope.StoreType = "-1";
    $scope.GetStoreType = function (data) {
        $scope.StoreTypeID = data;
        $scope.selectedType = $filter('filter')($scope.storetypes, { Value: data });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventoryperiodiccostsCtrl");
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