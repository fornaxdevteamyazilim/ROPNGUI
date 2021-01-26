(function () {
    'use strict';
    app.controller('inventorydeliveryinvoicerelationCtrl', inventorydeliveryinvoicerelationCtrl);
    function inventorydeliveryinvoicerelationCtrl($rootScope, $translate, $scope, Restangular, $modalInstance, $filter, item, $log, $window, ngnotifyService, ngTableParams, toaster) {
        $rootScope.uService.EnterController("inventorydeliveryinvoicerelationCtrl");
        var data = item;
        $scope.UnasSigned = function (item) {
            Restangular.all('InventoryDelivery/unassigned').getList({
                pageNo: 1,
                pageSize: 1000,
                CompanyID: data.CompanyID,
                StoreID: (item.StoreID)?item.StoreID:'',
            }).then(function (result) {
                $scope.unassigned = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        };
        $scope.loadEntitiesCache = function (EntityType, Container) {
            if (!$scope[Container].length) {
                Restangular.all(EntityType).getList({}).then(function (result) {
                    $scope[Container] = result;
                }, function (response) {
                    toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
                });
            }
        };
        $scope.store = [];
        $scope.loadEntitiesCache('cache/Store', 'store');
        $scope.company = [];
        $scope.loadCompany = function () {
            if (!$scope.company.length) {
                Restangular.all('company').getList({
                    pageNo: 1,
                    pageSize: 1000,
                    sort: 'id',
                    search: ''
                }).then(function (result) {
                    $scope.company = result;
                }, function (response) {
                    toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        };
        $scope.loadCompany();
        $scope.ok = function (data) {
            var senddata = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i].isSelected == true) {
                    senddata.push(data[i])
                }
            }
            $modalInstance.close(senddata);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.$on('$destroy', function () {
            $rootScope.uService.ExitController("inventorydeliveryinvoicerelationCtrl");
        });
    };
})();