'use strict';
app.controller('storestreetaddressesCtrl', storestreetaddressesCtrl);
function storestreetaddressesCtrl($rootScope, $scope, $translate, $modalInstance, addressID, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window) {
    $rootScope.uService.EnterController("storestreetaddressesCtrl");
    $scope.search = '';
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trStreetAddress = $translate.instant('main.STREETADDRESS');
        $scope.trPod = $translate.instant('main.POD');
        $scope.trWDT = $translate.instant('main.WDT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 5,
    },{
        counts: [],
        getData: function ($defer, params) {
            Restangular.all('storestreetaddress').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: "StreetAddressID='" + addressID + "'",
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) {
                $scope.tableParams.reload();
                toaster.pop('success', $translate.instant('margeaddress.Updated'), $translate.instant('margeaddress.Updated'));
            }, function (response) {
                toaster.pop('error',$translate.instant('margeaddress.FailedtoUpdate'), response.data.ExceptionMessage);
            });
        } else {
            Restangular.restangularizeElement('', data, 'storestreetaddress')
            data.post().then(function (res) {
                $scope.tableParams.reload();
                toaster.pop('success',$translate.instant('margeaddress.Added'), $translate.instant('margeaddress.Saved'));
            }, function (response) {
                toaster.pop('error',$translate.instant('margeaddress.NotSaved'), response.data.ExceptionMessage);
            });
            data.get();
        }
    };
    $scope.addItem = function () {
        $scope.tableParams.data.push({ StreetAddressID: addressID, StreetAddressID: addressID });
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!$scope.tableParams.data[$scope.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove($scope.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('margeaddress.Cancelled'), $translate.instant('margeaddress.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('margeaddress.Cancelled'), $translate.instant('margeaddress.Editcancelled'));
        }
    };
    $scope.cancelremove = function (index) {
        if ($scope.tableParams.data[index].fromServer) {
            $scope.tableParams.data[index].remove();
        }
        $scope.tableParams.data.splice(index, 1);
    };
    $scope.removeItem = function (index) {
        if ($scope.tableParams.data[index].fromServer) {
            $scope.tableParams.data[index].remove();
            toaster.pop("error", $translate.instant('margeaddress.Attention'), $translate.instant('margeaddress.RecordDeleted'));
        }
        $scope.tableParams.data.splice(index, 1);
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
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
    $scope.storePods = [];
    $scope.slectedStore = function (StoreID) {
        Restangular.all('pod').getList({
            pageNo: 1,
            pageSize: 1000,
            sort:'+name',
            search: "StoreID='" + StoreID + "'",
        }).then(function (result) {
            angular.copy(result, $scope.storePods);
        }, function (response) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    var deregistration1 = $scope.$watch(angular.bind($scope, function () {
        return $scope.search;
    }), function (value) {
    });
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $rootScope.uService.ExitController("storestreetaddressesCtrl");
    });
};