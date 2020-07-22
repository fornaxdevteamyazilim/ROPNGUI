﻿app.controller('useremailCtrl',useremailCtrl);
function useremailCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("useremailCtrl");
    var ue = this;
    $scope.ID = $stateParams.id ? $stateParams.id : 0;
    var deregistration1 = $scope.$on('user', function (event, data) {
        $scope.ID = data;
        ue.tableParams.reload();
    });
    $scope.translate = function () {
        $scope.trEmail = $translate.instant('main.EMAIL');
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
                ue.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'useremail')
            data.post().then(function (res) {
                ue.tableParams.reload();
                toaster.pop('success', "Saved.", 'Saved.');
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
        if (!ue.tableParams.data[ue.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ue.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    ue.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },{
        getData: function ($defer, params) {
            Restangular.all('useremail').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "UserID='" + $scope.ID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Server Error", response);
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
                if (ue.tableParams.data[index].fromServer) {
                    ue.tableParams.data[index].remove();
                }
                ue.tableParams.data.splice(index, 1);
               toaster.pop("error", "Attention !", "Record Deleted !");
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
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("useremailCtrl");
    });
};
