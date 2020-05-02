'use strict';
app.factory('NGSettingService', ['NG_SETTING',
    function (NG_SETTING) {
        var NGSettingServiceFactory = {};
        var _Get = function (SettingName,DefaultValue) {
            params=SettingName,DefaultValue;
            //val=Restangular.get(...);
           // return val
        };
        NGSettingServiceFactory.Get = _Get;
        return NGSettingServiceFactory;
    }]);
//var ecrval="ECR_"+user.Store.Name+"Enable";
// if (NGSettingService.Get(ecrval,false)) {};