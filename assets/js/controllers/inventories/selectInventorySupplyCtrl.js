'use strict';
app.controller('selectInventorySupplyCtrl', selectInventorySupplyCtrl);
function selectInventorySupplyCtrl($rootScope, $scope, $modalInstance, Restangular, $translate, $window, toaster) {
    $rootScope.uService.EnterController("selectInventorySupplyCtrl");
    $scope.translate = function () {
        $scope.traddnewrquirment = $translate.instant('main.ADDNEWREQUIRMENT');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.addnewRequirment = function () {
        location.href = '#/app/inventory/inventoryrequirments/edit/new';
        $scope.cancel();
    };
    $scope.InventorySupplies = [];
    $scope.loadEntities('InventorySupply', 'InventorySupplies');
    $scope.slectSupply = function (supplyID) {
        $scope.ok(supplyID);
    };
    $scope.ok = function (supplyID) {
        $modalInstance.close(supplyID);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("selectInventorySupplyCtrl");
    });
};