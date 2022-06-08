'use strict';
app.factory('userService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', 'authService', '$timeout', '$filter', '$rootScope', '$location', 'NG_SETTING', '$window', 
    function ($http, $q, localStorageService, ngAuthSettings, authService, $timeout, $filter, $rootScope, $location, NG_SETTING, $window, $localStorage) {
        var userServiceFactory = {};
        var LogutTimeOut;
        var ReportParameters = [];
        var userRestirctions = null;
        var userPreferences = null;
        var isTimedOut = false;
        var isAutoTimedOut = false;
        var PreferenceValue = null;
        var _GetParameter = function (reportName, DefaultParams) {
            var reports = $filter('filter')(ReportParameters, { 'reportname': reportName });
            var report = {
                reportname: reportName,
                Parameters: DefaultParams
            }
            if (reports.length > 0) {
                report = reports[0];
            }
            else {
                ReportParameters.push(report);
            }
            return report;
        };
        
        var _cardLogin = function (card, skipLandigRoute) {
            authService.logOut();
            var _storeID = localStorageService.get('StoreID');
            if (_storeID) {
                _JoinGroup(_storeID.toString());
            }
            else {
                _storeID = $rootScope.user.StoreID;
            }
            var logindata = {
                userName: "UserCard_" + _storeID,
                password: card,
                useRefreshTokens: true
            }
            var deferred = $q.defer();
            authService.login(logindata).then(function (response) {
                isTimedOut = false;
                _refreshUserData(skipLandigRoute);
                deferred.resolve(response);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        var _fmdLogin = function (fmd, skipLandigRoute) {
            authService.logOut();
            var _storeID = localStorageService.get('StoreID');
            if (_storeID) {
                _JoinGroup(_storeID.toString());
            }
            else {
                _storeID = $rootScope.user.StoreID;
            }
            var logindata = {
                userName: "FMD_" + _storeID,
                password: fmd,
                useRefreshTokens: true
            }
            var deferred = $q.defer();
            authService.login(logindata).then(function (response) {
                isTimedOut = false;
                _refreshUserData(skipLandigRoute);
                deferred.resolve(response);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        var _mcardLogin = function (fmd, skipLandigRoute) {
            authService.logOut();
            var _storeID = localStorageService.get('StoreID');
            if (_storeID) {
                _JoinGroup(_storeID.toString());
            }
            else {
                _storeID = $rootScope.user.StoreID;
            }
            var logindata = {
                userName: "MSR_" + _storeID,
                password: fmd,
                useRefreshTokens: true
            }
            var deferred = $q.defer();
            authService.login(logindata).then(function (response) {
                isTimedOut = false;
                _refreshUserData(skipLandigRoute);
                deferred.resolve(response);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        var _refreshUserData = function (skipLandigRoute) {
            _resetUserData();
            $http.get(ngAuthSettings.apiServiceBaseUri + 'api/user', { params: { id: 'CurrentUser' } }).success(function (response) {
                $rootScope.user = response;
                $rootScope.user.UserExtensionNumber = localStorageService.get('ExtensionNumber');
                $rootScope.user.ClientName = localStorageService.get('ClientName');
                userRestirctions = _getRestrictions();
                userPreferences = _getPreferences();
                _setCurrentUser(response, skipLandigRoute);
                
            }).error(function (err, status) {
                //send error to toster
                return null;
            });
        };
        var _resetUserData = function () {
            userRestirctions = null;
            userPreferences = null;
        };
        var _getRestrictions = function () {
            $rootScope.user.restrictions = {};
            //if (!userRestirctions) {
            $http.get(ngAuthSettings.apiServiceBaseUri + 'api/restriction', { params: { id: 'CurrentUser' } }).success(function (response) {
                userRestirctions = response;
                if (response.restrictions && response.restrictions.length) {
                    var restrictions = {};
                    for (var i = 0; i < response.restrictions.length; i++) {
                        restrictions[response.restrictions[i].Name] = response.restrictions[i].UserRestrictionType;
                        angular.copy(restrictions, $rootScope.user.restrictions);
                    }
                    //if ($rootScope.user.UserRole.MemberID == '116642192568') {
                    //    $location.path('/app/orders/tablePlan');
                    //} else if (_userIsInRole("CCMANAGER") || _userIsInRole("CALLCENTER")) {
                    //    $location.path('/app/orders/personpage/list');
                    //} else if (_userIsInRole("AREAMANAGER")) {
                    //    //$location.path('/app/dashboard');
                    //    $location.path('app/reports/giroreports/trends');
                    //} else if (!_userIsInRole("CALLCENTER") && !_userIsInRole("CCMANAGER")) {
                    //    $location.path('/app/mainscreen');
                    //}
                    $rootScope.updateSessionTimeOutState();
                }
                return response;
            }).error(function (err, status) {
                //send error to toster
                return null;
            });
            //}
            //else
            //    return userRestirctions;
        };
        var _getPreferences = function (PreferenceName) {
            if (!userPreferences) {
                $http.get(ngAuthSettings.apiServiceBaseUri + 'api/preferences', { params: { id: 'CurrentUser' } }).success(function (response) {
                    userPreferences = response;
                    if (userPreferences.preferences && userPreferences.preferences.length) {
                        var preferences = {};
                        for (var i = 0; i < response.preferences.length; i++) {
                            preferences[response.preferences[i].Preference.name] = response.preferences[i].Value;
                            angular.copy(preferences, $rootScope.user.preferences);
                        }
                        
                    }
                }).error(function (err, status) {
                    //send error to toster
                    return null;
                });
            }
            else {
                return userPreferences;

            }
            //return userPreferences.preferences[0].Preference.name;
        };
        var _GetPreferenceValue = function (PreferenceName) {
            //    if (!userPreferences) {
            //        $http.get(ngAuthSettings.apiServiceBaseUri + 'api/preferences', { params: { id: 'CurrentUser' } }).success(function (response) {
            //            userPreferences = response;
            //            return (_PreferenceValue(PreferenceName, userPreferences))
            //        }).error(function (err, status) {
            //            //send error to toster
            //            return null;
            //        });
            //    }
            //    else {
            //        return (_PreferenceValue(PreferenceName, userPreferences))
            //    }
            //    //return userPreferences.preferences[0].Preference.name;
        };
        var _PreferenceValue = function (prefname, preflist) {
            for (var i = 0; i < preflist.preferences.length; i++) {
                if (preflist.preferences[i].Preference.name == prefname) {
                    return preflist.preferences[i].Value;
                }
            }
        }
        var _stopTimeout = function () {
            $timeout.cancel(LogutTimeOut);
        }
        var _setTimeOut = function (newstate) {
            isTimedOut = newstate;
            //if (newstate)
            //    $location.path("/login/lock");
        }
        var _startTimeout = function (timeout) {
            LogutTimeOut = $timeout(function () {
                isTimedOut = true;
                //$location.path("/login/lock");
                //authService.logOut();
                //_resetUserData();
                //$location.path('app/login/logout/logout');//.search('ref', '/path/to/redirect');
            }, timeout);
        }
        var _TimedOut = function () {                
            return false;//isTimedOut;
        }
        var _RestartTimeout = function (timeout) {                
            _stopTimeout();
            _startTimeout(timeout);
        }
        var _isPreference = function () {
            return PreferenceValue;
        };
        var _isCleanPreference = function () {
            userPreferences = null;
            return userPreferences;
        };
        var _userAuthorizated = function () {
            if (!$rootScope.user || !$rootScope.user.UserRole || !$rootScope.user.UserRole.Name) {
                return $location.path('/login/signin');
            }
            //if (!userServiceFactory.currentUser.ShiftActive) {
            //    $location.path('/login/clockinout');
            //}
        };
        var _landingPage = function (routeToShift) {
            //if (isTimedOut && userServiceFactory.currentUser.UserRole.ShiftControl)// && userServiceFactory.currentUser.ShiftActive)
                //$location.path("/login/lock");
            //else
            $rootScope.updateSessionTimeOutState();
            if (!userServiceFactory.currentUser.ShiftActive && routeToShift && $location.path() != '/login/signin/logout') {
                $location.path('/login/clockinout');
            } else if (userServiceFactory.currentUser && userServiceFactory.currentUser.UserRole && userServiceFactory.currentUser.UserRole.MemberID == '116642192568') {
                $location.path('/app/orders/tablePlan');
            }
            else if (userServiceFactory.userIsInRole("CCMANAGER") || userServiceFactory.userIsInRole("CALLCENTER") || userServiceFactory.userIsInRole("Alonet")) {
                $location.path('/app/orders/personpage/list');
            }
            else if (userServiceFactory.userIsInRole("Manager") || userServiceFactory.userIsInRole("AREAMANAGER") || userServiceFactory.userIsInRole("Manager_v2") ||userServiceFactory.userIsInRole("Admin")) {
                //$location.path('/app/dashboard');
                $location.path('app/reports/giroreports/trends');
            }
            else if (userServiceFactory.userIsInRole("MarketingDepartment") || userServiceFactory.userIsInRole("PurchasingDepartment") || userServiceFactory.userIsInRole("FinanceDepartment")) {
                $location.path('app/reports/reportspage');
            }
            else if (!userServiceFactory.userIsInRole("CALLCENTER") && !userServiceFactory.userIsInRole("CCMANAGER") && !userServiceFactory.userIsInRole("Alonet")) {
                $location.path('/app/mainscreen');
            $location.path('/app/mainscreen');
            }
        };
        var _userIsInRole = function (role) {
            
            _userAuthorizated();
            if (role=="CALLCENTER") 
                {
                    if (userServiceFactory.currentUser && userServiceFactory.currentUser.UserRole && userServiceFactory.currentUser.UserRole.Name == "CCBACKOFFICE")
                        return true;
                }
            if (userServiceFactory.currentUser && userServiceFactory.currentUser.UserRole && userServiceFactory.currentUser.UserRole.Name == role)
                return true;
            if (userServiceFactory.currentUser && userServiceFactory.currentUser.UserRole && userServiceFactory.currentUser.UserRole.Name != role);
            return false;
            //return ($rootScope.user.UserRole.Name == role);
        };
        var _setCurrentUser = function (data,skipLandingRoute) {
            userServiceFactory.currentUser = data;    
            //var pt = $location.path();
            //if (!userServiceFactory.currentUser.ShiftActive)
            if (!skipLandingRoute)
                _landingPage(true);
        };
        var _getCurrentUser = function () {
            return userServiceFactory.currentUser;
        };
        var _isAdmin = function () {
            return (userServiceFactory.currentUser && userServiceFactory.currentUser.isAdmin);
        };
        var _getUseOKC = function (StoreID) {
            if ($rootScope.user.Store) {
                return $rootScope.user.Store.isECREnabled;
            }
            var store = [  //LC
                { id: 100620224522, name: 'AdminStore' }, { id: 107899457925, name: 'Güneşli' }, { id: 107396980294, name: 'Yenibosna' }, { id: 101726989152, name: 'Beşyüzevler' }, { id: 108867068158, name: 'Kabataş' }, { id: 108752444536, name: 'Gaziosmanpaşa' }, { id: 103246745452, name: 'Acıbadem' }, { id: 108799641794, name: 'Gülbağ' }, { id: 107729874358, name: 'Şişli' }, { id: 105237833850, name: 'Etiler' }, { id: 102205406875, name: 'Kozyatağı' }, { id: 103505210273, name: 'Aksaray' }, { id: 109839205501, name: 'Ataköy' }, { id: 108062413089, name: 'Merter' }, { id: 103092709269, name: 'Bakırköy' }, { id: 105837627393, name: 'İstinye' }, { id: 106487136633, name: 'Seyrantepe ' }, { id: 102420187105, name: 'Beykop ' }, { id: 108817088373, name: 'Bahçeşehir ' }, { id: 104555564107, name: 'Yakacık' }, { id: 102330240432, name: 'Kağıthane' }, { id: 107793449897, name: 'Beykent' }, { id: 102870232062, name: 'Çekmeköy' }, { id: 105055168705, name: 'Zeytinburnu' }, { id: 107367938492, name: 'Maslak (Ayazağa)' }, { id: 107567020016, name: 'Zonguldak (Merkez)' }, { id: 108167743804, name: 'Kartal' }, { id: 108164692248, name: 'Görükle' }, { id: 109075477209, name: 'Başakşehir' }, { id: 101344584764, name: 'Özlüce' }, { id: 200005314720, name: 'Haznedar' }, { id: 103701959279, name: 'Hoşdere' }, { id: 106822840275, name: 'Yeşilpınar' }, { id: 200083680738, name: 'Atakum - Samsun' }, { id: 107252612891, name: 'Taşdelen' }, { id: 108873386457, name: 'Dikilitaş' }, { id: 109947523126, name: 'Beylikdüzü' },
                //PL
                { id: 113738504170, name: 'AdminStore' }, { id: 117718331338, name: 'Kuyubaşı' }, { id: 110070471718, name: 'Beykop' }, { id: 114962332077, name: 'Mimaroba' }, { id: 116730015904, name: 'Beykent' }, { id: 300000022036, name: 'Avrupa Konutlari' }, { id: 300002415962, name: 'EMNIYETEVLERI' }
            ]
            for (var i = 0; i < store.length; i++) {
                if (store[i].id == StoreID) {
                    return true;
                }
            }
        };
        var _getUserRoles = function (MemberID) {

            if (MemberID == 300000000000) { // PH
                var userroles = [
                    { id: 106732385859, name: 'REST. MANAGER', isActive: false , isDriver: false},
                    { id: 109474168055, name: 'REST. ASSIST. MANAGER', isActive: false , isDriver: false },
                    { id: 104536896676, name: 'REST. SHIFT MANAGER', isActive: false, isDriver: false },
                    { id: 300002043374, name: 'REST. TEAM MEMBER', isActive: false, isDriver: false },
                    { id: 106761563444, name: 'Rest. Driver', isActive: true, isDriver: true },
                    { id: 300002043360, name: 'REST. KITCHEN MEMBER', isActive: false, isDriver: false },
                    { id: 300021512530, name: 'Fiyuu Driver', isActive: false , isDriver: false},//Bir tane de Fiyuu sürücü
                    { id: 300021694696, name: 'Sürücü', isActive: false , isDriver: true},
                    { id: 300156809299, name: 'REST. DRIVER (No Shift)', isActive: false, isDriver: true},
                    
                ];
            }
            if (MemberID == 106851154380) { // LC
                var userroles = [
                    { id: 106732385859, name: 'Restoran Müdürü' },
                    { id: 109474168055, name: 'Asistan Müdür' },
                    { id: 104536896676, name: 'Vardiya Müdürü' },
                    { id: 105665651981, name: 'Restoran Kullanıcısı' },
                    { id: 106761563444, name: 'Sürücü' }
                ];
            }
            return userroles;

        };
        //ControllerUsages
        var _UsedControllers = [];
        var _enterController = function (controllerName) {
            var found = false;
            if (_UsedControllers && _UsedControllers.length > 0) {
                for (var i = 0; i < _UsedControllers.length; i++) {
                    if (_UsedControllers[i].controllerName == controllerName) {
                        _UsedControllers[i].InstanceCount++;
                        _UsedControllers[i].UsageCount++;
                        if (controllerName == 'mainscreenCtrl' && _UsedControllers[i].UsageCount > 20)
                            $window.location.assign('refresh.html');
                        // $state.reload();
                        //$route.reload();
                        //$window.location.reload();
                        found = true;
                    }
                }
            }
            if (!found) {
                _UsedControllers.push({
                    controllerName: controllerName,
                    InstanceCount: 1,
                    UsageCount: 1
                });
            }
        };
        var _exitController = function (controllerName) {
            if (_UsedControllers && _UsedControllers.length > 0) {
                var found = false;
                for (var i = 0; i < _UsedControllers.length; i++) {
                    if (_UsedControllers[i].controllerName == controllerName) {
                        _UsedControllers[i].InstanceCount--;
                        found = true;
                    }
                }
                if (!found) {
                    console.log("Controller [" + controllerName + "] not found in array!");
                }
            }
            else {
                console.log("No Controllers defined yet!");
            }
        };
        var _getControllerUsages = function () {
            return _UsedControllers;
        }
        //ControllerUsages
        userServiceFactory.getPreferences = _getPreferences;
        userServiceFactory.GetPreferenceValue = _GetPreferenceValue;
        userServiceFactory.cardLogin = _cardLogin;
        userServiceFactory.fmdLogin = _fmdLogin;
        userServiceFactory.mcardLogin = _mcardLogin;
        userServiceFactory.getRestrictions = _getRestrictions;
        userServiceFactory.CleanPreferences = _isCleanPreference;
        userServiceFactory.Preferences = _isPreference;
        userServiceFactory.startTimeout = _startTimeout;
        userServiceFactory.setTimeOut = _setTimeOut;
        userServiceFactory.TimedOut = _TimedOut;
        userServiceFactory.resetUserData = _resetUserData;
        userServiceFactory.stopTimeout = _stopTimeout;
        userServiceFactory.refreshUserData = _refreshUserData;
        userServiceFactory.userAuthorizated = _userAuthorizated;
        userServiceFactory.userIsInRole = _userIsInRole;
        userServiceFactory.setCurrentUser = _setCurrentUser;
        userServiceFactory.getCurrentUser = _getCurrentUser;
        userServiceFactory.getUseOKC = _getUseOKC;
        userServiceFactory.getUserRoles = _getUserRoles;
        userServiceFactory.ExitController = _exitController;
        userServiceFactory.EnterController = _enterController;
        userServiceFactory.GetControllerUsages = _getControllerUsages;
        userServiceFactory.landingPage = _landingPage;
        userServiceFactory.isAdmin = _isAdmin;
        userServiceFactory.getParameter = _GetParameter;
        userServiceFactory.RestartTimeout=_RestartTimeout;
        return userServiceFactory;
    }]);