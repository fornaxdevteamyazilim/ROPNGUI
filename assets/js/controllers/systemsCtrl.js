(function () {
    'use strict';
    app.controller('systemsCtrl', systemsCtrl);
    function systemsCtrl($scope, Restangular, ngTableParams, toaster, $translate, SweetAlert, $window) {
        var vm = this;
        $scope.SelectedItem = null;
        $scope.objectType = 'brand';
        vm.search = '';
        $scope.SelectItem = function (id) {
            $scope.SelectedItem = id;
        };
        $scope.saveData = function (data) {
            if (data.restangularized) {
                data.put().then(function (res) { vm.tableParams.reload(); toaster.pop('success',$translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated')); });
            }
            else {
                Restangular.restangularizeElement('', data, $scope.objectType)
                data.post().then(function (res) { vm.tableParams.reload(); toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Updated')); });
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
                toaster.pop('warning',$translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.Insertcancelled'));
            } else {
                toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.Editcancelled'));
            }
        };
        //$scope.cancelForm = function (rowform) {
        //    rowform.$cancel();
        //    if ($scope.addMode)
        //        $scope.removeItem(vm.tableParams.data.length - 1, 1);
        //};
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
                    sort: params.orderBy(),
                    search: vm.search
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $scope.SelectedItem = items[0].id;
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response);
                    SweetAlert.swal("Server error!", angular.toJson(response, false), "error");
                });
            }
        });
        
        $scope.saveItem = function (data) {
            _update(data, this.item);
            $scope.saveData(this.item);
            return this.item;
        }

        //$scope.saveItem = function (data) {
        //    _update(data, this.item);
        //    if (this.item.restangularized) {
        //        this.item.put();
        //    }
        //    else {
        //        Restangular.restangularizeElement('', this.item, $scope.objectType)
        //        $scope.newItem = this.item;
        //        this.item.post().then(function (resp) {
        //            $scope.newItem.id = resp.id;
        //            $scope.newItem = null;
        //        });
        //        this.item.get();
        //    }
        //    return this.item;
        //}
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
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    if (vm.tableParams.data[index].fromServer) {
                        vm.tableParams.data[index].remove();
                        toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
                    }
                    vm.tableParams.data.splice(index, 1);
                    SweetAlert.swal( $translate.instant('orderfile.Deleted'),  $translate.instant('orderfile.RecordDeleted'), "success");
                } else {
                    SweetAlert.swal($translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
                }
            });            
        };
        $scope.addItem = function () {
            vm.tableParams.data.push({});
        };
        $scope.$watch(angular.bind(vm, function () {
            return vm.search;
        }), function (value) {
            vm.tableParams.reload();
        });

    };
    app.controller('systemsEditCtrl', systemsEditCtrl);
    function systemsEditCtrl($scope, $stateParams, $translate,$location, Restangular, SweetAlert) {
        var vm = this;
        $scope.objectType = 'brand';
        if ($stateParams.id != 'new')
            Restangular.one($scope.objectType, $stateParams.id).get().then(function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
            })
        else {
            $scope.item = {}; //set default values here
        }

        $scope.isClean = function () {
            return angular.equals($scope.original, $scope.item);
        }
        $scope.destroy = function () {
            SweetAlert.swal({
                title:  $translate.instant('orderfile.Sure') ,
                text:  $translate.instant('orderfile.SureRecord'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    $scope.original.remove().then(function () {
                        $location.path('/app/settings/systems/list');
                    });
                    SweetAlert.swal($translate.instant('orderfile.Deleted'),  $translate.instant('orderfile.RecordDeleted'), "success");
                } else {
                    SweetAlert.swal($translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
                }
            });
        };
        $scope.save = function () {
            if ($scope.item.id)
                $scope.item.put().then(function () {
                    //toster ... kaydedildi...
                    $location.path('/app/others/sytems/list');
                })
            else
                Restangular.all('brand').post($scope.item);
            $location.path('/app/others/systems/list');
        }

    };

})();