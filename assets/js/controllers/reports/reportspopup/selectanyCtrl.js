'use strict';
app.controller('selectanyCtrl', selectanyCtrl);
function selectanyCtrl($scope, $log, $modal, $filter, Restangular, Value, SweetAlert,$translate, $interval, toaster, $window, $stateParams, $rootScope, $location, $modalInstance) {
    $scope.Value = Value;
    $scope.inventorycounts = [];
    $scope.loadInventoryCounts = function () {
        if (!$scope.inventorycounts.length) {
            Restangular.all('inventorycount').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: "Repository.StoreID='" + $rootScope.user.StoreID + "'",
            }).then(function (result) {
                $scope.inventorycounts = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadInventoryCounts();
    $scope.ComboCountValue = function (data) {
        $scope.CountDate = [];
        for (var i = 0; i < $scope.inventorycounts.length; i++) {
            var dateID = $scope.inventorycounts[i].id
            if (dateID == data.Count.DateTime) {
                $scope.CountDate = $scope.inventorycounts[i];
                break;
            }
        }
        $scope.ok();
    };
    $scope.ok = function () {
        $modalInstance.close($scope.CountDate);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
