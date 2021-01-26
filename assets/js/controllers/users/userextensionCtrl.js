app.controller('userextensionCtrl', userextensionCtrl);
function userextensionCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("userextensionCtrl");
    var ue = this;
    $scope.ID = $stateParams.id;
    $scope.translate = function () {
        $scope.trNumber = $translate.instant('main.NUMBER');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        data.UserID = $stateParams.id;
        if (data.restangularized) {
            data.put().then(function (res) {
                ue.tableParams.reload();
                toaster.pop('success',$translate.instant('userfile.Updated'), $translate.instant('userfile.Saved'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'userextension')
            data.post().then(function (res) {
                ue.tableParams.reload();
                toaster.pop('success', $translate.instant('userfile.Saved'), $translate.instant('userfile.Saved'));
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
        if (!ue.tableParams.data[ue.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ue.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('userfile.Cancelled'), $translate.instant('userfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('userfile.Cancelled'), $translate.instant('userfile.Editcancelled') );
        }
    };
    ue.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },{
        getData: function ($defer, params) {
            Restangular.all('userextension').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: ($stateParams.id) ? "UserID='" + $stateParams.id + "'" : ""
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
                if (ue.tableParams.data[index].fromServer) {
                    ue.tableParams.data[index].remove();
                }
                ue.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('userfile.Attention'),$translate.instant('userfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ue.tableParams.data[index].fromServer) {
            ue.tableParams.data[index].remove();
        }
        ue.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ue.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("userextensionCtrl");
    });
};
