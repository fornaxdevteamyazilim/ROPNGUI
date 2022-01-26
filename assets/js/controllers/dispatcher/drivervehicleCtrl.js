app.controller('drivervehicleCtrl', drivervehicleCtrl);
function drivervehicleCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $modalInstance, userService, ngnotifyService) {
    $rootScope.uService.EnterController("drivervehicleCtrl");
    $scope.translate = function () {
        $scope.trDriversName = $translate.instant('main.DRIVERSNAME');
        $scope.trVehiclePlate = $translate.instant('main.VEHICLEPLATE');
        $scope.trStartKilometer = $translate.instant('main.STARTKILOMETER');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
        $scope.trEndDate = $translate.instant('main.ENDDATE');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    $scope.DriverVehicle = [];
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.StartDate = $scope.StartDate;
            this.item.EndDate = $scope.EndDate;
            this.item.put().then(function (res) {
                $scope.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'),  $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'drivervehicle')
            this.item.StartDate = $scope.StartDate;
            this.item.EndDate = $scope.EndDate;
            this.item.post().then(function (res) {
                $scope.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Updated'));
            });
            this.item.get();
        }
    }
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!$scope.tableParams.data[$scope.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove($scope.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };

    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 20,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('drivervehicle').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "Drivers.StoreID='" + $rootScope.user.StoreID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                    $scope.DriverVehicle = items;
                }, function (response) {
                    toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.isActivePasif = function (data) {
        if (data == null || data == false) {
            $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
            $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');//TODO delete this line.
        }
        else {
            $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
            for (var i = 0; i < $scope.DriverVehicle.length; i++) {
                $scope.StartDate = $scope.DriverVehicle[i].StartDate;
            }

        }
    };
    $scope.removeItem = function (index) {
        if ($scope.tableParams.data[index].fromServer) {
            $scope.tableParams.data[index].remove();
        }
        $scope.tableParams.data.splice(index, 1);
        toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
    };
    $scope.cancelremove = function (index) {
        if ($scope.tableParams.data[index].fromServer) {
            $scope.tableParams.data[index].remove();
        }
        $scope.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        $scope.tableParams.data.push({});
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
                search: "StoreID='" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntities2 = function (EntityType, Container) {
        $scope.userroles = userService.getUserRoles($rootScope.user.UserRole.MemberID);
        var DriverRoles = $filter('filter')($scope.userroles, { name: 'Rest. Driver'} | {name: 'Sürücü' }).map(function (elem) {
            return elem.id;  
        }).join(",");
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: "UserRoleID in (" + DriverRoles + ") and StoreID='" + $rootScope.user.StoreID + "'"
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.drivers = [];
    $scope.loadEntities2('user', 'drivers');
    $scope.vehicles = [];
    $scope.loadEntities('vehicle', 'vehicles');
    $scope.ok = function () {
        $modalInstance.close($scope.DateTime = $filter('date')($scope.DateTime, 'yyyy-MM-dd HH:mm:ss'));
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("drivervehicleCtrl");
    });
};