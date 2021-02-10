app.controller('selectstoreCtrl', selectstoreCtrl);
function selectstoreCtrl($rootScope, $scope, $modalInstance, $log, $filter,$translate, SweetAlert, Restangular, ngTableParams, toaster, $window) {
    $rootScope.uService.EnterController("selectstoreCtrl");
    $scope.SaveSelcetedStore = function (data) {
        $scope.StoreID = data;
        $scope.ok();
    }
    $scope.GetSelectStore = function (StoreID) {
        Restangular.one('store', StoreID).get().then
            (function (restresult) {
                $scope.StoreAddress = restresult.StoreAddress;
            });
    };
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.towns = [];
    $scope.loadEntities('town', 'towns');
    $scope.stores = [];
    $scope.loadStores = function (town) {
        Restangular.all('cache/store').getList({
            pageNo: 1,
            pageSize: 1000,
            search: (town) ? "TownID='" + town + "'" : ""
        }).then(function (result) {
            for (var i = 0; i < result.length; i++) {
                for (var j = 0; j < result[i].StoreOrderTypes.length; j++) {
                    if (result[i].StoreOrderTypes[j].OrderTypeID == 3) {
                        result[i]['StoreHNR'] = true;
                    }
                }
            }
            $scope.stores = result;
        }, function (response) {
            toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.ok = function () {
        $modalInstance.close($scope.StoreID);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("selectstoreCtrl");
    });
};

