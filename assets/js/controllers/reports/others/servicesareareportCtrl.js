app.controller('servicesareareportCtrl', servicesareareportCtrl);
function servicesareareportCtrl($scope, $modal, $filter, $translate, SweetAlert, Restangular, toaster, $window, $rootScope, $location, Excel, $timeout, NG_SETTING, userService, ngnotifyService, $element, $translate) {
    $rootScope.uService.EnterController("servicesareareportCtrl");
    userService.userAuthorizated();
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

    $scope.translate = function () {
        $scope.store = $translate.instant('main.STORE');
        $scope.townname = $translate.instant('main.TOWNNAME');
        $scope.subcityname = $translate.instant('main.SUBCITYNAME');
        $scope.quartername = $translate.instant('main.QUARTERNAME');
        $scope.addressname = $translate.instant('main.ADDRESSNAME');
        $scope.streetaddresstype = $translate.instant('main.STREETADDRESSTYPE');
        $scope.grid = $translate.instant('main.GRID');
        $scope.wdt = $translate.instant('main.WDT');
        $scope.deliverytime = $translate.instant('main.DELIVERYTIME');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });

    $scope.Time = ngnotifyService.ServerTime();
    $scope.ServicesArea = [];
    $scope.LoadServicesArea = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('StoreReports/servicearea').getList(
            {
                StoreID: $scope.StoreID,
            }
        ).then(function (result) {
            $scope.isWaiting = false;
            angular.copy(result, $scope.ServicesArea);
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', "Server Error", response);
        });
    };
    //$scope.exportToExcel = function (tableId) {
    //    var blob = new Blob([document.querySelector(tableId).innerHTML], {
    //        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    //    });
    //    var downloadLink = angular.element('<a></a>');
    //    downloadLink.attr('href', window.URL.createObjectURL(blob));
    //    downloadLink.attr('download', 'RestoranServisBolgeleri.xls');
    //    downloadLink[0].click();
    //};
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'RestoranServisBolgeleri');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    $scope.AgentOrdersExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/StoreReports/serviceareaxls?StoreID=' + $scope.StoreID;
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
                toaster.pop('Warning', "Server Error", response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.addresstype = [];
    $scope.loadAddresstype = function () {
        if (!$scope.addresstype.length) {
            Restangular.all('enums/streetaddresstype').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: ''
            }).then(
            function (result) {
                $scope.addresstype = result;
            },
            function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadAddresstype();
    $scope.showAddresstype = function (streetAddress) {
        if (streetAddress.StreetAddressTypeID && $scope.addresstype.length) {
            var selected = $filter('filter')($scope.addresstype, { Value: streetAddress.StreetAddressTypeID });
            return selected.length ? selected[0].Name : 'Not Set';
        } else {
            return streetAddress.name || 'Not Set';
        }
    };
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("servicesareareportCtrl");
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