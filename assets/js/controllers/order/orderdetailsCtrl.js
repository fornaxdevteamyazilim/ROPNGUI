﻿app.controller('orderdetailsCtrl', orderdetailsCtrl);
function orderdetailsCtrl($scope, $rootScope, $log, $modal, $interval, $filter, Restangular, $stateParams, ngTableParams, SweetAlert, toaster, $window, $location, userService, ngnotifyService, $element, $translate) {
    $rootScope.uService.EnterController("orderdetailsCtrl");
    userService.userAuthorizated();
    $scope.StoreData = {};
    if ($rootScope.user.UserRole.Name == 'Alonet') {
        $scope.buttonpanel = false;
    } else {
        $scope.ButtonPanel = true;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.userRestrictions = $rootScope.user.restrictions;
     $scope.translate = function (StoreOrderTypes) {
         $scope.orderdetails = $translate.instant('main.ORDERDETAILSS');
        $scope.ordernumber = $translate.instant('main.ORDERNUMBER');
        $scope.ordertype = $translate.instant('main.ORDERTYPE');
        $scope.orderno = $translate.instant('main.ORDERNO');
        $scope.back = $translate.instant('main.BACK');
        $scope.ordersource = $translate.instant('main.ORDERSOURCE');
        $scope.personname = $translate.instant('main.PERSONNAME');
        $scope.address = $translate.instant('main.ADDRESS');
        $scope.personnote = $translate.instant('main.PERSONNOTE');
        $scope.companyname = $translate.instant('main.COMPANYNAME');
        $scope.amount = $translate.instant('main.AMOUNT');
        $scope.orderstate = $translate.instant('main.ORDERSTATE');
        $scope.paymenttype = $translate.instant('main.PAYMENTTYPE');
        $scope.paymentstatus = $translate.instant('main.PAYMENTSTATUS');
        $scope.paymentnote = $translate.instant('main.PAYMENTNOTE');
        $scope.ordernote = $translate.instant('main.ORDERNOTE');
        $scope.orderdate = $translate.instant('main.ORDERDATE');
        $scope.deliverydate = $translate.instant('main.DELIVERYDATE');
        $scope.agent = $translate.instant('main.AGENT');
        $scope.reprint = $translate.instant('main.REPRINT');
         $scope.changetoorder = $translate.instant('main.CHANGETOORDER');
         $scope.sendtofiyuu = $translate.instant('main.SENDTOFIYUU');
         $scope.sendgifpromotions = $translate.instant('main.SENDGIFTPROMOTIONS');
        $scope.canceltoorder = $translate.instant('main.CANCELTOORDER');
        $scope.addpromotion = $translate.instant('main.ADDPROMOTION');
        $scope.deleteysmaping = $translate.instant('main.DELETEYSMAPING');
        $scope.acceptorder = $translate.instant('main.ACCEPTORDER');
        $scope.refreshorder = $translate.instant('main.REFRESHORDER');
        $scope.changetopaymenttype = $translate.instant('main.CHANGETOPAYMENTTYPE');
        $scope.refuseorder = $translate.instant('main.REFUSEDORDER');
         $scope.chooseorderstate = $translate.instant('main.CHOOSEORDERSTATE');
         $scope.sendordertofiyuu = $translate.instant('main.SENDORDERTOFIYUU');
        $scope.reverttoprevstate = $translate.instant('main.REVERTTOPREVSTATE');
        $scope.updateorderpaymentstatus = $translate.instant('main.UPDATEORDERPAYMENTSTATUS');
        $scope.updateorderstatusadmin = $translate.instant('main.UPDATEORDERSTATUSADMIN');
        $scope.updatecode = $translate.instant('main.UPDATECODE');
        $scope.orderitemdetails = $translate.instant('main.ORDERITEMDETAILS');
        $scope.satates = $translate.instant('main.SATATES');
        $scope.promotions = $translate.instant('main.PROMOTIONS');
        $scope.state = $translate.instant('main.STATE');
        $scope.time = $translate.instant('main.TIME');
        $scope.user = $translate.instant('main.USER');
        $scope.driver = $translate.instant('main.DRIVER');
        $scope.reason = $translate.instant('main.REASON');
        $scope.promotionname = $translate.instant('main.PROMOTIONNAME');
        $scope.promotioncode = $translate.instant('main.PROMOTIONCODE');
        $scope.payment = $translate.instant('main.PAYMENT');
        $scope.paymenttype = $translate.instant('main.PAYMENTTYPE');
        $scope.date = $translate.instant('main.DATE');
        $scope.amount = $translate.instant('main.AMOUNT');
        $scope.store = $translate.instant('main.STORE');
        $scope.storetype = $translate.instant('main.STORETYPE');
        $scope.storephone = $translate.instant('main.STOREPHONE');
        $scope.servicestime = $translate.instant('main.SERVICESTIME');
        $scope.storenote = $translate.instant('main.STORENOTE');
        $scope.storedetails = $translate.instant('main.STOREDETAILS');
        $scope.closeorderpayment = $translate.instant('main.CLOSEORDERPAYMENT');
        $scope.refreshorderamount = $translate.instant('main.REFRESHORDERAMOUNT');
        $scope.repeatorder = $translate.instant('main.REPEATORDER');
        $scope.isChargedd = $translate.instant('main.ISCHARGEDD');
        $scope.open = $translate.instant('main.OPEN');
         $scope.close = $translate.instant('main.CLOSE');
         $scope.efaturadetails = $translate.instant('main.EFATURADETAILS');
         $scope.invoiceid = $translate.instant('main.ORDERINVOICEID');
         $scope.phonenumber = $translate.instant('main.PHONENUMBER');
         $scope.taxnumber = $translate.instant('main.TAXNUMBER');
         $scope.taxoffice = $translate.instant('main.TAXOFFICE');
         $scope.title = $translate.instant('main.TITLE');
         $scope.duration = $translate.instant('main.DURATION');
         $scope.durationn = $translate.instant('main.DURATIONN');




    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectPromotions = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/selectPromotion.html',
            controller: 'orderpromotionsCtrl',
            size: '',
            backdrop: '',
            resolve: {
                Order: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (data) {
            if (data) {
                $scope.RefreshOrder($stateParams.id)
                $scope.getOrder();
            }
        })
    };
    $scope.RemovePromotion = function (OrderID) {
        Restangular.all("orderpromotion").getList({
            search: "OrderID='" + OrderID + "'"
        }).then(function (result) {
            $scope.DeletePromotion(result[0].id);
        },
      function (response) {
          toaster.pop('error', "Server Connection Error", response.data.ExceptionMessage);
      });
    };
    $scope.DeletePromotion = function (ID) {
        Restangular.one("orderpromotion", ID).remove().then(function () {
            toaster.pop("error", "Deleted.", "Promotion Deleted !");
            $scope.getOrder();
            $scope.RefreshOrder($stateParams.id)
        });
    };
    $scope.orders = [];
    $scope.getOrder = function () {
        if ($stateParams.id != 'new') {
            Restangular.one('order', $stateParams.id).get().then
                (function (restresult) {
                    $scope.item = Restangular.copy(restresult);
                    $scope.LoadOrderItems();
                    $scope.GetStore(restresult.StoreID)
                    for (var i = 0; i < restresult.states.length; i++) {
                        if (restresult.states[i].OrderStateID == 0)
                            if (restresult.states[i].User) {
                                $scope.User = restresult.states[i].User;
                            }
                    }
                },
               function (restresult) {
                   toaster.pop('warning', "It is cancelled !", restresult.data.ExceptionMessage);
               }
               )
        }
    };
    $scope.getOrder();    
    $scope.GetStore = function (StoreID) {
        Restangular.one('store', StoreID).get().then
             (function (restresult) {
                 angular.copy(restresult, $scope.StoreData);
             })
    };
    $scope.LoadOrderItems = function () {
        Restangular.all('orderitem').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "OrderID='" + $stateParams.id + "'"
        }).then(function (_orderItems) {
            $scope.orderItems = angular.copy(_orderItems);
        }, function (response) {
            toaster.pop('error', "Server Error", response.data.ExceptionMessage);;
        });
    };
    $scope.CopyOrder = function (order) {
        return {
            id: order.id,
            DepartmentID: order.DepartmentID,
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
        }
    };
    $scope.AwaitingCCAutorization = function (item) {
        if (item.OrderStateID == 20) {
            swal({
                title: "Are you sure you want to confirm the order ?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes !",
                closeOnConfirm: false
            }, function () {
                Restangular.one('order', item.id).get().then
               (function (restresult) {
                   var ordertosave = $scope.CopyOrder(restresult);
                   ordertosave.OrderStateID = 13;
                   Restangular.restangularizeElement('', ordertosave, 'order');
                   if (ordertosave.restangularized && ordertosave.id) {
                       ordertosave.put().then(function (resp) {
                           $scope.getOrder();
                           swal("Updated.", " Order Confirmed.", "success");
                       }, function (response) {
                           toaster.pop('error', "Server Error", response.data.ExceptionMessage);
                       });
                   }
               })
            });
        } else {
            toaster.pop('warning', "Order Cannot Be Changed !", "");
        }
    };
    $scope.RePrintOrder = function (OrderID) {
        Restangular.all('ordertools/PrintLabels').getList({
            OrderID: OrderID
        }).then(function (_orderItems) {
            toaster.pop('success', "Printed Again.");
        }, function (response) {
            toaster.pop('error', "Server Error", response);
        });
    };
    $scope.SendToFiyuu = function (OrderID) {
        Restangular.all('ordertools/sendToFiyuu').getList({
            OrderID: OrderID
        }).then(function (_orderItems) {
            toaster.pop('success', "Order Fiyuu transmission initiated.");
        }, function (response) {
            toaster.pop('error', "Server Error", response);
        });
    };
    $scope.Date = $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss dd-MM-yyyy')
    $scope.SendToFiyuu = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('ordertools/sendToFiyuu').get({
            OrderID: OrderID,
        }).then(function (result) {
            toaster.pop("success", "Transmitted to Fiyuu!");
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "Error!", response.data.Message);
            $scope.isSpinner = false;
        });
    }
    $scope.SendGiftPromotions = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('ordertools/sendgiftpromotioncodes').get({
            OrderID: OrderID,
        }).then(function (result) {
            toaster.pop("success", "Gift codes forwarded!");
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "Error!", response.data.Message);
            $scope.isSpinner = false;
        });
    }
    $scope.OrderChange = function (item) {
        if (item.PaymentStatusID == 0) {
            if (item.OrderStateID == 2) {
                if ($rootScope.user.restrictions && $rootScope.user.restrictions.changeorder == 'Enable') { //callcenter=false !callcenter=ture
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable') {
                        if (item.OrderTypeID == 0)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Masa Sipariş
                        if (item.OrderTypeID == 1 && !item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Gel-Al Sipariş (Hızlı Sipariş) 
                        if (item.OrderTypeID == 1 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Gel-Al Sipariş
                        if (item.OrderTypeID == 2 || item.OrderTypeID == 7)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Adrese Sipaiş
                        if (item.OrderTypeID == 4 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id;      //Personel Yemeği Sipariş
                    }
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + item.id;
                } else {
                    toaster.pop('warning', "Change Order Status !", "");
                }
            } else {
                if (item.OrderStateID == 5 && $rootScope.user.restrictions.changeorder == 'Enable') {
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable') {
                        if (item.OrderTypeID == 0)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Masa Sipariş
                        if (item.OrderTypeID == 1 && !item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Gel-Al Sipariş (Hızlı Sipariş) 
                        if (item.OrderTypeID == 1 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Gel-Al Sipariş
                        if (item.OrderTypeID == 2 || item.OrderTypeID == 7)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Adrese Sipaiş
                        if (item.OrderTypeID == 4 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id;      //Personel Yemeği Sipariş
                    }
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + item.id;
                }
                if (item.OrderStateID == 5 || item.OrderStateID == 6 || item.OrderStateID == 7 || item.OrderStateID == 10 || item.OrderStateID == 9 || item.OrderStateID == 8) {
                    if ($rootScope.user.restrictions.changeorder != 'Enable')
                        toaster.pop('warning', "Order Cannot Be Changed!", "");
                } else {
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable') {
                        if (item.OrderTypeID == 0)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Masa                              
                        if (item.OrderTypeID == 1 && !item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Gel-Al Sipariş (Hızlı Sipariş) 
                        if (item.OrderTypeID == 1 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Gel-Al Sipariş
                        if (item.OrderTypeID == 2 || item.OrderTypeID == 7)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Adrese Sipaiş
                        if (item.OrderTypeID == 4 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id;      //Personel Yemeği Sipariş
                    }
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + item.id;
                }
            }
        } else {
            toaster.pop('warning', "Order Cannot Be Changed!", "");
        }
    };
    $scope.UpdateOrderStatusAdmin = function (itemID) {
        SweetAlert.swal({
            title: "CANCEL ORDER !",
            text: "Are you sure you want to cancel the order ? ",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes , İptal Et !",
            cancelButtonText: "No, İptal Etme !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                Restangular.all('ordertools/updateorderstatus').getList(
            {
                OrderID: itemID,
                newSatus: 7,
                OrderReasonID: '100592257695',
                OrderNote: "Authorized User Canceled !"
            }
            ).then(function (result) {
                $scope.getOrder();
                toaster.pop('success', "Order Status Updated.", "");
            });
            }
        });
    };
    $scope.UpdateOrderStatus = function (item) {
        SweetAlert.swal({
            title: "CANCEL ORDER !",
            text: "Are you sure you want to cancel the order ? ",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes , İptal Et !",
            cancelButtonText: "No, İptal Etme !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                item.root = "orderdetail";
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
                    if (value == 'result') {
                        $scope.getOrder();
                    }
                })
            }
        });
    };
    $scope.UpdateOrderPaymentStatusChoose = function (OrderID) {
        Restangular.one("ordertools/updateorderpaymentstatus").get({
            OrderID: OrderID,
            newSatus: 1
        }).then(function () {
            toaster.pop('success', "Payment Of Order Closed.", "");
            $scope.getOrder();
        }, function (response) {
            toaster.pop('error', "Response", response.data.ExceptionMessage);
        });
    };
    $scope.RevertToPrevState = function (OrderID) {
        Restangular.one("ordertools/reverttoprevstate").get({
            OrderID: OrderID
        }).then(function () {
            toaster.pop('success', "Order Restored To Previous State.", "");
            $scope.getOrder();
        }, function (response) {
            toaster.pop('error', "Response", response.data.ExceptionMessage);
        });
    };
    $scope.RefreshOrder = function (OrderID) {
        Restangular.one("ordertools/RefreshOrder").get({
            OrderID: OrderID,
        }).then(function () {
            toaster.pop('success', "Order Amount Updated.", "");
            $scope.getOrder();
        }, function (response) {
            toaster.pop('error', "Response", response.data.ExceptionMessage);
        });
    };
    $scope.UpdateOrderStateChoose = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/changeorderstate2.html',
            controller: 'changeorderstate2Ctrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
        })
    };
    $scope.UpdateCode = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/updatecode.html',
            controller: 'updatecodeCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
        })
    };
    $scope.CheckCode = function (item, root) {
        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCBACKOFFICE") ||userService.userIsInRole("CCMANAGER")) {
            if (root == 'CancelOrder')
                $scope.UpdateOrderStatus(item)
        } else {
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
                            userService.stopTimeout();
                            if (root == 'ChangeOrderDriver')
                                $scope.ChangeOrderDriver(item)
                            if (root == 'OrderPaymentDeteails')
                                $scope.OrderPaymentDeteails(item)
                            if (root == 'ChangeOrderPayment')
                                $scope.ChangeOrderPayment(item)
                            if (root == 'CancelOrder')
                                $scope.UpdateOrderStatus(item)
                        }, function (err) {
                            if (err) {
                                toaster.pop('warrning', "Password Erroneous!", err.error_description);
                                return 'No'
                            }
                            else {
                                //toaster
                                $scope.message = "Unknown error";
                                return 'No'
                            }
                        });

                    }
                })
            } else {
                toaster.pop("warning", "YOU ARE NOT AUTHORIZED FOR THIS PROCEDURE. !");
                return 'No';
            }
        }
    };
    $scope.OrderPaymentDeteails = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/orderpayments.html',
            controller: 'orderpaymentCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                Order: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
            $scope.getOrder();
        })
    };
    $scope.ChangeOrderDriver = function (states) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/changeorderdriver.html',
            controller: 'changeorderdriverCtrl',
            size: '',
            backdrop: '',
            resolve: {
                OrderStates: function () {
                    return states;
                },
            }
        });
        modalInstance.result.then(function (item) {
            if (item == 'Yes') {
                if ($stateParams.id != 'new') {
                    Restangular.one('order', $stateParams.id).get().then
                        (function (restresult) {
                            angular.copy(restresult, $scope.orders);
                            angular.copy(restresult, $scope.item);
                            $scope.LoadOrderItems();
                            $scope.getOrder();
                        },
                       function (restresult) {
                           toaster.pop('warning', "Cancelled", restresult.data.ExceptionMessage);
                       }
                       )
                }
            }
        })
    };
    $scope.ChangeOrderPayment = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/orderpaymenttypes.html',
            controller: 'orderpaymenttypesCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
            if (item == 'OK') {
                $scope.LoadOrderItems();
                $scope.getOrder();
            }
        })
    };
    $scope.repeatOrder = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('ordertools/repeatorder').get({
            OrderID: OrderID,
            AddressID: '',
        }).then(function (result) {
            if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                location.href = '#/app/orders/orderStore/' + result.id;
            if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                location.href = '#/app/orders/order/' + result.id;
            toaster.pop("success", "Order Created.");
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "Hata!", response.data.ExceptionMessage);
            $scope.isSpinner = false;
        });
    };
    $scope.DeleteYSMaping = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('yemekSepetiCustomerMap/deletemap').get({
            OrderID: OrderID,
        }).then(function (result) {
            toaster.pop("success", "YS Order Customer Mapping Deleted!");
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "Hata!", response.data.Message);
            $scope.isSpinner = false;
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("orderdetailsCtrl");
    });
};