app.controller('changeysorderstoreCtrl', changeysorderstoreCtrl);
function changeysorderstoreCtrl($rootScope, $translate, $scope, $modalInstance, order, Restangular, toaster, $window,$http,NG_SETTING ) {
    $rootScope.uService.EnterController("changeysorderstoreCtrl");
    $scope.translate = function () {
        $scope.trchangeysorderstore = $translate.instant('main.CHANGEYSORDERSTORE');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trNote = $translate.instant('main.NOTE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.translate();
    $scope.saveRejectResoan = function (data) {
        $http.get(NG_SETTING.apiServiceBaseUri + "/api/aggregator/ChangeStore", {
            params: {
                OrderID: order.id,
                ToStoreID:data.StoreID,
                Notes:data.Notes
            }
        })
            .then(function (response) {
                //toaster.pop('warning', $translate.instant('Server.ServerError'), $translate.instant('Server.DataLoadingError'));
            }, function (response) {
                //toaster.pop('warning', $translate.instant('Server.ServerError'), $translate.instant('Server.DataLoadingError'));
            });
        $scope.ok();
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                OrderID:order.id
                //Calculate:false
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.store = [];
    $scope.loadEntities('aggregator/GetAvailibleStoresForTransfer', 'store');
    $scope.ok = function () {
        $modalInstance.close('OK');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("changeysorderstoreCtrl");
    });
};