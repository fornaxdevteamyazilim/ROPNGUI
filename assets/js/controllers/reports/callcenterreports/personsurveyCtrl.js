'use strict';
app.controller('personsurveyCtrl', personsurveyCtrl);
function personsurveyCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $location, $translate, Excel, $timeout, ngnotifyService, NG_SETTING, $rootScope, $element) {
    $rootScope.uService.EnterController("personsurveyCtrl");
    if (!$scope.FromDate) {
        $scope.FromDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.ToDate) {
        $scope.ToDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.Time = ngnotifyService.ServerTime();
    $scope.PersonSurvey = [];
    $scope.LoadPersonSurvey = function (FromValue) {
          $scope.isWaiting = true;
        Restangular.all('reports/PersonSurvey/result').getList(
            {
               FromDate: $scope.FromDate,
               ToDate: $scope.ToDate,
            }
        ).then(function (result) {
            $scope.isWaiting = false;
            $scope.total = result.length;
            $scope.PersonSurvey = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadPersonSurvey();
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'sheet name');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };


    $scope.PersonSurveyExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/reports/PersonSurvey/resultxls?FromDate=' + $scope.FromDate + '&ToDate=' + $scope.ToDate;
    };

    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Anket Sonuclari Raporu.xls');
        downloadLink[0].click();
    };

    $scope.SelectFromDate = function (item) {
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
            $scope.FromDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    $scope.SelectToDate = function (item) {
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
            $scope.ToDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("personsurveyCtrl");
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