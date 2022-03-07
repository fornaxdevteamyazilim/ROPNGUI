app.controller('kds2Ctrl', kds2Ctrl);
function kds2Ctrl($rootScope, $scope, $log, $modal, $translate, $interval, $timeout, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $location, $filter, localStorageService, $translate, ngnotifyService, userService, ngAudio, $element, $localStorage) {
    $rootScope.uService.EnterController("kds2Ctrl");
    $scope.item = {};
    $scope.audio = ngAudio.load('assets/sound/ringin.mp3');
    $scope.audio.volume = 0.8;
    $scope.audio.pause();
    userService.userAuthorizated();
    $scope.inProgress = false;
    $scope.KDIndex = 0;
    $scope.$storage = $localStorage.$default({
        KDisplayIndex: 0
    });
    var stopTime;
    var kd = this;
    $scope.BottonDblcilik = function () { };
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
        $scope.fontselection = $translate.instant('main.FONTSELECTION');
        $scope.notes = $translate.instant('main.NOTES');
        $scope.ordernote = $translate.instant('main.ORDERSNOTE');
        $scope.kitchendisplayselection = $translate.instant('main.KITCHENDISPLAYSELECTION');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    //$rootScope.disableSessionTimeOut();
    var OrderRefresh = $scope.$on('OrderChange', function (event, data) {
        $scope.LoadOrderItemStates();
    });
    var KDSNotify = $scope.$on('KDSUpdate', function (event, data) {
        if (data.Beep)
        $scope.audio.play();
        $scope.LoadOrderItemStates();
    });
    var BumpBarData = $scope.$on('BumpBarData', function (event, data) {
        var sID = $scope.$storage.KDisplayIndex ? $scope.$storage.KDisplayIndex : 0;
        if (data.StationID == sID)
            $scope.ApplyBumpBarData(data);
    });
    $scope.ApplyBumpBarData = function (data) {
        var key = -1;
        switch (data.Data) {
            case "a": key = 0; break;
            case "b": key = 4; break;
            case "c": key = 1; break;
            case "d": key = 5; break;
            case "e": key = 2; break;
            case "f": key = 6; break;
            case "g": key = 3; break;
            case "h": key = 7; break;
            case "1": key = 0; break;
            case "2": key = 1; break;
            case "3": key = 2; break;
            case "4": key = 3; break;
            case "5": key = 4; break;
            case "6": key = 5; break;
            case "7": key = 6; break;
            case "8": key = 7; break;
            case "9": key = 8; break;
            case "0": key = 9; break;
            default: key = -1;
        }
        if (key => 0)
            $scope.RemoveItem($scope.orderitemstates[key].OrderID, key);
    };
    var interval = $interval(function () {
        $scope.UpdateOrderItemStatesTimers($scope.orderitemstates);
    }, 1000);
    $scope.orderitemstates = [];
    $scope.LoadOrderItemStates = function () {
        if ($scope.inProgress) return;
        $scope.inProgress = true;
        Restangular.all('kds/getitems').getList({
            StoreID: $rootScope.user.StoreID,
            OrderStateID: 4,
            KDisplayIndex: $scope.$storage.KDisplayIndex ? $scope.$storage.KDisplayIndex : 0
        }).then(function (result) {
            // if (result.length > 0)
            //     $scope.audio.play();
            // else
            //     $scope.audio.pause();
             $scope.inProgress = false;
            $scope.orderitemstates = $scope.UpdateOrderItemStatesTimers(result.plain());
            $scope.$broadcast('$$rebind::refresh');
        }, function (response) {
            $scope.inProgress = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadOrderItemStates();
    $scope.UpdateOrderItemStatesTimers = function (items) {
        if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
                if (!items[i].data) {
                    items[i].Timer = Math.round(moment.duration((moment(ngnotifyService.ServerTime())).diff(moment(items[i].FirstOrderItemStateDate))).asSeconds() - items[i].TotalDuration);
                    items[i].data = items[i].Timer;
                }
                items[i].Timer++;
                items[i].isTimedOut = items[i].Timer < 0;
                items[i].TimerStr = items[i].Timer;
            }
            return items;
        }
    };
    //$scope.RemoveItem = function (OrderID, index, AutoPrint) {
    //    $scope.orderitemstates.splice(index, 1);
    //    $scope.$broadcast('$$rebind::refresh');
    //    if ($scope.WaitForResult == true) {
    //        toaster.pop("warning", "Lütfen Bekleyin !", "Please Click Again!");
    //    }
    //    else {
    //        if (!AutoPrint) {  //if (!AutoPrint) olmalı
    //            SweetAlert.swal({
    //                title: "TOPLU ETİKET YAZDIRMA",
    //                text: "Etiketi Yazdırmak İstiyor musunuz ?",
    //                type: "warning",
    //                showCancelButton: true,
    //                confirmButtonColor: "#DD6B55",
    //                confirmButtonText: "Evet, Yazdır !",
    //                cancelButtonText: "Hayır, Yazdırma !",
    //                closeOnConfirm: true,
    //                closeOnCancel: true
    //            }, function (isConfirm) {
    //                $scope.updateOrder(OrderID, isConfirm);
    //            });
    //        }
    //        else {
    //            $scope.updateOrder(OrderID, true);
    //        }
    //    }
    //};
    //$scope.updateOrder = function (OrderID,autoPrint) {
    //    Restangular.one('kds/updateorder').get({
    //        OrderID: OrderID,
    //        AutoPrint: autoPrint
    //    }).then(function (restresult) {
    //        toaster.pop("success", "Hazır.", "Item prepared!");
    //    }, function (restresult) {
    //        $scope.WaitForResult = false;
    //        toaster.pop('error', "Güncelleme başarısız !", restresult.data.ExceptionMessage);
    //    })
    //};

    $scope.RemoveItem = function (OrderID, index) {
        $scope.orderitemstates.splice(index, 1);
        $scope.$broadcast('$$rebind::refresh');
        if ($scope.WaitForResult == true) {
            toaster.pop("warning", $translate.instant('kitchendisplayf.PleaseWait'), $translate.instant('kitchendisplayf.PleaseClickAgain'));
        }
        else {
            var data = $scope.updateOrder(OrderID);
        }
    };
    $scope.updateOrder = function (OrderID) {
        Restangular.one('kds/updateorder').get({
            OrderID: OrderID,
            AutoPrint: false,
            KDisplayIndex: $scope.$storage.KDisplayIndex ? $scope.$storage.KDisplayIndex : 0
        }).then(function (restresult) {
            toaster.pop("success", $translate.instant('kitchendisplayf.Prepared'), $translate.instant('kitchendisplayf.Itemprepared'));
            $scope.LoadOrderItemStates();
        }, function (restresult) {
            $scope.WaitForResult = false;
            toaster.pop('error', $translate.instant('kitchendisplayf.Updatefailed'), restresult.data.ExceptionMessage);
            $scope.LoadOrderItemStates();
        })
    };
    $scope.setLocalStoregFont = function (data) {
        localStorageService.set('FontSize', data)
    };
    $scope.gettLocalStoregFont = function () {
        var data = localStorageService.get('FontSize');
        $scope.ngstyle = (data) ? data : '';
    };
    $scope.gettLocalStoregFont();
    $scope.Change = function (data) {
        $scope.ngstyle = data;
        $scope.setLocalStoregFont(data)
    };
    $scope.getLastOrders = function (addressID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/kitchenDisplay/kdslastorders.html',
            controller: 'kdslastordersCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
            }
        });
        modalInstance.result.then(function () {
        })
    };
    var clockStop;
    $scope.FormatClock = function (val) {
        return $filter('date')(val, 'HH:mm:ss');
    };
    $scope.GoToClockIn = function () {
        $location.path('/login/clockinout');
    }
    $scope.theClock = $scope.FormatClock(ngnotifyService.ServerTime());
    $scope.StartClock = function () {
        if (angular.isDefined(clockStop)) return;
        clockStop = $interval(function () {
            $scope.theClock = $scope.FormatClock(ngnotifyService.ServerTime());
        }, 1000);
    }
    var stopClock = function () {
        if (angular.isDefined(clockStop)) {
            $interval.cancel(clockStop);
            clockStop = undefined;
        }
    };
    $scope.StartClock();


    $scope.$on('$destroy', function () {
        //$timeout.cancel(interval);
        deregistration();
        clearInterval(interval);
        //$timeout.cancel(OrderRefreshTimeOut);
        OrderRefresh();
        KDSNotify();
        BumpBarData();
        stopClock();
        $element.remove();
        //$rootScope.updateSessionTimeOutState();
        $rootScope.uService.ExitController("kds2Ctrl");
    });
};

