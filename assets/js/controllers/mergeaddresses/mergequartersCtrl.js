'use strict';
app.controller('mergequartersCtrl', mergequartersCtrl);
function mergequartersCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("mergequartersCtrl");
    var mq = this;
    $scope.search = '';
    $scope.fromQuarters = [];
    $scope.toQuarters = [];
    $scope.subcities = [];
    $scope.translate = function () {
        $scope.trMerge = $translate.instant('main.TOWNNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.selecttown = $translate.instant('main.SELECTTOWN');
        $scope.selectsubcity = $translate.instant('main.SELECTSUBCITY');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
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
    $scope.SelectSubcity = function (SubcityID) {
        $scope.SubcityID = SubcityID;
        $scope.LoadQuarters();
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        result.push("SubcityID='" + $scope.SubcityID + "'");
        if ($scope.search.length > 0) {
            result.push("name like '%" + $scope.search + "%'");
        }
        return result;
    };
    $scope.LoadQuarters = function () {
        $scope.ShowObject = true;
        Restangular.all('quarter').getList({
            pageNo: 1,
            pageSize: 1000,
            search: $scope.BuildSearchString()
        }).then(function (result) {
            angular.copy(result, $scope.fromQuarters);
            angular.copy(result, $scope.toQuarters);
            $scope.ShowObject = false;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            $scope.ShowObject = false;
        });
    };
    $scope.FromSelectItem = function (Item) {
        $scope.FromSelectQuarter = Item;
        toaster.pop('warning', $translate.instant('margeaddress.BemergedNeighborhood '));
    };
    $scope.ToSelectItem = function (Item) {
        $scope.ToSelectQuarter = Item;
        toaster.pop('warning',  $translate.instant('margeaddress.WilluniteNeighborhood '));
    };
    $scope.MergeQuarter = function () {
        swal({
            title: "'" + $scope.FromSelectQuarter.name + $translate.instant('margeaddress.Neighborhood ')  + $scope.ToSelectQuarter.name +  $translate.instant('margeaddress.Neighborhoodwillmergewith '),
            text: $translate.instant('margeaddress.DoYouConfirmThisTransaction '),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('margeaddress.confirmButtonText'),
            cancelButtonText:$translate.instant('margeaddress.cancelButtonText'),
            closeOnConfirm: true
        }, function () {
            Restangular.one('addresshelper/merge/quarter?FromQuarterID=' + $scope.FromSelectQuarter.id + '&ToQuarterID=' + $scope.ToSelectQuarter.id).get().then
                 (function (restresult) {
                     $scope.LoadQuarters();
                     toaster.pop('success', $translate.instant('margeaddress.NeighborhoodCombined'));
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
   var deregistration1 =  $scope.$watch(angular.bind($scope, function () {
        return $scope.search;
    }), function (value) {
        $scope.LoadQuarters();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("mergequartersCtrl");
    });
};