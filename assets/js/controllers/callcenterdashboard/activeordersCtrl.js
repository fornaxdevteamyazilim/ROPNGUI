app.controller('activeordersCtrl', activeordersCtrl);
function activeordersCtrl($rootScope, $scope, $log, $modal, $filter, $timeout, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, ngAudio, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("activeordersCtrl");
    var ao = this;
    var stopTime;
    $scope.audio = ngAudio.load('assets/sound/ringin.mp3');
    $scope.audio.volume = 0.8;
    $scope.orders = [];
    userService.userAuthorizated();
    $scope.translate = function () {
        $scope.trStoreName = $translate.instant('main.STORENAME');
        $scope.trAcitveOrders = $translate.instant('main.ACTIVEORDERS');
        $scope.trNewOrders = $translate.instant('main.NEWORDERS');
        $scope.trPreparingOrders = $translate.instant('main.PREPARINGORDERS');
        $scope.trPreparedOrders = $translate.instant('main.PREPAREDORDERS');
        $scope.trOutOrders = $translate.instant('main.OUTORDERS');
        $scope.trAwaitingOrders = $translate.instant('main.AWAITINGORDERS');
        $scope.trDelayed = $translate.instant('main.DELAYED');
        $scope.trARefused = $translate.instant('main.REFUSED');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trOrderNumber = $translate.instant('main.ORDERNUMBER');
        $scope.trPersonName = $translate.instant('main.PERSONNAME');
        $scope.trOrderState = $translate.instant('main.ORDERSTATE');
        $scope.trOrderDate = $translate.instant('main.ORDERDATE');
        $scope.trDeliveryDate = $translate.instant('main.DELIVERYDATE');
        $scope.trAttention = $translate.instant('main.ATTENTION');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.StoreEdit = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/callcenterdashboard/changestoredata.html',
            controller: 'changestoredataCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function () {
        })
    };
    $scope.ChangeStore = function (item) {
        //if (item.OrderStateID == 14) {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/callcenterdashboard/changeorderstore.html',
                controller: 'changeorderstoreCtrl',
                size: '',
                backdrop: '',
                resolve: {
                    item: function () {
                        return item;
                    },
                }
            });
            modalInstance.result.then(function () {
            })
        //} else {
          //  toaster.pop('warning', "SİPARİŞ DEĞİŞTİRİLEMEZ !");
    //    }
    };

    $scope.SelectItem = function (data, Store) {
        //$scope.orders = null;
        $scope.Store = Store.name;
        Restangular.all('order').getList({
            pageNo: 1,
            pageSize: 1000,
            search: $scope.BuildSearchString(data, Store),
        }).then(function (result) {
            angular.copy(result, $scope.orders);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
        // location.href = '#/app/callcenterdashboard/activeorders/orderdetails/' + Store.id;
    };
    $scope.OrderDetails = function (id) {
        location.href = '#/app/orders/orderDetail/' + id;
    };
    $scope.translate();
    $scope.item = {};
    ao.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            OrderDate: 'descending'
        }
    },
     {
         getData: function ($defer, params) {
             Restangular.all('activeorders/strorelist').getList({
                 pageNo: params.page(),
                 pageSize: params.count(),
             }).then(function (items) {
                 params.total(items.paging);
                 $defer.resolve(items);
                 var AlarmCount = 0;
                 for (var i = 0; i < items.length; i++) {
                     AlarmCount += items[i].AlertActive;
                 }
                 $scope.audio.muting = !(AlarmCount > 0);
                 if (AlarmCount > 0)
                     $scope.audio.play();
                 else
                     $scope.audio.pause();
             }, function (response) {
                 toaster.pop('error', $translate.instant('Server.ServerError'), response);
                 SweetAlert.swal($translate.instant('Server.ServerError'), angular.toJson(response, false), "error");
             });
         }
     });
    $scope.BuildSearchString = function (data, Store) {
        $scope.ShowChangeButton = false;
        $scope.ShowProsesingButton = false;
        $scope.ShowSendAgenButton = false;
        if (data == 131920) {
            $scope.isChangeButtonShow(true);
            $scope.isProsesingButtonShow(true);
        }
        if (data == 14) {
            $scope.isProsesingButtonShow(true);
            $scope.isChangeButtonShow(true);
        }
        if (data == 4) {
            $scope.isSendAgenButtonShow(true);
        }
        var result = [];
        var date = $filter('date')(ngnotifyService.ServerTime(), 'HH');
        if (date > 9) {
            $scope.OrderDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
            result.push("OrderDate >'" + $scope.OrderDate + "'");
        } else {
            var now = moment().subtract(1, 'days');
            var filterdate = moment(now).format('YYYY-MM-DD');
            //var filterdate = parseInt($filter('date')(new Date(now), 'yyyy-MM-dd'));
            result.push("OrderDate >'" + filterdate + "'");
        }
        if (Store && Store.id) {
            result.push("StoreID='" + Store.id + "'");
        }
        if (data && data == 131920) {
            result.push("OrderStateID in (13,19,20)");
        }
        else {
            if (data && data != 'all') {
                result.push("OrderStateID='" + data + "'");
            }
        }
        if (data && data == 'all') {
            result.push("OrderStateID in (1,2,3,4,5,6,13,19,20)");
        }
        result.push("OrderTypeID in (1,2,5,7)");
        return result;
    };

    $scope.GetOrdes = function (data, Store) {
        $scope.Store = Store.name;
        Restangular.all('order').getList({
            pageNo: 1,
            pageSize: 1000,
            search: $scope.BuildSearchString(data, Store),
            //search:"OrderStateID='" + data + "'and StoreID='" + Store.id + "'and OrderDate'"+ $scope.OrderDate+"'",
        }).then(function (result) {
            angular.copy(result, $scope.orders);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.RefreshData = function () {
        ao.tableParams.reload();
        $scope.start();
    };
    $scope.start = function () {
        $scope.stop();
        stopTime = $timeout(function () { $scope.RefreshData(); }, 10000);
        $scope.nowTime = $filter('date')(ngnotifyService.ServerTime(), 'dd-MM-yyyy HH:mm');
        //stopTime = $interval($scope.RefreshData, 10000);
    };
    $scope.isChangeButtonShow = function (value) {
        if (userService.isAdmin() || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCBACKOFFICE")) {
            $scope.ShowChangeButton = value;
        }
    };
    $scope.isProsesingButtonShow = function (value) {
        if (userService.isAdmin() || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCBACKOFFICE")) {
            $scope.ShowProsesingButton = value;
        }
    };
    $scope.isSendAgenButtonShow = function (value) {
        if (userService.isAdmin() || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CALLCENTER")  || userService.userIsInRole("CCBACKOFFICE"))  {
            $scope.ShowSendAgenButton = value;
        }
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
    $scope.ChangeOrderState = function (OrderID, data) {
        if (userService.isAdmin() || userService.userIsInRole("CCMANAGER")  || userService.userIsInRole("CALLCENTER")  || userService.userIsInRole("CCBACKOFFICE") ) {
            swal({
                title: $translate.instant('accounting.PreparingChanging'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $translate.instant('accounting.confirmButtonText'),
                closeOnConfirm: false
            }, function () {
                Restangular.one('order', OrderID).get().then
               (function (restresult) {
                   var ordertosave = $scope.CopyOrder(restresult);
                   if (data == 4) {
                       ordertosave.OrderStateID = 4;
                   }
                   if (data == 13) {
                       ordertosave.OrderStateID = 13;
                   }
                   Restangular.restangularizeElement('', ordertosave, 'order');
                   if (ordertosave.restangularized && ordertosave.id) {
                       ordertosave.put().then(function (resp) {
                           swal($translate.instant('accounting.Updated'), $translate.instant('accounting.OrderStatus'), "success");
                           // toaster.pop('success', "Güncellendi");
                       }, function (response) {
                           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                       });
                   }
               })
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
            //$scope.isButtonShow(false);
        }
    };
    $scope.stop = function () {
        $timeout.cancel(stopTime);
    };
    $scope.$on('$destroy', function () {
        $scope.audio.pause();
        $scope.stop();
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("activeordersCtrl");
    });
    $scope.start();
};