'use strict';
app.controller('storenotelistCtrl', storenotelistCtrl);
function storenotelistCtrl($scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, Excel, $timeout, userService, $element) {
    $rootScope.uService.EnterController("storenotelistCtrl");
    var vm = this;
    $scope.objectType = 'store';
    vm.search = '';
    $scope.translate = function () {
        $scope.trStoreName = $translate.instant('main.STORENAME');
        $scope.trStoreAddress = $translate.instant('main.STOREADDRESS');
        $scope.trNotes = $translate.instant('main.NOTES');
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trOperationDate = $translate.instant('main.OPERATIONDATE');
        $scope.trTkwServicesTime= $translate.instant('main.TKWSERVICESTIME');
        $scope.trServicesTime = $translate.instant('main.SERVICESTIME');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.exportToExcel = function (tableId) {
        $scope.exportHref = Excel.tableToExcel(tableId, 'Store');
        $timeout(function () { location.href = $scope.exportHref }, 1);
    };

    $scope.BuildSearchString = function () {
        var result = [];
        if (userService.userIsInRole("MemberAdmin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("LC") || userService.userIsInRole("Admin")|| userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CMRESTORANHATTI") || userService.userIsInRole("CCMANAGER")|| userService.userIsInRole("CMRESTORANHATTI")) {
            if (vm.search) {
                result.push("name like '%" + vm.search + "%'");
            }
        } else {
            if ($rootScope.user.StoreID) {
                result.push("tt.id in ('" + $rootScope.user.StoreID + "')");
            }
        }
        return result;
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 1000,
        sorting: {
        }
    },{
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response);
                SweetAlert.swal($translate.instant('Server.ServerError'), angular.toJson(response, false), "error");
            });
        }
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storenotelistCtrl");
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
