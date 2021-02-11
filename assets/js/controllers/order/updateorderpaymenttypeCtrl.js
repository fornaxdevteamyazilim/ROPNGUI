app.controller('updateorderpaymenttypeCtrl', updateorderpaymenttypeCtrl);
function updateorderpaymenttypeCtrl($scope, $translate, $rootScope, $modalInstance, Orderid, Restangular, toaster, $window) {
    $rootScope.uService.EnterController("updateorderpaymenttypeCtrl");
    $scope.OrderNo = Orderid;
    $scope.translate = function () {
        $scope.ordernumber = $translate.instant('main.ORDERNUMBER');
    }
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.LoadOrder = function () {

        Restangular.one('order', Orderid).get().then
             (function (restresult) {
                 angular.copy(restresult, $scope.order);
             },
            function (restresult) {
                swal("Error!",$translate.instant('Server.DataError'), "Warning");
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
    $scope.SaveData = function (PaymentTypeID) {
        Restangular.all('ordertools/updateorderpaymenttype').getList(
     {
         OrderID: Orderid,
         StorePaymentTypeID: PaymentTypeID,
     }).then(function (result) {
     $scope.UpdateOrderPaymentType = result;
     $scope.ok();
     toaster.pop('success', $translate.instant('orderfile.PaymentTypeOrderChanged'), 'Success');
 }, function (response) {
             toaster.pop('error',$translate.instant('Server.ServerError'), restresult.data.ExceptionMessage);
 });
    };
    $scope.storepaymenttypes = [];
    $scope.loadStorePaymentTypes = function () {
        if (!$scope.storepaymenttypes.length) {
            Restangular.all('storepaymenttype').getList({
                pageNo: 1,
                pageSize: 1000,
                search: "StoreID='" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                $scope.storepaymenttypes = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
        tranlatelistener();
        $rootScope.uService.ExitController("updateorderpaymenttypeCtrl");
    });
};
