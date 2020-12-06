'use strict';
app.controller('mergesubcitiesCtrl', mergesubcitiesCtrl);
function mergesubcitiesCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("mergesubcitiesCtrl");
    var ms = this;
    $scope.fromSubcities = [];
    $scope.toSubcities = [];
    $scope.translate = function () {
        $scope.trMerge = $translate.instant('main.TOWNNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.selecttown = $translate.instant('main.SELECTTOWN');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectTown = function (TownID) {
        $scope.TownID = TownID;
        $scope.LoadSubcities();
    };
    $scope.LoadSubcities = function () {
        $scope.ShowObject = true;
        Restangular.all('subcity').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "TownID='" + $scope.TownID + "'"
        }).then(function (result) {
            angular.copy(result, $scope.fromSubcities);
            angular.copy(result, $scope.toSubcities);
            $scope.ShowObject = false;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            $scope.ShowObject = false;
        });
    };
    //$scope.LoadSubcities();
    $scope.FromSelectItem = function (Item) {
        $scope.FromSelectSubcity = Item;
        toaster.pop('warning',  $translate.instant('margeaddress.BeMergedDistrict '));
    };
    $scope.ToSelectItem = function (Item) {
        $scope.ToSelectSubcity = Item;
        toaster.pop('warning',$translate.instant('margeaddress.DistrictMerged ') );
    };
    $scope.MergeSubcity = function () {
        swal({
            title: "'" + $scope.FromSelectSubcity.name + $translate.instant('margeaddress.District ') + $scope.ToSelectSubcity.name + $translate.instant('margeaddress.Willmergewiththedistrict '),
            text: $translate.instant('margeaddress.Doyouapproveofthisoperation '),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('margeaddress.confirmButtonText'),
            cancelButtonText:$translate.instant('margeaddress.cancelButtonText'),
            closeOnConfirm: true
        }, function () {
            Restangular.one('addresshelper/merge/subcity?FromSubcityID=' + $scope.FromSelectSubcity.id + '&ToSubcityID=' + $scope.ToSelectSubcity.id).get().then
         (function (restresult) {
             $scope.LoadSubcities();
             toaster.pop('success',$translate.instant('margeaddress.DistrictMerged ') );
         }, function (response) {
             toaster.pop('error', $translate.instant('Server.ServerError'), response.ExceptionMessage);
         });
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
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("mergesubcitiesCtrl");
    });
};