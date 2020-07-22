app.controller('billboarditemCtrl', billboarditemCtrl);
function billboarditemCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $translate, $element, $modal, $filter, SweetAlert) {
    $rootScope.uService.EnterController("billboarditemCtrl");
    var bbi = this;
    $scope.translate = function () {
        $scope.trTitle = $translate.instant('main.TITLE');
        $scope.trBillboardItemType = $translate.instant('main.BILLBOARDITEMTYPE');
        $scope.trDetails = $translate.instant('main.DETAILS');
        $scope.trAddDate = $translate.instant('main.DATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                bbi.tableParams.reload();
                toaster.pop('success', "Updated.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'billboarditem')
            this.item.post().then(function (res) {
                bbi.tableParams.reload();
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
        if (!bbi.tableParams.data[bbi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(bbi.tableParams.data.length - 1, 1);
            toaster.pop('warning', "It is cancelled !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "It is cancelled !", 'Edit cancelled !');
        }
    };
    bbi.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('billboarditem').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (bbi.search) ? "Name like '%" + bbi.search + "%'" : ""
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
                if (bbi.tableParams.data[index].fromServer) {
                    bbi.tableParams.data[index].remove();
                }
                bbi.tableParams.data.splice(index, 1);
                toaster.pop("error", "Attention !", "Record Deleted !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (bbi.tableParams.data[index].fromServer) {
            bbi.tableParams.data[index].remove();
        }
        bbi.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        bbi.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(bbi, function () {
        return bbi.search;
    }), function (value) {
        bbi.tableParams.reload();
    });
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.billboarditemtypes = [];
    $scope.loadEntities('enums/billboarditemtype', 'billboarditemtypes');
    $scope.datepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.AddDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.AddDate = $filter('date')(result, 'yyyy-MM-dd');
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("billboarditemCtrl");
    });
};
