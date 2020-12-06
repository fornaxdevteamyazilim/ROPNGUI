'use strict';
app.controller('SearchAddressSelectorCtrl', SearchAddressSelectorCtrl);
function SearchAddressSelectorCtrl($scope, $rootScope, $modalInstance, $location, StreetAddressID, InfoNotes, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $translate, userService) {
    $rootScope.uService.EnterController("SearchAddressSelectorCtrl");
    userService.userAuthorizated();
    $scope.isSearch = false;
    $scope.Method = '';
    var storedata = $rootScope.user.Store;
    $("#searchby").focus();
    $scope.StreetAddressID = StreetAddressID;
    $scope.InfoNotes = InfoNotes;
    $scope.SelectedItem = null;
    $scope.search = '';
    $scope.GetShearchData = "";
    //if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER") && !userService.userIsInRole("CMRESTORANHATTI") && !userService.userIsInRole("Admin")) {
    //    $scope.ShowObject = false;
    //    $scope.showsearchinput = true;
    //}
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
    };
    $scope.translate = function () {
        $scope.trStreetName = $translate.instant('main.STREETNAME');
        $scope.trType = $translate.instant('main.TYPE');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trStore = $translate.instant('main.STORE');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.TownCahnge = function (TownID) {
        $scope.TownID = TownID;
        $scope.showsearchinput = true;
        Restangular.all('subcity').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "TownID='" + TownID + "'"
        }).then(function (result) {
            $scope.Subcities = result;
        }, function (response) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.SubcityChange = function (SubcityID) {
        Restangular.all('quarter').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "SubcityID='" + SubcityID + "'"
        }).then(function (result) {
            $scope.Quarters = result;
        }, function (response) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
        $scope.SubcityID = SubcityID;
    };
    $scope.QuerterChange = function (QuarterID) {
        $scope.QuarterID = QuarterID;
    };
    //if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER") && !userService.userIsInRole("CMRESTORANHATTI") && !userService.userIsInRole("Admin")) {
    //    $scope.TownCahnge(storedata.TownID);
    //}
    $scope.BuildSearchString = function () {
        var result = [];
        if ($scope.search && $scope.search.length > 0)
            result.push("tt.name  like '" + $scope.search + "%'");
        if ($scope.TownID != undefined) {
            result.push(("Towns.id='" + $scope.TownID + "'")); //Towns.id='3453'
        }
        //else {
        //    result.push("Towns.id='-1'");
        //}
        if ($scope.SubcityID && $scope.SubcityID != undefined)
            result.push("Subcities.id='" + $scope.SubcityID + "'");
        if ($scope.QuarterID && $scope.QuarterID != undefined)
            result.push("Quarters.id='" + $scope.QuarterID + "'");
        //if () {
        //    result.push("StoreStreetAddresses.StoreID='" + $rootScope.user.StoreID + "'");
        //} 
        else {
            result.push("StoreStreetAddresses.id<>'0'");
        }
        if ($scope.Method) {
            result.push("Method='" + $scope.Method + "'");
        }
        return result;
    };
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 5,
    }, {
            counts: [],
            total: 1,
            getData: function ($defer, params) {
                if ($scope.search && $scope.search.length > 0) {
                    if ($scope.Method) {
                        $scope.isSearching(true);
                        Restangular.all('streetaddress/find').getList({
                            pageNo: 1,
                            pageSize: 1000,
                            search: $scope.search,
                            StoreID: ($rootScope.user.StoreID) ? $rootScope.user.StoreID : "",
                            Method: $scope.Method,
                        }).then(function (items) {
                            params.total(items);
                            $defer.resolve(items);
                            $scope.isSearching(false);
                        }, function (response) {
                            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.Message);
                        });
                    } else {
                        $scope.isSearching(true);
                        Restangular.all('streetaddress').getList({
                            pageNo: 1,
                            pageSize: 1000,
                            search: $scope.BuildSearchString(),
                            sort: params.orderBy()
                        }).then(function (items) {
                            params.total(items);
                            $defer.resolve(items);
                            $scope.isSearching(false);
                        }, function (response) {
                            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.Message);
                        });
                    }
                }
            }
        });
    $scope.isSearching = function (value) {
        $scope.isSearch = value;
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
    $scope.ok = function () {
        $modalInstance.close($scope.tableParams.data[$scope.SelectedItem]);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    var deregistration1 = $scope.$watch(angular.bind($scope.search, function () {
        return $scope.search;
    }), function (value) {
        if ($scope.search && $scope.search.length > 0) {
            $scope.tableParams.reload();
        }
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $rootScope.uService.ExitController("SearchAddressSelectorCtrl");
    });
};
