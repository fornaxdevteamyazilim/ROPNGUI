app.controller('orderproductitemsCtrl', orderproductitemsCtrl);
function orderproductitemsCtrl($rootScope,$translate, $scope, $modalInstance, $compile, ObjectID, OrderID, CurrentPersonID, CurrentSplitID, $modal, $filter, Restangular) {
    $rootScope.uService.EnterController("orderproductitemsCtrl");
    $scope.item = {};
    $scope.ObjectID = ObjectID;
    $scope.OrderID = OrderID;
    $scope.CurrentPersonID = CurrentPersonID;
    $scope.CurrentSplitID = CurrentSplitID;
    $scope.ok = function () {
        $modalInstance.close($scope.item);
        $scope.DisableWatch();
        $scope.$destroy();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
        $scope.DisableWatch();
        $scope.$destroy();
    };
    $scope.RefreshOrderItem = function (ObjectID, oi) {
        var newElement = angular.element('<orderable id="itemdetails" ngif="OrderID" item="' + ObjectID + '" order="OrderID" orderitem="' + oi + '"class="col-lg-12 col-md-12 col-sm-12 col-xs-12 slide-animate"></orderable>');
        $('#itemdetails').replaceWith(newElement);
        $compile(newElement)($scope);
    }
    $scope.$on('$destroy', function () {
        $scope.DisableWatch();
        $rootScope.uService.ExitController("orderproductitemsCtrl");
    });
    $scope.DisableWatch = function () {
    //...
        }
};
