app.controller('quitreasonCtrl', quitreasonCtrl);
function quitreasonCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("quitreasonCtrl");
    var qr = this;
    $scope.translate = function () {
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trisProhibited = $translate.instant('main.ISPROHIBITED');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                qr.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'),  $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'quitreason')
            data.post().then(function (res) {
                qr.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
            });
            data.get();
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
        if (!qr.tableParams.data[qr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(qr.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),$translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    qr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Description: 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('quitreason').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (qr.search) ? "Description like '%" + qr.search + "%'" : ""
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
                if (qr.tableParams.data[index].fromServer) {
                    qr.tableParams.data[index].remove();
                    $scope.$emit('DeleteUserRoles', "ReloadUserRoles");
                }
                qr.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.addItem = function () {
        qr.tableParams.data.push({});
    };
    $scope.cancelremove = function (index) {
        if (qr.tableParams.data[index].fromServer) {
            qr.tableParams.data[index].remove();
        }
        qr.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(qr, function () {
        return qr.search;
    }), function (value) {
        qr.tableParams.reload();
    });

    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("quitreasonCtrl");
    });
};
