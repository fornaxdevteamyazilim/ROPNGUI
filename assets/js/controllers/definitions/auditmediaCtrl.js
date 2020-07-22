app.controller('auditmediaCtrl', auditmediaCtrl);
function auditmediaCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, userService, $rootScope, $element) {
    var am = this;
    $rootScope.uService.EnterController("auditmediaCtrl");
    $scope.translate = function () {
        $scope.trMediaName = $translate.instant('main.MEDIANAME');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trDeviceName = $translate.instant('main.DEVICENAME');
        $scope.trAuditMediaType = $translate.instant('main.AUDITMEDIATYPE');
        $scope.trMediaAlias = $translate.instant('main.MEDIAALIAS');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                am.tableParams.reload();
                $scope.$emit('LoadUserRestrictions', "ReloadUserRestrictions");
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'auditmedia')
            this.item.post().then(function (res) {
                am.tableParams.reload();
                $scope.$emit('LoadUserRestrictions', "ReloadUserRestrictions");
                toaster.pop('success', "Saved.", 'Saved.');
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
        if (!am.tableParams.data[am.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(am.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    am.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            DeviceName:'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('auditmedia').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                //search: (am.search) ? "DeviceName like '%" + am.search + "%'" : "",
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: "ARE YOU SURE ?",
            text: "Are you sure you want to delete the record ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Delete !",
            cancelButtonText: "No, Deletion !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (am.tableParams.data[index].fromServer) {
                    am.tableParams.data[index].remove();
                }
                am.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (am.tableParams.data[index].fromServer) {
            am.tableParams.data[index].remove();
        }
        am.tableParams.data.splice(index, 1);
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
                toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Server Error", response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.auditmediatypes = [];
    $scope.loadEntities('enums/auditmediatype', 'auditmediatypes');
    $scope.addItem = function () {
        am.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("auditmediaCtrl");
    });
};
