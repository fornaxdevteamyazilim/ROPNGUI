'use strict';
app.controller('usagereportselectedCtrl', usagereportselectedCtrl);
function usagereportselectedCtrl($scope, $filter, Restangular, item, StartDate, EndDate, InventoryGroupTagID, toaster, $window, $stateParams, $rootScope, $location, Excel, $timeout, $translate, $modalInstance, userService, ngnotifyService, $element) {
            $rootScope.uService.EnterController("usagereportselectedCtrl");
    userService.userAuthorizated();
    $scope.Time = ngnotifyService.ServerTime();
    $scope.UsageReportResults = [];
    $scope.isWaiting = true;
    Restangular.all('reports/inventoryconsuptioncontrol').getList(
        {
            StartDate: StartDate,
            EndDate: EndDate,
            InventoryID: item.Inventory.id,
            StoreID: $rootScope.user.StoreID,
            InventoryGroupTagID: InventoryGroupTagID

        }).then(function (result) {
            $scope.isWaiting = false;
            $scope.UsageReportResults = result;
            $scope.TotalUnitCount = 0;
            $scope.ProductCount = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.TotalUnitCount += result[i].UnitCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.ProductCount += result[i].ProductCount;
            }
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    $scope.ShowTime = function () {
        return $scope.Time = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
    };
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("usagereportselectedCtrl");
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
