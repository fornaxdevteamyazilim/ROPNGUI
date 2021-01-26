app.controller('hotandreadyCtrl', hotandreadyCtrl);
function hotandreadyCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("hotandreadyCtrl");
    $scope.item = {};
    $scope.isWaiting=true;
    userService.userAuthorizated();
    if ($stateParams.id != 'new') {
        Restangular.one('hotandready').get({
        hnrDataID:$stateParams.id
        }).then
            (function (restresult) {
            $scope.isWaiting=false;
                $scope.item = Restangular.copy(restresult);
            },
           function (restresult) {
               toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
           }
           )
    }
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("hotandreadyCtrl");
    });
};
