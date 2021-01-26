app.controller('splitaccountCtrl', splitaccountCtrl);
function splitaccountCtrl($rootScope, $scope, $log, $modal, $filter, $modalInstance, Order, Restangular, ngTableParams, SweetAlert, toaster, $window, $location, $translate, ngnotifyService) {
    $rootScope.uService.EnterController("splitaccountCtrl");
    $scope.order = Order;
    $scope.storepaymenttypes = [];
    $scope.currentPayment = {};
    $scope.getProduct = function () {
        if (Order.items) {
            for (var i = 0; i < Order.items.length; i++) {
                var itemAmount = 0;
                if (Order.items[i].items) {
                    for (var j = 0; j < Order.items[i].items.length; j++) {
                        if (Order.items[i].items[j].items) {
                            for (var k = 0; k < Order.items[i].items[j].items.length; k++) {
                                itemAmount += Order.items[i].items[j].items[k].Amount;
                            }
                        }
                        itemAmount += Order.items[i].items[j].Amount;
                    }
                }
                Order.items[i].Amount += itemAmount;
            }
        }
        $scope.order = Order
    };
    $scope.getProduct();
    $scope.GetPaymentTypes = function () {
        Restangular.all('storepaymenttype').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "StoreID='" + $scope.order.StoreID + "'",
        }).then(function (result) {
            $scope.storepaymenttypes = result;
            var pt = $filter('filter')(result, { id: $scope.order.PaymentTypeID });
            if (pt && pt.length > 0) {
                $scope.currentPayment.PaymentTypeID = pt[0].PaymentTypeID;
            }
            else {
                $scope.currentPayment.PaymentTypeID = result[0].PaymentTypeID;
            }
        }, function (response) {
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.GetPaymentTypes();
    $scope.selectPerson = function (item) {
        for (var i = 0; i < $scope.order.persons.length; i++) {
            if ($scope.order.persons[i].id == item.id) {
                $scope.selectedPersonID = item.id;
                for (var l = 0; l < $scope.order.payments.length; l++) {
                    if ($scope.order.persons[i].id == $scope.order.payments[l].OrderPersonID) {
                        $scope.selectedPersonID = null;
                        toaster.pop('warning', $translate.instant('margeaddress.SelectedPersonPaymentUnrealizable'), "warning");
                        return;
                    }
                }
            }
        }
    };
    $scope.setProductPerson = function (items) {
        if ($scope.selectedPersonID) {
            items.OrderPersonID = $scope.selectedPersonID
            Restangular.restangularizeElement('', items, 'orderitem');
            items.put().then(function (resp) {
                $scope.calculatePersonAcount();
                $scope.controlPersonAccount();
            });
        }
    };
    $scope.deleteProductItem = function (items) {
        if (items) {
            items.OrderPersonID = $scope.order.persons[0].id;
            Restangular.restangularizeElement('', items, 'orderitem');
            items.put().then(function (resp) {
                $scope.calculatePersonAcount();
                $scope.controlPersonAccount();
            });
        }
    };
    $scope.controlPersonAccount = function () {
        for (var j = 0; j < $scope.order.items.length; j++) {
            for (var l = 0; l < $scope.order.payments.length; l++) {
                if ($scope.order.items[j].OrderPersonID == $scope.order.payments[l].OrderPersonID) {
                    $scope.order.items[j]['select'] = false;
                }
            }
        }
    };
    $scope.controlPersonAccount();
    $scope.calculatePersonAcount = function () {
        for (var j = 0; j < $scope.order.persons.length; j++) {
            $scope.order.persons[j]['TotalAmount'] = 0;
            for (var i = 0; i < $scope.order.items.length; i++) {
                if ($scope.order.items[i].OrderPersonID == $scope.order.persons[j].id) {
                    $scope.order.persons[j]['TotalAmount'] += $scope.order.items[i].Amount;
                }
            }
        }
    };
    $scope.calculatePersonAcount();
    $scope.savePayment = function (paymentype) {
        if ($scope.selectedPersonID) {
            var person = $filter('filter')($scope.order.persons, { id: $scope.selectedPersonID });
        } else {
            toaster.pop('warning', $translate.instant('margeaddress.PleaseSelectPerson'), "warning");
        }
        if (person[0].TotalAmount == 0) {
            toaster.pop('error',$translate.instant('margeaddress.PayableAmount'), "error");
        } else {
            var data = { PaymentTypeID: paymentype.id, OrderID: $scope.order.id, Amount: person[0].TotalAmount, OrderPersonID: person[0].id, PaymentDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'), }
            Restangular.restangularizeElement('', data, 'orderpayment');
            data.post().then(function (resp) {
                $scope.order.payments.push(resp);
                $scope.controlPersonAccount();
                toaster.pop("success", $translate.instant('orderfile.PAYMENTSAVED'));
                $scope.Recalc('OK');
            }, function (resp) {
                toaster.pop('error', $translate.instant('orderfile.NEWPAYMENTNOTSAVED'), resp.data.ExceptionMessage);
            });
        }
    };
    $scope.Recalc = function () {
        var total = 0;
        for (var i = 0; i < $scope.order.payments.length; i++) {
            total += $scope.order.payments[i].Amount;
        }
        if ($scope.order.Amount == total)
            $scope.ok('OK');
    };
    $scope.addNewPerson = function () {
        var items = { OrderID: $scope.order.id, PersonIndex: $scope.order.persons.length + 1 }
        Restangular.restangularizeElement('', items, 'orderperson');
        items.post().then(function (resp) {
            $scope.order.persons.push(resp.plain());
        }, function (resp) { });
    };
    $scope.BottonDblcilik = function () { };
    $scope.ok = function (msg) {
        $modalInstance.close(msg);
    };
    $scope.cancel = function () {
        $modalInstance.close('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("splitaccountCtrl");
    });
};
app.controller('AccordionDemoCtrl', AccordionDemoCtrl);
function AccordionDemoCtrl($rootScope, $scope) {
    $rootScope.uService.EnterController("townCtrl");
    $scope.oneAtATime = true;
    $scope.groups = [{
        title: 'Dynamic Group Header - 1',
        content: 'Dynamic Group Body - 1'
    }, {
        title: 'Dynamic Group Header - 2',
        content: 'Dynamic Group Body - 2'
    }];
    $scope.items = ['Item 1', 'Item 2', 'Item 3'];
    $scope.addItem = function () {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };
    $scope.status = {
        isFirstOpen: false,
        isFirstDisabled: false
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("splitaccountCtrl");
    });
};
