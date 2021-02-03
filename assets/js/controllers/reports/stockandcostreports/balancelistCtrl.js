'use strict';
app.controller('balancelistCtrl', balancelistCtrl);
function balancelistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, Excel, $timeout, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("balancelistCtrl");
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList(
            {
                search: "number='013'"
            }).then(function (result) {
                $scope.VeiwHeader = result[0];
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    }
    $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    $scope.SelectItem = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/reports/stockandcostreports/usagereportselected.html',
            controller: 'usagereportselectedCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
                StartDate: function () {
                    return $scope.StartDate;
                },
                EndDate: function () {
                    return $scope.EndDate;
                },
                InventoryGroupTagID: function () {
                    return $scope.TagData.id;
                },
            }
        });
        modalInstance.result.then(function () {
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.Time = ngnotifyService.ServerTime();
    $scope.ActualCalculateRemainderListResults = [];
    $scope.BuildSearch = function () {
        var result = [];
        if ($scope.selectedTag) {
            for (var i = 0; i < $scope.selectedTag.length; i++) {
                if (i == $scope.selectedTag.length - 1) {
                    result += $scope.selectedTag[i].id;
                } else {
                    result += $scope.selectedTag[i].id + ',';
                }
            }
            return result;
        }
    };
    $scope.LoadActualCalculateRemainderListResults = function () {
        $scope.isWaiting = true;
        Restangular.all('reports/inventorycompare').getList(
            {
                RepositoryID: $scope.RepositoryID,
                FromDate: $scope.StartDate,
                ToDate: $scope.EndDate,
                InventoryGroupTagID: $scope.BuildSearch()
                //InventoryGroupTagID: ($scope.TagData) ? $scope.TagData.id : ''$scope.BuildSearch()
            }).then(function (result) {
                $scope.ActualCalculateRemainderListResults = result;
                $scope.isWaiting = false;
                $scope.TotalAmount = 0;
                $scope.TotalRealCostsPrice = 0;
                $scope.TotalCalculatedPrice = 0;
                $scope.TotalCalculateAmount = 0;
                for (var i = 0; i < result.length; i++) {
                    $scope.GroupTotalRealCostsPrice = 0;
                    $scope.GroupTotalUnitPrice = 0;
                    $scope.GroupCalculatedPrice = 0;
                    $scope.GroupTotalAmount = 0;
                    $scope.TotalAmount += result[i].Amount;
                    for (var k = 0; k < result[i].InventoryCompareDatas.length; k++) {
                        $scope.GroupTotalRealCostsPrice += result[i].InventoryCompareDatas[k].Price * (result[i].InventoryCompareDatas[k].Usage + result[i].InventoryCompareDatas[k].Exited + result[i].InventoryCompareDatas[k].Difference);
                        $scope.GroupTotalUnitPrice += result[i].InventoryCompareDatas[k].Price;
                        $scope.GroupCalculatedPrice += result[i].InventoryCompareDatas[k].Price * (result[i].InventoryCompareDatas[k].Usage + result[i].InventoryCompareDatas[k].Exited + result[i].InventoryCompareDatas[k].UsageReturned);
                        $scope.GroupTotalAmount += result[i].InventoryCompareDatas[k].Price * result[i].InventoryCompareDatas[k].FinalCount;
                    }
                    result[i]['GroupTotalRealCostsPrice'] = $scope.GroupTotalRealCostsPrice;
                    result[i]['GroupCalculatedPrice'] = $scope.GroupCalculatedPrice;
                    result[i]['GroupTotalAmount'] = $scope.GroupTotalAmount;
                    $scope.TotalCalculateAmount += $scope.GroupTotalAmount;
                    $scope.TotalRealCostsPrice += $scope.GroupTotalRealCostsPrice;
                    $scope.TotalCalculatedPrice += $scope.GroupCalculatedPrice;
                }
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
    };
    $scope.exportToExcel = function (tableId) {
        var blob = new Blob([document.querySelector(tableId).innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        var downloadLink = angular.element('<a></a>');
        downloadLink.attr('href', window.URL.createObjectURL(blob));
        downloadLink.attr('download', 'Bakiye Listesi.xls');
        downloadLink[0].click();
    };
    $scope.repositories = [];
    $scope.loadRepository = function (StoreID) {
        Restangular.all('repository').getList({
            pageNo: 1,
            pageSize: 1000,
            sort: 'id',
            //search: "StoreID='" + StoreID + "'"
        }).then(function (result) {
            $scope.repositories = result;
            $scope.RepositoryID = result[0].id;
            $scope.StoreID = result[0].name;
        }, function (response) {
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    if ($rootScope.user.userstores && $rootScope.user.userstores.length > 1) {
        $scope.selectStore = true;
    } else {
        $scope.loadRepository($rootScope.user.StoreID);
    }
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
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.periods = [];
    $scope.loadEntities('period', 'periods');
    $scope.GetRepository = function (data) {
        $scope.RepositoryID = data;
    };
    $scope.GetPeriod = function (data) {
        $scope.PeriodID = data;
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
                    return item;s
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    //$scope.selecttag = function (item) {
    //    var modalInstance = $modal.open({
    //        templateUrl: 'assets/views/reports/reportspopup/selecttag.html',
    //        controller: 'selecttagCtrl',
    //        size: '',
    //        backdrop: '',
    //        resolve: {
    //        }
    //    });
    //    modalInstance.result.then(function (item) {
    //        $scope.TagData = item;
    //    })
    //};
    ///*********************************************///
    $scope.tags = [];
    var item = {};
    $scope.LoadTagArray = function (data) {
        $scope.tags = [];
        if ($scope.selectedTag.length > 0) {
            $scope.tags = $scope.selectedTag
        }
        Restangular.all('tag/array').getList({
            id: data
        }).then(function (result) {
            if (data == 20) {
                $scope.tags.push(angular.copy(result[0].plain().item));
            } else {
                for (var i = 0; i < result.length; i++) {
                    $scope.tags.push(angular.copy(result[i].plain().item));
                }
            }
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    };
    $scope.selectedTag = function (data) {
        var veri = data;
    };
    $scope.selectOnly1Or2 = function (item, selectedItems) {
        if (selectedItems !== undefined && selectedItems.length >= 20) {
            return false;
        } else {
            return true;
        }
    };
    ///*********************************************///
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("balancelistCtrl");
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