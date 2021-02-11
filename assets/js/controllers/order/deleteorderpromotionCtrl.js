app.controller('deleteorderpromotionCtrl', deleteorderpromotionCtrl);
function deleteorderpromotionCtrl($scope, $rootScope, $translate, $modalInstance, Order, Restangular, toaster, $window) {
    $rootScope.uService.EnterController("deleteorderpromotionCtrl");
    $scope.OrderNo = Order;
    $scope.delete = function (idx) {
        var person_to_delete = $scope.persons[idx];

        API.DeletePerson({ id: person_to_delete.id }, function (success) {
            $scope.persons.splice(idx, 1);
        });
    };
    $scope.LoadOrder = function () {
        Restangular.one('order', Order).get().then
             (function (restresult) {
                 angular.copy(restresult, $scope.order);
             },
            function (restresult) {
                swal("Error!", $translate.instant('Server.DataError'), "Warning");
            })
    };
    $scope.CopyOrder = function (order) {
        return {
            id: order.id,
            DepartmentID: order.DepartmentID,
            OrderNumber: order.OrderNumber,
            StoreID: order.StoreID,
            AddressID: order.AddressID,
            OrderTypeID: order.OrderTypeID,
            VAT: order.VAT,
            Amount: order.Amount,
            PaymentTypeID: order.PaymentTypeID,
            PaymentStatusID: order.PaymentStatusID,
            OrderStateID: order.OrderStateID,
            OrderDate: $filter('date')(order.OrderDate, 'yyyy-MM-dd HH:mm:ss'),
            DeliveryDate: $filter('date')(order.DeliveryDate, 'yyyy-MM-dd HH:mm:ss'),
            OperationDate: order.OperationDate,
            OrderNote: order.OrderNote,
            PaymentNote: order.PaymentNote,
            StoreTableID: order.StoreTableID,
        }
    };
    $scope.DeleteOrderPromotion = function (data) {
        Restangular.all('orderpromotion').delete(
     {
         OrderID: Orderid,
         StorePaymentTypeID: data.PaymentTypeID,
     }).then(function (result) {
         $scope.UpdateOrderPaymentType = result;
         $scope.ok();
         toaster.pop('success', $translate.instant('orderfile.StatusOrderChanged'), 'Success');
     }, function (response) {
         toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
     });
    };
    $scope.storepaymenttypes = [];
    $scope.loadStorePaymentTypes = function () {
        if (!$scope.storepaymenttypes.length) {
            Restangular.all('storepaymenttype').getList({
                pageNo: 1,
                pageSize: 1000,
                StoreID:$rootScope.user.StoreID,
            }).then(function (result) {
                $scope.storepaymenttypes = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadStorePaymentTypes();
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $scope.LoadOrder();
        $rootScope.uService.ExitController("deleteorderpromotionCtrl");
    });
};
