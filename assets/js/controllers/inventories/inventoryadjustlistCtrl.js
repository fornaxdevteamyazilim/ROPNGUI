app.controller('inventoryadjustlistCtrl', inventoryadjustlistCtrl);
function inventoryadjustlistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $translate, userService, userService, $element, ngnotifyService) {
    $rootScope.uService.EnterController("inventoryadjustlistCtrl");
    var ia = this;
    userService.userAuthorizated();
    ia.search = '';
    userService.userAuthorizated();
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventoryadjust/edit/' + $scope.SelectedItem;
    };
        if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.translate = function () {
        $scope.trAdjustDate = $translate.instant('main.ADJUSTDATE');
        $scope.trAdjustName = $translate.instant('main.ADJUSTNAME');
        $scope.trAdjustType = $translate.instant('main.ADJUSTTYPE');
        $scope.trRepository = $translate.instant('main.REPOSITORY');
        $scope.searchbydate = $translate.instant('main.SEARCHBYDATE');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.addnewadjust = $translate.instant('main.ADDNEWADJUST');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showwastes = $translate.instant('main.SHOWWASTES');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
        $scope.BuildSearchString = function (src) {
        var result = [];
        if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && $scope.StoreID) {
            result.push("AdjustDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push(($scope.StoreID) ? "Repository.StoreID='" + $scope.StoreID + "'" : "Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        else if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && !$scope.StoreID) {
            result.push("AdjustDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push("Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        return result;
    };
    ia.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            AdjustDate: 'desc'
        }
    },{
        getData: function ($defer, params) {
            Restangular.all('inventoryadjust').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items.length > 0)
                    $scope.SelectedItem = items[0].id;
                $scope.myValues = $filter('orderBy')(items, params.orderBy());
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });

    $scope.LoadAdjust = function () {
        ia.tableParams.reload();
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

    $scope.RemoveItem = function (index) {
        ia.tableParams.data[index].remove();
    };
    var deregistration1 = $scope.$watch(angular.bind(ia, function () {
        return ia.search;
    }), function (value) {
        ia.tableParams.reload();
    });


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
        $rootScope.uService.ExitController("inventoryadjustlistCtrl");
    });
};
