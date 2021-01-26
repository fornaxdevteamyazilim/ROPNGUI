'use strict';
app.controller('inventorytransferlistCtrl', inventorytransferlistCtrl);
function inventorytransferlistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $translate, userService, $element, ngnotifyService) {
    $rootScope.uService.EnterController("inventorytransferlistCtrl");
    var its = this;
    userService.userAuthorizated();
    $scope.objectType = 'inventorytransfer';
    $scope.SelectedItem = null;
    its.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorytransfer/edit/' + $scope.SelectedItem;
    };

    //if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
    //    $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    //    $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    //}
    if (!$scope.StartDate) {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    } else {
        $scope.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    if (!$scope.EndDate) {
        $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    } else {
        $scope.EndDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!its.tableParams.data[its.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(its.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.translate = function () {
        $scope.trDate = $translate.instant('main.DATE');
        $scope.trDocumentNumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.trFromRepository = $translate.instant('main.FROMREPOSITORY');
        $scope.trToRepository = $translate.instant('main.TOREPOSITORY');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trInventorySupplyState = $translate.instant('main.INVENTORYSUPPLYSTATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showtransfer = $translate.instant('main.SHOWTRANSFER');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    //$scope.BuildSearchString = function (src) {
    //    var result = [];
    //    if (its.search && its.search.length > 0) {
    //        result.push("AdjustDate like '%" + its.search + "%'");
    //    }
    //    if ($rootScope.user && $rootScope.user.StoreID) {
    //        result.push("FromRepository.StoreID=" + $rootScope.user.StoreID + " or ToRepository.StoreID=" + $rootScope.user.StoreID + "");
    //    }
    //    return result;
    //};
    $scope.BuildSearchString = function (src) {
        var result = [];
        if ($scope.StartDate && $scope.EndDate && $scope.StoreID) {
            result.push("TransferDate between'" + $scope.StartDate + "'and'" + $scope.EndDate + "'");
            result.push(($scope.StoreID) ? "FromRepository.StoreID='" + $scope.StoreID + "' or ToRepository.StoreID='" + $scope.StoreID + "'" : "FromRepository.StoreID='" + $rootScope.user.StoreID + "' or ToRepository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        else if ($scope.StartDate && $scope.EndDate && !$scope.StoreID) {
            result.push("TransferDate between'" + $scope.StartDate + "'and'" + $scope.EndDate + "'");
            //result.push("FromRepository.StoreID='" + $rootScope.user.StoreID + "'");
            result.push("(FromRepository.StoreID='" + $rootScope.user.StoreID + "' or ToRepository.StoreID='" + $rootScope.user.StoreID + "')");
        }
        return result;
    };

    its.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
            getData: function ($defer, params) {
                Restangular.all($scope.objectType).getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.BuildSearchString(),
                    sort: '-TransferDate'
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    //$scope.SelectedItem = items[0].id;
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });

    $scope.LoadTransfer = function () {
        its.tableParams.reload();
    };
    $scope.ChangeStore = function (StoreID) {
        $scope.StoreID = StoreID;
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.repositories = [];
    $scope.loadEntities('repository', 'repositories');
    $scope.inventorysupplystate = [];
    $scope.loadEntities('enums/inventorysupplystate', 'inventorysupplystate');
    $scope.cancelremove = function (index) {
        if (its.tableParams.data[index].fromServer) {
            its.tableParams.data[index].remove();
        }
        its.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(its, function () {
        return its.search;
    }), function (value) {
        its.tableParams.reload();
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

    //$scope.SelectStartDate = function (item) {
    //    var modalInstance = $modal.open({
    //        templateUrl: 'assets/views/Tools/date.html',
    //        controller: 'dateCtrl',
    //        size: '',
    //        backdrop: '',
    //        resolve: {
    //            DateTime: function () {
    //                return item;
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function (item) {
    //        var data = new Date(item);
    //        $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
    //    })
    //};
    //$scope.SelectEndDate = function (item) {
    //    var modalInstance = $modal.open({
    //        templateUrl: 'assets/views/Tools/date.html',
    //        controller: 'dateCtrl',
    //        size: '',
    //        backdrop: '',
    //        resolve: {
    //            DateTime: function () {
    //                return item;
    //            }
    //        }
    //    });
    //    modalInstance.result.then(function (item) {
    //        var data = new Date(item);
    //        $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
    //    })
    //};

    $scope.SelectStartDate = function (item) {
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
            var data = new Date(item);
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.SelectEndDate = function (item) {
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
            var data = new Date(item);
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };

    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("inventorytransferlistCtrl");
    });
};
