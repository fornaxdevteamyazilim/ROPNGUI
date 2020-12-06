app.controller('awaitingsuppliesCtrl', awaitingsuppliesCtrl);
function awaitingsuppliesCtrl($scope, $modal, $filter, SweetAlert, Restangular, toaster, $window, $stateParams, Excel, $timeout, $location, $translate, userService, ngnotifyService, $rootScope, $element) {
           $rootScope.uService.EnterController("awaitingsuppliesCtrl");
   userService.userAuthorizated();
    $scope.Time = ngnotifyService.ServerTime();
    $scope.data = [];
    $scope.LoadData = function (ApproveID) {
        if (!ApproveID) {
            ApproveID = -1;
        }
        $scope.isWaiting = true;
        Restangular.all('reports/awaitingsupplies').getList(
            {
                Approve: ApproveID,
                UserID: $rootScope.user.id,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID
            }).then(function (result) {
                $scope.isWaiting = false;
                angular.copy(result, $scope.data);
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExpectMassage);
            });
    };
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'sheet name');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    $scope.exportData = function () {
        var blob = new Blob([document.getElementById('report').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
    };
    $scope.Back = function () {
        $window.history.back();
    };
        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("awaitingsuppliesCtrl");
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