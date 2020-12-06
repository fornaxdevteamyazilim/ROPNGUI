﻿'use strict';
app.controller('deletedorderitemsCtrl', deletedorderitemsCtrl);
function deletedorderitemsCtrl($scope, $modal, $filter, SweetAlert, Restangular, toaster, $window, $stateParams, $rootScope, Excel, $timeout, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("deletedorderitemsCtrl");
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList(
       {
           search: "number='008'"
       }
   ).then(function (result) {
       $scope.VeiwHeader = result[0];
   }, function (response) {
       toaster.pop('error', $translate.instant('Server.ServerError'), response);
   });
    }
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'SilinenSiparisKalemleri.xls');
        downloadLink[0].click();
    };
    $scope.ReportList = [];
    $scope.LoadData = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/deletedorderitems').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: ($scope.StoreID) ? $scope.StoreID : $rootScope.user.StoreID,
            }
        ).then(function (result) {
            $scope.isWaiting = false;
            $scope.ReportList = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
        $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });

    };
    $scope.RunOrderDetail = function (itemID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/ordersreports/deletedorderitemsdetails.html',
            controller: 'deletedorderitemsdetailsCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                OrderID: function () {
                    return itemID;
                }
            }
        });
        modalInstance.result.then(function (item) {
        })
    };
    $scope.FromDate = function (item) {
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
    $scope.ToDate = function (item) {
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
    $scope.stores = $rootScope.user.userstores;
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("deletedorderitemsCtrl");
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