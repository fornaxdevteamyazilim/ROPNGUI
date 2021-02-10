app.controller('incomeslipCtrl', incomeslipCtrl);
function incomeslipCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, $filter, ngnotifyService, $element, $location, userService) {
    $rootScope.uService.EnterController("incomeslipCtrl");
    var is = this;
    is.search = '';
    userService.userAuthorizated();
    $scope.translate = function () {
        $scope.trNumber = $translate.instant('main.NUMBER');
        $scope.trSlipDateTime = $translate.instant('main.SLIPDATETIME');
        $scope.trCreateDate = $translate.instant('main.REGISTRATIONDATE');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trNewItem = $translate.instant('main.ADDNEWSLIP');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });

    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/accountingintegration/incomeslip/edit/' + $scope.SelectedItem;
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (is.search && is.search.length > 0) {
            result.push("Number like'%" + is.search + "%'");
        }
        return result;
    };
    is.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
            getData: function ($defer, params) {
                Restangular.all('AccountingIncomeSlip').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.BuildSearchString(),
                    sort: '-SlipDate'
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    var deregistration1 = $scope.$watch(angular.bind(is, function () {
        return is.search;
    }), function (value) {
        is.tableParams.reload();
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
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
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("incomeslipCtrl");
    });
};
