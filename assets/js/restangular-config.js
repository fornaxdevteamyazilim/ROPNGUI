'use strict';
angular.module("config-restangular", ['restangular'])
.config(restangularConfig);

function restangularConfig(RestangularProvider) {
   
    //RestangularProvider.setBaseUrl('http://pizzahut.ropng.site:9075/api/'); //PH - Test
    //RestangularProvider.setBaseUrl('http://192.168.9.40:9065/api/'); //PH
    RestangularProvider.setBaseUrl('http://192.168.104.153:9065/api/'); //KFC
    //RestangularProvider.setBaseUrl('http://10.0.0.245:9065/api/'); //MAROCCO
    //RestangularProvider.setBaseUrl('http://localhost:9065/api/'); //localhost
    //RestangularProvider.setBaseUrl('http://192.168.15.10:9065/api/'); //PH
    //RestangularProvider.setBaseUrl('http://31.145.149.211:9063/api/'); //CALLCENTER
    //RestangularProvider.setBaseUrl('http://192.168.9.41:9069/api/'); //NEWGNUI 

    
    //RestangularProvider.setDefaultHeaders({ "Content-Type": "application/json;charset=utf-8" });
    RestangularProvider.setDefaultHeaders({ "Accept-Language": "tr-TR" });
    //RestangularProvider.setPlainByDefault(true);
    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
        var extractedData;
        if (operation === "getList" && data && data.Items) {
            extractedData = data.Items;
            extractedData.paging =
            {
                pageCount: data.PageCount,
                pageNo: data.PageNo,
                pageSize: data.PageSize,
                totalRecordCount: data.TotalRecordCount
            };
            return extractedData;
        } else {
            if (data != null) {
            extractedData = data;
            return extractedData;
            }
        }
    });
};