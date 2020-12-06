'use strict';
app.controller('inventorywasteconsuptionsCtrl', inventorywasteconsuptionsCtrl);
function inventorywasteconsuptionsCtrl($scope, $modal, $filter, SweetAlert, Restangular, toaster, $window, Excel, $timeout, $stateParams, $rootScope, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorywasteconsuptionsCtrl");
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList(
       {
           search: "number='015'"
       }).then(function (result) {
           $scope.VeiwHeader = result[0];
       }, function (response) {
           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
       });
    }
    $scope.periods = [];
    if (!$scope.periods.length) {
        Restangular.all('period').getList({
            pageNo: 1,
            pageSize: 1000,
        }).then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].PeriodStateID == 0) {
                    $scope.StartDate = $filter('date')(angular.copy(result[i].StartDate), 'yyyy-MM-dd ');
                    $scope.EndDate = $filter('date')(angular.copy(result[i].EndDate), 'yyyy-MM-dd ');
                }
            }
            if (!$scope.StartDate && !$scope.EndDate) {
                $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
                $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
            }
        }, function (response) {
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
        });
    }
    $scope.Time = ngnotifyService.ServerTime();
    $scope.ProductUsageCounts = [];
    $scope.LoadInventoryTransactions = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('reports/wasteinventoryconsuptions').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : '',//$rootScope.user.StoreID,
                InventoryGroupTagID: ($scope.TagData) ? $scope.TagData.id : '',
                includeAddjusts: $scope.ChangedAdjustValue,
                includeProductWastes: $scope.ChangedWasteValue,
                includeReturnedProducts: $scope.ChangedReturnProducts
            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.TotalAmount = 0;
                for (var i = 0; i < result.length; i++) {
                    $scope.TotalAmount += result[i].Amount;
                }
                $scope.ProductUsageCounts = result;
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.ChangedAdjustValue = true;
    $scope.GetAdjustValue = function (data) {
        $scope.ChangedAdjustValue = data;
    };
    $scope.ChangedWasteValue = true;
    $scope.GetChangedWasteValue = function (data) {
        $scope.ChangedWasteValue = data;
    };
    $scope.ChangedReturnProducts = true;
    $scope.GetChangedReturnProducts = function (data) {
        $scope.ChangedReturnProducts = data;
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'EnvanterAtikRaporu.xls');
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd ');
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
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    $scope.selecttag = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/reportspopup/selecttag.html',
            controller: 'selecttagCtrl',
            size: '',
            backdrop: '',
            resolve: {
            }
        });
        modalInstance.result.then(function (item) {
            $scope.TagData = item;
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.Time = ngnotifyService.ServerTime();

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventorywasteconsuptionsCtrl");
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
app.filter('abs', function () {
    return function (val) {
        return Math.abs(val);
    }
});