app.controller('changestoredataCtrl', changestoredataCtrl);
function changestoredataCtrl($rootScope, $scope,$translate, $modalInstance, item, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $translate) {
    $rootScope.uService.EnterController("changestoredataCtrl");
    angular.copy(item.Store.name, $scope.StoreName);
    if (item && item.Store && item.Store.id) {
        Restangular.one('store', item.Store.id).get().then(function (restresult) {
                 $scope.StoreServicesTime = angular.copy(restresult.ServiceTime);
                 $scope.StoreTKWServicesTime = angular.copy(restresult.ServiceTimeTKW);
                 $scope.StoreNote = angular.copy(restresult.notes);
             },function (restresult) {
                swal("Error!",$translate.instant('Server.DataError'), restresult.data.ExceptionMessage);
            });
    }
    $scope.SaveData = function (StoreNote, StoreServicesTime, StoreTKWServicesTime) {
        item.Store.notes = angular.copy(StoreNote);
        item.Store.ServiceTime = angular.copy(StoreServicesTime);
        item.Store.ServiceTimeTKW = angular.copy(StoreTKWServicesTime);
        Restangular.restangularizeElement('', item.Store, 'store');
        if (item.Store.restangularized && item.Store.id) {
            item.Store.put().then(function (resp) {
                toaster.pop('success', $translate.instant('accounting.Updated'), $translate.instant('accounting.Updated'));
                $scope.ok();
            },function (restresult) {
                swal("Error!", $translate.instant('Server.DataError'), restresult.data.ExceptionMessage);
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
        $rootScope.uService.ExitController("changestoredataCtrl");
    });
};
