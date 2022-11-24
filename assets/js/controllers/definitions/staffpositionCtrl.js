app.controller('staffpositionCtrl', staffpositionCtrl);
function staffpositionCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("staffpositionCtrl");
    var sp = this;
    $scope.translate = function () {
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trName = $translate.instant('main.NAME');
        $scope.trOrderIndex = $translate.instant('main.INDEX');
        $scope.trPersonsPerStore = $translate.instant('main.PERSONSPERSTORE');
        $scope.trMinPersonsPerStore = $translate.instant('main.MINPERSONSPERSTORE');
        $scope.trMaxPersonsPerStore = $translate.instant('main.MAXPERSONSPERSTORE');
        $scope.trHourlyOrdersByPerson = $translate.instant('main.HOURLYORDERSBYPERSON');
        $scope.trCalculateHourlyRequirment = $translate.instant('main.CALCULATEHOURLYREQUIRMENT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trStaffMealLimit = $translate.instant('main.STAFFMEALLIMIT')
        $scope.trHourlyProductsByPerson = $translate.instant('main.HOURLYPRODUCTSBYPERSON')

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                sp.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'staffposition')
            data.post().then(function (res) {
                sp.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'),$translate.instant('difinitions.Saved'));
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
        if (!sp.tableParams.data[sp.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sp.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    sp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Name : 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('staffposition').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (sp.search) ? "Name  like '%" + sp.search + "%'" : ""
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
                if (sp.tableParams.data[index].fromServer) {
                    sp.tableParams.data[index].remove();
                    $scope.$emit('DeleteUserRoles', "ReloadUserRoles");
                }
                sp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.addItem = function () {
        sp.tableParams.data.push({});
    };
    $scope.cancelremove = function (index) {
        if (sp.tableParams.data[index].fromServer) {
            sp.tableParams.data[index].remove();
        }
        sp.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(sp, function () {
        return sp.search;
    }), function (value) {
        sp.tableParams.reload();
    });

    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("staffpositionCtrl");
    });
};
