'use strict';
app.controller('scheduletypelistCtrl', scheduletypelistCtrl);
function scheduletypelistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $translate, $element) {
    $rootScope.uService.EnterController("scheduletypelistCtrl");
    var st = this;
    $scope.translate = function () {
        $scope.trScheduleTypes = $translate.instant('main.SCHEDULETYPES');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });

    st.search = '';
    $scope.SelectedItem = null;
    $scope.SelectItem = function (id) {
        location.href = '#/app/definitions/scheduledefinitions/edit/' + id;
    };
    st.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('scheduletype').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: (st.search) ? "name like '%" + st.search + "%'" : "",
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
    $scope.$watch(angular.bind(st, function () {
        return st.search;
    }), function (value) {
        st.tableParams.reload();
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
    var deregistration1 = $scope.$watch(angular.bind(st, function () {
        return st.search;
    }), function (value) {
        st.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("scheduletypelistCtrl");
    });
};

