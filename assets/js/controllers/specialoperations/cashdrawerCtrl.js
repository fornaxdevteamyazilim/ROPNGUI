'use strict';
app.controller('cashdrawerCtrl', cashdrawerCtrl);
function cashdrawerCtrl($scope, $log, $modal, Restangular, SweetAlert, toaster, $window, $rootScope, $location, $translate, $modalInstance) {
    $rootScope.uService.EnterController("cashdrawerCtrl");
    $scope.Notes = {};
    $scope.Description = {};
   // $scope.isAutomatic  = {};
    $scope.CashDrawerOpenReason = [];
    $scope.LoadCheckOutCash = function (data) {
        if (data.isAutomatic == 0) {
            Restangular.all('tools/opencashdrawer').post(
           {
           // isAutomatic: data.isAutomatic,
               Notes: data.Notes,
               Description: data.Description,
               CashDrawerOpenReasonID: data.CashDrawerOpenReasonID
           }
       ).then(function (result) {
           toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
           $scope.ok();
           return $scope.CashDrawerOpenReason = result;
       }, function (response) {
           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
       });
        }
               if (data.isAutomatic == 1) {
            Restangular.all('tools/opencashdrawer').post(
           {
           // isAutomatic: data.isAutomatic,
               Notes: data.Notes,
               Description: data.Description,
               CashDrawerOpenReasonID: data.CashDrawerOpenReasonID
           }
       ).then(function (result) {
           toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
           $scope.ok();
           return $scope.CashDrawerOpenReason = result;
       }, function (response) {
           toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
       });
        }
    };
    // $scope.loadEntities = function (EntityType, Container) {
    //     if (!$scope[Container].length) {
    //         Restangular.all(EntityType).getList({
    //             pageNo: 1,
    //             pageSize: 1000,
    //         }).then(function (result) {
    //             $scope[Container] = result;
    //         }, function (response) {
    //             toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    //         });
    //     }
    // };
 
    $scope.AccountTransactionGroups = [];
   // $scope.loadEntities('AccountTransactionGroup', 'AccountTransactionGroups');
    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("cashdrawerCtrl");
    });
};
