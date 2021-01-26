app.controller('storegroupitemCtrl', storegroupitemCtrl);
function storegroupitemCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("storegroupitemCtrl");
    var sgi = this;
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.$on('StoreGroup', function (event, data) {
        $scope.StoreGroupID = data;
        sgi.tableParams.reload();
    });
    $scope.translate();
    $scope.item = {};
    sgi.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            if ($scope.StoreGroupID) {
                Restangular.all('storegroupitem').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "StoreGroupID='" + $scope.StoreGroupID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response);
                });
            }
        }
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                sgi.tableParams.reload();
                toaster.pop('success',$translate.instant('userfile.Updated'),$translate.instant('userfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'storegroupitem')
            data.post().then(function (res) {
                sgi.tableParams.reload();
                toaster.pop('success', $translate.instant('userfile.Saved'),$translate.instant('userfile.Updated'));
            });
            data.get();
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
        if (!sgi.tableParams.data[sgi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sgi.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('userfile.Cancelled'), $translate.instant('userfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('userfile.Cancelled'), $translate.instant('userfile.Editcancelled') );
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (sgi.tableParams.data[index].fromServer) {
                    sgi.tableParams.data[index].remove();
                }
                sgi.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('userfile.Attention'),$translate.instant('userfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sgi.tableParams.data[index].fromServer) {
            sgi.tableParams.data[index].remove();
        }
        sgi.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sgi.tableParams.data.push({ StoreGroupID: $scope.StoreGroupID });
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
                angular.copy(result, $scope[Container]);
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerConnectionError'), "Error!");
            });
        }
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
    $scope.storegroups = [];
    $scope.loadEntities('storegroup', 'storegroups');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storegroupitemCtrl");
    });
};
