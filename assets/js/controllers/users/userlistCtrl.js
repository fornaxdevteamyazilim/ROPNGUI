app.controller('userlistCtrl', userlistCtrl);
function userlistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("userlistCtrl");
    var us = this;
    $scope.objectType = 'store';
    $scope.SelectedItem = null;
    us.search = '';
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.USERNAME');
        $scope.trFullName = $translate.instant('main.FULLUSERNAME');
        $scope.trStoreID = $translate.instant('main.STORE');
        $scope.trCommand = $translate.instant('main.COMMANDS');
        $scope.trUserRoleName = $translate.instant('main.USERROLE');
                $scope.trisActive = $translate.instant('main.ISACTIVE');

    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        if ($rootScope.user && $rootScope.user.UserRole) {
            if ($rootScope.user.isAdmin) {
                location.href = '#/app/users/useredit/' + $scope.SelectedItem;
            } else {
                toaster.pop('warning',  $translate.instant('userfile.UnauthorizedAccessRequest '));
            }
        }
    };
    us.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },{
        getData: function ($defer, params) {
            Restangular.all('user').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: (us.search.length > 0) ? "Name like '%" + us.search + "%'" : "",
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response);
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
    var deregistration1 = $scope.$watch(angular.bind(us, function () {
        return us.search;
    }), function (value) {
        us.tableParams.reload();
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
        $rootScope.uService.ExitController("userlistCtrl");
    });
};
