'use strict';
app.controller('TagModalCtrl', TagModalCtrl);
function TagModalCtrl($rootScope, $scope, $translate, $modalInstance, ObjectID, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window) {
    $rootScope.uService.EnterController("TagModalCtrl");
    $scope.search = '';
    $scope.ObjectID = ObjectID;
    $scope.translate = function () {
        $scope.trTagName = $translate.instant('main.TAGNAME');
        $scope.trAddTag = $translate.instant('main.ADDTAG');
        $scope.trTagRemove = $translate.instant('main.TAGREMOVE');
    };
    $scope.translate();
    $scope.saveData = function (data) {
        var Object={BaseObjectID:ObjectID,TagID:data.id}
        Restangular.restangularizeElement('', Object, 'objecttag')
        Object.post().then(
            function (res) {
                $scope.tableParams.reload();
                toaster.pop('success', $translate.instant('margeaddress.Saved'),  $translate.instant('margeaddress.Saved'));
            },
                function (response) {
                    toaster.pop('error',$translate.instant('margeaddress.NotSaved'), response.data.ExceptionMessage);
                }
        );
    };
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 5,
    },{
        counts: [],
        getData: function ($defer, params) {
            Restangular.all('objecttag').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: "BaseObjectID ='" + $scope.ObjectID + "'",
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.GetTagTypes = function () {
        Restangular.all('enums/tagtype').getList({                
        }).then(function (result) {
            $scope.tagtypes = result;
        });
    };
    $scope.GetTagTypes();
    $scope.GetTags = function (data) {
        Restangular.all('tag').getList({
            pageNo: 1,
            pageSize: 1000,
            search: ($scope.search) ? "name like '%" + $scope.search + "%'" : "TagType='" + data + "'"
        }).then(function (result) {
            $scope.tag = result;
        });
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
                pageSize: 5000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.tags = [];
    $scope.loadEntities('tag', 'tags');
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
    };
    $scope.removeItem = function (index) {
        if ($scope.tableParams.data[index].fromServer) {
            $scope.tableParams.data[index].remove();
            toaster.pop("error", $translate.instant('margeaddress.Attention'),$translate.instant('margeaddress.RecordDeleted'));
        }
        $scope.tableParams.data.splice(index, 1);
    };
    var deregistration = $scope.$watch(angular.bind($scope, function () {
        return $scope.search;
    }), function (value) {
        $scope.GetTags();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        $rootScope.uService.ExitController("TagModalCtrl");
    });
}; 