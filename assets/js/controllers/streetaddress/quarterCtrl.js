'use strict';
app.controller('quarteryCtrl', quarteryCtrl);
function quarteryCtrl($rootScope, $scope, $log, $modal, Restangular, SweetAlert, ngTableParams, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("quarteryCtrl");
    var vm = this;
    $scope.objectType = 'quarter'
    $scope.SelectedItem = null;
    vm.search = '';
    $scope.subcities = [];
    $scope.translate = function () {
        $scope.trQuarterName = $translate.instant('main.QUARTERNAME');
        $scope.trSubcityTownName = $translate.instant('main.SUBCITYTOWNNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.tag = $translate.instant('main.TAG');
        $scope.remove = $translate.instant('main.REMOVE');
        $scope.searchbyquartername = $translate.instant('main.SEARCHBYQUARTERNAME');
        $scope.town = $translate.instant('main.TOWN');
        $scope.subcity = $translate.instant('main.SUBCITY');
        $scope.addquarter = $translate.instant('main.ADDQUARTER');
        $scope.search = $translate.instant('main.SEARCH');
        $scope.selecttown = $translate.instant('main.SELECTTOWN');
        $scope.selectsubcity = $translate.instant('main.SELECTSUBCITY');
        $scope.trminamount = $translate.instant('main.MINAMOUNT');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
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
                     toaster.pop('error',  $translate.instant('margeaddress.Couldnotupdated'), response.data.ExceptionMessage);
                 }
                 );
        }
        else {
            Restangular.restangularizeElement('', data, $scope.objectType)
            data.post().then(
                function (res) {
                    vm.tableParams.reload();
                    toaster.pop('success', $translate.instant('margeaddress.Added'), $translate.instant('margeaddress.Saved') );
                },
                 function (response) {
                     toaster.pop('error', $translate.instant('margeaddress.Notrecorded'), response.data.ExceptionMessage);
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
            toaster.pop('warning', $translate.instant('margeaddress.Cancelled'), $translate.instant('margeaddress.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('margeaddress.Cancelled'), $translate.instant('margeaddress.Editcancelled'));
        }
    };
      $scope.LoadSubcities = function (TownID) {
        Restangular.all('subcity').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "TownID='" + TownID + "'"
        }).then(function (result) {
            angular.copy(result, $scope.subcities);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.SelectSubcity = function (SubcityID) {
        $scope.SubcityID = SubcityID;
        vm.tableParams.reload();
    };
    $scope.BuildSearchString = function () {
        var result = [];
        if (vm.search && vm.search.length > 0)
            result.push("name like '%" + vm.search + "%'");
        if ($scope.SubcityID != undefined) {
            result.push(("SubcityID='" + $scope.SubcityID + "'")); 
        }
        return result;
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
            Restangular.all('quarter').getList({
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
    $scope.subcity = [];
    $scope.loadSubcity = function () {
        if (!$scope.subcity.length) {
            Restangular.all('subcity').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: ''
            }).then(function (result) {
                $scope.subcity = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadSubcity();
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
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
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
        vm.tableParams.data.push({});
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
        $rootScope.uService.ExitController("quarteryCtrl");
    });
};