'use strict';
app.controller('ysstoreeditCtrl', ysstoreeditCtrl);
function ysstoreeditCtrl($scope, $modalInstance, $log, $rootScope, toaster, Restangular, $window, $location, callsService, localStorageService, userService, ngTableParams, $translate) {
    $rootScope.uService.EnterController("ysstoreeditCtrl");
        var ysse = this;
    $scope.item = {};

    $scope.SaveYsStore = function (data) {
        $scope.isSpinner = true;
        Restangular.all('YemekSepetiTools/ChangeStoreState').getList(
            {
                StoreID: data.StoreID,
                Open: $scope.Open,
                Note: data.Note
            }
        ).then(function (result) {
            $scope.isSpinner = false;
            toaster.pop('success', $translate.instant('yemeksepetifile.YSRestaurantStatusChanged'), '');
            $scope.ok();
            //location.href = '#/app/mainscreen'
            }, function (response) {
                $scope.isSpinner = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');


    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("ysstoreeditCtrl");
    });
};