app.controller('inventorycountlistCtrl', inventorycountlistCtrl);
function inventorycountlistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, $element, userService, $filter, ngnotifyService) {
    $rootScope.uService.EnterController("inventorycountlistCtrl");
    var ic = this;
    $scope.objectType = 'inventorycount';
    $scope.SelectedItem = null;
    ic.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorycount/edit/' + $scope.SelectedItem;
    };
    if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.translate = function () {
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trCountType = $translate.instant('main.COUNTTYPE');
        $scope.trRepository = $translate.instant('main.REPOSITORY');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.searchbydate = $translate.instant('main.SEARCHBYDATE');
        $scope.addnewcount = $translate.instant('main.ADDNEWCOUNT');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showcounts = $translate.instant('main.SHOWCOUNTS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ic.tableParams.data[ic.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ic.tableParams.data.length - 1, 1);
            toaster.pop('warning', "İptal edildi !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "İptal edildi !", 'Edit cancelled !');
        }
    };
    //$scope.BuildSearchString = function (src) {
    //    var result = [];
    //    if (!userService.userIsInRole("Admin")|| !userService.userIsInRole("PHAdmin")) {
    //        result.push("Repository.StoreID='" + $rootScope.user.StoreID + "'");
    //        return result;
    //    }
    //};
            $scope.BuildSearchString = function (src) {
        var result = [];
        if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && $scope.StoreID) {
            result.push("CountDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push(($scope.StoreID) ? "Repository.StoreID='" + $scope.StoreID + "'" : "Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        else if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && !$scope.StoreID) {
            result.push("CountDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push("Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        return result;
    };
    ic.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },{
        getData: function ($defer, params) {
            if ($scope.StoreID || $rootScope.user.StoreID && $rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate) {
                $scope.isWaiting = true;
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: '-CountDate'
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items.length > 0)
                    $scope.SelectedItem = items[0].id;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('error', "Sunucu Hatası", response);
                SweetAlert.swal("Sunucu Hatası!", angular.toJson(response.data.ExceptionMessage, false), "error");
            });
            }
        }
        });
    $scope.ChangeStore = function (StoreID) {
        $scope.StoreID = StoreID;
    };

    $scope.LoadCounts = function () {
        ic.tableParams.reload();
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
                toaster.pop('Warning', "Sunucu hatası", response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu Hatası", response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.counttypes = [];
    $scope.loadEntities('enums/inventorycounttype', 'counttypes');
    $scope.cancelremove = function (index) {
        if (ic.tableParams.data[index].fromServer) {
            ic.tableParams.data[index].remove();
        }
        ic.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(ic, function () {
        return ic.search;
    }), function (value) {
        ic.tableParams.reload();
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
            $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };


    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("inventorycountlistCtrl");
    });
};
