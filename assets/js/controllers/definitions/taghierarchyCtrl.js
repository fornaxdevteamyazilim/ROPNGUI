app.controller('taghierarchyCtrl', taghierarchyCtrl);
function taghierarchyCtrl($rootScope, $scope, $modal, Restangular, toaster, $window, $translate, $compile, $element) {
    $rootScope.uService.EnterController("taghierarchyCtrl");
    $scope.TagTYpeID = null;
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.RefreshNestables = function () {
        var newElement = angular.element('<div ng-nestable ng-model="tags">{{$item.name}}</div>');
        $compile(newElement)($scope);
        $('#nestables').html(newElement);
    }
    $scope.tagtypes = [];
    $scope.loadEntities('enums/tagtype', 'tagtypes');
    $scope.tags = [];
    $scope.LoadTags = function (data) {
        Restangular.all('tag/array').getList({
            id: data
        }).then(function (result) {
            $scope.tags = result;
            $scope.RefreshNestables();
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.saveData = function (data) {
        Restangular.restangularizeElement('', data, 'tag/array')
        data.post().then(function (res) {
            toaster.pop('success', $translate.instant('difinitions.Saved'),  $translate.instant('difinitions.Saved'));
        });
    }
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("taghierarchyCtrl");
    });
};