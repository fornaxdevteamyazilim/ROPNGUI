'use strict';
app.controller('mainscreenCtrl', mainscreenCtrl);
function mainscreenCtrl($scope, $modal, $timeout, $filter, SweetAlert, $interval, toaster, Restangular, $rootScope, $location, userService, ngAudio, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("mainscreenCtrl");
    var OrderRefreshTimeOut;
    var Departments = [];
    $rootScope.ShowSpinnerObject = true;
    $scope.audio = ngAudio.load('assets/sound/ringin.mp3');
    $scope.audio.volume = 0.8;
    $scope.goreportspage = function () {
        $location.path('app/reports/reportspage');
    };
    userService.userAuthorizated();
    $rootScope.allowNavigation();
    $scope.translate = function (StoreOrderTypes) {
        $scope.sales = $translate.instant('main.SALES');
        $scope.totalnetamount = $translate.instant('main.TOTALNETAMOUNT');
        $scope.average = $translate.instant('main.AVERAGE');
        $scope.totalorders = $translate.instant('main.TOTALORDERS');
        if (StoreOrderTypes)
            angular.forEach(StoreOrderTypes, function (StoreOrderType) {
                StoreOrderType.OrderType = $translate.instant(StoreOrderType.OrderType);
                //StoreOrderType.OrderType = $translate.instant('OrderType.'+StoreOrderType.OrderType);
            });
        $scope.txtORDERLIST = $translate.instant('main.ORDERLIST');
        $scope.txtKITCHENDISPLAY = $translate.instant('main.KITCHENDISPLAY');
        $scope.txtDISPATCHER = $translate.instant('main.DISPATCHER');
        $scope.txtCASH = $translate.instant('main.CASH');
        $scope.txtCASHREPORT = $translate.instant('main.CASHREPORT');
        $scope.txtREPORTS = $translate.instant('main.REPORTS');
        $scope.txtADDOUTCASH = $translate.instant('main.ADDOUTCASH');
        $scope.txtNOTPAID = $translate.instant('main.NOTPAID');
        $scope.txtSTAFFPAYMENTS = $translate.instant('main.STAFFPAYMENTS');
        $scope.txtSTAFFPAYMENT = $translate.instant('main.STAFFPAYMENT');
        $scope.txtENDOFDAY = $translate.instant('main.ENDOFDAY');
        $scope.txtCLOCKINOUT = $translate.instant('main.CLOCKINOUT');
        $scope.txtENDDAY = $translate.instant('main.ENDDAY');
        $scope.open = $translate.instant('main.OPEN');
        $scope.close = $translate.instant('main.CLOSE');
        $scope.latecomplaints = $translate.instant('main.LATECOMPLAINTS');
        $scope.activecomplaints = $translate.instant('main.ACTIVECOMPLAINTS');
        $scope.OK = $translate.instant('main.OK');
        $scope.accept = $translate.instant('main.ACCEPT');
        $scope.cashdrawer = $translate.instant('main.CASHDRAWER');

    };
    $scope.StoreOrderTypes = [];
    if ($rootScope.user && $rootScope.user.Store) {
        $scope.StoreOrderTypes = angular.copy($rootScope.user.Store.StoreOrderTypes);
        $scope.translate($scope.StoreOrderTypes);
    }
    var deregistration1 = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.StoreOrderTypes = angular.copy($rootScope.user.Store.StoreOrderTypes);
        $scope.translate($scope.StoreOrderTypes);
    });
    var NewOrderfresh = $scope.$on('NewOrder', function (event, data) {
        $scope.GetNewOrderCount();
    });
    var StoreStatsRefresh = $scope.$on('UpdateStats', function (event, data) {
        $scope.RefreshStoreStats(data);
        $scope.AuditFinalizeOpDay();
    });
    $scope.GetStoreStats = function () {
        Restangular.one('dashboard/storestats').get({
            StoreID: ($scope.selectedStoreID) ? $scope.selectedStoreID : $rootScope.user.StoreID,
        }).then(function (result) {
            $scope.RefreshStoreStats(result);
            $scope.AuditFinalizeOpDay();
            $scope.isDeclaredRevenueInvalids();
        },
            function (restresult) {
                $rootScope.ShowSpinnerObject = false;
            })
    };
    $scope.RefreshStoreStats = function (stats) {
        $rootScope.ShowSpinnerObject = false;
        $scope.yemekSepetiStore = angular.copy(stats.yemekSepetiStore);
        $scope.AggregatorStoreStats = angular.copy(stats.AggregatorStoreStats);
        $scope.getirStore = angular.copy(stats.getirStore);
        $scope.trendyolStore = angular.copy(stats.trendyolStore);
        $scope.DisplayName = angular.copy(stats.DisplayName);
        $scope.isOpen = angular.copy(stats.isOpen);

        $scope.ComplaintSatats = angular.copy(stats.ComplaintSatats);
        $scope.ActiveComplaints = angular.copy(stats.ActiveComplaints);
        $scope.LateComplanits = angular.copy(stats.LateComplanits);

        $scope.storePerformanceData = angular.copy(stats.storePerformanceData);
        $scope.AwaitingAuthDuration = angular.copy(stats.AwaitingAuthDuration);
        $scope.Below30 = angular.copy(stats.Below30);
        $scope.Below30Percent = angular.copy(stats.Below30Percent);

        $scope.Beyond30 = angular.copy(stats.Beyond30);
        $scope.Beyond30Percent = angular.copy(stats.Beyond30Percent);

        $scope.Beyond45 = angular.copy(stats.Beyond45);
        $scope.Beyond45Percent = angular.copy(stats.Beyond45Percent);

        $scope.BuildingDuration = angular.copy(stats.BuildingDuration);
        $scope.DeliveryPeriod = angular.copy(stats.DeliveryPeriod);
        $scope.OrdersCount = angular.copy(stats.OrdersCount);
        $scope.OutDuration = angular.copy(stats.OutDuration);
        $scope.PeparedDuration = angular.copy(stats.PeparedDuration);
        $scope.PeparingDuration = angular.copy(stats.PeparingDuration);
        $scope.RealDeliveryTime = angular.copy(stats.RealDeliveryTime);
        $scope.TransferredDuration = angular.copy(stats.TransferredDuration);
        $scope.WaitingPeriod = angular.copy(stats.WaitingPeriod);
        $scope.isFinalizeRequired = angular.copy(stats.isFinalizeRequired);
        $scope.isDeclaredRevenueInvalid = angular.copy(stats.isDeclaredRevenueInvalid);
        $scope.InvalidDeclaredRevenueMessage = angular.copy(stats.InvalidDeclaredRevenueMessage);
    };
    $scope.GetStoreStats();
    //$rootScope.user.UserExtensionNumber = callsService.currentExtension = localStorageService.get('ExtensionNumber');
    //$rootScope.user.ClientName = localStorageService.get('ClientName');
    if ($rootScope.user && $rootScope.user.UserRole) {
        if ($rootScope.user.restrictions.ClientName == 'Enable') {
            if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER")) {
                if (!$rootScope.user.UserExtensionNumber) {
                    var modalInstance = $modal.open({
                        templateUrl: 'assets/views/mainscreen/acentextension.html',
                        controller: 'acentextensionCtrl',
                        size: '',
                        backdrop: '',
                        resolve: {
                            ObjectPath: function () {
                            }
                        }
                    });
                    modalInstance.result.then(function (password) {
                    })
                }
            }
            if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER")) {
                if (!$rootScope.user.UserExtensionNumber || !$rootScope.user.ClientName) {
                    var modalInstance = $modal.open({
                        templateUrl: 'assets/views/mainscreen/acentextension.html',
                        controller: 'acentextensionCtrl',
                        size: '',
                        backdrop: '',
                        resolve: {
                            ObjectPath: function () {
                            }
                        }
                    });
                    modalInstance.result.then(function (password) {
                    })
                }
            }
        }
    }
    $scope.GetNewOrderCount = function () {
        if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.Name) {
            if (!userService.userIsInRole("CCMANAGER") && !userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("MemberAdmin") && !userService.userIsInRole("MarketingDepartment") && !userService.userIsInRole("OperationDepartment") && !userService.userIsInRole("PurchasingDepartment") && !userService.userIsInRole("FinanceDepartment") && !userService.userIsInRole("STOREADMIN") && !userService.userIsInRole("PH")
                && $rootScope.user.restrictions.NewOrdersCount != 'Disable') {
                Restangular.one('ordertools/NewOrdersCount').get().then(function (result) {
                    if (result.Total > 0) {
                        if ($scope.ShowAlert != true) {
                            $scope.ShowAlert = true;
                            SweetAlert.swal({
                                title: $translate.instant('mainscreen.NEWORDER '),
                                text: $translate.instant('mainscreen.CheckOrder '),
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: $scope.accept,
                                cancelButtonText: $scope.OK,
                                closeOnConfirm: true,
                                closeOnCancel: true
                            }, function (isConfirm) {
                                if (isConfirm) {
                                    $scope.ShowAlert = false;
                                    location.href = '#/app/orderdisplay/orderdisplay';
                                }
                            });
                        }
                    }
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        }
    };
    $scope.GetNewOrderCount();
    $scope.getNewYSOrder = function () {
        if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.Name) {
            if ($rootScope.user.restrictions.ysorder == 'Enable') {
                Restangular.all('yemeksepeti/unmapedorders').getList({
                    StoreID: $rootScope.user.StoreID ? $rootScope.user.StoreID : ''
                }).then(function (result) {
                    $scope.audio.muting = !(result.length > 0);
                    if (result.length > 0) {
                        if (!($rootScope.user.restrictions.ysnosound == 'Enable'))
                            $scope.audio.play();
                        $rootScope.YSOrderCount = angular.copy(result.length);
                    } else
                        $scope.audio.pause();
                    $rootScope.YSOrderCount = angular.copy(result.length);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        }
    };
    $scope.getNewYSOrder();
    var NewAggregatorOrderfresh = ($rootScope.user && $rootScope.user.restrictions.aggregatorcustomermapping == 'Enable') ?
        $scope.$on('AggregatorOrder', function (event, data) {
            $scope.getNewwAggregatorOrder();
        }) : $scope.$on('AggregatorOrderUpdate', function (event, data) {
            $scope.getNewwAggregatorOrder();
        });
    $scope.getNewwAggregatorOrder = function () {
        if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.Name) {
            if ($rootScope.user.restrictions.aggregatorcustomermapping == 'Enable') {
                Restangular.all('aggregator/unmappedorders').getList({
                    StoreID: $rootScope.user.StoreID ? $rootScope.user.StoreID : ''
                }).then(function (result) {
                    $scope.audio.muting = !(result.length > 0);
                    if (result.length > 0) {
                        if (!($rootScope.user.restrictions.ysnosound == 'Enable'))
                            $scope.audio.play();
                        $rootScope.AggregatorOrderCount = angular.copy(result.length);
                    } else
                        $scope.audio.pause();
                    $rootScope.AggregatorOrderCount = angular.copy(result.length);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        }
    };
    $scope.getNewwAggregatorOrder();
    $scope.Preference = function () {
        var data = $rootScope.user;
    };
    $scope.StartTimeOut = function () {
        userService.startTimeout(60000);
    };
    //$scope.StartTimeOut();
    $scope.isTimedOut = function () {
        return userService.TimedOut();
    };
    $scope.selectRootOrderPage = function (orderType) {
        $rootScope.OrderType = orderType;
        if (orderType == 0)
            $scope.login('#/app/orders/tablePlan');
        //if (orderType == 0 && $rootScope.user.UserRole.MemberID == 106851154380)
        //    $scope.login('#/app/orders/tablePlantwo');
        if (orderType == 1)
            $scope.login('#/app/orders/takeaway');
        if (orderType == 2)
            $scope.login('#/app/orders/personpage/list');
        if (orderType == 7)
            $scope.login('#/app/orders/getirpersonpage/list');
        // if (orderType == 11)
        //     $scope.login('#/app/orders/migrospersonpage/list');
        //if (orderType == 7)
        //    $scope.login('#/app/orders/personpage/list');
        if (orderType == 3) {
            var data = $scope.GetDepartment();
            if (data != null) {
                var order = {
                    persons: [],
                    OrderTypeID: 3,
                    StoreID: $rootScope.user.StoreID,
                    DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id
                }
                Restangular.restangularizeElement('', order, 'order');
                order.post().then(function (resp) {
                    location.href = '#/app/orders/orderStoreTable/' + resp.id;
                },
                    function (resp) {
                        toaster.pop('error', $translate.instant('mainscreen.createneworder '), "error");
                    });
            }
        }
        if (orderType == 4)
            $scope.login('#/app/orders/stafforder');
        if (orderType == 5)
            $scope.login('#/app/orders/pickup');
        if (orderType == 6)
            $scope.login('#/app/orders/mall');
        if (orderType == 9)
            $scope.login('#/app/orders/WebDineIn');
        if (orderType == 10) {
            var data = $scope.GetDepartment();
            if (data != null) {
                var order = {
                    persons: [],
                    OrderTypeID: 10,
                    StoreID: $rootScope.user.StoreID,
                    DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id
                }
                Restangular.restangularizeElement('', order, 'order');
                order.post().then(function (resp) {
                    location.href = '#/app/orders/orderStoreTable/' + resp.id;
                },
                    function (resp) {
                        toaster.pop('error', $translate.instant('mainscreen.createneworder '), "error");
                    });
            }
        }

    };
    $scope.login = function (path) {
        var data = userService.TimedOut();
        //if (data) {
        //    $scope.EnterCardCode(path)
        //}
        //else {
        //    userService.stopTimeout();
        //    location.href = path;
        //}
        if ($rootScope.user.UserRole.MemberID == '106851154380' && path == '#/app/staffpayments/staffpayments') {
            $scope.GoPage = path;
            $scope.InputAuthCode();
            userService.stopTimeout();
        } else {
            if (data) {
                $scope.EnterCardCode(path)
            }
            else {
                userService.stopTimeout();
                location.href = path;
            }
        }
    };
    $scope.EnterCardCode = function (path) {
        $scope.GoPage = path;
        $scope.InputPassword(path);
    };
    var idListener = $rootScope.$on('Identification', function (event, data) {
        //var uiFMD = encodeURIComponent(data.FMD);
        userService.fmdLogin(data.FMD, false).then(function (response) {
            userService.stopTimeout();
            if (response) {
                $location.path('/app/mainscreen');
            }
        }, function (err) {
            if (err && err.error == 'invalid_grant') {
                toaster.pop('warrning', $translate.instant('mainscreen.fingerprints '), err.error_description);
            }
            else {
                if (err) {
                    toaster.pop('warrning', err.error, err.error_description);
                }
                else {
                    toaster.pop('warrning', "Error", $translate.instant('Server.UnknownError'));
                }
            }
        });
    });
    var mcListener = $rootScope.$on('MSRIdentification', function (event, data) {
        userService.mcardLogin(data.CardData, false).then(function (response) {
            userService.stopTimeout();
            if (response) {
                $location.path('/app/mainscreen');
            }
        }, function (err) {
            if (err && err.error == 'invalid_grant') {
                toaster.pop('warrning', $translate.instant('mainscreen.MagneticCardInvalid'), err.error_description);
            }
            else {
                if (err) {
                    toaster.pop('warrning', err.error, err.error_description);
                }
                else {
                    toaster.pop('warrning', "Error", $translate.instant('Server.UnknownError'));
                }
            }
        });
    });
    $scope.ChechCardCode = function (password) {
        userService.cardLogin(password, true).then(function (response) {
            userService.stopTimeout();
            location.href = $scope.GoPage;
        }, function (err) {
            if (err) {
                toaster.pop('warrning', $translate.instant('mainscreen.WrongPassword '), err.error_description);
            }
            else {
                $scope.message = "Unknown error";
            }
        });
    };
    $scope.InputPassword = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/mainscreen/loginpassword.html',
            controller: 'loginpasswordCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectPath: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function (password) {
            if (password != "cancel") {
                $scope.ChechCardCode(password);
            }
        })
    };
    $scope.InputAuthCode = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/mainscreen/authcode.html',
            controller: 'authcodeCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectPath: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function (msg) {
            if (msg == "ok") {
                location.href = $scope.GoPage;
            }
        })
    };
    var deregistration2 = $scope.$on('SelectUserCard', function (event, data) {
        $scope.login(data);
    });
    $scope.checkoutcash = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/specialoperations/checkoutcash.html',
            controller: 'checkoutcashCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectPath: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {

        })
    };
    $scope.GoToCashDrawer = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/specialoperations/cashdrawer.html',
            controller: 'cashdrawerCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectPath: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {

        })
    };
    $scope.isFinalizeOpDayRequired = function () { //Gün sonu almaya gerek var mı?
        return $scope.isFinalizeRequired;
        //changed to be server based 
        if (userService && $rootScope.user && $rootScope.user.Store) {
            if ($rootScope.user.Store.OperationDate) {
                var date = new Date($rootScope.user.Store.OperationDate);
                var today = new Date();
                //eğer saat 0 ile 5 arasında ise, bir gün öncesi ile kıyaslanmalı.
                if (today.getHours() < 5)
                    today.setDate(today.getDate() - 1);
                return $filter('date')(date, 'dd-MM-yyyy') != $filter('date')(today, 'dd-MM-yyyy');
            }
            return false;
        }
    }

    //$scope.isFinalizeOpDayRequired = function () { //Gün sonu almaya gerek var mı?
    //    if (userService && $rootScope.user && $rootScope.user.Store) {
    //        if ($rootScope.user.Store.OperationDate) {
    //            var date = new Date($rootScope.user.Store.OperationDate);
    //            var bugun = new date();
    //            if ($filter('date')(date, 'dd-MM-yyyy') != $filter('date')(bugun, 'dd-MM-yyyy')) //işletme tarihi bugüne eşit mi?
    //                return true; //Gün sonu al (bügüne eşit değil)
    //            else
    //                return false; //Gerek yok. Zaten bugüne eşit.
    //        } else {
    //            return false; //Gün sonu alınmış.
    //        }
    //    }
    //    else
    //        return false;
    //}

    $scope.isDeclaredRevenueInvalide = function () {

        return $scope.isDeclaredRevenueInvalid;

    };

    $scope.isDeclaredRevenueInvalids = function () {

        if ($scope.isDeclaredRevenueInvalide()) {
            SweetAlert.swal({
                title: $translate.instant('mainscreen.Editdeclaration '),
                text: $translate.instant('mainscreen.Declareinformation ') + " " + $scope.InvalidDeclaredRevenueMessage,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $translate.instant('mainscreen.Editdeclaration '),
                cancelButtonText: $scope.OK,
                closeOnConfirm: true,
                closeOnCancel: true
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.ShowAlert = false;
                    location.href = '#/app/specialoperations/declaredrevenueelist';
                }
            });
        }

    };
    $scope.isDeclaredRevenueInvalids();
    $scope.AuditFinalizeOpDay = function () {
        if ($scope.isFinalizeOpDayRequired()) {
            SweetAlert.swal({
                title: $translate.instant('mainscreen.EndOfDay '),
                text: $translate.instant('mainscreen.PleaseEndOfDay '),
                type: "warning",
                //showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $scope.OK,

                closeOnConfirm: true,

            });
        }
    };
    $scope.AuditFinalizeOpDay();

    $scope.selectcurrent = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/specialoperations/currentend.html',
            controller: 'currentendCtrl',
            size: '',
            backdrop: '',
            resolve: {
            }
        });
        modalInstance.result.then(function (item) {

        });
    };

    $scope.ChangeYsStore = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/yemeksepeti/ysstoreedit.html',
            controller: 'ysstoreeditCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectPath: function () {
                    return data;
                }
            }
        });
        modalInstance.result.then(function () {
        })
    };


    $scope.GetDepartments = function () {
        Restangular.all('department').getList({
            pageNo: 1,
            pageSize: 1000,
        }).then(function (result) {
            angular.copy(result, $scope.Departments);
        }, function (response) {
            return null;
        });

    };
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
    $scope.selectnotpaid = function (data) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/specialoperations/notpaid.html',
            controller: 'notpaidCtrl',
            size: '',
            backdrop: '',
            resolve: {

            }
        });
        modalInstance.result.then(function () {
        })
    };
    $scope.updateOpDateDisplay = function () {
        if (userService && $rootScope.user && $rootScope.user.Store) {
            //var date = new Date($rootScope.user.Store.OperationDate);
            //$scope.opdate = $filter('date')(date, 'dd-MM-yyyy')
            if ($rootScope.user.Store.OperationDate) {
                var date = new Date($rootScope.user.Store.OperationDate);
                $scope.opdate = $filter('date')(date, 'dd-MM-yyyy');
            } else {
                $scope.opdate = $translate.instant('main.ENDOFDAY');;
            }
        }
    }
    $scope.updateOpDateDisplay();
    var deregistration3 = $rootScope.$on('OperationDayChanged', function (event, data) {
        $scope.updateOpDateDisplay();
    });
    var deregistration4 = $rootScope.$on('UpdateOperationDate', function (event, data) {
        $scope.updateOpDateDisplay();
    });
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
        $scope.audio.pause();
        $timeout.cancel(OrderRefreshTimeOut);
        NewOrderfresh();
        NewAggregatorOrderfresh();
        StoreStatsRefresh();
        userService.stopTimeout();
        deregistration1();
        deregistration2();
        deregistration3();
        deregistration4();
        stopClock();
        idListener();
        mcListener();
        $element.unbind();
        $scope.$destroy;
        $element.remove();
        $rootScope.uService.ExitController("mainscreenCtrl");
    });
};
app.controller('endofdayCtrl', endofdayCtrl);
function endofdayCtrl($scope, $log, $modal, Restangular, SweetAlert, toaster, $window, $rootScope, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("endofdayCtrl");
    $scope.ShowingObje = false;
    $scope.endofdays = [];
    $scope.SaveEndOfDays = function (data) {
        swal({
            title: $translate.instant('mainscreen.EndOfDayWant '),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('mainscreen.yes '),
            cancelButtonText: $translate.instant('mainscreen.no '),
            closeOnConfirm: true
        }, function () {
            $scope.ShowingObje = true;
            Restangular.one('store/finalizeday').get({ id: $rootScope.user.StoreID }).then
                (function (restresult) {
                    $scope.orders = restresult;
                    if (restresult == true) {
                        $scope.ShowingObje = false;
                        toaster.pop('success', $translate.instant('mainscreen.EndOfDayReceived '), 'OK');
                    }
                    location.href = '#/app/specialoperations/declaredrevenueelist';
                },
                    function (restresult) {
                        $scope.ShowingObje = false;
                        var start = restresult.data.ExceptionMessage.indexOf("[");
                        var end = restresult.data.ExceptionMessage.indexOf("]");
                        var orderID = restresult.data.ExceptionMessage.substring(start + 1, end);
                        SweetAlert.swal("Error!", restresult.data.ExceptionMessage);
                        SweetAlert.swal({
                            title: $translate.instant('mainscreen.EndOfDayFailed '),
                            text: restresult.data.ExceptionMessage,
                            type: "info",
                            showCancelButton: true,
                            closeOnConfirm: true,
                            showLoaderOnConfirm: true,
                            confirmButtonText: $translate.instant('mainscreen.GotoOrder '),
                            cancelButtonText: $translate.instant('mainscreen.Cancel '),
                            closeOnCancel: true
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $location.path('app/orders/orderDetail/' + orderID);
                            }
                        })
                    })
        });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("endofdayCtrl");
    });
};
