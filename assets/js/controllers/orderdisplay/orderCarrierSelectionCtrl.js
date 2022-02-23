app.controller('orderCarrierSelectionCtrl', orderCarrierSelectionCtrl);
function orderCarrierSelectionCtrl($scope, $log, $interval, $timeout, amMoment, $filter, $modal, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $anchorScroll, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("orderCarrierSelectionCtrl");
    var dis = this;



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
        $scope.selectcarrier = $translate.instant('main.CARRIERSELECT');
    };
    $scope.translate();
    $scope.message = {};
    $scope.AvgTimer = 0;
    $scope.orders = [];
    $scope.ShowObject = true;
    $scope.UpdateOrder = function (OrderUpdate) {
        if (OrderUpdate.OrderTypeID == 2 || OrderUpdate.OrderTypeID == 7) {
            if (OrderUpdate.isActive && ([4].some(x => x === OrderUpdate.OrderStateID))) {
                if ($scope.preparingOrders) {
                    if ($scope.preparingOrders.some(x => x.id === OrderUpdate.OrderID)) {
                        var idx = $scope.preparingOrders.findIndex(x => x.id === OrderUpdate.OrderID);
                        if (OrderUpdate.OrderStateID == 4)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.preparingOrders[idx] = result;
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });
                        else
                            $scope.preparingOrders.splice(idx, 1);
                    }
                    else {
                        if (OrderUpdate.OrderStateID == 4)
                            Restangular.one('order/updated').get({ OrderID: OrderUpdate.OrderID }).then(function (result) {
                                $scope.preparingOrders.push(result);
                            }, function (response) { toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage); });
                    }
                }
            }
            else if (OrderUpdate.OrderStateID > 0) {
                if ($scope.preparingOrders.some(x => x.id === OrderUpdate.OrderID)) {
                    $scope.preparingOrders.splice($scope.preparingOrders.findIndex(x => x.id === OrderUpdate.OrderID), 1);
                    dis.tableParams.reload();
                }
            }
            $scope.ShowObject = false;
            $scope.getOrder = true;
            $scope.$broadcast('$$rebind::refresh');
        }
    }

    var OrderUpdated = $scope.$on('OrderUpdated', function (event, data) {
        $scope.UpdateOrder(data);
    });
    var SignalrReConnected = $scope.$on('Signalr', function (event, data) {
        if (data == 'reConnected')
            $scope.LoadOrders(true);
    });
    $scope.SelectItem = function (id) {
        location.href = '#/app/orders/orderDetail/' + id;
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        result.push("OrderTypeID in (2,7)");
        result.push("StoreID='" + $rootScope.user.StoreID + "'");
        result.push("OrderStateID in (4)");
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
                $scope.$broadcast('$$rebind::refresh');
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    //$rootScope.preparingOrders.length

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
                //dis.tableParams.reload();
            }
        })
    };
    $scope.carrier = function () {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/carrier.html',
            controller: 'carrierCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                Order: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function () {
            dis.tableParams.reload();
        })
    };
    $scope.LoadOrders(true);


    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    var OrderRefresh1 = $rootScope.$on('RefreshOrders', function (event, OrdeID) {
        $scope.LoadOrders(true);
    });
    $scope.$on('$destroy', function () {
        OrderUpdated();
        SignalrReConnected();
        OrderRefresh1();
        deregistration1();
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
                    search: ""//"Drivers.StoreID='" + $rootScope.user.StoreID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.SelectCarrier = function (data) {
        Restangular.one('ordertools/updateCarrier').get({
            OrderID: Order.id,
            CarrierID: data
        })
            .then(function (result) {
                $rootScope.$emit('RefreshOrders', { id: $scope.order.id });
                toaster.pop("success", $translate.instant('dispatcherfile.OrderOutput'), $translate.instant('dispatcherfile.OrdermarkedOut'));
                $scope.ok();
            },
                function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("carrierOrderCtrl");
    });
};
