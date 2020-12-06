﻿app.controller('segmentationreportCtrl', segmentationreportCtrl);
function segmentationreportCtrl($scope, $rootScope, $modal, $filter, SweetAlert, Restangular, toaster, $window, $stateParams, $timeout, $location, $translate, Excel, userService, ngnotifyService, NG_SETTING, $element) {
    $rootScope.uService.EnterController("segmentationreportCtrl");
    userService.userAuthorizated();

    $scope.Year = '';
    $scope.Month = '';


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
    $scope.SetStoreTypeID = function (FromValue) {
        $scope.StoreTypeID = FromValue;
        $scope.selectedStoreType = $filter('filter')($scope.storetypes, { id: FromValue });
    };
    $scope.Time = ngnotifyService.ServerTime();
    $scope.data = [];
    $scope.StoreTypeID = -1;
    $scope.LoadData = function () {
        $scope.isWaiting = true;
        Restangular.all('extendedreports/segmentation').getList(
            {
                //StoreID: $scope.StoreID,
                Year: $scope.Year,
                Month: $scope.Month,
                StoreTypeID: $scope.StoreTypeID
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.total = result.length;
                $scope.totalTotalOrdersInActivePeriod = $scope.sumColumnJS(result, "TotalOrdersInActivePeriod");
                $scope.totalCustomersCount = $scope.sumColumnJS(result, "CustomersCount");
                $scope.totalActiveCustomers = $scope.sumColumnJS(result, "ActiveCustomers");
                $scope.totalActiveCustomersRatio = $scope.sumColumnJS(result, "ActiveCustomersRatio");
                $scope.totalNewCustomerPerDay = $scope.sumColumnJS(result, "NewCustomerPerDay");
                $scope.totalActiveCustomersFrequency = $scope.sumColumnJS(result, "ActiveCustomersFrequency");
                $scope.totalActiveCustomersFrequencyExceptNew = $scope.sumColumnJS(result, "ActiveCustomersFrequencyExceptNew");
                $scope.totalHeavyCustomers = $scope.sumColumnJS(result, "HeavyCustomers");
                $scope.totalHeavyCustomersRatio = $scope.sumColumnJS(result, "HeavyCustomersRatio");
                $scope.totalLapsedCustomers = $scope.sumColumnJS(result, "LapsedCustomers");
                $scope.totalLightCustomers = $scope.sumColumnJS(result, "LightCustomers");
                $scope.totalLightCustomersRatio = $scope.sumColumnJS(result, "LightCustomersRatio");
                $scope.totalLostCustomers = $scope.sumColumnJS(result, "LostCustomers");
                $scope.totalLostCustomersRatio = $scope.sumColumnJS(result, "LostCustomersRatio");
                $scope.totalMediumCustomers = $scope.sumColumnJS(result, "MediumCustomers");
                $scope.totalMediumCustomersRatio = $scope.sumColumnJS(result, "MediumCustomersRatio");
                $scope.totalNewCustomers = $scope.sumColumnJS(result, "NewCustomers");
                $scope.totalNewCustomersByActiveRatio = $scope.sumColumnJS(result, "NewCustomersByActiveRatio");
                $scope.totalOneTimeCustomers = $scope.sumColumnJS(result, "OneTimeCustomers");
                $scope.totalOneTimeCustomersRatio = $scope.sumColumnJS(result, "OneTimeCustomersRatio");
                angular.copy(result, $scope.data);
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

    $scope.finalDate = '';
    $scope.today = new Date();
    //$scope.currentYear = $scope.today.getFullYear();
    $scope.currentYear = '2018';

    // 10 Years from current year
    $scope.maxYear = new Date($scope.today.setFullYear($scope.today.getFullYear() + 10)).getFullYear();
    $scope.isDateValid = false;
    $scope.dateValidationText = '';

    $scope.days = [{
        Id: '',
        Name: 'DAY'
    }];

    for (x = 1; x <= 31; x++) {
        $scope.days.push({ Id: x, Name: x });
    }

    $scope.months = [{
        Id: '',
        Name: 'MONTH'
    }, {
        Id: 0,
        Name: 'JANUARY'
    }, {
        Id: 1,
        Name: 'FEBRUARY'
    }, {
        Id: 2,
        Name: 'MARCH'
    }, {
        Id: 3,
        Name: 'APRIL'
    }, {
        Id: 4,
        Name: 'MAY'
    }, {
        Id: 5,
        Name: 'JUNE'
    }, {
        Id: 6,
        Name: 'JULY'
    }, {
        Id: 7,
        Name: 'AUGUST'
    }, {
        Id: 8,
        Name: 'SEPTEMBER'
    }, {
        Id: 9,
        Name: 'OCTOBER'
    }, {
        Id: 10,
        Name: 'NOVEMBER'
    }, {
        Id: 11,
        Name: 'DECEMBER'
    }];

    $scope.years = [{
        Id: '',
        Name: ''
    }];

    for (x = $scope.currentYear; x <= $scope.maxYear; x++) {
        $scope.years.push({ Id: x, Name: x });
    }

    $scope.isLeapYear = false;
    $scope.yearType = '';

    $scope.RecordDataExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/extendedreports/segmentationxls?Year=' + $scope.Year + '&Month=' + $scope.Month + '&StoreTypeID=' + $scope.StoreTypeID;
    };
    $scope.exportToExcel = function (tableId) {
        $scope.exportHref = Excel.tableToExcel(tableId, 'MusteriSegmantasyonu');
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
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.storetypes = [];
    $scope.loadEntities('enums/storetype', 'storetypes');
    $scope.StoreType = "-1";
    $scope.GetStoreType = function (data) {
        $scope.StoreTypeID = data;
        $scope.selectedType = $filter('filter')($scope.storetypes, { Value: data });
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
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("segmentationreportCtrl");
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