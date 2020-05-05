'use strict';
app.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService',
    function ($q, $injector, $location, localStorageService, $scope) {
    var authInterceptorServiceFactory = {};
    var _request = function (config) {
        config.headers = config.headers || {};
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }
        return config;
    }
    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('authService');
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                if (authData.useRefreshTokens) {
                    authService.refreshToken().then(function (response) {
                        //$location.path('/');
                        return $q.resolve(rejection);
                    },function (err) {
                        //$scope.message = err.error_description;
                        return $q.reject(rejection);
                    });
                    //$location.path('/refresh');
                }
            } else {
                authService.logOut();
                $location.path('/login/signin');
            }
        }
        return $q.reject(rejection);
    }
    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;
    return authInterceptorServiceFactory;
}]);