app.controller('kdsCtrl', kdsCtrl);
function kdsCtrl($scope, $log, $modal, $interval, $timeout, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $location, $filter, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("kdsCtrl");
    $scope.item = {};
    userService.userAuthorizated();
    $scope.inProgress = false;
    var stopTime;   
    $scope.translate = function () {
        $scope.trQuantity = $translate.instant('main.QUANTITY');
        $scope.trProductName = $translate.instant('main.PRODUCTNAME');
        $scope.trState = $translate.instant('main.STATE');
        $scope.trDuration = $translate.instant('main.DURATION');
        $scope.trTimer = $translate.instant('main.TIMER');
        $scope.trDriverName = $translate.instant('main.DRIVERNAME');
        $scope.trVehicle = $translate.instant('main.VEHICLE');
        $scope.trTotalOrder = $translate.instant('main.TOTALORDER');
        $scope.trStateTime = $translate.instant('main.STATETIME');
        $scope.ordernumber = $translate.instant('main.ORDERNUMBER');
        $scope.productname = $translate.instant('main.PRODUCTNAME');
        $scope.materials = $translate.instant('main.MATERIALS');
        $scope.state = $translate.instant('main.STATE');
        $scope.duration = $translate.instant('main.DURATION');
        $scope.timer = $translate.instant('main.TIMER');
        $scope.timerstr = $translate.instant('main.TIMERSTR');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.orderitemstates = [];
    $scope.BuildSearchString = function (src) {
        var result = [];
        $scope.stop();
        if ($rootScope.user && $rootScope.user.UserRole) {
            result.push("Completed=0");
            result.push("Orders.StoreID='" + $rootScope.user.StoreID + "'");
            result.push("OrderStateID=4");
            var date = $filter('date')(ngnotifyService.ServerTime(), 'HH');
            if (date > 9) {
                $scope.OrderDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
                result.push("OrderDate >'" + $scope.OrderDate + "'");
            } else {
                var now = moment().subtract(1, 'days');
                var filterdate = moment(now).format('YYYY-MM-DD');
                result.push("OrderDate >'" + filterdate + "'");
            }
        }
        return result;
    };
    $scope.LoadOrderItemStates = function () {
        if ($scope.inProgress) return;
        $scope.stop();
        $scope.inProgress = true;
        Restangular.all('orderitemstate').getList({
            pageNo: 1,
            pageSize: 100,
            search: $scope.BuildSearchString(),
            sort: '+Orders.OrderNumber',
        }).then(function (result) {
            $scope.inProgress = false;
            angular.copy($scope.UpdateOrderItemStatesTimers(result.plain()), $scope.orderitemstates);
            $scope.start();
        }, function (response) {
            $scope.inProgress = false;
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            $scope.start();
        });
    };
    $scope.UpdateOrderItemStatesTimers = function (items) {
        if (items && items.length) {
            var TimersTotal = 0;
            for (var i = 0; i < items.length; i++) {
                var d1 = moment(items[i].OrderItemStateDate);
                var d2 = moment();
                var data = moment.duration(d2.diff(d1)).asSeconds();
                if (moment.duration(d2.diff(d1)).asSeconds() < items[i].Duration) {
                    items[i].Timer = parseInt(items[i].Duration) - parseInt((moment.duration(d2.diff(d1)).asSeconds()));
                    items[i].isTimedOut = false;
                }
                else {
                    items[i].Timer = parseInt((moment.duration(d2.diff(d1)).asSeconds())) - parseInt(items[i].Duration);
                    items[i].isTimedOut = true;
                }
                items[i].TimerStr = d1.add(items[i].Duration, 'seconds').fromNow();
            }
            return items;
        }
        $scope.start();
    };
    $scope.stop = function () {
        $timeout.cancel(stopTime);
    };
    $scope.start = function () {
        $scope.stop();
        stopTime = $timeout(function () { $scope.LoadOrderItemStates(); }, 1000);
    };
    $scope.start();
    $scope.RemoveItemDispalay = function (item) {
        $scope.WaitForResult = true;
        for (var i = 0; i < $scope.orderitemstates.length; i++) {
            if ($scope.orderitemstates[i].id == item.id) {
                $scope.orderitemstates[i].Completed = true;
                $scope.orderitemstates[i].put().then(
                function (res) {
                    toaster.pop("success",  $translate.instant('kitchendisplayf.Prepared'),$translate.instant('kitchendisplayf.Itemprepared'));
                    $scope.WaitForResult = false;
                },
                 function (response) {
                     $scope.WaitForResult = false;
                     toaster.pop('error',$translate.instant('kitchendisplayf.Updatefailed'), response.data.ExceptionMessage);
                 });
                break;
            }
        }
        return $scope.WaitForResult;
    };
    $scope.RemoveItem = function (item) {
        $scope.stop();
        if ($scope.WaitForResult == true) {
            toaster.pop("warning",$translate.instant('kitchendisplayf.PleaseWait'),$translate.instant('kitchendisplayf.PleaseClickAgain'));
        } else {
            $scope.RemoveItemDispalay(item);
        }
        $scope.start();
    };
    $scope.$on('$destroy', function () {
    $timeout.cancel(stopTime);
        deregistration();
        $scope.stop();
        $element.remove();
        $rootScope.uService.ExitController("kdsCtrl");
    });
};