app.controller('lastordersCtrl', lastordersCtrl);
function lastordersCtrl($rootScope, $scope, $log, $interval, $timeout, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("lastordersCtrl");
    var lo = this;
    var stopTime;
    $scope.translate = function () {
        $scope.trTakeDateTime = $translate.instant('main.DATE');
        $scope.trAddressType = $translate.instant('main.ADDRESSTYPE');
        $scope.trTakenBy = $translate.instant('main.TAKENBY');
        $scope.trOrderID = $translate.instant('main.ORDERID');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trOrderAmount = $translate.instant('main.ORDERAMOUNT');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trPersonName = $translate.instant('main.PERSONNAME');
        $scope.trPhone = $translate.instant('main.PHONE');
        $scope.trComboMeals = $translate.instant('main.COMBOMEALS');
        $scope.trProducts = $translate.instant('main.PRODUCT');
        $scope.trOptions = $translate.instant('main.OPTIONS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    })
    $scope.translate();
    $scope.item = {};

    lo.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('ccstats/lastorders').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
            }).then(function (items) {
                params.total(items.paging);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.RefreshData = function () {
        lo.tableParams.reload();
        $scope.start();
    };
    $scope.start = function () {
        $scope.stop();
        stopTime = $timeout(function () { $scope.RefreshData(); }, 10000);
    };
    $scope.stop = function () {
        $timeout.cancel(stopTime);
    };
    $scope.$on('$destroy', function () {
        $scope.stop();
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("lastordersCtrl");
    });
    $scope.start();
};
