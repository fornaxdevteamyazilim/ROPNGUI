app.controller('filterlistCtrl', filterlistCtrl);
function filterlistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $location, $translate, $element, $rootScope) {
    $rootScope.uService.EnterController("filterlistCtrl");
    var ic = this;
    $scope.objectType = 'filter';
    $scope.SelectedItem = null;
    ic.search = '';
    $scope.translate = function () {
        $scope.trFilterName = $translate.instant('main.FILTERNAME');
        $scope.trFilterObject = $translate.instant('main.FILTEROBJECT');
        $scope.trSchedule = $translate.instant('main.SCHEDULE');
        $scope.trFilterLevel = $translate.instant('main.FILTERLEVEL');
        $scope.trFilterType = $translate.instant('main.FILTERTYPE');
        $scope.trActive = $translate.instant('main.ACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/filter/filter/edit/' + $scope.SelectedItem;
    };
    ic.tableParams = new ngTableParams({
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
                search: (ic.search.length > 0) ? "Name like '%" + ic.search + "%'" : "",
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.filterobjects = [];
    $scope.loadEntities('enums/filterobject', 'filterobjects');
    $scope.schedules = [];
    $scope.loadEntities('schedule', 'schedules');
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
     $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("filterlistCtrl");
    });
};
