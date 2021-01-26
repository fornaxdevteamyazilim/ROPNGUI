app.controller('currentcallreasonCtrl', currentcallreasonCtrl);
function currentcallreasonCtrl($rootScope, $scope,$translate, $modalInstance, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $translate) {
    $rootScope.uService.EnterController("currentcallreasonCtrl");
    $scope.item = {};
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
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
    $scope.callreasons = [];
    $scope.loadEntities('callreason', 'callreasons');
    $scope.ok = function (data) {
        if (data && data.storeID && data.ReasonID) {
            $modalInstance.close(data);
        }
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("currentcallreasonCtrl");
    });
};
