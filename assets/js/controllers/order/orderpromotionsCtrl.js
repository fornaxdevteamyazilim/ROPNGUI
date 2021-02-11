app.controller('orderpromotionsCtrl', orderpromotionsCtrl);
function orderpromotionsCtrl($rootScope, $translate, $scope, $log, $filter, $modalInstance, SweetAlert, Restangular, Order, ngTableParams, toaster, $window) {
    $rootScope.uService.EnterController("orderproductitemsCtrl");
    $scope.AktiveCode = false;
    $scope.translate = function () {
        $scope.trSlectPromotion = $translate.instant('main.SELECTPROMOTION');
        $scope.trCODE = $translate.instant('main.CODE');
        $scope.trOk = $translate.instant('main.OK');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.ActiveCode = function (data) {
        var bilgi = data;
        Restangular.all('promotion').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "tt.id in ('" + data.PromotionID + "')"
        }).then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].PromotionScenario == 1)
                    $scope.AktiveCode = true;
            }
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'));
        });
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container,OrderID) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                CalcParameters:"OrderID="+OrderID
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.promotions = [];
    $scope.loadEntities('promotion', 'promotions', Order.id);
    $scope.OrderPromotion = [];
    $scope.SaveOrderPromotrion = function (data) {
        var result = { PromotionID: data.PromotionID, OrderID: Order.id, Code: data.Code };
        Restangular.restangularizeElement('', result, 'orderpromotion');
        result.post().then(
            function (res) {
                toaster.pop("success", $translate.instant('orderfile.PromotionAdded'));
                $scope.OrderPromotion = res;
                $scope.ok();
            },
            function (res) {
                toaster.pop("error", $translate.instant('orderfile.CannotAddPromotion'), res.data.ExceptionMessage);
            });
    };
    $scope.ok = function () {
        $modalInstance.close($scope.OrderPromotion);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("orderproductitemsCtrl");
    });
};
