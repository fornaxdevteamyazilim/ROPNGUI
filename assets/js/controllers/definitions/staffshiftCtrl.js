app.controller('staffshiftCtrl', staffshiftCtrl);
function staffshiftCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $location, $translate, $element, SweetAlert) {
    $rootScope.uService.EnterController("staffshiftCtrl");
    var sr = this;
    $scope.translate = function () {
        $scope.trShiftName = $translate.instant('main.SHIFTNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trStartTime = $translate.instant('main.STARTTIME');
        $scope.trEndTime = $translate.instant('main.ENDTIME');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                sr.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'staffshift')
            this.item.post().then(function (res) {
                sr.tableParams.reload();
                toaster.pop('success', "Saved.", 'Saved.');
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
        if (!sr.tableParams.data[sr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sr.tableParams.data.length - 1, 1);
            toaster.pop('warning', " It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', " It is cancelled !", 'Edit cancelled !');
        }
    };
    sr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Descrition: 'asc'
        }
    }, {
            getData: function ($defer, params) {
                Restangular.all('staffshift').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', "Server Error ", response.data.ExceptionMessage);
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
                if (sr.tableParams.data[index].fromServer) {
                    sr.tableParams.data[index].remove();
                }
                sr.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sr.tableParams.data[index].fromServer) {
            sr.tableParams.data[index].remove();
        }
        sr.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sr.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(sr, function () {
        return sr.search;
    }), function (value) {
        sr.tableParams.reload();
    });

    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("staffshiftCtrl");
    });
};
