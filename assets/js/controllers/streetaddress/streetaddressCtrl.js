//'use strict';
app.controller('streetaddressCtrl', streetaddressCtrl);
function streetaddressCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("streetaddressCtrl");
    var vm = this;
    $scope.lastEditedQaurter = '';
    $scope.objectType = 'streetaddress';
    $scope.SelectedItem = null;
    vm.search = '';
    $scope.subcities = [];
    $scope.quarter = [];
    $scope.translate = function () {
        $scope.trStreetAddressName = $translate.instant('main.STREETADDRESSNAME');
        $scope.trAddressTypeName = $translate.instant('main.ADDRESSTYPENAME');
        $scope.trQuarter = $translate.instant('main.QUARTER');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.showstorestreetaddress = $translate.instant('main.SHOWSTORESTREETADDRESS');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.remove = $translate.instant('main.REMOVE');
        $scope.tag = $translate.instant('main.TAG');
        $scope.quarter = $translate.instant('main.QUARTER');
        $scope.subcity = $translate.instant('main.SUBCITY');
        $scope.town = $translate.instant('main.TOWN');
        $scope.search = $translate.instant('main.SEARCH');
        $scope.addstreetaddress = $translate.instant('main.ADDSTREETADDRESS');
        $scope.searchbystreetaddressname = $translate.instant('main.SEARCHBYSTREETADDRESSNAME');
        $scope.selecttown = $translate.instant('main.SELECTTOWN');
        $scope.selectsubcity = $translate.instant('main.SELECTSUBCITY');
        $scope.selectquarter = $translate.instant('main.SELECTQUARTER');
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
                    toaster.pop('success', $translate.instant('margeaddress.Updated'), $translate.instant('margeaddress.Updated'));
                },
                 function (response) {
                     toaster.pop('error', $translate.instant('margeaddress.FailedtoUpdate'), response.data.ExceptionMessage);
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
    $scope.LoadQuarters = function (QuarterID) {
        Restangular.all('quarter').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "SubcityID='" + QuarterID + "'"
        }).then(function (result) {
            angular.copy(result, $scope.quarters);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.SelcetQuarter = function (QuarterID) {
        $scope.QuarterID = QuarterID;
        vm.tableParams.reload();
    };
    $scope.BuildSearchString = function () {
        var result = [];
        if (vm.search && vm.search.length > 0)
            result.push("tt.name like'%" + vm.search + "%'");
        if ($scope.QuarterID != undefined) {
            result.push("Quarters.id='" + $scope.QuarterID + "'");
        }
        return result;
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('streetaddress').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $scope.SelectedItem = (items[0]) ? items[0].id : null;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.addresstype = [];
    $scope.loadAddresstype = function () {
        if (!$scope.addresstype.length) {
            Restangular.all('enums/streetaddresstype').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: ''
            }).then(
            function (result) {
                $scope.addresstype = result;
            },
            function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadAddresstype();
    $scope.showAddresstype = function (streetAddress) {
        if (streetAddress.StreetAddressTypeID && $scope.addresstype.length) {
            var selected = $filter('filter')($scope.addresstype, { Value: streetAddress.StreetAddressTypeID });
            return selected.length ? selected[0].Name : 'Not Set';
        } else {
            return streetAddress.name || 'Not Set';
        }
    };
    $scope.quarters = [];
    $scope.loadQuarter = function () {
        if (!$scope.quarters.length) {
            Restangular.all('quarter').getList({
                pageNo: 1,
                pageSize: 5000,
            }).then(function (result) {
                $scope.quarters = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadQuarter();
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
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
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
    $scope.getStoreStreetAddress = function (addressID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/streetaddress/storestreetaddresses.html',
            controller: 'storestreetaddressesCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                addressID: function () {
                    return addressID;
                }
            }
        });
        modalInstance.result.then(function () {
        });
    };
    $scope.streetAddresEdit = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/streetaddress/streetaddress.edit.html',
            controller: 'streetaddresseditCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (mesage) {
            if (mesage == 'Reload Table') {
                vm.tableParams.reload();
            }
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("streetaddressCtrl");
    });
};