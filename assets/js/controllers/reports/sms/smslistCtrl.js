'use strict';
app.controller('smslistCtrl', smslistCtrl);
function smslistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $location, $translate, Excel, $timeout, NG_SETTING,$rootScope, $element) {
            $rootScope.uService.EnterController("smslistCtrl");
    $scope.translate = function () {
        $scope.trNumber = $translate.instant('main.NUMBER');
        $scope.trLastOrder = $translate.instant('main.LASTORDER');
        $scope.trPersonName = $translate.instant('main.PERSONNAME');
        $scope.trTown = $translate.instant('main.TOWN');
    };
    $scope.translate();
    $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.Time = new Date();
    $scope.LoadSmsList = function (data) {
        $scope.isWaiting = true;
        Restangular.all('smslist/storelist').getList(
            {
                StoreID: data,
                pageNo: 1,
                pageSize: 1000000,
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.tableParams = new ngTableParams({
                    page: 1,
                    count: 10
                }, {
                    counts: [],
                    total: result.length, // length of data
                    getData: function ($defer, params) {
                        $defer.resolve(
                            result.slice((params.page() - 1) * params.count(),
                            params.page() * params.count()));
                    }
                });
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.SmsListExcel = function (data) {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/smslist/storelistxls?StoreID=' + data + '&pageno=' + 1 + '&pagesize=' + 1000000;
    };
    $scope.exportToExcel = function (tableId) {
        $scope.exportHref = Excel.tableToExcel(tableId, 'Order List');
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
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("smslistCtrl");
    });
};
app.factory('Excel', function ($window) {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
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