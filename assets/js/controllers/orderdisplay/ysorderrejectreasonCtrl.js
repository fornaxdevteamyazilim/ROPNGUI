app.controller('ysorderrejectreasonCtrl', ysorderrejectreasonCtrl);
function ysorderrejectreasonCtrl($rootScope, $translate, $scope, $modalInstance, order, Restangular, toaster, $window, $translate) {
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
        if (data.Notes) {
            order.Notes = data.Notes;
            order.YemekSepetiOrderStateID = 7;
            order.RejectReasonID = data.RejectReasonID;
            order.isCustomerInformed = data.isCustomerInformed;
            Restangular.restangularizeElement('', order, 'yemeksepetiordermap');
            order.put().then(function (resp) {
                $scope.ok();
                toaster.pop('success', $translate.instant('orderfile.PairingSaved '));
            }, function (resp) {
                toaster.pop('error', $translate.instant('orderfile.PairingNotSaved '), resp.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.yemeksepetirejectreasons = [];
    $scope.loadEntities('cache/yemeksepetirejectreasons', 'yemeksepetirejectreasons');
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