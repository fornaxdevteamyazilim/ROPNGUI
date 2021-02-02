'use strict';
app.factory('authService', ['$http', '$rootScope', '$q', 'localStorageService', 'ngAuthSettings',
    function ($http, $rootScope, $q, localStorageService, ngAuthSettings, NG_SETTING) {
        // Create Base64 Object
        var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
        var authServiceFactory = {};
        var _authentication = {
            isAuth: false,
            userName: "",
            useRefreshTokens: true
        };
        var _externalAuthData = {
            provider: "",
            userName: "",
            externalAccessToken: ""
        };
        var _saveRegistration = function (registration) {
            _logOut();
            return $http.post(ngAuthSettings.apiServiceBaseUri + 'api/account/register', registration).then(function (response) {
                return response;
            });
        };
        var _login = function (loginData) {
            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
            if (loginData.useRefreshTokens) {
                data = data + "&client_id=" + ngAuthSettings.clientId;
            }
            var deferred = $q.defer();
            var basicAuthHeader = 'Basic ' + Base64.encode(ngAuthSettings.clientId + ':' + ngAuthSettings.secret);
            $http.post(ngAuthSettings.apiServiceBaseUri + 'token', data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': basicAuthHeader }
            }).success(function (response) {
                localStorageService.set('authorizationData', {
                    token: response.access_token,
                    userName: loginData.userName,
                    refreshToken: loginData.useRefreshTokens ? response.refresh_token : "",
                    useRefreshTokens: loginData.useRefreshTokens
                });
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
                _authentication.useRefreshTokens = loginData.useRefreshTokens;
                deferred.resolve(response);
            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };
        var _logOut = function () {
            localStorageService.remove('authorizationData');
            _authentication.isAuth = false;
            _authentication.userName = "";
            _authentication.useRefreshTokens = false;
        };
        var _fillAuthData = function () {
            //if (PH)
                //return false;
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                _authentication.useRefreshTokens = authData.useRefreshTokens;                
                return true;
            }
            else 
            {
                return false;
            }
        };
        var _refreshToken = function () {
            var deferred = $q.defer();
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                if (authData.useRefreshTokens) {
                    var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;
                    localStorageService.remove('authorizationData');
                    var basicAuthHeader = 'Basic ' + Base64.encode(ngAuthSettings.clientId + ':' + ngAuthSettings.secret);
                    $http.post(ngAuthSettings.apiServiceBaseUri + 'token', data, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': basicAuthHeader }
                    }).success(function (response) {
                        localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                        deferred.resolve(response);
                    }).error(function (err, status) {
                        _logOut();
                        deferred.reject(err);
                    });
                }
            }
            return deferred.promise;
        };
        var _obtainAccessToken = function (externalData) {
            var deferred = $q.defer();
            $http.get(ngAuthSettings.apiServiceBaseUri + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {
                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });
                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.useRefreshTokens = false;
                deferred.resolve(response);
            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };
        var _registerExternal = function (registerExternalData) {
            var deferred = $q.defer();
            $http.post(ngAuthSettings.apiServiceBaseUri + 'api/account/registerexternal', registerExternalData).success(function (response) {
                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });
                _authentication.isAuth = true;
                _authentication.userName = response.userName;
                _authentication.useRefreshTokens = false;
                deferred.resolve(response);
            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });
            return deferred.promise;
        };
        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;
        authServiceFactory.obtainAccessToken = _obtainAccessToken;
        authServiceFactory.externalAuthData = _externalAuthData;
        authServiceFactory.registerExternal = _registerExternal;
        return authServiceFactory;
    }]);