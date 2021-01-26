'use strict';
app.controller('subcityCtrl', subcityCtrl);
function subcityCtrl($rootScope, $scope, $log, $modal, Restangular, SweetAlert, ngTableParams, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("subcityCtrl");
    var vm = this;
    $scope.translate = function () {
        $scope.trSubcityName = $translate.instant('main.SUBCITYNAME');
        $scope.trTownName = $translate.instant('main.TOWNNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.remove = $translate.instant('main.REMOVE');
        $scope.tag = $translate.instant('main.TAG');
        $scope.searchbysubcityname = $translate.instant('main.SEARCHBYSUBCITYNAME');
        $scope.town = $translate.instant('main.TOWN');
        $scope.search = $translate.instant('main.SEARCH');
        $scope.addsubcity = $translate.instant('main.ADDSUBCITY');
        $scope.selecttown = $translate.instant('main.SELECTTOWN');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.objectType = 'subcity';
    $scope.SelectedItem = null;
    vm.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
    };
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(
                function (res) {
                    vm.tableParams.reload();
                    toaster.pop('success', $translate.instant('margeaddress.Updated'),  $translate.instant('margeaddress.Updated'));
                },
                 function (response) {
                     toaster.pop('error', $translate.instant('margeaddress.Failedupdate'), response.data.ExceptionMessage);
                 }
                 );
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(
                function (res) {
                    vm.tableParams.reload();
                    toaster.pop('success',$translate.instant('margeaddress.Added'), $translate.instant('margeaddress.Saved'));
                },
                 function (response) {
                     toaster.pop('error', $translate.instant('margeaddress.NotSaved'), response.data.ExceptionMessage);
                 }
                );
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
        if (!vm.tableParams.data[vm.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(vm.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('margeaddress.Cancelled'),  $translate.instant('margeaddress.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('margeaddress.Cancelled'),  $translate.instant('margeaddress.Editcancelled'));
        }
    };
    $scope.SelectTown = function (TownID) {
        $scope.TownID = TownID;
        vm.tableParams.reload();
    };
    $scope.BuildSearchString = function () {
        var result = [];
        if (vm.search && vm.search.length > 0)
            result.push("name like '%" + vm.search + "%'");
        if ($scope.TownID != undefined) {
            result.push(("TownID='" + $scope.TownID + "'"));
        }
        return result;
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },{
        getData: function ($defer, params) {
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
                if (items.length > 0)
                    $scope.SelectedItem = items[0].id;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.towns = [];
    $scope.loadEntities('town', 'towns');
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    }
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (vm.tableParams.data[index].fromServer) {
                    vm.tableParams.data[index].remove();
                }
                vm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('margeaddress.Attention'),$translate.instant('margeaddress.RecordDeleted'));
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
        vm.tableParams.data.push({ TownID: $scope.lastEditedTown });
    };
    var deregistration1 = $scope.$watch(angular.bind(vm, function () {
        return vm.search;
    }), function (value) {
        vm.tableParams.reload();
    });
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
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("subcityCtrl");
    });
};
