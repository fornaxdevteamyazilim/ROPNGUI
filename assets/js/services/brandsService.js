'use strict';
app.factory('brandsService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings, NG_SETTING) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var brandsServiceFactory = {};

    var _getBrands = function () {

        return $http.get(serviceBase + 'api/brand').then(function (results) {
            return results;
        });
    };

    brandsServiceFactory.getBrands = _getBrands;

    return brandsServiceFactory;

}]);