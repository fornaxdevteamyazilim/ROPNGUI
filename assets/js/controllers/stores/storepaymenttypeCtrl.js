(function () {
    'use strict';
    app.controller('storepaymenttypeCtrl', storepaymenttypeCtrl);
    function storepaymenttypeCtrl($scope, $log, $modal, $translate, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope) {
        var vm = this;
        $scope.objectType = 'storepaymenttype';
        $scope.SelectedItem = null;
        vm.search = '';
        $scope.SelectItem = function (id) {
            $scope.SelectedItem = id;
        };
        $scope.saveData = function (data) {
            if (data.restangularized) {
                data.put().then(function (res) { vm.tableParams.reload(); toaster.pop('success', $translate.instant('personfile.DataUpdated'), $translate.instant('personfile.DataUpdateapplyedserver')); });
            }
            else {
                Restangular.restangularizeElement('', data, $scope.objectType)
                data.post().then(function (res) { vm.tableParams.reload(); toaster.pop('success', $translate.instant('personfile.DataUpdated'), $translate.instant('invantories.Savedserver')); });
                data.get();
            }
        }
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
        };
        $scope.cancelForm = function (rowform) {
            rowform.$cancel();
            if (!vm.tableParams.data[vm.tableParams.data.length - 1].restangularized) {
                $scope.cancelremove(vm.tableParams.data.length - 1, 1);
                toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
            } else {
                toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
            }
        };
        vm.tableParams = new ngTableParams({
            page: 1,
            count: 10,
        },
        {
            getData: function ($defer, params) {
                Restangular.all($scope.objectType).getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: (vm.search.length > 0) ? "PaymentType.name like '%" + vm.search + "%'" : "",
                    sort: params.orderBy()
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $scope.SelectedItem = items[0].id;
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error',$translate.instant('Server.ServerError'), response);
                    SweetAlert.swal($translate.instant('Server.ServerError'), angular.toJson(response, false), "error");
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
                    toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
                });
            }
        };

        $scope.paymenttypes = [];
        $scope.loadEntities('enums/paymenttype', 'brands');
        $scope.stores = [];
        $scope.loadEntities('store', 'stores');

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
        }
        $scope.removeItem = function (index) {
            SweetAlert.swal({
                title:  $translate.instant('orderfile.Sure') ,
                text: $translate.instant('orderfile.Youwillnotbeablerecoverthisrecord'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
                cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    if (vm.tableParams.data[index].fromServer) {
                        vm.tableParams.data[index].remove();
                        toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
                    }
                    vm.tableParams.data.splice(index, 1);
                    SweetAlert.swal($translate.instant('orderfile.Deleted'),  $translate.instant('orderfile.RecordDeleted'), "success");
                } else {
                    SweetAlert.swal($translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
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
        $scope.$watch(angular.bind(vm, function () {
            return vm.search;
        }), function (value) {
            vm.tableParams.reload();
        });
        $scope.open = function (ObjectID) {

            var modalInstance = $modal.open({
                templateUrl: 'assets/views/Tags/ObjectTagEditModalContent.html',
                controller: 'TagModalCtrl',
                size: '',
                resolve: {
                    ObjectID: function () {
                        return ObjectID;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.result = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    };
})();