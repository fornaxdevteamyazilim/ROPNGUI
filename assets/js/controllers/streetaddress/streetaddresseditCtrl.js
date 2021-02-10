(function () {
    'use strict';
    app.controller('streetaddresseditCtrl', streetaddresseditCtrl);
    function streetaddresseditCtrl($rootScope, $scope, $modalInstance, $translate, Restangular, item, $filter, $log, $window, toaster, ngnotifyService) {
        $rootScope.uService.EnterController("streetaddresseditCtrl");
        $scope.item = item;
        $scope.subcities = [];
        $scope.quarters = [];
        if (item)
            Restangular.one('streetaddress', item.id).get().then(function (restresult) {
                $scope.item = Restangular.copy(restresult);
            })
        else {
            toaster.pop('error',$translate.instant('margeaddress.PleaseTryAgain'));
        }
        $scope.saveData = function (data) {
            if (data.restangularized) {
                data.put().then(
                    function (res) {
                        toaster.pop('success',$translate.instant('margeaddress.Updated'), $translate.instant('margeaddress.Updated'));
                        $scope.ok();
                    },
                     function (response) {
                         toaster.pop('error', $translate.instant('margeaddress.FailedtoUpdate'), response.data.ExceptionMessage);
                     }
                     );
            }
        };
        $scope.LoadSubcities = function (TownID) {
            Restangular.all('subcity').getList({
                pageNo: 1,
                pageSize: 1000,
                search: "TownID='" + TownID + "'"
            }).then(function (result) {
                angular.copy(result, $scope.subcities);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        };
        $scope.LoadQuarters = function (QuarterID) {
            Restangular.all('quarter').getList({
                pageNo: 1,
                pageSize: 1000,
                search: "SubcityID='" + QuarterID + "'"
            }).then(function (result) {
                angular.copy(result, $scope.quarters);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        };
        $scope.towns = [];
        $scope.loadEntities('town', 'towns');
        $scope.streetaddresstype = [];
        $scope.loadEntities('enums/streetaddresstype', 'streetaddresstype');
        $scope.ok = function () {
            $modalInstance.close('Reload Table');
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
         $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("streetaddresseditCtrl");
    });
    };   
})();