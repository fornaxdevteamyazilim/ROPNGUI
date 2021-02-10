(function () {
    'use strict';
    app.controller('deliverytimeCtrl', deliverytimeCtrl);
    function deliverytimeCtrl($scope, $log, $modal, $filter,$translate, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location) {

        if (!$scope.StartDate) {
            $scope.StartDate = $filter('date')(new Date(), 'yyyy-MM-dd ');
        }
        if (!$scope.EndDate) {
            $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD ');
        }
        $scope.DeliveryTimes = [];
        $scope.LoadDeliveryTimes = function (FromValue) {
            Restangular.all('ccstats/agentorders').getList(
                {
                    StartDate: $scope.StartDate,
                    EndDate: $scope.EndDate,
                }
            ).then(function (result) {
                //$scope.TotalOrders = 0;
                //$scope.TotalAmount = 0;
                //for (var i = 0; i < result.length; i++) {
                //    $scope.TotalOrders += result[i].OrdersCount;
                //}
                //for (var i = 0; i < result.length; i++) {
                //    $scope.TotalAmount += result[i].OrdersAmount;
                //}
                $scope.DeliveryTimes = result;
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response);
            });
        };
        $scope.LoadDeliveryTimes();

        //$scope.AgentOrdersExcel = function () {
        //    location.href = 'http://10.101.252.150:9065/api/ccstats/agentordersxls?StartDate=' + $scope.StartDate + '&EndDate=' + $scope.EndDate;
        //};

        $scope.SelectStartDate = function (item) {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/Tools/date.html',
                controller: 'dateCtrl',
                size: '',
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
    };
})();