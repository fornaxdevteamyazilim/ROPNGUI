(function () {
    'use strict';
    app.controller('dateCtrl', dateCtrl);
    function dateCtrl($rootScope, $scope, $modalInstance, $filter, DateTime, $log, $window, ngnotifyService) {
        $rootScope.uService.EnterController("dateCtrl");
        if (!$scope.DateTime) {
            $scope.DateTime = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        }
        $scope.today = function () {
            $scope.DateTime = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        };
       $scope.clear = function () {
            $scope.DateTime = null;
        };
        $scope.ok = function () {
            $modalInstance.close($scope.DateTime = $filter('date')($scope.DateTime, 'yyyy-MM-dd'));
        };
       $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
       };
       $scope.$on('$destroy', function () {
           $rootScope.uService.ExitController("dateCtrl");
       });
    };
})();