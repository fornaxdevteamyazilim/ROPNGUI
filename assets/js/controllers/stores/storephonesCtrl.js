'use strict';
app.controller('storephonesCtrl', storephonesCtrl);
function storephonesCtrl($rootScope, $scope, $modalInstance, $translate, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window) {
    $rootScope.uService.EnterController("storephonesCtrl");
    $scope.Stores = [];
    var sp = this;
    $scope.search = '';
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trFixedPhone = $translate.instant('main.FIXEDPHONE');
        $scope.trPhone = $translate.instant('main.NUMBER');
    };
    $scope.translate();
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        counts: [],
        getData: function ($defer, params) {
            Restangular.all('cache/store').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: '+name'
            }).then(function (items) {
                var formattedNumber;
                for (var i = 0; i < items.length; i++) {
                    var phone = items[i].phone;
                    if (phone && phone.length && phone.length == 10) {
                        var area = phone.substring(0, 3);
                        var front = phone.substring(3, 6);
                        var end = phone.substring(6, 10);
                        if (front) {
                            formattedNumber = ("(" + area + ") " + front);
                        }
                        if (end) {
                            formattedNumber += ("-" + end);
                        }
                        items[i].phone = formattedNumber;
                    }
                }
                $scope.Stores = items;
                params.total(items);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    });
    $scope.ok = function () {
        $modalInstance.close('Yes');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('No');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("storephonesCtrl");
    });
};
