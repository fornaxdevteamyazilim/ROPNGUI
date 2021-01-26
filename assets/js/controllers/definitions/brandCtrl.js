app.controller('brandCtrl', brandCtrl);
function brandCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $location, $translate, $element) {
    $rootScope.uService.EnterController("brandCtrl");
    var vm = this;
    $scope.objectType = 'brand';
    $scope.SelectedItem = null;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
    };
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) { vm.tableParams.reload(); toaster.pop('success', $translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated')); });
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(function (res) { vm.tableParams.reload(); toaster.pop('success',$translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved')); });
            data.get();
        }
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            _update(rowform.$data, data);
            $scope.saveData(data);
            rowform.$cancel();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
        if (event.keyCode === 119) {
            $location.path('/app/orders/orderlist');
        }
    };
    $scope.Back = function () {
        $location.path('/app/definitions/inventorydefinitions/brand');
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!vm.tableParams.data[vm.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(vm.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('difinitions.Cancelled'),  $translate.instant('difinitions.Editcancelled'));
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }

    },
    {
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
                if (items.length > 0)
                    $scope.SelectedItem = items[0].id;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    }
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:  $translate.instant('difinitions.cancelButtonText'),
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
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.open = function (ObjectID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
            controller: 'TagModalCtrl',
            size: '',
            backdrop: '',
            resolve: {
                ObjectID: function () {
                    return ObjectID;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.result = selectedItem;
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("brandCtrl");
    });
};
