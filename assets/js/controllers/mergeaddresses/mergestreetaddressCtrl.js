'use strict';
app.controller('mergestreetaddressCtrl', mergestreetaddressCtrl);
function mergestreetaddressCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("mergestreetaddressCtrl");
    var msa = this
    $scope.search = '';
    $scope.fromStreetAddress = [];
    $scope.toStreetAddress = [];
    $scope.quarters = [];
    $scope.subcities = [];
    $scope.translate = function () {
        $scope.trMerge = $translate.instant('main.TOWNNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.selecttown = $translate.instant('main.SELECTTOWN');
        $scope.selectsubcity = $translate.instant('main.SELECTSUBCITY');
        $scope.selectquarter = $translate.instant('main.SELECTQUARTER');
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
    $scope.LoadQuarters = function (SubcityID) {
        Restangular.all('quarter').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "SubcityID='" + SubcityID + "'"
        }).then(function (result) {
            angular.copy(result, $scope.quarters);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.SelectQuarter = function (QuarterID) {
        $scope.QuarterID = QuarterID;
        $scope.LoadStreetAddress();
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if ($scope.QuarterID != undefined) {
            result.push("Quarters.id='" + $scope.QuarterID + "'");
        }
        if ($scope.search.length > 0) {
            result.push("tt.name like'%" + $scope.search + "%'");
        }
        return result;
    };
    $scope.LoadStreetAddress = function () {
        $scope.ShowObject = true;
        Restangular.all('streetaddress').getList({
            pageNo: 1,
            pageSize: 1000,
            search: $scope.BuildSearchString(),
        }).then(function (result) {
            angular.copy(result, $scope.fromStreetAddress);
            angular.copy(result, $scope.toStreetAddress);
            $scope.ShowObject = false;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            $scope.ShowObject = false;
        });
    };
    $scope.FromSelectItem = function (Item) {
        $scope.FromSelectStreetAddress = Item;
        toaster.pop('warning',   $translate.instant('margeaddress.Addresstobemerged '));
    };
    $scope.ToSelectItem = function (Item) {
        $scope.ToSelectStreetAddress = Item;
        toaster.pop('warning', $translate.instant('margeaddress.Addresstomerge ') );
    };
    $scope.MergeStreetAddress = function () {
        swal({
            title: "'" + $scope.FromSelectStreetAddress.name +$translate.instant('margeaddress.Address ') + $scope.ToSelectStreetAddress.name +  $translate.instant('margeaddress.Willcombinedwiththeaddress '),
            text:  $translate.instant('margeaddress.DoYouConfirmThisTransaction '),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('margeaddress.confirmButtonText'),
            cancelButtonText:$translate.instant('margeaddress.cancelButtonText'),
            closeOnConfirm: true
        }, function () {
            Restangular.one('addresshelper/merge/streetaddress?FromStreetAddressID=' + $scope.FromSelectStreetAddress.id + '&ToStreetAddressID=' + $scope.ToSelectStreetAddress.id).get().then
                 (function (restresult) {
                     $scope.LoadStreetAddress();
                     toaster.pop('success',  $translate.instant('margeaddress.NeighborhoodCombined'));
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
    var deregistration1 = $scope.$watch(angular.bind($scope, function () {
        return $scope.search;
    }), function (value) {
        if ($scope.search.length > 1) {
        $scope.LoadStreetAddress();
        }        
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("mergestreetaddressCtrl");
    });
};