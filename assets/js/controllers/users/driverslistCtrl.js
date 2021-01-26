app.controller('driverslistCtrl', driverslistCtrl);
function driverslistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, userService) {
    $rootScope.uService.EnterController("driverslistCtrl");
    var dl = this;
    userService.userAuthorizated();
    $scope.translate = function () {
        $scope.trDriversName = $translate.instant('main.DRIVERSNAME');
        $scope.trStore = $translate.instant('main.STORE');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    $scope.SelectItem = function (itemID) {
        location.href = '#/app/users/drivers/orderlist/' + itemID;
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (dl.search && dl.search.length > 1) {
            result.push("name like '%" + dl.search + "%'");
        }
        result.push("StoreID='" + $rootScope.user.StoreID + "'");
        return result;
    };
    dl.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('user').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search:  $scope.BuildSearchString()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    });
    var deregistration = $scope.$watch(angular.bind(dl, function () {
        return dl.search;
    }), function (value) {
        dl.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("driverslistCtrl");
    });
};
