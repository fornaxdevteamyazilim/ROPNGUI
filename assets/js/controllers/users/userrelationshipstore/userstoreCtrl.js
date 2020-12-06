app.controller('userstoreCtrl', userstoreCtrl);
function userstoreCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("userstoreCtrl");
    var aus = this;
    $scope.translate = function () {
        $scope.trUser = $translate.instant('main.USER');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    aus.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('userstore').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                aus.tableParams.reload();
                toaster.pop('success',$translate.instant('userfile.Updated'), $translate.instant('userfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'userstore')
            data.post().then(function (res) {
                aus.tableParams.reload();
                toaster.pop('success',$translate.instant('userfile.Saved'),$translate.instant('userfile.Updated'));
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
        if (!aus.tableParams.data[aus.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(aus.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('userfile.Cancelled'), $translate.instant('userfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('userfile.Cancelled'), $translate.instant('userfile.Editcancelled'));
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
                if (aus.tableParams.data[index].fromServer) {
                    aus.tableParams.data[index].remove();
                }
                aus.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('userfile.Attention'),$translate.instant('userfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (aus.tableParams.data[index].fromServer) {
            aus.tableParams.data[index].remove();
        }
        aus.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        aus.tableParams.data.push({});
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
                pageSize: 1000000,
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
    $scope.users = [];
    $scope.loadEntities('user', 'users');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("userstoreCtrl");
    });
};
