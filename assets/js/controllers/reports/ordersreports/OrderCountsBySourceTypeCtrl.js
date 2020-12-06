'use strict';
app.controller('OrderCountsBySourceTypeCtrl', OrderCountsBySourceTypeCtrl);
function OrderCountsBySourceTypeCtrl($scope, $log, $modal, $filter, Restangular, toaster, $window, $location, $translate, NG_SETTING, userService, ngnotifyService,$rootScope, $element) {
    $rootScope.uService.EnterController("OrderCountsBySourceTypeCtrl");
    userService.userAuthorizated();
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
    }
    $scope.Data = [];
    $scope.LoadOrderCountsBySourceTypePivot = function (FromValue) {
        $scope.isWaiting = true;
        Restangular.all('order/reports/OrderCountsBySourceTypePivot').getList(
    {
        EndDate: $scope.EndDate,
        StartDate: $scope.StartDate,
        OrderSourceID: ($scope.OrderSourceID == null) ? '' : $scope.OrderSourceID,
        PaymentTypeID: ($scope.PaymentTypeID == null) ? '' : $scope.PaymentTypeID,
    }).then(function (result) {
        $scope.isWaiting = false;
        $scope.Data = result.plain();
        $scope.gridOptions = { data: 'Data' };
        $scope.grid = true;
    }, function (response) {
        $scope.isWaiting = false;
        toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    });
    };
    $scope.GetOrderSourceID = function (data) {
        $scope.OrderSourceID = data;
    }
    $scope.GetExcel = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/order/reports/OrderCountsBySourceTypePivotxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate + '&OrderSourceID=&PaymentTypeID=';
    };
    $scope.SelectStartDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    $scope.SelectEndDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd ');
        })
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("OrderCountsBySourceTypeCtrl");
    });
};