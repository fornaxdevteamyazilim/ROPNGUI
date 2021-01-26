app.controller('verifonemerchantCtrl', verifonemerchantCtrl);
function verifonemerchantCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $location, $translate, $element, SweetAlert) {
    $rootScope.uService.EnterController("verifonemerchantCtrl");
    var vm = this;
    $scope.truefalsearray = [{ Value: true, Name: 'True' }, { Value: false, Name: 'False' }];
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trMerchant = $translate.instant('main.MERCHANT');
        $scope.trisActive = $translate.instant('main.ISACTIVE');
        $scope.trisTest = $translate.instant('main.ISTEST');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated'),  $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'verifonemerchant')
            this.item.post().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
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
        if (!vm.tableParams.data[vm.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(vm.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
            getData: function ($defer, params) {
                Restangular.all('verifonemerchant').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    //search: (vm.search) ? "Name like '%" + vm.search + "%'" : ""
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
                if (vm.tableParams.data[index].fromServer) {
                    vm.tableParams.data[index].remove();
                }
                vm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (vm.tableParams.data[index].fromServer) {
            vm.tableParams.data[index].remove();
        }
        vm.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        vm.tableParams.data.push({});
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
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
    var deregistration1 = $scope.$watch(angular.bind(vm, function () {
        return vm.search;
    }), function (value) {
        vm.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("verifonemerchantCtrl");
    });
};
