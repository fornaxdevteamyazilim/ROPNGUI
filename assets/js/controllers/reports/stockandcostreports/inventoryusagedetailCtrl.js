'use strict';
app.controller('inventoryusagedetailCtrl', inventoryusagedetailCtrl);
function inventoryusagedetailCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $timeout, $translate, Excel, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventoryusagedetailCtrl");
    $scope.InventoryUsageDetail = [];

    if ($rootScope.user.UserRole.Name == "Admin" || $rootScope.user.UserRole.Name == "CCMANAGER" || $rootScope.user.UserRole.Name == "LC" || $rootScope.user.UserRole.Name == "AREAMANAGER" || $rootScope.user.UserRole.Name == "ACCOUNTING" || $rootScope.user.UserRole.Name == "PH" || $rootScope.user.UserRole.Name == "MarketingDepartment" || $rootScope.user.UserRole.Name == "PHAdmin" || $rootScope.user.UserRole.Name == "OperationDepartment" || $rootScope.user.UserRole.Name == "FinanceDepartment") {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }

    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
    };

    $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    $scope.Time = ngnotifyService.ServerTime();
    $scope.LoadInventoryUsageDetail = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('reports/inventoryusagedetail').getList(
            {
                InventoryID: ($scope.InventoryID) ? $scope.InventoryID : '',
                StoreID: $scope.StoreID,
                FromDate: $scope.StartDate,
                ToDate: $scope.EndDate,
                InventoryGroupTagID: ($scope.TagData) ? $scope.TagData.id : '',

            }).then(function (result) {
                $scope.isWaiting = false;
                $scope.GeneralTotal = 0;
                $scope.TotalAmount = 0;
                for (var i = 0; i < result.length; i++) {
                    $scope.TotalAmount += result[i].ItemCost;
                }
                $scope.GeneralTotal += $scope.TotalAmount;
                $scope.totalItemCount = $scope.sumColumnJS(result, "ItemsCount");
                $scope.InventoryUsageDetail = result;
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
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'EnvanterKullanımDetayları.xls');
        downloadLink[0].click();
    };

    //    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
    //    $scope.exportHref = Excel.tableToExcel(tableId, 'UrunMaliyetListesi');
    //    $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    //};

    $scope.GetInventory = function (data) {
        $scope.InventoryID = data;
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
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
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
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');


    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("inventoryusagedetailCtrl");
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
app.controller('AccordionDemoCtrl', AccordionDemoCtrl);
function AccordionDemoCtrl($rootScope, $scope) {
    $rootScope.uService.EnterController("townCtrl");
    $scope.oneAtATime = true;
    $scope.groups = [{
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
    }, {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
    }];
    $scope.items = ['Item 1', 'Item 2', 'Item 3'];
    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };
    $scope.status = {
        isFirstOpen: false,
        isFirstDisabled: false
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("dispatcherCtrl");
    });
};