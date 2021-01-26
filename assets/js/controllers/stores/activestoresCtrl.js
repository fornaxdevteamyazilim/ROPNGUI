'use strict';
app.controller('activestoresCtrl', activestoresCtrl);
function activestoresCtrl($rootScope, $scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("activestoresCtrl");
    var as = this;
    as.search = '';
    $scope.translate = function () {
        $scope.trStoreName = $translate.instant('main.STORENAME');
        $scope.trLastRefresh = $translate.instant('main.LASTREFRESH');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.translate();
    $scope.item = {};
    as.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('rop6order/activestores').getList({//todo  controller name
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (as.search) ? "StoreName like '%" + as.search + "%'" : "",
            }).then(function (items) {
                params.total(items.paging);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    });
    var deregistration1 = $scope.$watch(angular.bind(as, function () {
        return as.search;
    }), function (value) {
        as.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("activestoresCtrl");
    });
};
