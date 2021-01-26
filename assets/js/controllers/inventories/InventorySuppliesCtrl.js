'use strict';
app.controller('InventorySuppliesCtrl', InventorySuppliesCtrl);
function InventorySuppliesCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $translate, userService, $element) {
    $rootScope.uService.EnterController("InventorySuppliesCtrl");
    var is = this;
    userService.userAuthorizated();
    $scope.SelectedItem = null;
    is.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorysupplies/edit/' + $scope.SelectedItem;
    };
    $scope.translate = function () {
        $scope.trTemplateName = $translate.instant('main.TEMPLATENAME');
        $scope.trObjectTags = $translate.instant('main.TAG');
        $scope.trisDefault = $translate.instant('main.ISDEFAULT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.BuildSearchString = function (src) {
        var result = [];
        if ($rootScope.user && $rootScope.user.StoreID) {
            result.push("StoreID=" + $rootScope.user.StoreID);
        }
        return result;
    };
    is.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },{
        getData: function ($defer, params) {
            Restangular.all('InventorySupply').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items && items.length > 0)
                    $scope.SelectedItem = items[0].id;                
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
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
        $element.remove();
        $rootScope.uService.ExitController("InventorySuppliesCtrl");
    });
};
