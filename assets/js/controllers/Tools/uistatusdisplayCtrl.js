'use strict';
app.controller('uistatusdisplayCtrl', uistatusdisplayCtrl);
function uistatusdisplayCtrl($rootScope, $scope, $modalInstance, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $translate, userService) {
    var uisd = this;
    $scope.translate = function () {
        $scope.trcontrollerName = $translate.instant('main.CONTRALLERNAME');
        $scope.trUsageCount = $translate.instant('main.USAGECOUNT');
        $scope.trInstanceCount = $translate.instant('main.INSTANCECOUNT');
    };
    $scope.translate();
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 100,
    },
    {
        counts: [],
        getData: function ($defer, params) {
            var data = userService.GetControllerUsages();
            $defer.resolve(userService.GetControllerUsages());
        }
    });
    $scope.refresh = function () {        
        $scope.tableParams.reload();
    };
    $scope.ok = function () {
        $modalInstance.close('Yes');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('No');
    };
};
