'use strict';
app.controller('checkoutcashCtrl', checkoutcashCtrl);
function checkoutcashCtrl($scope, $log, $modal, Restangular, SweetAlert, toaster, $window, $rootScope, $location, $translate, $modalInstance) {
    $rootScope.uService.EnterController("checkoutcashCtrl");
    $scope.Amount = {};
    $scope.Description = {};
    $scope.CheckOutCash = [];
    $scope.LoadCheckOutCash = function (data) {
        if (data.Value == 0) {
            Restangular.all('cash/addcash').post(
           {
               StoreID: $rootScope.user.StoreID,
               Amount: data.Amount,
               Description: data.Description,
               AccountTransactionGroupID: data.AccountTransactionGroupID
           }
       ).then(function (result) {
           toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
           $scope.ok();
           return $scope.CheckOutCash = result;
       }, function (response) {
           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
       });
        }
               if (data.Value == 1) {
            Restangular.all('cash/removecash').post(
           {
               StoreID: $rootScope.user.StoreID,
               Amount: data.Amount,
               Description: data.Description,
               AccountTransactionGroupID: data.AccountTransactionGroupID
           }
       ).then(function (result) {
           toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
           $scope.ok();
           return $scope.CheckOutCash = result;
       }, function (response) {
           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
       });
        }
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.AccountTransactionGroups = [];
    $scope.loadEntities('AccountTransactionGroup', 'AccountTransactionGroups');
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("checkoutcashCtrl");
    });
};
