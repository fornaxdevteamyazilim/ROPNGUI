app.controller('usertrainingCtrl',usertrainingCtrl);
function usertrainingCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("usertrainingCtrl");
    var ut = this;
    $scope.ID = $stateParams.id ? $stateParams.id : 0;
    var deregistration1 = $scope.$on('user', function (event, data) {
        $scope.ID = data;
        ut.tableParams.reload();
    });
    $scope.translate = function () {
        $scope.trTraining = $translate.instant('main.TRAININGNAME');
                $scope.trTrainingDate = $translate.instant('main.TRAININGDATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration =  $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        data.UserID = $scope.ID;
        if (data.restangularized) {
            data.put().then(function (res) {
                ut.tableParams.reload();
                toaster.pop('success', $translate.instant('userfile.Updated'),  $translate.instant('userfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'usertraining')
            data.post().then(function (res) {
                ut.tableParams.reload();
                toaster.pop('success', $translate.instant('userfile.Saved'),  $translate.instant('userfile.Saved'));
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
        if (!ut.tableParams.data[ut.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ut.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('userfile.Cancelled'),  $translate.instant('userfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('userfile.Cancelled'),  $translate.instant('userfile.Editcancelled') );
        }
    };
    ut.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },{
        getData: function ($defer, params) {
            Restangular.all('usertraining').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "UserID='" + $scope.ID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ut.tableParams.data[index].fromServer) {
                    ut.tableParams.data[index].remove();
                }
                ut.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('userfile.Attention'),$translate.instant('userfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ut.tableParams.data[index].fromServer) {
            ut.tableParams.data[index].remove();
        }
        ut.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ut.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("usertrainingCtrl");
    });
};
