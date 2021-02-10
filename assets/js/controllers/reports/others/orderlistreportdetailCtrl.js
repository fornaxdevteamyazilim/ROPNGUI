app.controller('orderlistreportdetailCtrl', orderlistreportdetailCtrl);
function orderlistreportdetailCtrl($scope, OrderID, $modalInstance, Restangular,$translate, $stateParams, toaster, $window, $rootScope) {
          $rootScope.uService.EnterController("orderlistreportdetailCtrl");
  $scope.StoreData = {};
    $scope.getOrder = function () {
            Restangular.one('order', OrderID).get().then
                (function (restresult) {
                    $scope.item = Restangular.copy(restresult);
                    $scope.LoadOrderItems();
                    $scope.GetStore(restresult.StoreID)
                    for (var i = 0; i < restresult.states.length; i++) {
                        if (restresult.states[i].OrderStateID == 0)
                            if (restresult.states[i].User) {
                                $scope.User = restresult.states[i].User;
                            }
                    }
                })
    };
    $scope.getOrder();
    $scope.LoadOrderItems = function () {
        Restangular.all('orderitem').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "OrderID='" + OrderID + "'"
        }).then(function (_orderItems) {
            $scope.orderItems = angular.copy(_orderItems);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.GetStore = function (StoreID) {
        Restangular.one('store', StoreID).get().then
             (function (restresult) {
                 angular.copy(restresult, $scope.StoreData);
             })
    };
    $scope.ok = function () {
        $modalInstance.close('Ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

        $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("orderlistreportdetailCtrl");
    });
};