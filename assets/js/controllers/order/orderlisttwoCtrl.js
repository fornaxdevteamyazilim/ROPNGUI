app.controller('orderlisttwoCtrl', orderlisttwoCtrl);
function orderlisttwoCtrl($scope, ngnotifyService, $modal, Restangular, ngTableParams, userService, toaster, $window, $rootScope, $timeout, $interval, $filter, $location, $translate, $element, Excel) {
    $rootScope.uService.EnterController("orderlisttwoCtrl");
    var aot = this;
    $scope.ShowObject = true;
    $scope.translate = function () {
        $scope.trOrderNo = $translate.instant('main.ORDERNO');
        $scope.trOrderNumber = $translate.instant('main.ORDERNUMBER');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trPerson = $translate.instant('main.PERSON');
        $scope.trPhone = $translate.instant('main.PHONE');
        $scope.trAddressType = $translate.instant('main.ADDRESSTYPE');
        $scope.trOrderType = $translate.instant('main.ORDERTYPE');
        $scope.trVAT = $translate.instant('main.VAT');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trOrderState = $translate.instant('main.ORDERSTATE');
        $scope.trOrderDate = $translate.instant('main.ORDERDATE');
        $scope.selectorderstatus = $translate.instant('main.SELECTORDERSTATUS');
        $scope.allorder = $translate.instant('main.ALLORDER');
        $scope.ordersinstore = $translate.instant('main.ORDERSINSTORE');
        $scope.neworder = $translate.instant('main.NEWORDER');
        $scope.preparingdorder = $translate.instant('main.PREPARINGDORDER');
        $scope.preparedorder = $translate.instant('main.PREPAREDOREDER');
        $scope.outorder = $translate.instant('main.OUTORDER');
        $scope.cancell = $translate.instant('main.CANCELL');
        $scope.rejected = $translate.instant('main.REJECTED');
        $scope.delayed= $translate.instant('main.DELAYED');
        $scope.awaitingauthorization = $translate.instant('main.AWAITINGAUTORIZATION');
        $scope.deliveredorder = $translate.instant('main.DELIVEREDORDER');
        $scope.closedorder = $translate.instant('main.CLOSEDORDER');
        $scope.openorder = $translate.instant('main.OPENORDER');
        $scope.tableorders = $translate.instant('main.TABLEORDERS');
        $scope.takeawayorders = $translate.instant('main.TAKEAWAYORDERS');
        $scope.hdorders = $translate.instant('main.HDORDERS');
        $scope.trPaymenttype = $translate.instant('main.PAYMENTTYPE');
        $scope.trPaymentStatus = $translate.instant('main.PAYMENTSTATUS');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trDriverName = $translate.instant('main.DRIVERNAME');
        $scope.trPromotion = $translate.instant('main.PROMOTION');
        $scope.hnrorders = $translate.instant('main.HNRORDERS');
        $scope.stafforders = $translate.instant('main.STAFFORDERS');
        $scope.voids = $translate.instant('main.VOIDS');
        $scope.notaccepted = $translate.instant('main.NOTACCEPTED');
    }
    $scope.params = userService.getParameter('inventorydeliverylist',
        {            
            OrderSourceID:'',
            OrderStateID : "OrderStateID >0",
            StartDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
            EndDate: moment().format('YYYY-MM-DD'),//moment().add(1, 'days').format('YYYY-MM-DD'),
            StoreID:null,
            page:1,
            count:10
        }
    ).Parameters;
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.SelectItem = function (item) {
        $location.path('app/orders/orderDetail/' + item.id);
    };
    $scope.BuildSearchString = function (StoreID) {
        var result = [];
        if ($scope.params.StartDate && $scope.params.EndDate) {
            if (StoreID)
                result.push("StoreID='" + StoreID + "'");
            result.push($scope.params.OrderStateID);
            result.push("OperationDate between '" + $scope.params.StartDate + "'and'" + $scope.params.EndDate + "'");
            if ($scope.params.OrderSourceID)
                result.push("OrderSourceID='" + $scope.params.OrderSourceID + "'");
            return result;
        } else {
            toaster.pop('warning',$translate.instant('orderfile.PleaseSelectDatePlease'));
        }
    };
    aot.tableParams = new ngTableParams({
        page: $scope.params.page,
        count: $scope.params.count,
        sorting: {
            OrderDate: 'descending'
        }
    },{
    getData: function ($defer, params) {
        //if (!$scope.StoreID) {
        //    toaster.pop('warning', "Lütfen Gerekli Alanları Seçiniz ! (*)");
        //} else {
            $scope.params.page=params.page();
            $scope.params.count=params.count();
            $scope.ShowObject = true;
            Restangular.all('order').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString($scope.params.StoreID),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
                $scope.ShowObject = false;
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                $scope.ShowObject = false;
            });
        //}
    }
});

    //$scope.exportToExcel = function (tableId) {
    //    var blob = new Blob([document.querySelector(tableId).innerHTML], {
    //        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    //    });
    //    var downloadLink = angular.element('<a></a>');
    //    downloadLink.attr('href', window.URL.createObjectURL(blob));
    //    downloadLink.attr('download', 'SiparisListesi.xls');
    //    downloadLink[0].click();
    //};

    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.GetOrders = function () {
        aot.tableParams.reload();
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
            $scope.params.StartDate = $filter('date')(data, 'yyyy-MM-dd ');
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
            $scope.params.EndDate = $filter('date')(data, 'yyyy-MM-dd ');
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
                pageSize: 1000,
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
    $scope.stores = $rootScope.user.userstores;
    //$scope.loadEntitiesCache('cache/store', 'stores');
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.changeOrderState = function (StateID) {
        $scope.params.OrderStateID = StateID;
        aot.tableParams.reload();
    };
    $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'Order List');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
    };
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.$on('$destroy', function () {
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("orderlisttwoCtrl");
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