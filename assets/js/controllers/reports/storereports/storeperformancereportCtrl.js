app.controller('storeperformancereportCtrl', storeperformancereportCtrl);
function storeperformancereportCtrl($scope, $modal, $filter, SweetAlert, Restangular, $translate,toaster, $window, $rootScope, $location, Excel, $timeout, NG_SETTING, userService, ngnotifyService, $element) {
        $rootScope.uService.EnterController("storeperformancereportCtrl");   
userService.userAuthorizated();
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
    };
    $scope.Time = ngnotifyService.ServerTime();
    $scope.StorePerformance = [];
    $scope.LoadStorePerformance = function (FromValue) {
        var totalGiro = 0;
        var totalTC = 0;
        var totalFirstTimeTC = 0;
        var totalFirstTimeTL = 0;
        var totalFirstTimePercent = 0;
        var totalSecondTimeTC = 0;
        var totalSecondTimeTL = 0;
        var totalThirdTimeTC = 0;
        var totalThirdTimeTL = 0;
        var totalInstore = 0;
        var totalHomeDelivery = 0;
        var totalTakeaway = 0;
        var totalHnr = 0;
        var totalStaff = 0;
        var totalHomeDeliveryCount = 0;
        var totalBelow30 = 0;
        var totalBeyond30 = 0;
        var totalBeyond45 = 0;
        $scope.isWaiting = true;
        Restangular.all('StoreReports/StorePerformance').getList(
            {
                StoreID: $scope.StoreID,
                StartDate: $rootScope.ReportParameters.StartDate,
                EndDate: $rootScope.ReportParameters.EndDate,
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.totalGiro = $scope.sumColumnJS(result, "Sales");
                $scope.totalTC = $scope.sumColumnJS(result, "TC");
                $scope.totalFirstTimeTC = $scope.sumColumnJS(result, "FirstTimeZoneTC");
                $scope.totalFirstTimeTL = $scope.sumColumnJS(result, "FirstTimeZoneSales");
                $scope.totalSecondTimeTC = $scope.sumColumnJS(result, "SecondTimeZoneTC");
                $scope.totalSecondTimeTL = $scope.sumColumnJS(result, "SecondTimeZoneSales");
                $scope.totalThirdTimeTC = $scope.sumColumnJS(result, "ThirdTimeZoneTC");
                $scope.totalThirdTimeTL = $scope.sumColumnJS(result, "ThirdTimeZoneSales");
                $scope.totalInstore = $scope.sumColumnJS(result, "InStore");
                $scope.totalHomeDelivery = $scope.sumColumnJS(result, "HomeDelivery");
                $scope.totalTakeaway = $scope.sumColumnJS(result, "TakeAway");
                $scope.totalHnr = $scope.sumColumnJS(result, "HotAndReady");
                $scope.totalStaff = $scope.sumColumnJS(result, "Staff");
                $scope.totalHomeDeliveryCount = $scope.sumColumnJS(result, "OrdersCount");
                $scope.totalBelow30 = $scope.sumColumnJS(result, "Below30");
                $scope.totalBeyond30 = $scope.sumColumnJS(result, "Beyond30");
                $scope.totalBeyond45 = $scope.sumColumnJS(result, "Beyond45");
                angular.copy(result, $scope.StorePerformance);
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
    };
    $scope.StorePerformanceExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/StoreReports/StorePerformancexls?StoreID=' + $scope.StoreID + '&StartDate=' + $rootScope.ReportParameters.StartDate + '&EndDate=' + $rootScope.ReportParameters.EndDate;
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Restoran Performansı.xls');
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
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storeperformancereportCtrl");
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