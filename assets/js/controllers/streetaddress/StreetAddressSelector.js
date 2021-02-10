(function () {
    'use strict';
    app.controller('StreetAddressSelectorCtrl', StreetAddressSelectorCtrl);
    function StreetAddressSelectorCtrl($scope, $modalInstance, StreetAddressID, $log, $translate, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window) {
        $scope.StreetAddressID = StreetAddressID;
        $scope.SelectedItem = null;
        $scope.search = '';
        $scope.SelectItem = function (id) {
            $scope.SelectedItem = id;
        };
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10,
        },
        {
            getData: function ($defer, params) {
                Restangular.all('streetaddress').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: ($scope.search.length > 0) ? "name like '%" + $scope.search + "%'" : "",
                    sort: params.orderBy()
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response);
                    SweetAlert.swal($translate.instant('Server.ServerError'), angular.toJson(response, false), "error");
                });
            }
        });

        $scope.showAddresstype = function (streetAddress) {
            if (streetAddress.StreetAddressTypeID && $scope.addresstype.length) {
                var selected = $filter('filter')($scope.addresstype, { id: streetAddress.StreetAddressTypeID });
                return selected.length ? selected[0].name : 'Not set';
            } else {
                return streetAddress.name || 'Not set';
            }
        };

        //$scope.loadEntities = function (EntityType, Container) {
        //    if (!$scope[Container].length) {
        //        Restangular.all(EntityType).getList({
        //            pageNo: 1,
        //            pageSize: 1000,
        //        }).then(function (result) {
        //            $scope[Container] = result;
        //        }, function (response) {
        //            toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
        //        });
        //    }
        //};
        //$scope.loadEnums = function (EntityType, Container) {
        //    if (!$scope[Container].length || $scope[Container].length == 0) {
        //        Restangular.all(EntityType).getList().then(function (result) {
        //            $scope[Container] = result;
        //        }, function (response) {
        //            toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
        //        });
        //    }
        //};
        ////$scope.filterlevels = [];
        ////$scope.loadEntities('enums/FilterLevel', 'filterlevels');

        //$scope.tags = [];
        //$scope.loadEntities('tag', 'tags');
        //modal close funcitons
        $scope.ok = function () {
            $modalInstance.close($scope.tableParams.data[$scope.selectedItem]);
        };
        //addItem... {BaseObjectID:$scope.ObjectID}
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.$watch(angular.bind($scope, function () {
            return $scope.search;
        }), function (value) {
            $scope.tableParams.reload();
        });

    };

})();