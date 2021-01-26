app.controller('ngsettingitemCtrl', ngsettingitemCtrl);
function ngsettingitemCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("ngsettingitemCtrl");
    var ngs = this;
    $scope.translate = function () {
        $scope.trSettingName = $translate.instant('main.SETTINGNAME');
        $scope.trSettingValue = $translate.instant('main.SETTINGVALUE');
        $scope.trMember = $translate.instant('main.MEMBER');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trStore = $translate.instant('main.STORE');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                ngs.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'NGSettingItem')
            this.item.post().then(function (res) {
                ngs.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
            });
            this.item.get();
        }
    };
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
        if (!ngs.tableParams.data[ngs.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ngs.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    ngs.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            SettingName: 'asc'
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('NGSettingItem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (ngs.search) ? "SettingName like '%" + ngs.search + "%'" : ""
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:   $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ngs.tableParams.data[index].fromServer) {
                    ngs.tableParams.data[index].remove();
                }
                ngs.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ngs.tableParams.data[index].fromServer) {
            ngs.tableParams.data[index].remove();
        }
        ngs.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ngs.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(ngs, function () {
        return ngs.search;
    }), function (value) {
        ngs.tableParams.reload();
    });
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };

    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.members = [];
    $scope.loadEntities('member', 'members');

    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("ngsettingitemCtrl");
    });
};
