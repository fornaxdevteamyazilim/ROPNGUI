app.controller('driverordersCtrl', driverordersCtrl); 
function driverordersCtrl($scope, $log, $interval, $timeout, amMoment, $filter, $modal, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $anchorScroll, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("driverordersCtrl");
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trOutSide = $translate.instant('main.OUTSIDE');
        $scope.trPrepared = $translate.instant('main.PREPARED');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    var OrderRefreshTimeOut;
    $scope.orders = [];
    $scope.LoadOrders = function () {
        Restangular.all('order').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "OrderStateID in (5) and StoreID='" + $rootScope.user.StoreID + "'"
        }).then(function (result) {
            $scope.UpdateOrderArray(result);
            $scope.StartTimmer();
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
            OrderRefreshTimeOut = $timeout(function () { $scope.LoadOrders(); }, 3000);
        });
    };
    $scope.StartTimmer = function () {
        $scope.StopTimmer();
        OrderRefreshTimeOut = $timeout(function () { $scope.LoadOrders(); }, 1000);
    };
    $scope.StopTimmer = function () {
        $timeout.cancel(OrderRefreshTimeOut);
    };
    $scope.StartTimmer();
    $scope.Timer = function () {
        for (var i = 0; i < $scope.orders.length; i++) {
            $scope.UpdateOrderTimer($scope.orders[i]);
        }
    };
    $scope.UpdateOrderTimer = function (order) {
        var d1 = moment(order.DeliveryDate);
        var d2 = moment();
        order.TimerStr = moment(order.DeliveryDate).fromNow();
        order.isLate = (moment.duration(d2.diff(d1)).asSeconds() > 0);

    };
    var stopTime = $interval($scope.Timer, 1000);
    $scope.UpdateOrderArray = function (ordersFromServer) {
        for (var i = 0; i < ordersFromServer.length; i++) {
            var isExist = false;
            $scope.UpdateOrderTimer(ordersFromServer[i]);
            for (var a = 0; a < $scope.orders.length; a++) {
                if ($scope.orders[a].id == ordersFromServer[i].id) {
                    isExist = true;
                    $scope.orders[a] = ordersFromServer[i];
                }
            }
            if (!isExist) {
                $scope.orders.push(ordersFromServer[i]);
            }
        }
        for (var i = 0; i < $scope.orders.length; i++) {
            var isExist = false;
            for (var a = 0; a < ordersFromServer.length; a++) {
                if ($scope.orders[i].id == ordersFromServer[a].id)
                    isExist = true;
            }
            if (!isExist)
                $scope.orders.splice(i, 1);
        }
    }
    $scope.NowDateTime = function () {
        $scope.Time = $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss');
    }
    $scope.SaveDeliveryOrder = function (data) {
        var state = { DriverID: $stateParams.id, OrderID: $scope.orders[0].id, Duration: -1, OrderStateID: 6 }
        state.OrderStateDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
        Restangular.restangularizeElement('', state, 'orderstate')
        state.post().then(
            function (res) {
                toaster.pop("success",  $translate.instant('userfile.OrderOut '),  $translate.instant('userfile.OrdermarkedasOut '));
            });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        OrderRefreshTimeOut(); 
        stopTime();
        $element.remove();
        $rootScope.uService.ExitController("driverordersCtrl");
    });
};
app.controller('driverorderlistCtrl', driverorderlistCtrl);
function driverorderlistCtrl($scope, $log, $interval, $timeout, amMoment, $filter,$translate, $modal, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $anchorScroll, ngnotifyService, $element) {
    $rootScope.uService.EnterController("driverorderlistCtrl");
    $scope.orders = [];
    var OrderRefreshTimeOut;
    $scope.Driver = $stateParams.id;
    $scope.GetActualDriverStates = function (driver) {
        Restangular.all('orderstate').getList({
            pageNo: 1,
            pageSize: 1000,
            search: ["OrderStateID in (6) and Duration=-1", "DriverID='" + driver + "'"],
        }).then(function (result) {
            $scope.LoadOrders(result);
            $scope.OrderIDs(result);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
            $scope.StartTimmer();
        });
    };
    $scope.OrderIDs=function (states){
        if (!(states || states.length)) return '';
        $scope.IDs=[];
        for (var i = 0; i < states.length; i++) {
            $scope.IDs.push(states[i].OrderID);
        }
        return $scope.IDs.join();
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.LoadOrders = function (DriverOrdersStates) {
        Restangular.all('order').getList({
            pageNo: 1,
            pageSize: 1000,
            sort: 'OrderDate',
            search: ["OrderStateID in (6)","StoreID='"+ $rootScope.user.StoreID +"'"]
        }).then(function (result) {
            var ResResult = [];
            for (var i = 0; i < $scope.IDs.length; i++) {

                for (var j = 0; j < result.length; j++) {
                    if (result[j].id == $scope.IDs[i]) {
                        ResResult.push( result[j]);
                    }
                }
            }
            $scope.UpdateOrderArray(ResResult);
            $scope.StartTimmer();
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
            $scope.StartTimmer();
        });
    };
    $scope.StartTimmer = function () {
        $scope.StopTimmer();
        OrderRefreshTimeOut = $timeout(function () { $scope.GetActualDriverStates($stateParams.id); }, 1000);
    };
    $scope.StopTimmer = function () {
        $timeout.cancel(OrderRefreshTimeOut);
    };
    $scope.StartTimmer();
    $scope.Timer = function () {
        for (var i = 0; i < $scope.orders.length; i++) {
            $scope.UpdateOrderTimer($scope.orders[i]);
        }
    };
    $scope.UpdateOrderTimer = function (order) {
        var d1 = moment(order.DeliveryDate);
        var d2 = moment();
        order.TimerStr = moment(order.DeliveryDate).fromNow();
        order.isLate = (moment.duration(d2.diff(d1)).asSeconds() > 0);

    };
    var stopTime = $interval($scope.Timer, 1000);
    $scope.UpdateOrderArray = function (ordersFromServer) {
        for (var i = 0; i < ordersFromServer.length; i++) {
            var isExist = false;
            $scope.UpdateOrderTimer(ordersFromServer[i]);
            for (var a = 0; a < $scope.orders.length; a++) {
                if ($scope.orders[a].id == ordersFromServer[i].id) {
                    isExist = true;
                    $scope.orders[a] = ordersFromServer[i];
                }
            }
            if (!isExist) {
                $scope.orders.push(ordersFromServer[i]);
            }
        }
        for (var i = 0; i < $scope.orders.length; i++) {
            var isExist = false;
            for (var a = 0; a < ordersFromServer.length; a++) {
                if ($scope.orders[i].id == ordersFromServer[a].id)
                    isExist = true;
            }
            if (!isExist)
                $scope.orders.splice(i, 1);
        }
    }
    $scope.NowDateTime = function () {
        $scope.Time = $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss');
    }
    $scope.backdriver = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/backdriver.html',
            controller: 'driverbackCtrl',
            size: '',
            backdrop: '',
            resolve: {
                Order: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function () {
        })
    };
    $scope.$on('$destroy', function () {
        $scope.StopTimmer();
        OrderRefreshTimeOut();
        stopTime();
        $element.remove();
        $rootScope.uService.ExitController("driverslistCtrl");
    });
};
app.controller('driverbackCtrl', driverbackCtrl);
function driverbackCtrl($rootScope, $scope, $modalInstance,$translate, $modal, ngTableParams, Order, $stateParams, SweetAlert, toaster, Restangular, $filter, $log, $window, ngnotifyService) {
    $rootScope.uService.EnterController("driverbackCtrl");
    $scope.order = Order;
    $scope.driver = {};
    $scope.GetOrderDriver = function (order) {
        if (order.OrderStateID != 6) return;
        Restangular.one('user', $stateParams.id).get().then
            (function (d) { $scope.driver = d; });
    };
    $scope.GetOrderDriver(Order);
    $scope.reasons=[];
    $scope.GetReasons = function () {
        Restangular.all('orderreason').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "OrderReasonTypeID=2 and isActive=1"
        }).then(function (result) {
            return $scope.reasons = result;
        });
    };
    $scope.GetReasons();
    $scope.SaveDriverReturn = function (driverId, ostate, reason) {
        $scope.OrderReasonID = null;
        var state = { DriverID: driverId.id, OrderID: $scope.order.id, Duration: 0, OrderStateID: ostate, OrderReasonID: reason }
        state.OrderStateDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
        state.OrderReasonID = (state.OrderStateID == 9) ?  state.OrderReasonID : $scope.OrderReasonID ;
        Restangular.restangularizeElement('', state, 'orderstate')
        state.post().then(function (resp) {
            $scope.ok();
        }, function (resp) {
            toaster.pop('error', $translate.instant('userfile.NONEWPAYMENTRECORDED '), resp.data.ExceptionMessage);
        });
    };
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("driverbackCtrl");
    });
};
