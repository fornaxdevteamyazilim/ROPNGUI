app.controller('staffpaymentsCtrl', staffpaymentsCtrl);
function staffpaymentsCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $timeout, $location, $translate, $filter, userService, ngnotifyService, $element) {
    var sp = this;
    $rootScope.uService.EnterController("staffpaymentsCtrl");
    userService.userAuthorizated();
    $scope.Time = ngnotifyService.ServerTime();
    $scope.translate = function () {
        $scope.staffname = $translate.instant('main.STAFFNAME');
        $scope.closeallcount = $translate.instant('main.CLOSEALLACOUNT');
        $scope.ordernumber = $translate.instant('main.ORDERNUMBER');
        $scope.paymenttype = $translate.instant('main.PAYMENTTYPE');
        $scope.amount = $translate.instant('main.AMOUNT');
        $scope.address = $translate.instant('main.ADDRESS');
        $scope.personname = $translate.instant('main.PERSONNAME');
        $scope.phonenumber = $translate.instant('main.NUMBER');
        $scope.allpaymenttype = $translate.instant('main.ALLPAYMENTTYPE');
        $scope.totalamount = $translate.instant('main.TOTALAMOUNT');
        $scope.totalcount = $translate.instant('main.TOTALCOUNT');
        $scope.trPLEASEWAIT = $translate.instant('main.PLEASEWAIT');
        $scope.closeall = $translate.instant('main.CLOSEALL');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.goOrderDriverListReport = function (page) {
        $location.path(page);
    };
    var OrderRefresh = $scope.$on('OrderChange', function (event, data) {
        $scope.GetPayOff();
    });
    $scope.ShowObject = true;
    $scope.StaffPayments = [];
    $scope.GetPayOff = function () {
        Restangular.all('payoff').getList({
            StoreID: $rootScope.user.StoreID,
        }).then(function (result) {
            angular.copy(result.plain(), $scope.StaffPayments);
            $scope.$broadcast('$$rebind::refresh');
            $scope.ShowObject = false;
        }, function (response) {
            toaster.pop('error', "Sunucu Hatası", response.data.ExceptionMessage);
        });
    };
    $scope.GetPayOff();
    $scope.UpdateOrderPaymentType = function (item) {
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'assets/views/order/updateorderpaymenttype.html',
            controller: 'updateorderpaymenttypeCtrl',
            size: '',
            backdrop: '',
            windowClass: 'no-animation-modal',
            resolve: {
                Orderid: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.GetPayOff();
        })
    };
    $scope.IsCharged = function (OrderID, index, driver) {
        driver.orders.splice(index, 1);
        Restangular.one('ordertools/updateorderascharged').get({ OrderID: OrderID }).then
            (function (restresult) {
                toaster.pop("success", "HESAP KAPATIILDI.");
            }, function (restresult) {
                $scope.GetPayOff();
                toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
            })
    };
    $scope.CloseAcount = function (item, index, driver) {
        if (item && item.PaymentTypeID && $scope.isWaiting != true) {
            var a = driver.orders.indexOf(item);
            var b = driver.orders.indexOf(index);
            $scope.isWaiting = true;
            if (item.PaymentStatusID == 1) {
                driver.orders.splice(driver.orders.indexOf(item), 1);
                Restangular.one('ordertools/updateorderascharged').get({ OrderID: item.id }).then
                    (function (restresult) {
                        toaster.pop('success', "ÖDEME ALINDI.");
                        $scope.Showspinner = false;
                        $scope.isWaiting = false;
                    },
                    function (restresult) {
                        toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
                        $scope.Showspinner = false;
                        $scope.isWaiting = false;
                    })
            } else {
                driver.orders.splice(driver.orders.indexOf(item), 1);
                var payment = {
                    Amount: item.Amount,
                    OrderID: item.id,
                    PaymentDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                    PaymentTypeID: item.PaymentTypeID
                };
                Restangular.restangularizeElement('', payment, 'orderpayment');
                payment.post().then(function (resp) {
                    Restangular.one('ordertools/updateorderascharged').get({ OrderID: resp.OrderID }).then
                        (function (restresult) {
                            toaster.pop("success", "HESAP KAPATILDI.");
                            $scope.isWaiting = false;
                            $scope.GetPayOff();
                        }, function (restresult) {
                            toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
                            $scope.isWaiting = false;
                            $scope.GetPayOff();
                        })
                }, function (resp) {
                    $scope.GetPayOff();
                    toaster.pop('error', "YENİ ÖDEME KAYDEDİLMEDİ !", resp.data.ExceptionMessage);
                    $scope.isWaiting = false
                });
            }
        }
    };
    $scope.CloseSameTypeAcounts = function (item, Payment) {

        if ($rootScope.user.restrictions.authorized == "Enable") {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/mainscreen/loginpassword.html',
                controller: 'loginpasswordCtrl',
                size: '',
                backdrop: '',
            });
            $scope.Showspinner = true;
            modalInstance.result.then(function (password) {
                if (password != "cancel") {
                    userService.cardLogin(password,true).then(function (response) {
                        swal({
                            title: "'" + Payment.name + "'  Hesapların Hepsi Kapatılacak !",
                            text: "Bu İşlemi Onaylıyor musunuz ?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Evet",
                            cancelButtonText: "Hayır",
                            closeOnConfirm: true
                        }, function () {
                            for (var i = 0; i < item.length; i++) {
                                if (item[i].PaymentType.PaymentTypeID == Payment.id) {
                                    if (item[i].PaymentStatusID == 1) {
                                        Restangular.one('ordertools/updateorderascharged').get({ OrderID: item[i].id }).then
                                            (function (restresult) {
                                                toaster.pop('success', "ÖDEME ALINDI.");
                                            }, function (restresult) {
                                                toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
                                            })
                                    } else {
                                        var payment = {
                                            Amount: item[i].Amount,
                                            OrderID: item[i].id,
                                            PaymentDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                                            PaymentTypeID: item[i].PaymentTypeID
                                        };
                                        Restangular.restangularizeElement('', payment, 'orderpayment');
                                        payment.post().then(function (resp) {
                                            toaster.pop("success", "'" + Payment.name + "HESAPLARIN HEPSİ KAPATILDI.");
                                            Restangular.one('ordertools/updateorderascharged').get({ OrderID: resp.OrderID }).then
                                                (function (restresult) {
                                                    toaster.pop('success', "ÖDEME ALINDI.");
                                                }, function (restresult) {
                                                    toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
                                                })
                                        }, function (resp) {
                                            toaster.pop('error', "YENİ ÖDEME KAYDEDİLMEDİ !", resp.data.ExceptionMessage);
                                        });
                                    }
                                }
                            }
                            $scope.Showspinner = false;
                            $scope.GetPayOff();
                        });
                    }, function (err) {
                        if (err) {
                            toaster.pop('warning', "Şifre Yanlış!", err.error_description);
                            $scope.Showspinner = false;
                            return 'No';
                        }
                        else {
                            $scope.message = "Unknown error";
                            $scope.Showspinner = false;
                            return 'No';
                        }
                    });
                }
            })
        } else {
            toaster.pop("warning", "BU İŞLEM İÇİN GEREKLİ YETKİNİZ BULUNMAMAKTADIR !");
            $scope.Showspinner = false;
            return 'No';
        }
    };
    $scope.CloseAllAccounts = function (item, Driver) {
        $scope.Showspinner = true;
        if ($rootScope.user.restrictions.authorized == "Enable") {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/mainscreen/loginpassword.html',
                controller: 'loginpasswordCtrl',
                size: '',
                backdrop: '',
            });
            modalInstance.result.then(function (password) {
                if (password != "cancel") {
                    userService.cardLogin(password,true).then(function (response) {
                        swal({
                            title: "'" + Driver + "' Tüm Hesabi Kapatılacak !",
                            text: "Bu İşlemi Onaylıyor musunuz ?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Evet",
                            cancelButtonText: "Hayır",
                            closeOnConfirm: true
                        }, function () {
                            for (var i = 0; i < item.length; i++) {
                                if (item[i].PaymentStatusID == 1) {
                                    Restangular.one('ordertools/updateorderascharged').get({ OrderID: item[i].id }).then
                                        (function (restresult) {
                                            toaster.pop('success', "ÖDEME ALINDI.");
                                        }, function (restresult) {
                                            toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
                                        })
                                } else {
                                    var payment = {
                                        Amount: item[i].Amount,
                                        OrderID: item[i].id,
                                        PaymentDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                                        PaymentTypeID: item[i].PaymentTypeID
                                    };
                                    Restangular.restangularizeElement('', payment, 'orderpayment');
                                    payment.post().then(function (resp) {
                                        toaster.pop("success", "'" + Driver + "HESAPLARIN HEPSİ KAPATILDI.");
                                        Restangular.one('ordertools/updateorderascharged').get({ OrderID: resp.OrderID }).then
                                            (function (restresult) {
                                                toaster.pop('success', "ÖDEME ALINDI.");
                                            }, function (restresult) {
                                                toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
                                            })
                                    }, function (resp) {
                                        toaster.pop('error', "YENİ ÖDEME KAYDEDİLMEDİ !", resp.data.ExceptionMessage);
                                    });
                                }
                            }
                            $scope.Showspinner = false;
                            $scope.GetPayOff();
                        });
                    }, function (err) {
                        if (err) {
                            toaster.pop('warrning', "Şifre Yanlış!", err.error_description);
                            $scope.Showspinner = false;
                            return 'No';
                        }
                        else {
                            $scope.message = "Unknown error";
                            $scope.Showspinner = false;
                            return 'No';
                        }
                    });

                }
            })
        } else {
            toaster.pop("warning", "BU İŞLEM İÇİN GEREKLİ YETKİNİZ BULUNMAMAKTADIR !");
            $scope.Showspinner = false;
            return 'No';
        }
    };
    $scope.OrderPaymentDeteails = function (item) {
        $scope.Showspinner = true;
        if (item.PaymentStatusID == 1) {
            Restangular.one('ordertools/updateorderascharged').get({ OrderID: item.id }).then
                (function (restresult) {
                    toaster.pop('success', "ÖDEME ALINDI.");
                    $scope.Showspinner = false;
                },
                function (restresult) {
                    toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
                    $scope.Showspinner = false
                })
        } else {
            Restangular.all('orderperson').getList({
                pageNo: 1,
                pageSize: 1000,
                search: "OrderID='" + item.id + "'"
            }).then(function (result) {
                item.persons = [];
                item.persons.push(result[0]);
                var modalInstance = $modal.open({
                    templateUrl: 'assets/views/order/orderpayments.html',
                    controller: 'orderpaymentCtrl',
                    size: 'lg',
                    backdrop: '',
                    keyboard: false,
                    resolve: {
                        Order: function () {
                            return item;
                        },
                    }
                });
                modalInstance.result.then(function (data) {
                    if (data.msg == "OtherPayment" || data.msg == "ECRPayment") {
                        Restangular.one('ordertools/updateorderascharged').get({ OrderID: item.id }).then
                            (function (restresult) {
                                toaster.pop('success', "ÖDEME ALINDI.");
                                $scope.Showspinner = false;
                            },
                            function (restresult) {
                                toaster.pop('warning', "ÖDEME ALINAMADI !", restresult.data.ExceptionMessage);
                                $scope.Showspinner = false;
                            })
                    }
                    if (data == "cancel") {
                        $scope.Showspinner = false;
                    }
                })
            }, function (response) {
                toaster.pop('error', "Sunucu Hatası", response.data.ExceptionMessage);
                $scope.Showspinner = false;
            });
            $scope.GetPayOff();
        }
    };
    $scope.CheckCode = function (orderID, itemStates) {
        if ($rootScope.user.restrictions.authorized == "Enable") {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/mainscreen/loginpassword.html',
                controller: 'loginpasswordCtrl',
                size: '',
                backdrop: '',
            });
            modalInstance.result.then(function (password) {
                if (password != "cancel") {
                    userService.cardLogin(password, true).then(function (response) {
                        $scope.ChangeOrderDriver(orderID, itemStates)
                    }, function (err) {
                        if (err) {
                            toaster.pop('warrning', "Şifre Yanlış !", err.error_description);
                            return 'No'
                        }
                        else {
                            $scope.message = "Unknown error";
                            return 'No'
                        }
                    });

                }
            })
        } else {
            toaster.pop("warning", "BU İŞLEM İÇİN GEREKLİ YETKİNİZ BULUNMAMAKTADIR !");
            return 'No';
        }
    };
    $scope.ChangeOrderDriver = function (orderID, itemStates) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/changeorderdriver.html',
            controller: 'changeorderdriverCtrl',
            size: '',
            backdrop: '',
            resolve: {
                OrderStates: function () {
                    return itemStates;
                },
            }
        });
        modalInstance.result.then(function (item) {
            $scope.GetPayOff();
        })
    };
    $scope.SelectItem = function (itemID) {
        $location.path('app/orders/orderDetail/' + itemID);
    };
    $scope.$on('$destroy', function () {
        deregistration();
        OrderRefresh
        $element.remove();
        $rootScope.uService.ExitController("staffpaymentsCtrl");
    });

    $scope.Back = function () {
        $window.history.back();
    };
};