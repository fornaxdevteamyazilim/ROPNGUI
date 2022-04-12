app.controller('orderdisplayCtrl', orderdisplayCtrl);
function orderdisplayCtrl($scope, $log, $modal, $interval, Restangular, ngTableParams, $timeout, SweetAlert, toaster, $window, $rootScope, $location, $translate, userService, $filter, $element, ngnotifyService) {
    $rootScope.uService.EnterController("orderdisplayCtrl");
    $scope.orders = [];
    userService.userAuthorizated();
    $scope.LoadOrders = function () {
        Restangular.all('ordertools/NewOrders').getList().then(function (result) {
            $scope.UpdateOrderArray(result);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadOrders();
    $scope.Timer = function () {
        for (var i = 0; i < $scope.orders.length; i++) {
            $scope.UpdateOrderTimer($scope.orders[i]);
        }
    };
    $scope.UpdateOrderTimer = function (order) {
        var d1 = moment(order.OrderDate);
        var d2 = moment(ngnotifyService.ServerTime());
        order.TimerStr = moment(order.OrderDate).from(ngnotifyService.ServerTime());
        order.isLate = (moment.duration(d1.diff(d2)).asMinutes() > 5);

    };
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
    };
    $scope.CopyOrder = function (order) {
        return {
            id: order.id,
            DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id,
            OrderNumber: order.OrderNumber,
            StoreID: order.StoreID,
            AddressID: order.AddressID,
            OrderTypeID: order.OrderTypeID,
            VAT: order.VAT,
            Amount: order.Amount,
            PaymentTypeID: order.PaymentTypeID,
            PaymentStatusID: order.PaymentStatusID,
            OrderStateID: order.OrderStateID,
            OrderDate: $filter('date')(order.OrderDate, 'yyyy-MM-dd HH:mm:ss'),
            DeliveryDate: $filter('date')(order.DeliveryDate, 'yyyy-MM-dd HH:mm:ss'),
            OperationDate: order.OperationDate,
            OrderNote: order.OrderNote,
            PaymentNote: order.PaymentNote,
            StoreTableID: order.StoreTableID,
            Alias: order.Alias,
        }
    };
    $scope.ChangeOrderState = function (item) {
        item.root = "order";
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/changeorderstate.html',
            controller: 'changeorderstateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (value) {
            event.preventDefault();
            if (value == 'result') {
                $scope.CallReason(2, 'cancel');
                $scope.ClearCallerID();
                $window.history.back();
            }
        })
    };
    $scope.CheckOrder = function (data, state) {
        if (state == 1) {
            var ordertosave = $scope.CopyOrder(data);
            ordertosave.OrderStateID = 1;
            Restangular.restangularizeElement('', ordertosave, 'order');
            ordertosave.put().then(function (result) {
                toaster.pop('success', $translate.instant('orderfile.OrderConfirmed '));
                $scope.LoadOrders();
                $rootScope.$broadcast('AskingOrder');
            }, function () {
                toaster.pop('error', $translate.instant('orderfile.NotSaved '));
                $scope.LoadOrders();
                $rootScope.$broadcast('AskingOrder');
            });
        }
        if (state == 14) {
            data.root = "orderdisplay";
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/order/changeorderstate.html',
                controller: 'changeorderstateCtrl',
                size: '',
                backdrop: '',
                resolve: {
                    item: function () {
                        return data;
                    },
                }
            });
            modalInstance.result.then(function (value) {
                if (value == 'result') {
                    $scope.LoadOrders();
                    $rootScope.$broadcast('AskingOrder');
                }
            })
        }
    };
    $scope.changestore = function (order) {
        
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/orderdisplay/changeysorderstore.html',
            controller: 'changeysorderstoreCtrl',
            size: '',
            backdrop: '',
            resolve: {
                order: function () {
                    return order;
                },
            }
        });
        modalInstance.result.then(function (result) {
            if (result == 'OK') {
                $scope.LoadOrders();
                $location.path('app/mainscreen/mainscreen');
            }
        })
    };

      $scope.DeleteYSMaping = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('aggregator/deletecustomermap').get({
            OrderID: OrderID,
        }).then(function (result) {
            toaster.pop("success",$translate.instant('orderfile.YSOrderCustomerMatchingDeleted '));
            $scope.isSpinner = false;
            location.href = '#/app/mainscreen';
        }, function (response) {
            toaster.pop('error', "error!", response.data.Message);
            $scope.isSpinner = false;
        });
    };

    $scope.$on('$destroy', function () {
        $scope.LoadOrders();
        $element.remove();
        $rootScope.uService.ExitController("orderdisplayCtrl");
    });
};
