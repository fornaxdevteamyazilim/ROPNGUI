'use strict';
app.controller('addcashCtrl', addcashCtrl);
function addcashCtrl($scope, $log, $modal, Restangular, SweetAlert, toaster, $window, $rootScope, $location, $translate, $modalInstance) {

    $scope.Amount = {};
    $scope.Description = {};
    $scope.AddCash = [];
    $scope.LoadAddCash = function (data) {
        Restangular.all('cash/addcash').post(
            {
                StoreID: $rootScope.user.StoreID,
                Amount: data.Amount,
                Description: data.Description

            }
        ).then(function (result) {
            toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            $scope.ok();
            return $scope.AddCash = result;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    };
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
