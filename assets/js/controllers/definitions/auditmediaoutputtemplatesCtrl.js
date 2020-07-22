app.controller('auditmediaoutputtemplatesCtrl', auditmediaoutputtemplatesCtrl);
function auditmediaoutputtemplatesCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("auditmediaoutputtemplatesCtrl");
    var samot = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trTemplate = $translate.instant('main.TEMPLATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                samot.tableParams.reload();
                $scope.$emit('LoadUserRestrictions', "ReloadUserRestrictions");
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'auditmediaoutputtemplate')
            this.item.post().then(function (res) {
                samot.tableParams.reload();
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
        if (!samot.tableParams.data[samot.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(samot.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    samot.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('auditmediaoutputtemplate').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (samot.search) ? "Name like '%" + samot.search + "%'" : ""
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
                if (samot.tableParams.data[index].fromServer) {
                    samot.tableParams.data[index].remove();
                }
                samot.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (samot.tableParams.data[index].fromServer) {
            samot.tableParams.data[index].remove();
        }
        samot.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        samot.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(samot, function () {
        return samot.search;
    }), function (value) {
        samot.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("auditmediaoutputtemplatesCtrl");
    });
};
