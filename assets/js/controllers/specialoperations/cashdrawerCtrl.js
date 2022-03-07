'use strict';
app.controller('cashdrawerCtrl', cashdrawerCtrl);
function cashdrawerCtrl($scope, $log, $modal, Restangular, SweetAlert, toaster, $window, $rootScope, $location, $translate, $modalInstance, localStorageService) {
    $rootScope.uService.EnterController("cashdrawerCtrl");
    $scope.Notes = {};
    //$scope.Description = {};
    // $scope.isAutomatic  = {};
    $scope.CashDrawerOpenReason = [];
    $scope.LoadCheckOutCash = function (data) {
        Restangular.one('tools/opencashdrawer').get(
            {
                Notes: data.CashDrawerOpenReasonID == '300158910401' ? data.Note : '',
                CashDrawerOpenReasonID: data.CashDrawerOpenReasonID,
                PosName: localStorageService.get('ClientName')
            }
        ).then(function (result) {
            toaster.pop('success', $translate.instant('orderfile.THEDRAWERISOPENED'), $translate.instant('orderfile.THEDRAWERISOPENED'));
            $scope.ok();
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
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
    $scope.CashDrawerOpenReasons = [];
    $scope.loadEntities('CashDrawerOpenReason', 'CashDrawerOpenReasons');
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
