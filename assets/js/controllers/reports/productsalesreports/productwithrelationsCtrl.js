'use strict';
app.controller('productwithrelationsCtrl', productwithrelationsCtrl);
function productwithrelationsCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $timeout, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("productwithrelationsCtrl");
    if (userService.userAuthorizated()) {
        Restangular.all('report').getList().then(function (result) {
            $scope.VeiwHeader = result[0];
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    if (!$scope.RecurseChildID) {
        $scope.RecurseChildID = "true";
    }
    if (userService.isAdmin || userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("MarketingDepartment") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
        $scope.selectedStore = $filter('filter')($scope.stores, { id: FromValue });

    };
    $scope.ReportData = [];
    $scope.Time = ngnotifyService.ServerTime();
    $scope.LoadRepor = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('PoductSaleAnalisys/ProductsWithRelitions').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
                StoreID: $scope.StoreID,
                SourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
                OrderType: ($scope.OrderTypeID == null) ? '' : $scope.OrderTypeID,
                RecurseChilds: ($scope.RecurseChildID) ? $scope.RecurseChildID : true,
                ItemsFilter: ($scope.ItemsFilter) ? $scope.ItemsFilter : 1,
                ProductID: ($scope.ProductID) ? $scope.ProductID : '',
                PromotionID: ($scope.PromotionID == null) ? '' : $scope.PromotionID
            }).then(function (result) {
                if ($scope.RecurseChildID == "true") {
                    $scope.RecurseChild = true;
                }
                if ($scope.RecurseChildID == "false") {
                    $scope.RecurseChild = false;
                }
                $scope.isWaiting = false;
                $scope.GroupTotal = 0;
                $scope.grantTotalAmount = 0;
                for (var i = 0; i < result.length; i++) {
                    result[i]['TotalGroupCost'] = 0;
                    result[i]['totalAmount'] = 0;
                    if (result[i].childs.length > 0) {
                        for (var k = 0; k < result[i].childs.length; k++) {
                            result[i].childs[k]['ChildCost'] = result[i].childs[k].ItemCost * result[i].childs[k].quantity;
                            result[i].childs[k]['ChildUnitCost'] = result[i].childs[k].ItemCost;
                            result[i]['TotalGroupCost'] += result[i].childs[k].ChildCost;
                            result[i]['totalAmount'] += result[i].childs[k].amount;
                        }
                        result[i]['TotalGroupCost'] += result[i].ItemCost * result[i].quantity;
                        result[i].totalAmount = result[i].totalAmount + result[i].amount;
                    } else {
                        result[i]['ChildCost'] = result[i].ItemCost * result[i].quantity;
                        result[i]['ChildUnitCost'] = result[i].ItemCost;
                        result[i]['ChildAmount'] = result[i].amount;
                        result[i]['TotalGroupCost'] = result[i].ItemCost * result[i].quantity;
                        result[i]['totalAmount'] = result[i].amount;
                    }
                }
                for (var j = 0; j < result.length; j++) {
                    $scope.GroupTotal += result[j].TotalGroupCost;
                    $scope.grantTotalAmount += result[j].totalAmount;
                }
                $scope.ReportData = result;
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
        downloadLink.attr('download', 'MenuUrunSatis.xls');
        downloadLink[0].click();
    };

    //$scope.ProductWithRelationsExcel = function () {
    //    location.href = NG_SETTING.apiServiceBaseUri + '/api/PoductSaleAnalisys/ProductsWithRelitionsxls?&EndDate=' + $scope.EndDate + '&ItemsFilter=' + $scope.ItemsFilter + '&OrderType=' + '&ProductID=' + '&RecurseChilds=' + $scope.RecurseChildID + '&SourceID=' + '&StartDate=' + $scope.StartDate + '&StoreID=';
    //};

    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.GetProducts = function (data) {
        $scope.ProductID = data;
        $scope.selectedProduct = $filter('filter')($scope.products, { id: data });
    };
    $scope.GetPromotions = function (data) {
        $scope.PromotionID = data;
        $scope.selectedPromotion = $filter('filter')($scope.promotions, { id: data });
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
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.promotions = [];
    $scope.loadEntities('promotion', 'promotions');
    $scope.GetOrderSource = function (data) {
        $scope.OrderSourceID = data;
        $scope.selectedSource = $filter('filter')($scope.ordersources, { id: data });
    };
    $scope.GetItemsFilter = function (data) {
        $scope.ItemsFilter = data;
    };
    $scope.GetOrderType = function (data) {
        $scope.OrderTypeID = data;
        $scope.selectedType = $filter('filter')($scope.ordertypes, { Value: data });
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("productwithrelationsCtrl");
    });
};
//app.factory('Excel', function ($window) {
//    var uri = 'data:application/vnd.ms-excel;base64,',
//        template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
//        base64 = function (s) { return $window.btoa(unescape(encodeURIComponent(s))); },
//        format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) };
//    return {
//        tableToExcel: function (tableId, worksheetName) {
//            var table = document.querySelector(tableId),
//                ctx = { worksheet: worksheetName, table: table.innerHTML },
//                href = uri + base64(format(template, ctx));
//            return href;
//        }
//    };
//})