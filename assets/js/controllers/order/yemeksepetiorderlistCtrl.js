app.controller('yemeksepetiorderlistCtrl', yemeksepetiorderlistCtrl);
function yemeksepetiorderlistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $timeout, $interval, $filter, $location, $translate, userService, $element, ngnotifyService, Excel) {
    $rootScope.uService.EnterController("yemeksepetiorderlistCtrl");
    var ysol = this;
    ysol.search = '';
    $scope.Time = ngnotifyService.ServerTime();
    $scope.isWaiting = false;
    $scope.YemekSepetiOrderStateID = "YemekSepetiOrderStateID >0";

    $scope.translate = function () {
        $scope.trCustomerName = $translate.instant('main.CUSTOMERNAME');
        $scope.trYsStoreName = $translate.instant('main.YSSTORENAME');
        $scope.trRopNgStoreName = $translate.instant('main.ROPNGSTORENAME');
        $scope.trYSOrderDate = $translate.instant('main.YSORDERRDATE');
        $scope.trRopngOrderDate = $translate.instant('main.ROPNGORDERDATE');
        $scope.trYsOrderState = $translate.instant('main.YSORDERSTATE');
        $scope.trOrderTotal = $translate.instant('main.ORDERTOTAL');
        $scope.trYsOrderDetails = $translate.instant('main.ORDERDETAILS');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.allorder = $translate.instant('main.ALLORDER');
        $scope.mappedorders = $translate.instant('main.MAPPEDORDERS');
        $scope.rejectedorders = $translate.instant('main.REJECTEDORDERS');
        $scope.selectorderstatus = $translate.instant('main.SELECTORDERSTATUS');
        $scope.customermappingorders = $translate.instant('main.CUSTOMERMAPPINGORDERS');
        $scope.skippedorders = $translate.instant('main.SKIPPEDORDERS');
        $scope.trYsOrderNote = $translate.instant('main.ORDERNOTE');
        $scope.trRejectReason = $translate.instant('main.YSREJECTREASON');
        $scope.trPaymentType = $translate.instant('main.PAYMENTTYPE');
        $scope.trYsOrderNumber = $translate.instant('main.YSORDERNUMBER');
        $scope.trRopngOrderNumber = $translate.instant('main.ROPNGORDERNUMBER');




    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.translate();
    $scope.item = {};

    //if (!$scope.StartDate) {
    //    $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    //} else {
    //    $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    //}
    //if (!$scope.EndDate) {
    //    $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    //} else {
    //    $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    //}
     if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }

    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        result.push(($scope.StoreID) ? "StoreID=" + $scope.StoreID : "StoreID=" + $rootScope.user.StoreID);
        result.push("OrderDate between '" + $scope.StartDate + "'" + 'and' + "'" + $scope.EndDate + "'");
        result.push($scope.YemekSepetiOrderStateID);
        return result;
    };

    $scope.LoadYSOrderList = function () {
        ysol.tableParams.reload();
    };
    ysol.tableParams = new ngTableParams({
        page: 1,
        count: 1000,
        sorting: {
        }
    },
{
    getData: function ($defer, params) {
        $scope.isWaiting = true;
        Restangular.all('yemeksepetiordermap').getList({
            pageNo: params.page(),
            pageSize: params.count(),
            sort: params.orderBy(),
            search: $scope.BuildSearchString(),
        }).then(function (items) {
            $defer.resolve(items);
            $scope.isWaiting = false;
            $scope.total = items.length;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
});
    $scope.sumColumnJS = function sumColumnJS(array, col) {
        var sum = 0;
        array.forEach(function (value, index, array) {
            sum += value[col];
        });
        return sum;
    };

    //$scope.exportToExcel = function (tableId) {
    //    var blob = new Blob([document.querySelector(tableId).innerHTML], {
    //        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
    //    });
    //    var downloadLink = angular.element('<a></a>');
    //    downloadLink.attr('href', window.URL.createObjectURL(blob));
    //    downloadLink.attr('download', 'YemekSepetiSiparisleri.xls');
    //    downloadLink[0].click();
    //};

     $scope.exportToExcel = function (tableId) { // ex: '#my-table'
        $scope.exportHref = Excel.tableToExcel(tableId, 'YemekSepetiSiparisleri');
        $timeout(function () { location.href = $scope.exportHref }, 1); // trigger download
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
    $scope.yemeksepetirejectreasons = [];
    $scope.loadEntitiesCache('cache/yemeksepetirejectreasons', 'yemeksepetirejectreasons');


    $scope.Back = function () {
        $window.history.back();
    };
    var deregistration1 = $scope.$watch(angular.bind(ysol, function () {
        return ysol.search;
    }), function (value) {
        ysol.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("yemeksepetiorderlistCtrl");
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