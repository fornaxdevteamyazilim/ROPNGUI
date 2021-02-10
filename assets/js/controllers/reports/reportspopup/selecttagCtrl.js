'use strict';
app.controller('selecttagCtrl', selecttagCtrl);
function selecttagCtrl($scope, $modal, Restangular, $modalInstance, toaster, $window, $translate, $compile) {
    var tree;
    $scope.TagID = 20;
    $scope.selected = null;
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.my_tree_handler = function (branch) {
        $scope.selected = branch.item;
    };
    $scope.tagtypes = [];
    $scope.loadEntities('enums/tagtype', 'tagtypes');
    $scope.tags = [];
    $scope.my_tree = tree = {};
    $scope.LoadTags = function (data) {
        Restangular.all('tag/array').getList({
            id: data
        }).then(function (result) {
            $scope.tags = $scope.AddLabels(result);
            tree.expand_all();
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    };
    $scope.LoadTags(20);
    $scope.saveData = function (data) {
        Restangular.restangularizeElement('', data, 'tag/array')
        toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
    };
    $scope.ok = function () {
        $modalInstance.close($scope.selected);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.AddLabels = function (items) {
        if (items && items.length)
            for (var i = 0; i < items.length; i++) {
                items[i]['label'] = items[i].item.name;
                $scope.AddLabels(items[i].children);
            }
        return items;
    };
};
