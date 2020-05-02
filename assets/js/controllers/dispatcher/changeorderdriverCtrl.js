app.controller('changeorderdriverCtrl', changeorderdriverCtrl);
function changeorderdriverCtrl($scope, $modal, $filter, OrderStates, $modalInstance, Restangular, $stateParams, ngTableParams, SweetAlert, toaster, $window, $rootScope, $location, userService ) {
    $rootScope.uService.EnterController("changeorderdriverCtrl");
    var cod;
    $scope.state = {};
    $scope.Drivers=[];
    $scope.OrderStateID = OrderStates[0].id;
    if ($scope.OrderStateID) {
        Restangular.one('orderstate', $scope.OrderStateID).get().then
           (function (restresult) {
               angular.copy(restresult, $scope.state);
           },
          function (restresult) {
              toaster.pop('warning', "İptal edildi !", restresult.data.ExceptionMessage);
          })
        Restangular.all('drivervehicle').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "Drivers.StoreID='" + $rootScope.user.StoreID + "'"
        }).then(function (result) {
            angular.copy(result, $scope.Drivers);
        }, function (response) {
            toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
        });
    }
    $scope.SaveNewDriver = function (driverId) {
        for (var i = 0; i < OrderStates.length; i++) {
            if (OrderStates[i].OrderStateID == 10 || OrderStates[i].OrderStateID == 6) {
                var state = OrderStates[i];
                state.DriverID = driverId;
                Restangular.restangularizeElement('', state, 'orderstate');
                state.put().then(function (resp) {
                    toaster.pop('success', "Sürücü değiştirildi !");
                },
                    function (err) {
                        if (err) {
                            toaster.pop('error', "Sürücü güncellenmedi !", err.error_description);
                        }
                        else {
                            toaster.pop('error', "Sürücü güncellenmedi!", "Bilinmeyen Hata!");
                        }
                    });
            }
        }
        $scope.ok();
    };
    $scope.ok = function () {
        $modalInstance.close('Yes');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("changeorderdriverCtrl");
    });
};