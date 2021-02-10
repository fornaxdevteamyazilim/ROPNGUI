app.controller('orderpaymenttypesCtrl', orderpaymenttypesCtrl);
function orderpaymenttypesCtrl($scope, $translate, $rootScope, $modalInstance, item, Restangular, toaster, $window, $translate) {
    $scope.OrderNo = item.id;
    $rootScope.uService.EnterController("orderpaymenttypesCtrl");
    $scope.OrderNumber = item.OrderNumber;
    $scope.SaveData = function (PaymentTypeID) {
        Restangular.restangularizeElement('', item, 'order');
        if (item.restangularized && item.id) 
            item.put().then(function (resp) {
            toaster.pop("success", $translate.instant('orderfile.PAYMENTTYPECHANGED'));
            $scope.ok();
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.paymenttypes = [];
    $scope.loadPaymenttypes = function () {
        if (!$scope.paymenttypes.length) {
            Restangular.all('cache/storepaymenttype').getList({
                StoreID: item.StoreID,
               OrderID: item.id ,
            }).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].isActiveValue == true) {
                        $scope.paymenttypes.push(result[i]);
                    }
                }
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadPaymenttypes();
    $scope.ok = function () {
        $modalInstance.close('OK');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("orderpaymenttypesCtrl");
    });
};