app.controller('ysorderrejectreasonCtrl', ysorderrejectreasonCtrl);
function ysorderrejectreasonCtrl($rootScope, $translate, $scope, $modalInstance, order, Restangular, toaster, $window,$http,NG_SETTING ) {
    $rootScope.uService.EnterController("ysorderrejectreasonCtrl");
    $scope.translate = function () {
        $scope.trrefusedYSOrderNote = $translate.instant('main.REFUSEDYSORDER');
        $scope.trResons = $translate.instant('main.REASONS');
        $scope.trisCustomerInformed = $translate.instant('main.CUSTOMERINFORMATION');
        $scope.trNote = $translate.instant('main.NOTE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.saveRejectResoan = function (data) {
        $http.get(NG_SETTING.apiServiceBaseUri + "/api/aggregator/OrderMapCancel", {
            params: {
                MapID: order.id,
                RejectReasonID:data.RejectReasonID,
                Notes:data.Notes,
                isCustomerInformed:data.isCustomerInformed||false
            }
        })
            .then(function (response) {
                toaster.pop('success', $translate.instant('orderfile.PairingSaved '));
            }, function (response) {
                toaster.pop('error', $translate.instant('orderfile.PairingNotSaved '), resp.data.ExceptionMessage);
            });
        $scope.ok();        
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                MapID:order.id
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.yemeksepetirejectreasons = [];
    $scope.loadEntities('aggregator/OrderCancelOptions', 'yemeksepetirejectreasons');
    $scope.ok = function () {
        $modalInstance.close('OK');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("ysorderrejectreasonCtrl");
    });
};