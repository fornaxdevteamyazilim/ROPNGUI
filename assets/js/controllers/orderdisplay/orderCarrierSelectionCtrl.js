app.controller('orderCarrierSelectionCtrl', orderCarrierSelectionCtrl);
function orderCarrierSelectionCtrl($scope, $log, $interval, $timeout, amMoment, $filter, $modal, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $anchorScroll, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("orderCarrierSelectionCtrl");
    var dis = this;
    //$scope.oneAtATime = true;
    //$scope.status = {
    //    isFirstOpen: false,
    //    isFirstDisabled: false
    //};



    $scope.getOrder = true;
    userService.userAuthorizated();
    $scope.preparingOrders = [];
    $scope.preparedOrders = [];
    $scope.outOrders = [];
    $scope.cookingOrders = [];
    $scope.translate = function () {
        $scope.new = $translate.instant('main.NEW');
        $scope.ordertime = $translate.instant('main.ORDERTIME');
        $scope.totalamount = $translate.instant('main.TOTALAMOUNT');
        $scope.ordertype = $translate.instant('main.ORDERTYPE');
        $scope.deliverytime = $translate.instant('main.DELIVERYTIME');
        $scope.ordercontent = $translate.instant('main.ORDERCONTENT');
        $scope.reprint = $translate.instant('main.REPRINT');
        $scope.prepared = $translate.instant('main.PREPARED');
        $scope.send = $translate.instant('main.SEND');
        $scope.outside = $translate.instant('main.OUTSIDE');
        $scope.return = $translate.instant('main.RETURN');
        $scope.driverlist = $translate.instant('main.DRIVERLIST');
        $scope.drivername = $translate.instant('main.DRIVERNAME');
        $scope.vehicle = $translate.instant('main.VEHICLE');
        $scope.totalorder = $translate.instant('main.TOTALORDER');
        $scope.statetime = $translate.instant('main.STATETIME');
        $scope.neworder = $translate.instant('main.NEWORDERR');
        $scope.homedelivery = $translate.instant('main.HOMEDELIVERY');
        $scope.ordernumber = $translate.instant('main.ORDERNUMBER');
        $scope.personname = $translate.instant('main.PERSONNAME');
        $scope.orderstate = $translate.instant('main.ORDERSTATE');
        $scope.paymentstatus = $translate.instant('main.PAYMENTSTATUS');
        $scope.storename = $translate.instant('main.STORENAME');
        $scope.orderdate = $translate.instant('main.ORDERDATE');
        $scope.orderdetails = $translate.instant('main.ORDERDETAILS');
        $scope.instore = $translate.instant('main.INSTORE');
        $scope.orderid = $translate.instant('main.ORDERID');
        $scope.address = $translate.instant('main.ADDRESS');
        $scope.estimateddeliverytime = $translate.instant('main.ESTIMATEDDELIVERYTIME');
        $scope.assigndriver = $translate.instant('main.ASSIGNDRIVER');
        $scope.orderperiod = $translate.instant('main.ORDERPERIOD');
        $scope.addcarrier = $translate.instant('main.ADDCARRIER');
    };
    $scope.translate();
    $scope.message = {};
    $scope.AvgTimer = 0;
    $scope.orders = [];
    $scope.ShowObject = true;
    $scope.UpdateOrder = function (OrderUpdate) {
        if (OrderUpdate.OrderTypeID == 2 || OrderUpdate.OrderTypeID == 7) {
            if (OrderUpdate.isActive && ([4, 5, 6, 21].some(x => x === OrderUpdate.OrderStateID))) {
                if ($scope.cookingOrders) {
                    if ($scope.cookingOrders.some(x => x.id === OrderUpdate.OrderID)) {
                        var idx = $scope.cookingOrders.findIndex(x => x.id === OrderUpdate.OrderID);
                        if (OrderUpdate.OrderStateID == 21)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.cookingOrders[idx] = result;
                                $scope.calculateOrderTime();
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });
                        else
                            $scope.cookingOrders.splice(idx, 1);
                    }
                    else {
                        if (OrderUpdate.OrderStateID == 21)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.cookingOrders.push(result);
                                $scope.calculateOrderTime();
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });

                    }
                }
                if ($scope.preparingOrders) {
                    if ($scope.preparingOrders.some(x => x.id === OrderUpdate.OrderID)) {
                        var idx = $scope.preparingOrders.findIndex(x => x.id === OrderUpdate.OrderID);
                        if (OrderUpdate.OrderStateID == 4)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.preparingOrders[idx] = result;
                                $scope.calculateOrderTime();
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });
                        else
                            $scope.preparingOrders.splice(idx, 1);
                    }
                    else {
                        if (OrderUpdate.OrderStateID == 4)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.preparingOrders.push(result);
                                $scope.calculateOrderTime();
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });

                    }
                }
                if ($scope.preparedOrders) {
                    if ($scope.preparedOrders.some(x => x.id === OrderUpdate.OrderID)) {
                        var idx = $scope.preparedOrders.findIndex(x => x.id === OrderUpdate.OrderID);
                        if (OrderUpdate.OrderStateID == 5)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.preparedOrders[idx] = result;
                                $scope.calculateOrderTime();
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });
                        else
                            $scope.preparedOrders.splice(idx, 1);
                    }
                    else {
                        if (OrderUpdate.OrderStateID == 5)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.preparedOrders.push(result);
                                $scope.calculateOrderTime();
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });
                    }
                }
                if ($scope.outOrders) {
                    if ($scope.outOrders.some(x => x.id === OrderUpdate.OrderID)) {
                        var idx = $scope.outOrders.findIndex(x => x.id === OrderUpdate.OrderID);
                        if (OrderUpdate.OrderStateID == 6)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.outOrders[idx] = result;
                                $scope.calculateOrderTime();
                                dis.tableParams.reload();
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });
                        else {
                            $scope.outOrders.splice(idx, 1);
                            dis.tableParams.reload();
                        }
                    }
                    else {
                        if (OrderUpdate.OrderStateID == 6)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.outOrders.push(result);
                                $scope.calculateOrderTime();
                                dis.tableParams.reload();
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });

                    }
                }
            }
            else if (OrderUpdate.OrderStateID > 0) {
                if ($scope.outOrders.some(x => x.id === OrderUpdate.OrderID)) {
                    $scope.outOrders.splice($scope.outOrders.findIndex(x => x.id === OrderUpdate.OrderID), 1);
                    dis.tableParams.reload();
                }
                if ($scope.preparedOrders.some(x => x.id === OrderUpdate.OrderID)) {
                    $scope.preparedOrders.splice($scope.preparedOrders.findIndex(x => x.id === OrderUpdate.OrderID), 1);
                    dis.tableParams.reload();
                }
                if ($scope.preparingOrders.some(x => x.id === OrderUpdate.OrderID)) {
                    $scope.preparingOrders.splice($scope.preparingOrders.findIndex(x => x.id === OrderUpdate.OrderID), 1);
                    dis.tableParams.reload();
                }
                if ($scope.cookingOrders.some(x => x.id === OrderUpdate.OrderID)) {
                    $scope.cookingOrders.splice($scope.cookingOrders.findIndex(x => x.id === OrderUpdate.OrderID), 1);
                    dis.tableParams.reload();
                }
            }

            $scope.calculateOrderTime();
            $scope.ShowObject = false;
            $scope.getOrder = true;
            $scope.$broadcast('$$rebind::refresh');
        }
    }

    var OrderUpdated = $scope.$on('OrderUpdated', function (event, data) {
        $scope.UpdateOrder(data);
    });
    var OrderRefresh = $scope.$on('OrderChange', function (event, data) {
        //$scope.LoadOrders();
    });
    var SignalrReConnected = $scope.$on('Signalr', function (event, data) {
        if (data == 'reConnected')
            $scope.LoadOrders();
    });
    amMoment.changeLocale('tr');
    $scope.SelectItem = function (id) {
        location.href = '#/app/orders/orderDetail/' + id;

    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        result.push("OrderTypeID in (2,7)");
        result.push("StoreID='" + $rootScope.user.StoreID + "'");
        result.push("OrderStateID in (4,5,6,21)");
        result.push("tt.OperationDate ='" + $rootScope.user.Store.OperationDate + "'");
        return result;
    };
    $scope.LoadOrders = function (initload) {
        if (!initload) return;
        if ($scope.getOrder == true) {
            $scope.getOrder = false;
            Restangular.all('order').getList({
                pageNo: 1,
                pageSize: 1000,
                search: $scope.BuildSearchString()
            }).then(function (result) {
                $scope.preparingOrders = $filter('filter')(result, (item) => { return (item.OrderStateID == 4 || item.OrderStateID == 21); });
                $scope.preparedOrders = $filter('filter')(result, (item) => { return (item.OrderStateID == 5); });
                $scope.outOrders = $filter('filter')(result, (item) => { return (item.OrderStateID == 6); });

                $scope.calculateOrderTime();
                $scope.ShowObject = false;
                $scope.getOrder = true;
                $scope.$broadcast('$$rebind::refresh');
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                $scope.ShowObject = false;
                $scope.getOrder = true;
            });
        }
    };
    
    $scope.UpdateOrderTimer = function (order) {
        var d1 = moment(order.DeliveryDate);
        var d2 = moment(ngnotifyService.ServerTime());
        var k1 = moment($filter('date')(order.OrderDate, 'yyyy-MM-dd HH:mm '), "YYYY-MM-DD HH:mm");
        var k2 = moment($filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm '), "YYYY-MM-DD HH:mm");
        var data = moment.duration(k2.diff(k1));
        order.TimerStr = data.asMinutes();
        //order.TimerStr = moment(order.DeliveryDate).from(ngnotifyService.ServerTime());
        order.isLate = (moment.duration(d2.diff(d1)).asSeconds() > 0);
        order.OrderDateTXT = $filter('date')(order.OrderDate, 'HH:mm:ss');
        order.DeliveryDateTXT = $filter('date')(order.DeliveryDate, 'HH:mm:ss');
        order.AmountTXT = $filter('number')(order.Amount, 2);
        order.states[0].OrderStateDateTXT = $filter('date')(order.states[0].OrderStateDate, 'HH:mm:ss');
        if (order.OrderStateID == 6) {
            for (var j = 0; j < order.states.length; j++) {
                if (order.states[j].OrderStateID == 6)
                    var ct2 = moment(order.states[j].OrderStateDate, "YYYY-MM-DD HH:mm");
            }
            var ct1 = moment(order.OrderDate, "YYYY-MM-DD HH:mm");
            var date = moment.duration(ct2.diff(ct1));
            order['calculatedTime'] = date.asMinutes();
        }
    };
    $scope.NowDateTime = function () {
        $scope.Time = $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss');
    };
    $scope.RemoveItem = function (Order) {
        for (var i = 0; i < $scope.orders.length; i++) {
            if ($scope.orders[i].id == Order.id) {
                $scope.orders[i].OrderStateID = 6;
                $scope.orders[i].put().then(
                    function (res) {
                        toaster.pop("success", $translate.instant('invantories.Prepared'), $translate.instant('invantories.OrderOutput'));
                        //$scope.orders.splice(i, 1);
                    },
                    function (response) {
                        toaster.pop('error', $translate.instant('difinitions.UpdatedFailed'), response.data.ExceptionMessage);
                        $scope.LoadOrders(false);
                    }
                );
                break;
            }
        }
    };
    $scope.ControlOrderType = function (data) {
        if (data.OrderTypeID == 0 || data.OrderTypeID == 1) {
            var state = { OrderID: data.id, Duration: -1, OrderStateID: 10 }
            state.OrderStateDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
            Restangular.restangularizeElement('', state, 'orderstate')
            state.post().then(
                function (res) {
                    toaster.pop("success", $translate.instant('invantories.Prepared'), $translate.instant('invantories.Wasdelivered'));
                });
        }
        else {
            $scope.preparedorder(data);
        }
    };
   
    $scope.homedeliveryOrder = function () {
        location.href = '#/app/orders/personpage/list';
    };
    $scope.orderitemdetails = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/orderItemDetails.html',
            controller: 'orderItemDetailsCtrl',
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
    $scope.itemdetails = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/itemDetails.html',
            controller: 'itemDetailsCtrl',
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
    $scope.preparedorder = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/carrierorder.html',
            controller: 'carrierOrderCtrl',
            size: '',
            backdrop: '',
            resolve: {
                Order: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (result) {
            if (result == 'Ok') {
                dis.tableParams.reload();
            }
        })
    };
    $scope.backdriver = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/backdriver.html',
            controller: 'backDriverCtrl',
            size: '',
            backdrop: '',
            resolve: {
                Order: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (result) {
            if (result == 'Ok') {
                dis.tableParams.reload();
            }
        })
    };
    dis.tableParams = new ngTableParams({
        page: 1,
        count: 100,
    },
        {
            counts: [],
            getData: function ($defer, params) {
                Restangular.all('carrier').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "Drivers.StoreID='" + $rootScope.user.StoreID + "'"
                }).then(function (items) {
                    for (var i = 0; i < items.length; i++) {
                        items[i].OrderStates.lengthTXT = $filter('number')(items[i].OrderStates.length / 2, 0);
                        items[i].StateTimeTXT = $filter('number')(items[i].StateTime / 60, 0);
                    }
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                    //$scope.carrier = items; 
                    $scope.$broadcast('$$rebind::refresh');
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data);
                });
            }
        });
    $scope.carrier = function () {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/carrier.html',
            controller: 'carrierCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
            }
        });
        modalInstance.result.then(function () {
            dis.tableParams.reload();
        })
    };
    $scope.stop = function () {
        $timeout.cancel($scope.refreshTime);
    };
    var OrderRefresh1 = $rootScope.$on('PreparedOrderRefresh', function (event, OrdeID) {
        for (var i = 0; i < $scope.preparedOrders.length; i++) {
            if ($scope.preparedOrders[i].id == OrdeID.id) {
                $scope.preparedOrders.splice(i, 1);
                return;
            }
        }
    });
    var OrderRefresh2 = $rootScope.$on('BackDriverRefresh', function (event, OrdeID) {
        for (var i = 0; i < $scope.outOrders.length; i++) {
            if ($scope.outOrders[i].id == OrdeID.id) {
                $scope.outOrders.splice(i, 1);
                return;
            }
        }
    });
    $scope.refreshTime = null;
    $scope.fullRefreshOrdersTimer = null;
    $scope.fullRefreshOrders = function () {
        $scope.LoadOrders(true);
        $scope.fullRefreshOrdersTimer=setTimeout(function () { $scope.fullRefreshOrders() }, 300000);
    }
    $scope.fullRefreshOrders();
    $scope.stopRefreshOrders = function () {
        $timeout.cancel($scope.fullRefreshOrdersTimer);
    };
    $scope.calculateOrderTime = function () {
        $scope.stop();
        angular.forEach($scope.preparingOrders, function (ord) {
            $scope.UpdateOrderTimer(ord);
        });
        angular.forEach($scope.preparedOrders, function (ord) {
            $scope.UpdateOrderTimer(ord);
        });
        angular.forEach($scope.outOrders, function (ord) {
            $scope.UpdateOrderTimer(ord);
        });
        $scope.$broadcast('$$rebind::refresh');
        $scope.refreshTime = setTimeout(function () { $scope.calculateOrderTime() }, 30000);
    };
    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    var deregistration2 = $scope.$on('stopAskingDispatcher', function (event, data) {
        $scope.stop();
        $timeout.cancel(refreshTime);
    });
    $scope.$on('$destroy', function () {
        OrderRefresh();
        OrderRefresh1();
        OrderRefresh2();
        OrderUpdated();
        userService.stopTimeout();
        //$scope.stopstop();
        deregistration1();
        deregistration2();
        $scope.stopRefreshOrders();
        $element.remove();
        $rootScope.uService.ExitController("orderCarrierSelectionCtrl");
    });
};
app.controller('carrierOrderCtrl', carrierOrderCtrl);
function carrierOrderCtrl($scope, $rootScope, $modalInstance, $modal, ngTableParams, Order, SweetAlert, toaster, Restangular, $filter, $log, $window, $translate, userService, ngnotifyService) {
    $rootScope.uService.EnterController("carrierOrderCtrl");
    var od = this;
    $scope.order = Order;
    $scope.translate = function () {
        $scope.trCarrierName = $translate.instant('main.CARRIERNAME');
        $scope.trVehiclePlate = $translate.instant('main.VEHICLEPLATE');
        $scope.trStartKilometer = $translate.instant('main.STARTKILOMETER');
        $scope.trisDefault = $translate.instant('main.ISDEFAULT');
        $scope.trisActiveFilter = $translate.instant('main.ISACTIVEFILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trisActiveValue = $translate.instant('main.ISACTIVEVALUE');
    };
    $scope.DblClikFunction = function () { };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.ok = function () {
        $modalInstance.close('Ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 20,
    },
        {
            counts: [],
            getData: function ($defer, params) {
                Restangular.all('carrier').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "Drivers.StoreID='" + $rootScope.user.StoreID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.saveDriver = function (data) {
        var state = { DriverID: data, OrderID: $scope.order.id, Duration: -1, OrderStateID: 6 }
        state.OrderStateDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
        Restangular.restangularizeElement('', state, 'orderstate')
        state.post().then(
            function (res) {
                $rootScope.$emit('PreparedOrderRefresh', { id: $scope.order.id });
                toaster.pop("success", $translate.instant('dispatcherfile.OrderOutput'), $translate.instant('dispatcherfile.OrdermarkedOut'));
                $scope.ok();
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                $scope.LoadOrders(false);
            });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("carrierOrderCtrl");
    });
};
