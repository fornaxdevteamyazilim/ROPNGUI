app.controller('kdslastordersCtrl', kdslastordersCtrl);
function kdslastordersCtrl($rootScope, $scope, $modalInstance, $translate, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $translate) {
    $rootScope.uService.EnterController("kdslastordersCtrl");
    $scope.translate = function () {
        $scope.trQuantity = $translate.instant('main.QUANTITY');
        $scope.trProductName = $translate.instant('main.PRODUCTNAME');
        $scope.trState = $translate.instant('main.STATE');
        $scope.trDuration = $translate.instant('main.DURATION');
        $scope.trTimer = $translate.instant('main.TIMER');
        $scope.trDriverName = $translate.instant('main.DRIVERNAME');
        $scope.trVehicle = $translate.instant('main.VEHICLE');
        $scope.trTotalOrder = $translate.instant('main.TOTALORDER');
        $scope.trStateTime = $translate.instant('main.STATETIME');
        $scope.ordernumber = $translate.instant('main.ORDERNUMBER');
        $scope.productname = $translate.instant('main.PRODUCTNAME');
        $scope.materials = $translate.instant('main.MATERIALS');
        $scope.state = $translate.instant('main.STATE');
        $scope.duration = $translate.instant('main.DURATION');
        $scope.timer = $translate.instant('main.TIMER');
        $scope.timerstr = $translate.instant('main.TIMERSTR');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.orderitemstates = [];
    $scope.getLastOrders = function () {
        Restangular.all('kds/getitems').getList({
            StoreID: $rootScope.user.StoreID,
            OrderStateID: 5,
        }).then(function (result) {
            $scope.inProgress = false;
            angular.copy(result.plain(), $scope.orderitemstates);
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.getLastOrders();
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("kdslastordersCtrl");
    });
};