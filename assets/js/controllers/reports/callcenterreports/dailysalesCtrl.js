app.controller('dailysalesCtrl', dailysalesCtrl);
function dailysalesCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $location, $translate, ngnotifyService,$rootScope, $element) {
    $rootScope.uService.EnterController("dailysalesCtrl");

    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.AgentOrders = [];
    $scope.LoadAgentOrders = function (FromValue) {
        Restangular.all('ccstats/agentstoreorders').getList(
            {
                StartDate: $scope.StartDate,
                EndDate: $scope.EndDate,
            }
        ).then(function (result) {
            $scope.TotalOrders = 0;
            $scope.TotalAmount = 0;
            for (var i = 0; i < result.length; i++) {
                $scope.TotalOrders += result[i].OrdersCount;
            }
            for (var i = 0; i < result.length; i++) {
                $scope.TotalAmount += result[i].OrdersAmount;
            }
            $scope.AgentOrders = result;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadAgentOrders();
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };

        $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("dailysalesCtrl");
    });
};