app.directive('autoFocus', function ($timeout) {
    return {
        restrict: 'AC',
        link: function (_scope, _element) {
            $timeout(function () {
                _element[0].focus();
            }, 0);
        }
    };
});
app.controller('loginCtrl', ['$scope', '$location', 'authService', 'ngAuthSettings', 'Restangular', '$rootScope', 'userService', 'toaster', '$translate', 'NG_SETTING', 'ngnotifyService', '$element','$stateParams','localStorageService','callsService',
    function ($scope, $location, authService, ngAuthSettings, Restangular, $rootScope, userService, toaster, $translate, NG_SETTING, ngnotifyService, $element, $stateParams,localStorageService,callsService) {
        $rootScope.uService.EnterController("loginCtrl");
        $scope.ngAuthSettings=ngAuthSettings;
        $scope.ConnStatus=function () {
            return ngAuthSettings.connected;
        }
        $scope.loginData = {
            userName: "",
            password: "",
            useRefreshTokens: true
        };
        $scope.translate = function () {
            $scope.signintoyouraccount = $translate.instant('main.SIGNINTOYOURACCOUNT');
            $scope.pleaseenteryournameandpasswordtologin = $translate.instant('main.PLEASEENTERYOURNAMEANDPASSWORDTOLOGIN');
            $scope.username = $translate.instant('main.USERNAME');
            $scope.password = $translate.instant('main.PASSWORD');
            $scope.iforgotmypassword = $translate.instant('main.IFORGOTMYPASSWORD');
            $scope.keepmesignedin = $translate.instant('main.KEEPMESIGNEDIN');
            $scope.trlogin = $translate.instant('main.LOGIN');
        };
        $scope.translate();
        var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
            $scope.translate();
        })
        $scope.message = "";
        userService.CleanPreferences();
        //authService.logOut();
        var idListener = $rootScope.$on('Identification', function (event,data) {
            userService.fmdLogin(data.FMD).then(function (response) {
                $scope.GetCurrentUserData(false);
            },
                function (err) {
                    $scope.isWaiting = false;
                    if (err && err.error == 'invalid_grant') {
                        $scope.translate = function () {
                            $scope.message = $translate.instant('main.LOGINERROR');
                        };
                        $scope.translate();
                        
                    } else {
                        $scope.message = (err && err.error)?err.error:"Unknown error";
                    }
                });            
        });
        var mcListener = $rootScope.$on('MSRIdentification', function (event,data) {
            userService.mcardLogin(data.CardData).then(function (response) {
                $scope.GetCurrentUserData(false);
            },
                function (err) {
                    $scope.isWaiting = false;
                    if (err && err.error == 'invalid_grant') {
                        $scope.translate = function () {
                            $scope.message = $translate.instant('main.LOGINERROR');
                        };
                        $scope.translate();
                        
                    } else {
                        $scope.message = (err && err.error)?err.error:"Unknown error";
                    }
                });            
        });
        $scope.login = function () {
            $scope.isWaiting = true;            
                authService.login($scope.loginData).then(function (response) {
                    $scope.GetCurrentUserData(false);
                },
                 function (err) {
                     $scope.isWaiting = false;
                     if (err && err.error == 'invalid_grant') {
                         $scope.translate = function () {
                             $scope.message = $translate.instant('main.LOGINERROR');
                         };
                         $scope.translate();
                         var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
                             $scope.translate();
                         });
                     } else {
                        $scope.message = (err && err.error)?err.error:"Unknown error";                
                     }
                 });            
        };
        $scope.GetCurrentUserData = function (skipRoute) {
            Restangular.one('user', 'CurrentUser').get().then(function (result) {
                $rootScope.user = result;
                ngnotifyService.SetStoreID(result.StoreID);
                userService.getRestrictions();
                userService.setCurrentUser(result, skipRoute);
                $rootScope.user.UserExtensionNumber = callsService.currentExtension = localStorageService.get('ExtensionNumber');
                $rootScope.user.ClientName = localStorageService.get('ClientName');
                //userService.landingPage(false);
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('Server.ServerError'), response);
            });
        }
        if ($stateParams.command && $stateParams.command == 'logout') {
            authService.logOut();
        }
        if (authService.fillAuthData()) {
            $scope.GetCurrentUserData(true);
            userService.setTimeOut(true);
        }

        $scope.FormKeyPress = function (event) {
            if (event.keyCode === 8) {
                $scope.message = '';
            }
        };
        $scope.authExternalProvider = function (provider) {
            var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';
            var externalProviderUrl = ngAuthSettings.apiServiceBaseUri + "api/Account/ExternalLogin?provider=" + provider
                                                                        + "&response_type=token&client_id=" + ngAuthSettings.clientId
                                                                        + "&redirect_uri=" + redirectUri;
            window.$windowScope = $scope;
            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };
        $scope.authCompletedCB = function (fragment) {
            $scope.$apply(function () {
                if (fragment.haslocalaccount == 'False') {
                    authService.logOut();
                    authService.externalAuthData = {
                        provider: fragment.provider,
                        userName: fragment.external_user_name,
                        externalAccessToken: fragment.external_access_token
                    };
                    $location.path('/associate');
                }
                else {
                    //Obtain access token and redirect to orders
                    var externalData = { provider: fragment.provider, externalAccessToken: fragment.external_access_token };
                    authService.obtainAccessToken(externalData).then(function (response) {
                        $location.path('/app/dashboard');
                    }, function (err) {
                        if (err) {
                            $scope.message = err.error_description;
                        }
                        else {
                            $scope.message = "Unknown message";
                        }
                    });
                }
            });
        };
        $scope.$on('$destroy', function () {
            tranlatelistener();
            idListener();
            mcListener();
            $element.remove();
            $rootScope.uService.ExitController("loginCtrl");
        });
    }]);
