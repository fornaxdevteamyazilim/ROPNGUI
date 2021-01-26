app.controller('changeysorderstoreCtrl', changeysorderstoreCtrl);
function changeysorderstoreCtrl($rootScope, $translate, $scope, $modalInstance, order, Restangular, toaster, $window, $translate) {
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
        if (order.route == "YemekSepetiOrderMap" ) {
            if (data.Notes) {
                order.Notes = data.Notes;
                order.StoreID = data.StoreID;
                Restangular.restangularizeElement('', order, 'yemeksepetiordermap');
                order.put().then(function (resp) {
                    $scope.ok();
                    toaster.pop('success', $translate.instant('orderfile.Saved') );
                }, function (resp) {
                    toaster.pop('error', $translate.instant('orderfile.NotSaved '), resp.data.ExceptionMessage);
                });
            }
        }
        if (order.route == "ordertools/NewOrders") {
            if (data.Notes) {
                order.OrderNote = data.Notes;
                order.StoreID = data.StoreID;
                Restangular.restangularizeElement('', order, 'order');
                order.put().then(function (resp) {
                    $scope.ok();
                    toaster.pop('success', $translate.instant('orderfile.Saved') );
                }, function (resp) {
                    toaster.pop('error', $translate.instant('orderfile.NotSaved '), resp.data.ExceptionMessage);
                });
            }
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.store = [];
    $scope.loadEntities('cache/store', 'store');
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