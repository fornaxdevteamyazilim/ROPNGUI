app.filter("getDiff", function () {
    return function (time) {
        var startDate = new Date(time.startDate);
        var endDate = new Date(time.endDate);
        var milisecondsDiff = endDate - startDate;

        return Math.floor(milisecondsDiff / (1000 * 60 * 60)).toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ":" + (Math.floor(milisecondsDiff / (1000 * 60)) % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ":" + (Math.floor(milisecondsDiff / 1000) % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });

    }
});
app.controller('tablePlanCtrl', tablePlanCtrl);
function tablePlanCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $translate, $filter, $window, $rootScope, $location, userService, $element, ngnotifyService,localStorageService) {
    $rootScope.uService.EnterController("tablePlanCtrl");
    $scope.tableplans = [];
    $scope.PersonCount = [];
    $scope.ShowObject = true;
    userService.userAuthorizated();
    $scope.dbClick = function () { };
    //******************//
    //$scope.setBackground = {
    //    'background-image': 'url(assets/images/InStore.png)'
    //};
    //******************//
    $scope.ShowOerderItems = function (order) {
        var value = [];
        for (var j = 0; j < order.items.length; j++) {
            value.push(order.items[j].Product)
            for (var k = 0; k < order.items[j].items.length; k++) {
                value.push(order.items[j].items[k].Product);
            }
        }
        order["OrderProducts"] = value;

        order.OrderDateTXT = $filter('date')(order.OrderDate, 'HH:mm dd.MM.yyyy');
        return order;
    };

    $scope.FormatClock = function (item) {
        if (item.orders[0]) {
            var val = new Date(item.orders[0].OrderDate);
            var n = new Date();
            var milisecondsDiff = n - val;

            return Math.floor(milisecondsDiff / (1000 * 60 * 60)).toLocaleString(undefined, { minimumIntegerDigits: 2 }) + ":" + (Math.floor(milisecondsDiff / (1000 * 60)) % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });// + ":" + (Math.floor(milisecondsDiff / 1000) % 60).toLocaleString(undefined, { minimumIntegerDigits: 2 });
        }
        return null;
        //return $filter('date')(ngnotifyService.ServerTime(val), 'HH:mm:ss');
    };
    $scope.GetOrderPaymentsTotal = function (data) {
        var ptotal = 0;
        var order = $scope.ShowOerderItems(data);
        if (order.payments) {
            for (var i = 0; i < order.payments.length; i++) {
                ptotal += order.payments[i].Amount;
            }
        }
        return order.Amount - ptotal;
    };

    $scope.UpdateOrder = function (UpdatedOrder) {
        if (UpdatedOrder.OrderTypeID == 0) {
            for (var i = 0; i < $scope.tableplans.length; i++) {
                if ($scope.tableplans[i].tables.some(x => x.id === UpdatedOrder.StoreTableID)) {
                    var tindex = $scope.tableplans[i].tables.findIndex(x => x.id === UpdatedOrder.StoreTableID);
                    if (UpdatedOrder.isActive) {
                        var x = i;
                        var tx = tindex;
                        Restangular.one('order/updated').get({ OrderID: UpdatedOrder.OrderID }).then(function (result) {
                            var tmpresult = result.plain();
                            if (tmpresult.isActive) {

                                tmpresult['Remaining'] = $scope.GetOrderPaymentsTotal(result);
                                $scope.tableplans[x].tables[tx].orders.length = 0;
                                $scope.tableplans[x].tables[tx].orders.push(tmpresult);
                            }
                            else {
                                $scope.tableplans[i].tables[tindex].orders.splice(0, $scope.tableplans[x].tables[tindex].orders.length);
                            }
                            $scope.UpdateTimers(true);
                        })
                    }
                    else {
                        //$scope.tableplans[i].tables[tindex].orders=[];
                        $scope.tableplans[i].tables[tindex].orders.splice(0, $scope.tableplans[i].tables[tindex].orders.length);
                    }

                }
            }
            $scope.UpdateTimers(true);
        }
    }
    $scope.UpdateTimers = function (fullRefresh) {
        for (var i = 0; i < $scope.tableplans.length; i++) {
            for (var j = 0; j < $scope.tableplans[i].tables.length; j++) {
                $scope.tableplans[i].tables[j].ActiveOrderTime = $scope.FormatClock($scope.tableplans[i].tables[j]);
            }
        }
        if (fullRefresh)
            $scope.$broadcast('$$rebind::refresh');
        $scope.$broadcast('$$rebind::timers');
    }
    var OrderUpdated = $scope.$on('OrderUpdated', function (event, data) {
        $scope.UpdateOrder(data);
    });
    $scope.LoadStoreTablePlans = function () {
        //$scope.isWaiting = true;
        Restangular.all('tableplan').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "StoreID = '" + $rootScope.user.StoreID + "'"
        }).then(function (result) {
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].tables.length; j++) {
                    for (var k = 0; k < result[i].tables[j].orders.length; k++) {
                        result[i].tables[j].orders[k]['Remaining'] = $scope.GetOrderPaymentsTotal(result[i].tables[j].orders[k]);
                        result[i].tables[j].ActiveOrderTime = $scope.FormatClock(result[i].tables[j]);
                    }
                }
            }
            $scope.selectedOrder = '';
            angular.copy(result.plain(), $scope.tableplans);
            $scope.UpdateTimers(true);
            //$scope.isWaiting = false;
            $scope.tool = { icon: 'assets/images/InStore.png' };
        }, function (response) {
            if (response.data && response.data.ExceptionMessage)
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            else
                toaster.pop('error', $translate.instant('Server.ServerError'), $translate.instant('Server.Errorloadingdata'));
            //$scope.isWaiting = false;
        });
    };
    $scope.LoadStoreTablePlans();
    
    //Burası masa güncellemelri için: sorun - boş masa siaprişleri oluşmakta. 
    var OrderRefresh = $scope.$on('OrderChange', function (event, data) {
        //$scope.LoadStoreTablePlans();
    });
    var SignalrReConnected = $scope.$on('Signalr', function (event, data) {
        if (data == 'reConnected')
            $scope.LoadStoreTablePlans();
    });
    $scope.PersonSelect = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/tableplan/SelectPersonCount.html',
            controller: 'SelectPersoncountCtrl',
            size: '',
            backdrop: '',
            resolve: {
                tableID: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (Msg) {
            if (Msg == 'Yes') {
                $scope.ShowObject = false;
            }
        })
    };
    $scope.AddTableOrder = function (table, tableID) {
        if ($scope.ShowObject) {
            $scope.ShowObject = false;
            if (table && table.length > 0) {
                for (var i = 0; i < table.length; i++) {
                    if (table[i].StoreTableID == tableID) {
                        // if (table[i].OrderStateID == 0 || table[i].OrderStateID == 2) {
                        //     $scope.ShowObject = true;
                        //     toaster.pop('error', "Order in use","Cannot change Order!");
                        // }
                        // else {
                        $scope.ShowObject = true;
                        location.href = '#/app/orders/orderStoreTable/' + table[i].id;
                        // }
                        break;
                    }
                    else {
                        $scope.PersonSelect(tableID);
                    }
                }
            } else {
                $scope.ShowObject = true;
                $scope.PersonSelect(tableID);
            }
        }
    };
    $scope.CopyOrder = function (order, PaymentType, OrderStateID) {
        return {
            id: order.id,
            DepartmentID: order.DepartmentID,
            OrderNumber: order.OrderNumber,
            StoreID: order.StoreID,
            //AddressID: order.AddressID,
            OrderTypeID: order.OrderTypeID,
            VAT: order.VAT,
            Amount: order.Amount,
            PaymentTypeID: PaymentType,
            PaymentStatusID: 1,
            OrderStateID: OrderStateID,
            OrderDate: $filter('date')(order.OrderDate, 'yyyy-MM-dd HH:mm:ss'),
            DeliveryDate: $filter('date')(order.DeliveryDate, 'yyyy-MM-dd HH:mm:ss'),
            OperationDate: order.OperationDate,
            OrderNote: order.OrderNote,
            PaymentNote: order.PaymentNote,
            StoreTableID: order.StoreTableID,
            Alias: order.Alias

        }
    };
    $scope.printOrder = function (data) {
        if (data) {
            Restangular.all('ordertools/PrintReciept').getList({
                OrderID: data.id,
                StationName:localStorageService.get('ClientName')
            }).then(function (_orderItems) {
            }, function (response) {
            });
        }
    };
    $scope.OrderPaymentDeteails = function (data) {
        $scope.ShowObject = false;
        if (data.PaymentStatusID == 1) {
            var order = $scope.CopyOrder(data, data.PaymentTypeID, 10);
            Restangular.restangularizeElement('', order, 'order');
            if (order.restangularized && order.id) {
                order.put().then(function (resp) {
                    //$scope.LoadStoreTablePlans();
                    $scope.ShowObject = true;
                    toaster.pop('success', $translate.instant('orderfile.OrderClosed'));
                }, function (response) {
                    $scope.ShowObject = true;
                    toaster.pop('error', $translate.instant('orderfile.OrderCannotClose'), response.data.ExceptionMessage);
                });
            }
        } else {
            Restangular.one('order', data.id).get().then(function (result) {
                var data = result;
                var modalInstance = $modal.open({
                    templateUrl: 'assets/views/order/orderpayments.html',
                    controller: 'orderpaymentCtrl',
                    size: 'lg',
                    backdrop: '',
                    resolve: {
                        Order: function () {
                            return data;
                        },
                    }
                });
                modalInstance.result.then(function (item) {
                    if (item.msg == 'ECRPayment') {
                        //$scope.LoadStoreTablePlans();
                    }
                    if (item.msg == 'OtherPayment') {
                        if (item.ReqOrderAmount <= 0) {
                            //$scope.LoadStoreTablePlans();
                        }
                    }
                    $scope.ShowObject = true;
                })
            }, function (response) {
                $scope.ShowObject = true;
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.changeSlectedtable = function (item) {
        $scope.selectedOrder.StoreTableID = item.id
        Restangular.restangularizeElement('', $scope.selectedOrder, 'order');
        if ($scope.selectedOrder.restangularized && $scope.selectedOrder.id) {
            $scope.selectedOrder.put().then(function (resp) {
                //$scope.LoadStoreTablePlans();
                item['Selected'] = false;
            });
        }
    };
    $scope.changeTable = function (item) {
        if (item.orders && item.orders.length > 0 && item.Selected == true) {
            $scope.selectedOrder = '';
            item.Selected = false;
            return item;
        }
        if (item.orders && item.orders.length > 0) {
            $scope.selectedOrder = item.orders[0];
            item['Selected'] = true;
        } else {
            if ($scope.selectedOrder) {
                $scope.changeSlectedtable(item);
            }
        }
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("tablePlanCtrl");
        OrderRefresh();
        OrderUpdated();
        SignalrReConnected();
        $element.remove();
    });
};
app.controller('SelectPersoncountCtrl', SelectPersoncountCtrl);
function SelectPersoncountCtrl($scope, $modalInstance, $rootScope, Restangular, $modal, tableID, $translate, SweetAlert, toaster, $window) {
    $rootScope.uService.EnterController("SelectPersoncountCtrl");
    $scope.isWaiting = true;
    $scope.Departments = [];
    $scope.PersonCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.dbClick = function () {
        //$scope.isWaiting = false;
    };
    $scope.AddPersonCount = function () {
        if ($scope.PersonCount.length < 30) {
            $scope.PersonCount.push($scope.PersonCount.length + 1);
        }
    };
    $scope.GetDepartments = function () {
        Restangular.all('department').getList({
            pageNo: 1,
            pageSize: 1000,
            //search: "Completed=0"/TODO MemberID
        }).then(function (result) {
            angular.copy(result, $scope.Departments);
        }, function (response) {
            return null;
        });
    };
    //$scope.GetDepartments();
    $scope.GetDepartment = function () {
        if ($rootScope.user.UserRole && $rootScope.user.UserRole.OrderSource && $rootScope.user.UserRole.OrderSource.Department) {
            return $rootScope.user.UserRole.OrderSource.Department;
        }
        else {
            $scope.GetDepartments();
            if (!$scope.Departments || $scope.Departments.length == 0) {
                //sweet lalr
            }
            if ($scope.Departments.length == 1) {
                $rootScope.user.UserRole.OrderSource.Department = $scope.Departments[0];
            }
            else {
                var modalInstance = $modal.open({
                    templateUrl: 'assets/views/order/selectdepartment.html',
                    controller: 'selectdepartmentCtrl',
                    size: '',
                    backdrop: '',
                    resolve: {
                    }
                });
                modalInstance.result.then(function (item) {
                    return $rootScope.user.UserRole.OrderSource.Department;
                },
                    function (resp) {
                        toaster.pop('error', $translate.instant('orderfile.NoDepartment'), "error");
                    });
            }
        }
    };
    $scope.InsotreOrder = function (PersonCount) {
        if ($scope.isWaiting == true) {
            $scope.isWaiting = false;
            var data = $scope.GetDepartment();
            if (data != null) {
                var order = {
                    StoreTableID: tableID,
                    persons: [],
                    OrderTypeID: 0,
                    StoreID: $rootScope.user.StoreID,
                    DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id
                }
                for (var i = 0; i < PersonCount; i++) {
                    var orderperson = { PersonIndex: i + 1 }
                    order.persons.push(orderperson);
                }
                Restangular.restangularizeElement('', order, 'order');
                order.post().then(function (resp) {
                    location.href = '#/app/orders/orderStoreTable/' + resp.id;
                    $scope.ok('Yes');
                },
                    function (resp) {
                        $scope.isWaiting = true;
                        toaster.pop('error', resp.data.ExceptionMessage, $translate.instant('margeaddress.FailedtoCreateNewOrder'));
                    });
            } else {
                //TODO Swet Alert
            }
        }
    };
    $scope.ok = function () {
        $modalInstance.close();
        $scope.isWaiting = true;
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("SelectPersoncountCtrl");

    });
};
app.directive('ngPosition', ngPosition);
function ngPosition($document, $window) {
    function makePosition(scope, element, attr) {
        for (var i = 0; i < scope.tableplans.length; i++) {
            for (var j = 0; j < scope.tableplans[i].tables.length; j++) {
                if (scope.tableplans[i].tables[j].id == attr.id) {
                    scope.x = scope.tableplans[i].tables[j].LocationX;
                    scope.y = scope.tableplans[i].tables[j].LocationY;
                }
            }
        }
        element.css({
            position: 'fixed',
            cursor: 'pointer',
            top: scope.y + 'px',
            left: scope.x + 'px',
        });
    }
    return {
        link: makePosition,
    }
};
app.directive('clickAndDisable', function () {
    return {
        scope: {
            clickAndDisable: '&'
        },
        link: function (scope, iElement, iAttrs) {
            iElement.bind('click', function () {
                iElement.prop('disabled', true);
                scope.clickAndDisable().finally(function () {
                    iElement.prop('disabled', false);
                })
            });
        }
    };
});