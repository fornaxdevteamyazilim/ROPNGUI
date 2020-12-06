app.controller('changeorderdriverCtrl', changeorderdriverCtrl);
function changeorderdriverCtrl($scope, $modal, $translate, $filter, OrderStates, $modalInstance, Restangular, $stateParams, ngTableParams, SweetAlert, toaster, $window, $rootScope, $location, userService ) {
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
              toaster.pop('warning', $translate.instant('invantories.Cancelled'), restresult.data.ExceptionMessage);
          })
        Restangular.all('drivervehicle').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "Drivers.StoreID='" + $rootScope.user.StoreID + "'"
        }).then(function (result) {
            angular.copy(result, $scope.Drivers);
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
    $scope.SaveNewDriver = function (driverId) {
        for (var i = 0; i < OrderStates.length; i++) {
            if (OrderStates[i].OrderStateID == 10 || OrderStates[i].OrderStateID == 6) {
                var state = OrderStates[i];
                state.DriverID = driverId;
                Restangular.restangularizeElement('', state, $translate.instant('dispatcherfile.orderstate'));
                state.put().then(function (resp) {
                    toaster.pop('success',$translate.instant('dispatcherfile.Drivechanged') );
                },
                    function (err) {
                        if (err) {
                            toaster.pop('error', $translate.instant('dispatcherfile.Driverupdated'), err.error_description);
                        }
                        else {
                            toaster.pop('error',  $translate.instant('dispatcherfile.Driverupdated'), $translate.instant('Server.UnknownError'));
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