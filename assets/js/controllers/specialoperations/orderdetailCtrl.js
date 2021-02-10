app.controller('orderdetailCtrl', orderdetailCtrl);
function orderdetailCtrl($rootScope, $scope, $translate, RelatedID, $modalInstance, Restangular, $stateParams, toaster, $window) {
    $rootScope.uService.EnterController("orderdetailCtrl");
    $scope.StoreData = {};
    $scope.getOrder = function () {
        Restangular.one('order', RelatedID).get().then
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
            search: "OrderID='" + RelatedID + "'"
        }).then(function (_orderItems) {
            $scope.orderItems = angular.copy(_orderItems);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
            SweetAlert.swal( $translate.instant('Server.ServerError'), angular.toJson(response, false), "error");
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
        $rootScope.uService.ExitController("orderdetailCtrl");
    });
};