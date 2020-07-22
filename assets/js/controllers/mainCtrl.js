'use strict';
/**
 * Clip-Two Main Controller
 */
app.controller('AppCtrl', ['$rootScope', '$scope', '$modal', '$state', '$translate', '$localStorage', '$window', '$document', '$timeout', '$http','cfpLoadingBar', 'authService', 'authInterceptorService', 'userService', 'callsService', 'localStorageService', 'Restangular', 'ngnotifyService', '$location', 'ngAudio', '$animate', '$element', 'Fullscreen','toaster', 
    function ($rootScope, $scope, $modal, $state, $translate, $localStorage, $window, $document, $timeout, $http,cfpLoadingBar, authService, authInterceptorService, userService, callsService, localStorageService, Restangular, ngnotifyService, $location, ngAudio, $animate, $element, Fullscreen,toaster) {
        $rootScope.uService = userService;
        $rootScope.uService.EnterController("AppCtrl");
        $animate.enabled(false);
        $scope.audio = ngAudio.load('assets/sound/ringin.mp3');
        $scope.audio.volume = 0.8;
        var stopTime;  
        // -----------------------------------
        var $win = $($window);
        var deregistration6 = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //start loading bar on stateChangeStart
            cfpLoadingBar.start();
            if (toState.authenticate && authService.authentication && !authService.authentication.isAuth) {
                {
                    if (authService.fillAuthData()) {
                        $scope.GetCurrentUserData();
                    }
                    else {
                        $state.transitionTo("login.signin");
                        event.preventDefault();
                    }
                }
                //if (toState.authenticate && authService.authentication && !authService.authentication.isAuth) {
                //    // Userisn’t authenticated
                //    $state.transitionTo("login.signin");
                //    event.preventDefault();
                //}
            }
        });
        var CustomerArrivedEvent = $scope.$on('CustomerArrived', function (event, data) {
            $rootScope.CustomerArrived=true;
            $scope.audio.play();
            stopTime = $timeout(function ()
            {
                $scope.audio.pause();
                $rootScope.CustomerArrived = false;

            }, 10000);
        });
        $scope.FullscreenPage = function () {
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
        };
        $scope.GetCurrentUserData = function () {
            Restangular.one('user', 'CurrentUser').get().then(function (result) {
                $rootScope.user = result;
                ngnotifyService.SetStoreID(result.StoreID);
                userService.getRestrictions();
                userService.setCurrentUser(result,true);
                if ($rootScope.user.UserRole.MemberID == '116642192568') {
                    $location.path('/app/orders/tablePlan');
                }
                else if (userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CALLCENTER")) {
                    $location.path('/app/orders/personpage/list');
                }
                else if (userService.userIsInRole("Manager") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("Admin") && $rootScope.user.UserRole.MemberID == '111679600561') {
                    $location.path('app/reports/giroreports/trends');
                }
                else if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER")) {
                    $location.path('/app/mainscreen');
                }
            }, function (response) {
                $scope.isWaiting = false;
                //toaster.pop('error', "Sunucu hatası", response);
            });
        }
        var deregistration5 = $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //stop loading bar on stateChangeSuccess
            event.targetScope.$watch("$viewContentLoaded", function () {
                cfpLoadingBar.complete();
            });
            // scroll top the page on change state
            $document.scrollTo(0, 0);
            if (angular.element('.email-reader').length) {
                angular.element('.email-reader').animate({
                    scrollTop: 0
                }, 0);
            }
            // Save the route title
            $rootScope.currTitle = $state.current.title;
        });
        // State not found
        var deregistration4 = $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            //$rootScope.loading = false;
            console.log(unfoundState.to);
            // "lazy.state"
            console.log(unfoundState.toParams);
            // {a:1, b:2}
            console.log(unfoundState.options);
            // {inherit:false} + default options
        });
        $rootScope.pageTitle = function () {
            return $rootScope.app.name + ' - ' + ($rootScope.currTitle || $rootScope.app.description);
        };
        // save settings to local storage
        if (angular.isDefined($localStorage.layout)) {
            $scope.app.layout = $localStorage.layout;

        } else {
            $localStorage.layout = $scope.app.layout;
        }
        var deregistration3 = $scope.$watch('app.layout', function () {
            // save to local storage
            $localStorage.layout = $scope.app.layout;
        }, true);
        //global function to scroll page up
        $scope.toTheTop = function () {
            $document.scrollTopAnimated(0, 600);
        };
        // angular translate
        // ----------------------
        $scope.language = {
            // Handles language dropdown
            listIsOpen: false,
            // list of available languages
            available: {
                'tr_TR': 'Türkçe',
                'en': 'English'
            },
            // display always the current ui language
            init: function () {
                var proposedLanguage = $translate.proposedLanguage() || $translate.use();
                var preferredLanguage = $translate.preferredLanguage();
                // we know we have set a preferred one in app.config
                $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];
            },
            set: function (localeId, ev) {
                $translate.use(localeId);
                $scope.language.selected = $scope.language.available[localeId];
                $scope.language.listIsOpen = !$scope.language.listIsOpen;
                if (localeId == "en") {
                    Restangular.setDefaultHeaders({ "Accept-Language": "en-US" });
                    $http.defaults.headers.common["Accept-Language"] = "en-US";
                }
                else {
                    Restangular.setDefaultHeaders({ "Accept-Language": "tr-TR" });
                    $http.defaults.headers.common["Accept-Language"] = "tr-TR";
                }
            }
        };
        $scope.language.init();
        // Function that find the exact height and width of the viewport in a cross-browser way
        var viewport = function () {
            var e = window, a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        };
        // function that adds information in a scope of the height and width of the page
        $scope.getWindowDimensions = function () {
            return {
                'h': viewport().height,
                'w': viewport().width
            };
        };
        // Detect when window is resized and set some variables
        var screenWatch = $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
            $scope.windowHeight = newValue.h;
            $scope.windowWidth = newValue.w;
            if (newValue.w >= 992) {
                $scope.isLargeDevice = true;
            } else {
                $scope.isLargeDevice = false;
            }
            if (newValue.w < 992) {
                $scope.isSmallDevice = true;
            } else {
                $scope.isSmallDevice = false;
            }
            if (newValue.w <= 768) {
                $scope.isMobileDevice = true;
            } else {
                $scope.isMobileDevice = false;
            }
        }, true);
        // Apply on resize
        //$win.on('resize', function () {
        //    $scope.$apply();
        //});
        $scope.waitingForCallReasonSelection = false;
        $rootScope.$on('pbxCallDisconnect', function (event, data) {
            if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER")) {
                if (callsService.isTypeRequired() && !$scope.waitingForCallReasonSelection) {
                    $scope.waitingForCallReasonSelection = true;
                    var modalInstance = $modal.open({
                        templateUrl: 'assets/views/callmonitor/currentcallreason.html',
                        controller: 'currentcallreasonCtrl',
                        size: '',
                        keyboard: false,
                        backdrop: '',
                        resolve: {
                        }
                    });
                    modalInstance.result.then(function (storeReason) {
                        $scope.waitingForCallReasonSelection = false;
                        if (data) {
                            var call = { UCID: data.UCID, CallStart: data.AddedAt, CallEnd: new Date(), Caller: data.CallerID, Extension: data.Extension, CallReasonID: storeReason.ReasonID, StoreID: storeReason.storeID }
                            Restangular.restangularizeElement('', call, 'call')
                            call.post().then(function (res) {
                            });
                            callsService.SetCurrentCallType(storeReason.ReasonID, storeReason.storeID);
                        }
                    });
                } else {
                    if (data) {
                        var ccall = callsService.GetCurrentCall();
                        var call = { UCID: data.UCID, CallStart: data.AddedAt, CallEnd: new Date(), Caller: data.CallerID, Extension: data.Extension, CallReasonID: ccall.CallType, StoreID: ccall.storeID }
                        Restangular.restangularizeElement('', call, 'call')
                        call.post().then(function (res) {
                        });
                    }
                }
            } 
        });
        $scope.StorePhones = function () {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/stores/storephones.html',
                controller: 'storephonesCtrl',
                size: '',
                backdrop: '',
                resolve: {
                }
            });
            modalInstance.result.then(function () {
            })
        };

        $scope.ChangeExtensionNumber = function () {
            if ($rootScope.user && $rootScope.user.UserRole) {
                if ($rootScope.user.UserRole.Name == "CALLCENTER" || $rootScope.user.UserRole.Name == "CCMANAGER" || $rootScope.user.UserRole.Name == "Admin" || $rootScope.user.UserRole.Name == "PHAdmin" || $rootScope.user.UserRole.Name == "STORETEST" || $rootScope.user.UserRole.Name == "STOREMANAGER" || $rootScope.user.UserRole.Name == "STOREASSISTANTMANAGER" || $rootScope.user.UserRole.Name == "STORESHIFTMANAGER" || $rootScope.user.UserRole.Name == "STOREUSER" || $rootScope.user.UserRole.Name == "Alonet") {
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
        };

        $scope.ReloadCache = function () {
            $scope.StartReloadCache = true;
            Restangular.all('tools/reloadcache').getList({}).then(function (result) {
                $scope.StartReloadCache = false;
            }, function (response) {
                $scope.StartReloadCache = false;
            });
        };
        $scope.ReloadCacheAll = function () {
            $scope.StartReloadCacheAll = true;
            Restangular.all('tools/reloadcache').getList({
                ReloadAll : 'true',
            }).then(function (result) {
                $scope.StartReloadCacheAll = false;
            }, function (response) {
                $scope.StartReloadCacheAll = false;
            });
        };
        var deregistration2 = $scope.$on('Logout', function (event, data) {
            $location.path('/login/signin?command=logout');
        });
        var deregistration1 = $rootScope.$on('OperationDayChanged', function (event, data) {
            //$location.path('/login/signin');
            if (authService.fillAuthData()) {
                $scope.GetCurrentUserData();
                userService.setTimeOut(true);
                $rootScope.$broadcast('UpdateOperationDate', data)
            }
            else {
                $state.transitionTo("login.signin");
                event.preventDefault();
            }
        });
        var NewOrderfresh = $scope.$on('NewOrder', function (event, data) {
            $scope.GetNewOrderCount();
        });
        $scope.GetNewOrderCount = function () {
            if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.Name) {
                if (!userService.userIsInRole("CCMANAGER") && !userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("MemberAdmin") && !userService.userIsInRole("PHAdmin")
                && $rootScope.user.restrictions.NewOrdersCount!='Disable'
                ) {
                    Restangular.one('ordertools/NewOrdersCount').get().then(function (result) {
                        $scope.audio.muting = !(result.Total > 0);
                        if ((result.Total > 0))
                            $scope.audio.play();
                        else
                            $scope.audio.pause();
                        $rootScope.OrderCount = angular.copy(result.Total);
                    });
                }
            }
        };
        var NewYSOrderfresh = $scope.$on('YSOrder', function (event, data) {
            $scope.getNewYSOrder();
        });
        $scope.getNewYSOrder = function () {
            if ($rootScope.user && $rootScope.user.UserRole && $rootScope.user.UserRole.Name) {
                if ($rootScope.user.restrictions.ysorder=='Enable') {
                    Restangular.all('yemeksepeti/unmapedorders').getList({
                        StoreID: $rootScope.user.StoreID ? $rootScope.user.StoreID : ''
                    }).then(function (result) {
                        $scope.audio.muting = !(result.length > 0);
                        if (result.length > 0) {
                            if (!($rootScope.user.restrictions.ysnosound=='Enable'))
                                $scope.audio.play();
                            $rootScope.YSOrderCount = angular.copy(result.length);
                        } else
                            $scope.audio.pause();
                        $rootScope.YSOrderCount = angular.copy(result.length);
                    }, function (response) {
                        toaster.pop('error', "Error", response.data.ExceptionMessage);
                    });
                }
            }
        };
        var OrderRefresh = $scope.$on('ServerTime', function (event, data) {
            if ($rootScope.OrderCount > 0)
                $scope.GetNewOrderCount();
            if ($rootScope.YSOrderCount > 0 || $rootScope.user.restrictions.ysorder=='Enable')
                $scope.getNewYSOrder();
        });
        $scope.getNewYSOrder();
        $scope.uistatusdisplay = function () {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/Tools/uistatusdisplay.html',
                controller: 'uistatusdisplayCtrl',
                size: '',
                backdrop: '',
                resolve: {
                }
            });
            modalInstance.result.then(function () {
            })
        };
        $scope.logOutSystem = function () {
            //var command = 'logout'
            $location.path('/login/signin' ? command : '');
        };
        $scope.FullscreenPage = function () {
            if (Fullscreen.isEnabled())
                Fullscreen.cancel();
            else
                Fullscreen.all();
        };
        $scope.$on('$destroy', function () {
            deregistration1();
            deregistration2();
            deregistration3();
            deregistration4();
            deregistration5();
            deregistration6();
            $timeout.cancel(stopTime);
            CustomerArrivedEvent();
            screenWatch();
            NewYSOrderfresh();
            NewOrderfresh();
            OrderRefresh();
            $element.remove();
            $rootScope.uService.ExitController("AppCtrl");
        });
    }]);
