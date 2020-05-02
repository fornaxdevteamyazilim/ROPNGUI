app.controller('maindashboardCtrl', maindashboardCtrl);
function maindashboardCtrl($scope, $filter, $window, Restangular, $stateParams, $rootScope, $location, userService, $translate, ngnotifyService, $element) {
    $scope.translate = function () {
        $scope.txtTABLESALE = $translate.instant('main.TABLESALE');
        $scope.txtPACKAGEORDER = $translate.instant('main.PACKAGEORDER');
        $scope.txtDISPATCHER = $translate.instant('main.DISPATCHER');
        $scope.txtORDERLIST = $translate.instant('main.ORDERLIST');
        $scope.txtKITCHENDISPLAY = $translate.instant('main.KITCHENDISPLAY2');
        $scope.txtREPORTS = $translate.instant('main.REPORTS');
    };
    $scope.translate();
    if (userService && $rootScope.user && $rootScope.user.Store) {
        var date = new Date($rootScope.user.Store.OperationDate);
        $scope.opdate = $filter('date')(date, 'dd-MM-yyyy')
    }
    $rootScope.$on('OperationDayChanged', function (event, data) {
        var opDate = ($rootScope.user && $rootScope.user.Store && $rootScope.user.Store.OperationDate) ? $rootScope.user.Store.OperationDate : $filter('date')(new Date(), 'yyyy-MM-dd');
        $rootScope.user.Store.OperationDate = opDate;
    });
    var clockStop;
    $scope.FormatClock = function (val) {
        return $filter('date')(val, 'HH:mm:ss');
    };
    $scope.theClock = $scope.FormatClock(ngnotifyService.ServerTime());
    $scope.StartClock = function () {
        if (angular.isDefined(clockStop)) return;
        clockStop = $interval(function () {
            $scope.theClock = $scope.FormatClock(ngnotifyService.ServerTime());
        }, 1000);
    }
    var stopClock = function () {
        if (angular.isDefined(clockStop)) {
            $interval.cancel(clockStop);
            clockStop = undefined;
        }
    };
    $scope.login = function (path) {
        var data = userService.TimedOut();
        if (data) {
            $scope.EnterCardCode(path)
        }
        else {
            userService.stopTimeout();
            location.href = path;
        }
    };
    //$scope.OrdersOrderType = [];
    //$scope.GetData = function () {
    //    Restangular.one('dashboard/storestats').get({
    //        StoreID: ($scope.selectedStoreID) ? $scope.selectedStoreID : $rootScope.user.StoreID,
    //    }).then(function (result) {
    //        angular.copy(result.statsByOrderType, $scope.OrdersOrderType);
    //        $scope.OrderTotalCount = 0;
    //        $scope.OrderTotalAmount = 0;
    //        for (var i = 0; i < $scope.OrdersOrderType.length; i++) {
    //            if ($scope.OrdersOrderType[i].OrderType == "Gel-Al Sipariş") {
    //                $scope.OrdersOrderType[i] = {
    //                    value: $scope.OrdersOrderType[i].OrdersCount,
    //                    color: '#F7464A',
    //                    highlight: '#FF5A5E',
    //                    label: $scope.OrdersOrderType[i].OrderType
    //                }
    //            }
    //            if ($scope.OrdersOrderType[i].OrderType == "Paket") {
    //                $scope.OrdersOrderType[i] = {
    //                    value: $scope.OrdersOrderType[i].OrdersCount,
    //                    color: '#46BFBD',
    //                    highlight: '#FF5A5E',
    //                    label: $scope.OrdersOrderType[i].OrderType
    //                }
    //            }
    //            if ($scope.OrdersOrderType[i].OrderType == "Masa Sipariş") {
    //                $scope.OrdersOrderType[i] = {
    //                    value: $scope.OrdersOrderType[i].OrdersCount,
    //                    color: '#FDB45C',
    //                    highlight: '#FF5A5E',
    //                    label: $scope.OrdersOrderType[i].OrderType
    //                }
    //            }
    //        }
    //    }, function (restresult) {
    //        $rootScope.ShowSpinnerObject = false;
    //    })
    //};
    //$scope.GetData();
    $scope.sales = [600, 923, 482, 1211, 490, 1125, 1487];
    $scope.data = [
        {
            value: 324,
            color: '#5cb85c',
            highlight: '#6ec96e',
            label: 'Res'
        },
        {
            value: 36,
            color: '#FDB45C',
            highlight: '#FFC870',
            label: 'ÇM'
        },
        {
            value: 90,
            color: '#F7464A',
            highlight: '#FF5A5E',
            label: 'YS'
        }
    ];
    $scope.total = 450;
};
