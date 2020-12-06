'use strict';
app.controller('giroreportCtrl', giroreportCtrl);
function giroreportCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("giroreportCtrl");
    $scope.NewDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    $scope.giroreports = [];
    $scope.LoadGiroReports = function (FromValue, ToValue) {
        $scope.isWaiting = true;
        Restangular.all('reports/turnover/daily').getList(
            {
                StoreID: $rootScope.user.StoreID,
                FromDate: (FromValue) ? "'" + FromValue + "'" : "'" + $scope.NewDate + "'",
                ToDate: (ToValue) ? "'" + ToValue + "'" : "'" + $scope.NewDate + "'",
            }
        ).then(function (result) {
            $scope.isWaiting = false;
            $scope.giroreports = result;
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.LoadGiroReports();
    $scope.FromDate = function (item) {
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
            $scope.DateFromDate = $filter('date')(data, 'yyyy-MM-dd');
            $scope.LoadGiroReports($scope.DateFromDate);
        })
    };
    $scope.ToDate = function (item) {
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
            var data = ngnotifyService.ServerTime(item);
            $scope.DateToDate = $filter('date')(data, 'yyyy-MM-dd');
            $scope.LoadGiroReports($scope.DateToDate);
        })
    };
    $scope.Time = ngnotifyService.ServerTime();
    var stopTime;
    stopTime = $interval(function () { $scope.Timer(); }, 1000);
    $scope.Timer = function () {
        $scope.Time = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
    }
    //$scope.$on('$destroy', function () {
    //    $interval.cancel(stopTime);

    //});
    $scope.Back = function () {
        $window.history.back();
    };

        $scope.$on('$destroy', function () {
                $interval.cancel(stopTime);
        $element.remove();
        $rootScope.uService.ExitController("giroreportCtrl");
    });
};
