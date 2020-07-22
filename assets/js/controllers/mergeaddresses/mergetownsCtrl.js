'use strict';
app.controller('mergetownsCtrl', mergetownsCtrl);
function mergetownsCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("mergetownsCtrl");
    var mt = this;
    $scope.fromTowns = [];
    $scope.toTowns = [];
    $scope.translate = function () {
        $scope.trTownName = $translate.instant('main.TOWNNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.LoadTowns = function () {
        $scope.ShowObject = true;
        Restangular.all('town').getList({
            pageNo: 1,
            pageSize: 1000,
        }).then(function (result) {
            angular.copy(result, $scope.fromTowns);
            angular.copy(result, $scope.toTowns);
            $scope.ShowObject = false;
        }, function (response) {
            toaster.pop('error', "Server Error", response.data.ExceptionMessage);
            $scope.ShowObject = false;
        });
    };
    $scope.LoadTowns();
    $scope.FromSelectItem = function (Item) {
        $scope.FromSelectTown = Item;
        toaster.pop('warning', "City To Be Merged");
    };
    $scope.ToSelectItem = function (Item) {
        $scope.ToSelectTown = Item;
        toaster.pop('warning', "United City");
    };
    $scope.MergeTown = function () {
        swal({
            title: "'" + $scope.FromSelectTown.name + "' City '" + $scope.ToSelectTown.name + "' Will merge with the city",
            text: "Do you approve of this operation!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
        }, function () {
            Restangular.one('addresshelper/merge/town?FromTownID=' + $scope.FromSelectTown.id + '&ToTownID=' + $scope.ToSelectTown.id).get().then
        (function (restresult) {
            $scope.LoadTowns();
            toaster.pop('success', "Merged with the city.");
        }, function (response) {
            toaster.pop('error', "Server Error", response.ExceptionMessage);
        });
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("mergetownsCtrl");
    });
};