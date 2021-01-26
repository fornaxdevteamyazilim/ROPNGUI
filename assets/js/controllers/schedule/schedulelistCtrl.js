'use strict';
app.controller('schedulelistCtrl', schedulelistCtrl);
function schedulelistCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $location, $translate, $element) {
    $rootScope.uService.EnterController("schedulelistCtrl");
    var s = this;
    s.search = '';
    $scope.SelectedItem = null;
    $scope.SelectItem = function (id) {
        location.href = '#/app/schedule/schedule/edit/' + id;
    };

    $scope.translate = function () {
        $scope.trScheduleName = $translate.instant('main.SCHEDULENAME');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    s.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('schedule').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: (s.search) ? "name like '%" + s.search + "%'" : "",
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items.length > 0)
                    $scope.SelectedItem = items[0].id;
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
    var deregistration1 = $scope.$watch(angular.bind(s, function () {
        return s.search;
    }), function (value) {
        s.tableParams.reload();
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
        $rootScope.uService.ExitController("schedulelistCtrl");
    });
};

