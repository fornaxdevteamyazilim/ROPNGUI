'use strict';
angular.module("config-restangular", ['restangular'])
.config(restangularConfig);

function restangularConfig(RestangularProvider) {
    //RestangularProvider.setBaseUrl('http://10.101.252.150:9065/api/'); //Little Caesars 150
    //RestangularProvider.setBaseUrl('http://10.101.252.152:9065/api/'); //Little Caesars 152
    //RestangularProvider.setBaseUrl('http://85.111.42.134:9000/api/'); //Little Caesars
    //RestangularProvider.setBaseUrl('http://85.111.42.134:9065/api/'); //Little Caesars Alonet
    //RestangularProvider.setBaseUrl('http://fornax.yazilimocagi.net:9069/api/'); //FORNAX
    //RestangularProvider.setBaseUrl('http://demo.yazilimocagi.net:9067/api/'); //demo
    //RestangularProvider.setBaseUrl('http://10.101.252.150:9077/api/'); //Little Caesars 9077
    //RestangularProvider.setBaseUrl('http://10.101.252.150:9067/api/'); //Little Caesars 9067
    //RestangularProvider.setBaseUrl('http://pizzahut.ropng.site:9075/api/'); //PH - Test
    //RestangularProvider.setBaseUrl('http://192.168.9.40:9067/api/'); //PH
    RestangularProvider.setBaseUrl('http://localhost:9065/api/'); //localhost

    
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