app.controller('changeorderstoreCtrl', changeorderstoreCtrl);
function changeorderstoreCtrl($rootScope,$translate, $scope, $modalInstance, item, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $translate) {
    $rootScope.uService.EnterController("changeorderstoreCtrl");
    var ao = this;
    $scope.Stores = [];
    if (item && item.id) {
        Restangular.all('cache/store').getList({
            pageNo: 1,
            pageSize: 200,
        }).then(function (items) {
            angular.copy(items,$scope.Stores);
            $scope.LoadOrder();
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), responsedata.ExceptionMessage);
        });

    }
    $scope.LoadOrder = function () {
        Restangular.one('order', item.id).get().then
             (function (restresult) {
                $scope.order= angular.copy(restresult);
             },
            function (restresult) {
                swal("Error!", $translate.instant('Server.DataError'), restresult.data.ExceptionMessage);
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
    $scope.SaveData = function (data) {
        var ordertosave = $scope.CopyOrder($scope.order);
        ordertosave.StoreID = data.StoreID;
        ordertosave.OrderStateID = 13;
        Restangular.restangularizeElement('', ordertosave, 'order');
        if (ordertosave.restangularized && ordertosave.id) {
            ordertosave.put().then(function (resp) {
                toaster.pop('success',$translate.instant('accounting.Updated'), $translate.instant('accounting.Updated'));
                $scope.ok();
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    }; 
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("changeorderstoreCtrl");
    });
};
