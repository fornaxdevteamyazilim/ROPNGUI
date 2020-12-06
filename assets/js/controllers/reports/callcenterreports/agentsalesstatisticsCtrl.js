'use strict';
app.controller('agentsalesstatisticsCtrl', agentsalesstatisticsCtrl);
function agentsalesstatisticsCtrl($scope, $log, $modal, $timeout, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $location, $translate, ngnotifyService,$rootScope, $element) {
    $rootScope.uService.EnterController("agentsalesstatisticsCtrl");
    var stopTime;
    $scope.OnRefresh = true;
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.AgentSalesStatistics = [];
    $scope.LoadAgentSalesStatistics = function () {
        $scope.isWaiting = true;
        Restangular.all('ccstats/agentsalestatistics').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
            }
        ).then(function (result) {
            $scope.OrdersAmountNoVAT = 0;
            $scope.OrdersCount = 0;
            $scope.AC = 0;
            $scope.Group1ProductCount = 0;
            $scope.Group1ProductRatio = 0;
            $scope.Group2ProductCount = 0;
            $scope.Group2ProductRatio = 0;
            $scope.GroupsAmountNoVAT = 0;
            $scope.GroupsAmounRatioNoVAT = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersAmountNoVAT += result[i].OrdersAmountNoVAT;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.OrdersCount += result[i].OrdersCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.AC += result[i].AC;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.Group1ProductCount += result[i].Group1ProductCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.Group1ProductRatio += result[i].Group1ProductRatio;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.Group2ProductCount += result[i].Group2ProductCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.Group2ProductRatio += result[i].Group2ProductRatio;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.GroupsAmountNoVAT += result[i].GroupsAmountNoVAT;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.GroupsAmounRatioNoVAT += result[i].GroupsAmounRatioNoVAT;
            }
            $scope.isWaiting = false;
            $scope.AgentSalesStatistics = result;
            $scope.start();
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadAgentSalesStatistics();
    $scope.AgentSalesStatisticsExcel = function () {
        location.href = 'http://10.101.252.150:9065/api/ccstats/agentsalestatisticsxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate;
    };
    $scope.SelectStartDate = function (item) {
        $scope.stop();
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
            $scope.OnRefresh = false;
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.SelectEndDate = function (item) {
        $scope.stop();
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
            $scope.OnRefresh = false;
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.RefreshData = function () {
        $scope.LoadAgentSalesStatistics();
        $scope.start();
    };
    $scope.start = function () {
        $scope.stop();
        if ($scope.OnRefresh == true) {
            stopTime = $timeout(function () { $scope.RefreshData(); }, 60000);
        }
    };
    $scope.stop = function () {
        $timeout.cancel(stopTime);
    };
    $scope.$on('$destroy', function () {
        $scope.stop();
    });
    $scope.$watch(angular.bind($scope.OnRefresh, function () {
        return $scope.OnRefresh;
    }), function (value) {
        if (value == false) {
            $scope.stop();
        }
        if (value == true) {
            $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
            $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
            $scope.start();
        }
    });
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("agentsalesstatisticsCtrl");
    });
};
