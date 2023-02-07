app.controller('storeeditCtrl', storeeditCtrl);
function storeeditCtrl($scope, $filter, SweetAlert, Restangular, ngTableParams, ngnotifyService, $modal, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("storeeditCtrl");
    var vm = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.original = {};
    $scope.podlar = "1";
    $rootScope.StoreID = 0;
    $scope.translate = function () {
        $scope.trStorePaymentType = $translate.instant('main.STOREPAYMENTTYPE');
        $scope.trStoreOrderType = $translate.instant('main.STOREORDERTYPE');
        $scope.trFilter = $translate.instant('main.FILTER');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trPlate = $translate.instant('main.PLATE');
        $scope.trModelName = $translate.instant('main.MODELNAME');
        $scope.trRegistrationDate = $translate.instant('main.REGISTRATIONDATE');
        $scope.trChassisNumber = $translate.instant('main.CHASSISNUMBER');
        $scope.trInsuranceDate = $translate.instant('main.INSURANCEDATE');
        $scope.trBrandName = $translate.instant('main.BRANDNAME');
        $scope.trPod = $translate.instant('main.POD');
        $scope.trRoutedToStore = $translate.instant('main.ROUTEDTOSTORE');
        $scope.trDeliveryTime = $translate.instant('main.DELIVERYTIME');
        $scope.trMinAmount = $translate.instant('main.MINAMOUNT');
        $scope.trSubcity = $translate.instant('main.SUBCITY');
        $scope.trRepositoryName = $translate.instant('main.REPOSITORYNAME');
        $scope.trDriversName = $translate.instant('main.DRIVERSNAME');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trTablePlan = $translate.instant('main.TABLEPLAN');
        $scope.trLocationX = $translate.instant('main.LOCATIONX');
        $scope.trLocationY = $translate.instant('main.LOCATIONY');
        $scope.trName = $translate.instant('main.NAME');
        $scope.trRepository = $translate.instant('main.REPOSITORY');
        $scope.trDepartment = $translate.instant('main.DEPARTMENT');
        $scope.trProductionPoint = $translate.instant('main.PRODUCTIONPOINT');
        $scope.trAuditMediaType = $translate.instant('main.AUDITMEDIATYPE');
        $scope.trStreetAddress = $translate.instant('main.STREETADDRESSNAME');
        $scope.trAddressType = $translate.instant('main.ADDRESSTYPE');
        $scope.trWdt = $translate.instant('main.WDT');
        $scope.trPodName = $translate.instant('main.PODNAME');
        $scope.trAuditMediaOutputTemplate = $translate.instant('main.AUDITMEDIAOUTPUTTEMPLATE');
        $scope.trLongitude = $translate.instant('main.LONGITUDE');
        $scope.trLatitude = $translate.instant('main.LATITUDE');
        $scope.trStoreLocationType = $translate.instant('main.STORELACATIONTYPE');
        $scope.trDayOfWeek = $translate.instant('main.DAYOFWEEK');
        $scope.trStartTime = $translate.instant('main.STARTTIME');
        $scope.trEndTime = $translate.instant('main.ENDTIME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trStoreRoutingType = $translate.instant('main.STOREROUTINGTYPE');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    if (!$scope.item.OpenDate) {
        $scope.item.OpenDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if (!$scope.item.CloseDate) {
        $scope.item.CloseDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd ');
    }
    if ($stateParams.id != 'new') {
        Restangular.one('store', $stateParams.id).get().then
            (function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
                $rootScope.StoreID = restresult.id;
                $scope.$broadcast('StoreIdChanged', restresult);
            },
                function (restresult) {
                    toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
                    swal("Error!", $translate.instant('Server.DataError'), "Warning");
                }
            )
    }
    var deregistration1 = $scope.$on('pod', function (event, data) {
        $scope.podlar = data;
        $scope.$broadcast('pod2', "Ok..");
    });
    var deregistration2 = $scope.$on('podDel', function (event, data) {
        $scope.$broadcast('podDeleted', "Delete..");
    });
    $scope.EditCountDisabled = function () {
        return $stateParams.id != 'new' && $rootScope.user.restrictions.EditCountDisabled == 'Enable';
    }
    $scope.saveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                swal($translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'), "success");
                $rootScope.StoreID = resp.id;
                $scope.$broadcast('StoreIdChanged', resp);
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'store')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal($translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'), "success");
                $rootScope.StoreID = resp.id;
                $scope.$broadcast('StoreIdChanged', resp);
            });

        }
    }
    $scope.SaveItem = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                ia.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'inventoryadjustitem')
            this.item.post().then(function (res) {
                ia.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
        }
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    vm.search = '';
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
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.companies = [];
    $scope.loadEntities('company', 'companies');
    $scope.members = [];
    $scope.loadEntities('member', 'members');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.towns = [];
    $scope.loadEntities('town', 'towns');
    $scope.storetypes = [];
    $scope.loadEntities('enums/storetype', 'storetypes');
    $scope.storestates = [];
    $scope.loadEntities('enums/storestate', 'storestates');
    $scope.storeregions = [];
    $scope.loadEntities('storeregion', 'storeregions');
    $scope.storeroutingtypes = [];
    $scope.loadEntities('enums/storeroutingtype', 'storeroutingtypes');
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal($translate.instant('orderfile.Deleted'), $translate.instant('orderfile.RecordDeleted'), "success");
                    $location.path('app/store/store/list');
                });
            }
            else {
                SweetAlert.swal($translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
            }
        });
    };
    $scope.AddressSelector = function () {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/streetaddress/StreetAddressSelector.html',
            controller: 'StreetAddressSelectorCtrl',
            size: '',
            backdrop: '',
            resolve: {
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.item.StoreAddress = selectedItem.name + '/' + selectedItem.Quarter.name + '/' + selectedItem.Quarter.Subcity.name + '/' + selectedItem.Quarter.Subcity.Town.name;
        })
    };
    $scope.datepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.item.OpenDate = item;
        })
    };
    $scope.closedatepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.item.CloseDate = item;
        })
    };
    $scope.OracleStartDatepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.item.OracleStartDate = item;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("storeeditCtrl");
    });
};
app.controller('storePaymentTypeCtrl', storePaymentTypeCtrl);
function storePaymentTypeCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $translate, $location, $element) {
    $rootScope.uService.EnterController("storePaymentTypeCtrl");
    var vm = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'storepaymenttype')
            this.item.post().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                    $scope.StoreID = 0;
                }
                Restangular.all('storepaymenttype').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "StoreID='" + $scope.StoreID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };

    $scope.paymenttypes = [];
    $scope.loadEntities('paymenttype', 'paymenttypes');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (vm.tableParams.data[index].fromServer) {
                    vm.tableParams.data[index].remove();
                }
                vm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
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
        vm.tableParams.data.push({ StoreID: $rootScope.StoreID });
    };
    var deregistration = $scope.$watch(angular.bind(vm, function () {
        return $rootScope.StoreID;
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storePaymentTypeCtrl");
    });
};
app.controller('storeordertypeCtrl', storeordertypeCtrl);
function storeordertypeCtrl($rootScope, $scope, $modal, $filter, $translate, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("storeordertypeCtrl");
    var vm = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'storeordertype')
            this.item.post().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                    $scope.StoreID = 0;
                }
                Restangular.all('storeordertype').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "StoreID='" + $scope.StoreID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (vm.tableParams.data[index].fromServer) {
                    vm.tableParams.data[index].remove();
                }
                vm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
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
        vm.tableParams.data.push({ StoreID: $rootScope.StoreID });
    };
    var deregistration = $scope.$watch(angular.bind(vm, function () {
        return $rootScope.StoreID;
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storeordertypeCtrl");
    });
};
app.controller('vehicleCtrl', vehicleCtrl);
function vehicleCtrl($rootScope, $scope, $modal, $filter, $translate, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("vehicleCtrl");
    var vm = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'vehicle')
            this.item.post().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                    $scope.StoreID = 0;
                }
                Restangular.all('vehicle').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "StoreID='" + $scope.StoreID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.brands = [];
    $scope.loadEntities('brand', 'brands');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (vm.tableParams.data[index].fromServer) {
                    vm.tableParams.data[index].remove();
                }
                vm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
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
        vm.tableParams.data.push({ StoreID: $scope.StoreID });
    };
    var deregistration = $scope.$watch(angular.bind(vm, function () {
        return $rootScope.StoreID;
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
        }, function () {
        });
    };
    $scope.datepopupRegistration = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.RegistrationDate = result;
        })
    };
    $scope.datepopupInsurance = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.InsuranceDate = result;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("vehicleCtrl");
    });
};
app.controller('storestreetaddressCtrl', storestreetaddressCtrl);
function storestreetaddressCtrl($rootScope, $scope, $modal, $filter, $translate, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $element) {
    $rootScope.uService.EnterController("storestreetaddressCtrl");
    var ssa = this;
    $scope.SelectedItem = null;
    $scope.subcity = [];
    var deregistration = $scope.$on('StoreIdChanged', function (event, data) {
        $scope.store = data;
        $scope.loadSubcity(true);
        //if ($scope.subcity && $scope.subcity.length) {
        //    $scope.item.SubcityID = $scope.subcity[0];
        //    $scope.SucityChanged($scope.subcity[0].id);
        //}
    });
    $scope.loadSubcity = function (ForceUpdate) {
        if (!$scope.subcity.length || ForceUpdate) {
            Restangular.all('subcity').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'name',
                search: "TownID='" + $scope.store.TownID + "'"
            }).then(function (result) {
                $scope.subcity = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.quarters = [];
    $scope.SucityChanged = function (subcityId) {
        Restangular.all('quarter').getList({
            pageNo: 1,
            pageSize: 1000,
            sort: 'id',
            search: "SubcityID='" + subcityId + "'"
        }).then(function (result) {
            $scope.quarters = result;
        }, function (response) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
        //$scope.Quarter = null;//why write this code
    };
    $scope.streetaddress = [];
    $scope.QuarterChanged = function (quarterId) {
        $scope.QuarterID = quarterId;
        $scope.SelectedItem = null;
        ssa.tableParams.reload();
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (ssa.search && ssa.search.length > 1) {
            result.push("name  like '%" + ssa.search + "%'");
        }
        result.push("Quarters.id='" + $scope.QuarterID + "'");
        return result;
    };
    ssa.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    }, {
        counts: [],
        getData: function ($defer, params) {
            if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                $scope.StoreID = 0;
            }
            if ($scope.QuarterID && $scope.QuarterID != undefined) {
                Restangular.all('streetaddress').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.BuildSearchString(),
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.addresstypes = [];
    $scope.loadEntities('enums/streetaddresstype', 'addresstypes');
    $scope.pods = [];
    $scope.loadPods = function (forceRefresh) {
        if (!$rootScope.StoreID) return;
        if (!$scope.pods.length || forceRefresh) {
            Restangular.all('pod').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: "StoreID='" + $rootScope.StoreID + "'"
            }).then(function (result) {
                $scope.pods = result;

            }, function (respons) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            })
        }
    };
    $scope.SelectItem = function (itemtoSelect) {
        $scope.SelectedItem = itemtoSelect;
    };
    $scope.pods = [];
    $scope.podChanged = function (podId) {
        ssa.tableParams.reload();
        ssa.StoreStreetsTable.reload();
    };
    ssa.StoreStreetsTable = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        counts: [],
        getData: function ($defer, params) {
            if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                $scope.StoreID = 0;
            }
            Restangular.all('storestreetaddress').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "StoreID='" + $scope.StoreID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $scope.SelectedItem = (items[0]) ? items[0].id : null;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }

    });
    var deregistration1 = $scope.$watch(angular.bind(ssa, function () {
        return $rootScope.StoreID;
    }), function (value) {
        $scope.loadPods(true);
    });
    var deregistration2 = $scope.$watch(angular.bind(ssa, function () {
        return ssa.search;
    }), function (value) {
        ssa.tableParams.reload();
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
        }, function () {
        });
    };
    var deregistration3 = $scope.$on('pod2', function (event, data) {
        console.log(data);
        $scope.loadPods(true);
    });
    var deregistration4 = $scope.$on('podDeleted', function (event, data) {
        console.log(data);
        $scope.loadPods(true);
    });
    $scope.AddAddressToPod = function (selectedstreet, PodID) {
        if (!$scope.PodID || $scope.PodID == 'all') {
            toaster.pop('warning', $translate.instant('storefile.SelectPod '));
            return;
        }
        var newssa = {
            StoreID: $rootScope.StoreID,
            PodID: $scope.PodID,
            StreetAddressID: selectedstreet,
            WDT: 0
        }
        {
            Restangular.restangularizeElement('', newssa, 'storestreetaddress')
            newssa.post().then(
                function (res) {
                    ssa.StoreStreetsTable.reload();
                    toaster.pop('success', $translate.instant('storefile.PodAdded '), $translate.instant('orderfile.Saved'));
                    $scope.$emit('pod', $translate.instant('storefile.PodAdded '));
                    newssa.get();
                }
            );
        }
    }
    $scope.updateDate = function (data) {
        data.put().then
            (function (res) {
                ssa.tableParams.reload();
                toaster.pop('success', $translate.instant('storefile.PodAdded '), $translate.instant('storefile.Saveddatatoserver '));
            });
    }
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ssa.StoreStreetsTable.data[index].fromServer) {
                    ssa.StoreStreetsTable.data[index].remove();
                }
                ssa.StoreStreetsTable.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        deregistration2();
        deregistration3();
        deregistration4();
        $element.remove();
        $rootScope.uService.ExitController("storestreetaddressCtrl");
    });
};
app.controller('podCtrl', podCtrl);
function podCtrl($rootScope, $scope, $modal, $filter, SweetAlert, $translate, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("podCtrl");
    var vm = this;
    $scope.saveData = function (data) {
        if (this.item.restangularized) {
            this.item.put().then(
                function (res) {
                    vm.tableParams.reload();
                    toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
                    $scope.$emit('pod', $translate.instant('storefile.PodAdded '));
                });
        }
        else {
            $scope.newssa = { StoreID: $rootScope.StoreID, PodID: $scope.item.PodID, StreetAddressID: $scope.selecteditem, WDT: 0 }
            Restangular.restangularizeElement('', data, 'pod')
            this.item.post().then(
                function (res) {
                    vm.tableParams.reload();
                    toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
                    $scope.$emit('pod', $translate.instant('storefile.PodAdded '));
                });
            data.get();
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
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    }, {
        getData: function ($defer, params) {
            if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                $scope.StoreID = 0;
            }
            Restangular.all('pod').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (vm.search) ? "name like '%" + vm.search + "%'and StoreID='" + $scope.StoreID + "'" : "StoreID='" + $scope.StoreID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
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
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (vm.tableParams.data[index].fromServer) {
                    vm.tableParams.data[index].remove();
                }
                vm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
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
        vm.tableParams.data.push({ StoreID: $scope.StoreID, isActive: true, DeliveryTime: 8, MinAmount: 0 });
    };
    var deregistration = $scope.$watch(angular.bind($rootScope, function () {
        return $rootScope.StoreID;
    }), function (value) {
        vm.tableParams.reload();
    });
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("podCtrl");
    });
};
app.controller('repositoryCtrl', repositoryCtrl);
function repositoryCtrl($rootScope, $scope, $modal, $filter, SweetAlert, $translate, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("repositoryCtrl");
    var vm = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'repository')
            this.item.post().then(function (res) {
                vm.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                    $scope.StoreID = 0;
                }
                Restangular.all('repository').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "StoreID='" + $scope.StoreID + "'"
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
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (vm.tableParams.data[index].fromServer) {
                    vm.tableParams.data[index].remove();
                }
                vm.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
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
        vm.tableParams.data.push({ StoreID: $rootScope.StoreID, MemberID: $rootScope.user.UserRole.MemberID });
    };
    var deregistration = $scope.$watch(angular.bind(vm, function () {
        return $rootScope.StoreID;
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("repositoryCtrl");
    });
};
app.controller('driverCtrl', driverCtrl);
function driverCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("driverCtrl");
    var dc = this;
    //$scope.item = {};
    $scope.SelectedItem = 0;
    $scope.SelectItem = function (id) {
        if ($scope.SelectedItem == id) {
            $scope.ShowDetail = !$scope.ShowDetail;
        }
        else
            $scope.ShowDetail = true;
        //if ($scope.ShowDetail)
        $scope.$broadcast('user', id);
        $scope.SelectedItem = id;

    };
    $scope.ExpanItem = function (item) {
        if (item[Expanded])
            item[Expanded] = !item[Expanded];
        else
            item[Expanded] = true;
    }
    $scope.translate = function () {
        $scope.trUserName = $translate.instant('main.USERNAME');
        $scope.trFullUserName = $translate.instant('main.FULLUSERNAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trUserCard = $translate.instant('main.USERCARD');
        $scope.trPassword = $translate.instant('main.PASSWORD');
        $scope.trUserRole = $translate.instant('main.USERROLE');
        $scope.trAuthCode = $translate.instant('main.AUTHCODE');
        $scope.trCitizenship = $translate.instant('main.CITIZENSHIPID');
        $scope.trStaffPosition = $translate.instant('main.STAFFPOSITION');
        $scope.trLaborCostType = $translate.instant('main.LABORCOSTTYPE');
        $scope.trisActive = $translate.instant('main.USERISACTIVE');
        $scope.trQuitReason = $translate.instant('main.QUITREASON');


    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.userroles = userService.getUserRoles($rootScope.user.UserRole.MemberID);
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope.userroles.length; i++) {
            if ($scope.userroles[i][idName] == idvalue)
                return $scope.userroles[i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.saveData = function (data) {
        data.StoreID = $stateParams.id;
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                dc.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
        else {
            data.StoreID = $stateParams.id;
            Restangular.restangularizeElement('', data, 'user')
            data.post().then(function (res) {
                dc.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
            data.get();
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
        if (!dc.tableParams.data[dc.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(dc.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };

    $scope.ToggleOff = function (rowform, data, index, field, thefield) {
        if (rowform.$visible) {
            thefield[field] = !thefield[field];
            rowform.$data[field] = !rowform.$data[field];
        }
        else {
            rowform.$show();
        }
    };

    $scope.BuildSearchString = function () {
        var result = [];
        var roleID = [];
        for (var i = 0; i < $scope.userroles.length; i++) {
            roleID.push($scope.userroles[i].id)
        }
        result.push("UserRoleID in (" + roleID + ")");
        result.push("StoreID='" + $scope.StoreID + "'");
        return result;
    };
    dc.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                    $scope.StoreID = 0;
                }
                Restangular.all('user').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: $scope.BuildSearchString()
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
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (dc.tableParams.data[index].fromServer) {
                    dc.tableParams.data[index].remove();
                }
                dc.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (dc.tableParams.data[index].fromServer) {
            dc.tableParams.data[index].remove();
        }
        dc.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        dc.tableParams.data.push({ StoreID: $rootScope.StoreID });
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
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
    $scope.staffpositions = [
        { id: 300000014253, Name: "Restoran Müdürü",isActive: false  },
        { id: 300000014254, Name: "Kurye",isActive: false  },
        { id: 300000014776, Name: "Asistan Müdür",isActive: false  },
        { id: 300000014777, Name: "Mutfakçi",isActive: false },
        { id: 300000014778, Name: "Vardiya Müdürü",isActive: false  },
        { id: 300048516424, Name: "Team Member",isActive: false  },
        { id: 300087503237, Name: "Restoran Müdürü - Kidemli",isActive: false  },
        { id: 300087503752, Name: "Restoran Müdürü - 2.Kademe",isActive: false  },
        { id: 300087503897, Name: "Restoran Müdürü - 3.Kademe",isActive: false  },
        { id: 300087504030, Name: "Restoran Müdürü - 4.Kademe",isActive: false  },
        { id: 300087504398, Name: "Asistan Müdür - 2.Kademe",isActive: false  },
        { id: 300087504536, Name: "Asistan Müdür - 3.Kademe",isActive: false  },
        { id: 300087504709, Name: "Asistan Müdür - 4.Kademe", isActive: false },
        { id: 300087504961, Name: "Vardiya Müdürü – 2.Kademe",isActive: false  },
        { id: 300087505089, Name: "Vardiya Müdürü - 3.Kademe",isActive: false  },
        { id: 300087505141, Name: "Vardiya Müdürü - 4.Kademe",isActive: false  },
        { id: 300087505293, Name: "ULAK Kurye", isActive: false },
        { id: 300106395212, Name: "Getir Kurye", isActive: false },
        { id: 300132772261, Name: "Team Training", isActive: false },
        { id: 300133806509, Name: "Vigo-Kurye",isActive: false  },
        { id: 300250073138, Name: "Joker-Kurye",isActive: true  },
        { id: 300148827478, Name: "Isim-Kurye", isActive: true },
        { id: 300154984454, Name: "Dispatcher Kurye", isActive: false }
    ];
    $scope.loadEntities('staffposition', 'staffpositions');
    $scope.quitreasons = [];
    $scope.loadEntities('quitreason', 'quitreasons');
    $scope.trainings = [];
    $scope.loadEntities('training', 'trainings');
    $scope.laborcosttypes = [];
    $scope.loadEntities('laborcosttype', 'laborcosttypes');

    var deregistration1 = $scope.$watch(angular.bind(dc, function () {
        return $rootScope.StoreID;
    }), function (value) {
        dc.tableParams.reload();
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("driverCtrl");
    });
};
app.controller('drivervehicleCtrl', drivervehicleCtrl);
function drivervehicleCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, ngnotifyService, userService, $element) {
    $rootScope.uService.EnterController("drivervehicleCtrl");
    var dc = this;
    $scope.translate = function () {
        $scope.trDriversName = $translate.instant('main.DRIVERSNAME');
        $scope.trVehiclePlate = $translate.instant('main.VEHICLEPLATE');
        $scope.trStartKilometer = $translate.instant('main.STARTKILOMETER');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
        $scope.trEndDate = $translate.instant('main.ENDDATE');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    $scope.DriverVehicle = [];
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.StartDate = $scope.StartDate;
            this.item.EndDate = $scope.EndDate;
            this.item.put().then(function (res) {
                dc.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'drivervehicle')
            this.item.StartDate = $scope.StartDate;
            this.item.EndDate = $scope.EndDate;
            this.item.post().then(function (res) {
                dc.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
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
        if (!dc.tableParams.data[dc.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(dc.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };

    dc.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                    $scope.StoreID = 0;
                }
                Restangular.all('drivervehicle').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "Drivers.StoreID='" + $scope.StoreID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                    $scope.DriverVehicle = items;
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.isActivePasif = function (data) {
        if (data == null || data == false) {
            $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
            $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');//TODO delete this line.
        }
        else {
            $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
            for (var i = 0; i < $scope.DriverVehicle.length; i++) {
                $scope.StartDate = $scope.DriverVehicle[i].StartDate;
            }

        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (dc.tableParams.data[index].fromServer) {
                    dc.tableParams.data[index].remove();
                }
                dc.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (dc.tableParams.data[index].fromServer) {
            dc.tableParams.data[index].remove();
        }
        dc.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        dc.tableParams.data.push({});
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
                search: "StoreID='" + $scope.StoreID + "'"
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.loadEntities2 = function (EntityType, Container) {
        $scope.userroles = userService.getUserRoles($rootScope.user.UserRole.MemberID);
        var DriverID = {};
        for (var i = 0; i < $scope.userroles.length; i++) {
            if ($scope.userroles[i].name == 'Sürücü') {
                DriverID = $scope.userroles[i].id
            }
        }
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: "UserRoleID='" + DriverID + "' and StoreID='" + $scope.StoreID + "'"
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.drivers = [];
    $scope.loadEntities2('user', 'drivers');
    $scope.vehicles = [];
    $scope.loadEntities('vehicle', 'vehicles');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("drivervehicleCtrl");
    });
};
app.controller('storetableCtrl', storetableCtrl);
function storetableCtrl($rootScope, $scope, $modal, $filter, $translate, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("storetableCtrl");
    var stable = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                stable.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'storetable')
            this.item.post().then(function (res) {
                stable.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!stable.tableParams.data[stable.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(stable.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    stable.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                $scope.StoreID = 0;
            }
            Restangular.all('storetable').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "StoreID='" + $scope.StoreID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
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
                search: "StoreID='" + $scope.StoreID + "'"
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.tableplans = [];
    $scope.loadEntities('tableplan', 'tableplans');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (stable.tableParams.data[index].fromServer) {
                    stable.tableParams.data[index].remove();
                }
                stable.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (stable.tableParams.data[index].fromServer) {
            stable.tableParams.data[index].remove();
        }
        stable.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        stable.tableParams.data.push({ StoreID: $stateParams.id });
    };
    var deregistration = $scope.$watch(angular.bind(stable, function () {
        return $rootScope.StoreID;
    }), function (value) {
        stable.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storetableCtrl");
    });
};
app.controller('storetableplanCtrl', storetableplanCtrl);
function storetableplanCtrl($rootScope, $scope, $modal, $filter, $translate, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("storetableplanCtrl");
    var stableplan = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                stableplan.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'tableplan')
            this.item.post().then(function (res) {
                stableplan.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!stableplan.tableParams.data[stableplan.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(stableplan.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    stableplan.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                $scope.StoreID = 0;
            }
            Restangular.all('tableplan').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "StoreID='" + $scope.StoreID + "'"
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
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (stableplan.tableParams.data[index].fromServer) {
                    stableplan.tableParams.data[index].remove();
                }
                stableplan.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (stableplan.tableParams.data[index].fromServer) {
            stableplan.tableParams.data[index].remove();
        }
        stableplan.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        stableplan.tableParams.data.push({ StoreID: $rootScope.StoreID });
    };
    var deregistration = $scope.$watch(angular.bind(stableplan, function () {
        return $rootScope.StoreID;
    }), function (value) {
        stableplan.tableParams.reload();
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storetableplanCtrl");
    });
};
app.controller('storeproductionCtrl', storeproductionCtrl);
function storeproductionCtrl($rootScope, $scope, $modal, $filter, $translate, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("storeproductionCtrl");
    var sp = this;
    $scope.item = {};
    $scope.SelectedItem = null;
    $scope.SelectedAuditMedia = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/stores/addStoreAuditMedia.html',
            controller: 'storeauditmediaCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
        }, function () {
        });
    };
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                sp.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'storeproduction')
            this.item.post().then(function (res) {
                sp.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!sp.tableParams.data[sp.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sp.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    sp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                $scope.StoreID = 0;
            }
            Restangular.all('storeproduction').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "StoreID='" + $scope.StoreID + "'"//TODO rootscope StroID
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.repositories = [];
    $scope.loadRepository = function () {
        if (!$scope.repositories.length) {
            Restangular.all('repository').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: "StoreID='" + $scope.StoreID + "'"
            }).then(function (result) {
                $scope.repositories = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadRepository();
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.departments = [];
    $scope.loadEntities('department', 'departments');
    $scope.productionpoints = [];
    $scope.loadEntities('productionpoint', 'productionpoints');
    $scope.storeauditmedias = [];
    $scope.loadEntities('storeauditmedia', 'storeauditmedias');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (sp.tableParams.data[index].fromServer) {
                    sp.tableParams.data[index].remove();
                }
                sp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sp.tableParams.data[index].fromServer) {
            sp.tableParams.data[index].remove();
        }
        sp.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sp.tableParams.data.push({ StoreID: $rootScope.StoreID });
    };
    var deregistration = $scope.$watch(angular.bind(sp, function () {
        return $rootScope.StoreID;
    }), function (value) {
        sp.tableParams.reload();
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
        }, function () {
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storeproductionCtrl");
    });
};
app.controller('storeauditmediaCtrl', storeauditmediaCtrl);
function storeauditmediaCtrl($rootScope, $scope, $modal, $modalInstance, $filter, item, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate) {
    $rootScope.uService.EnterController("storeauditmediaCtrl");
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trAuditMediaType = $translate.instant('main.AUDITMEDIATYPE');
        $scope.trAuditMedia = $translate.instant('main.AUDITMEDIA');
        $scope.trAuditMediaOutputTemplate = $translate.instant('main.AUDITMEDIAOUTPUTTEMPLATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();

    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    $scope.StoreAuditMedia = item;
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('storeauditmedia').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "StoreProductionID='" + item.id + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) {
                $scope.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'storeauditmedia')
            data.post().then(function (res) {
                $scope.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!$scope.tableParams.data[$scope.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove($scope.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.auditmediatypes = [];
    $scope.loadEntities('enums/auditmediatype', 'auditmediatypes');
    $scope.auditmedia = [];
    $scope.loadEntities('auditmedia', 'auditmedia');
    $scope.auditmediaoutputtemplates = [];
    $scope.loadEntities('auditmediaoutputtemplate', 'auditmediaoutputtemplates');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if ($scope.tableParams.data[index].fromServer) {
                    $scope.tableParams.data[index].remove();
                }
                $scope.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if ($scope.tableParams.data[index].fromServer) {
            $scope.tableParams.data[index].remove();
        }
        $scope.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        $scope.tableParams.data.push({ StoreProductionID: item.id });
    };
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
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("storeauditmediaCtrl");
    });
};
app.controller('storelocationCtrl', storelocationCtrl);
function storelocationCtrl($rootScope, $scope, $modal, $filter, SweetAlert, $translate, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $element) {
    $rootScope.uService.EnterController("storelocationCtrl");
    var sl = this;
    $scope.item = {};
    sl.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                $scope.StoreID = 0;
            }
            Restangular.all('storelocation').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "StoreID='" + $scope.StoreID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.StoreID = $stateParams.id;
            this.item.put().then(function (res) {
                sl.tableParams.reload();
                toaster.pop('success', $translate.instant('personfile.DataUpdated'), $translate.instant('invantories.Updatedapplied'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'storelocation')
            this.item.StoreID = $stateParams.id;
            this.item.post().then(function (res) {
                sl.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
            this.item.get();
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
        if (!sl.tableParams.data[sl.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sl.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
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
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.storeLocationType = [];
    $scope.loadEntities('enums/storelocationtype', 'storeLocationType');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (sl.tableParams.data[index].fromServer) {
                    sl.tableParams.data[index].remove();
                }
                sl.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sl.tableParams.data[index].fromServer) {
            sl.tableParams.data[index].remove();
        }
        sl.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sl.tableParams.data.push({ StoreID: $rootScope.StoreID });
    };

    var deregistration = $scope.$watch(angular.bind(sl, function () {
        return $rootScope.StoreID;
    }), function (value) {
        sl.tableParams.reload();
    });

    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storelocationCtrl");
    });

};
app.controller('storeworkingtimesCtrl', storeworkingtimesCtrl);
function storeworkingtimesCtrl($rootScope, $scope, $filter, SweetAlert, $translate, Restangular, ngTableParams, toaster, $window, $stateParams, $modal, $element) {
    $rootScope.uService.EnterController("storeworkingtimesCtrl");
    var swt = this;
    $scope.StoreID = $stateParams.id;
    $scope.item = {};
    swt.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            if ($scope.StoreID == 'new' && $stateParams.id == 'new') {
                $scope.StoreID = 0;
            }
            Restangular.all('storeworkingtime').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "StoreID='" + $scope.StoreID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.saveData = function (olddata) {
        var data = olddata;
        if (data.restangularized) {
            data.StartTime = $filter('date')(olddata.StartTime, 'HH:mm:ss');
            data.EndTime = $filter('date')(olddata.EndTime, 'HH:mm:ss');
            data.StoreID = $stateParams.id;
            data.put().then(function (res) {
                swt.tableParams.reload();
                toaster.pop('success', $translate.instant('personfile.DataUpdated'), $translate.instant('invantories.Updatedapplied'));
            });
        }
        else {
            data.StartTime = $filter('date')(olddata.StartTime, 'HH:mm:ss');
            data.EndTime = $filter('date')(olddata.EndTime, 'HH:mm:ss');
            Restangular.restangularizeElement('', data, 'storeworkingtime')
            data.StoreID = $stateParams.id;
            data.post().then(function (res) {
                swt.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!swt.tableParams.data[swt.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(swt.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (swt.tableParams.data[index].fromServer) {
                    swt.tableParams.data[index].remove();
                }
                swt.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (swt.tableParams.data[index].fromServer) {
            swt.tableParams.data[index].remove();
        }
        swt.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        swt.tableParams.data.push({ StoreID: $stateParams.id });
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
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.weekdays = [];
    $scope.loadEntities('enums/weekdays', 'weekdays');
    $scope.startTime = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.item.StartTime = item;
        })
    };
    $scope.endTime = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.item.EndTime = item;
        })
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("storeworkingtimesCtrl");
    });
};
app.controller('useremailCtrl', useremailCtrl);
function useremailCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("useremailCtrl");
    var ue = this;
    $scope.ID = $stateParams.id;
    $scope.translate = function () {
        $scope.trEmail = $translate.instant('main.EMAIL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        data.UserID = $stateParams.id;
        if (data.restangularized) {
            data.put().then(function (res) {
                ue.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'useremail')
            data.post().then(function (res) {
                ue.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!ue.tableParams.data[ue.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ue.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    ue.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('useremail').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: ($stateParams.id) ? "UserID='" + $stateParams.id + "'" : ""
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ue.tableParams.data[index].fromServer) {
                    ue.tableParams.data[index].remove();
                }
                ue.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ue.tableParams.data[index].fromServer) {
            ue.tableParams.data[index].remove();
        }
        ue.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ue.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("useremailCtrl");
    });
};
app.controller('usertrainingCtrl', usertrainingCtrl);
function usertrainingCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("usertrainingCtrl");
    var ut = this;
    $scope.ID = $stateParams.id;
    $scope.translate = function () {
        $scope.trTraining = $translate.instant('main.TRAININGNAME');
        $scope.trTrainingDate = $translate.instant('main.TRAININGDATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        data.UserID = $stateParams.id;
        if (data.restangularized) {
            data.put().then(function (res) {
                ut.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'usertraining')
            data.post().then(function (res) {
                ut.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
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
        if (!ut.tableParams.data[ut.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ut.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    ut.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('usertraining').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: ($stateParams.id) ? "UserID='" + $stateParams.id + "'" : ""
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: $translate.instant('orderfile.Sure'),
            text: $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText: $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ut.tableParams.data[index].fromServer) {
                    ut.tableParams.data[index].remove();
                }
                ut.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('invantories.Attention'), $translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ut.tableParams.data[index].fromServer) {
            ut.tableParams.data[index].remove();
        }
        ut.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ut.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("usertrainingCtrl");
    });
};
