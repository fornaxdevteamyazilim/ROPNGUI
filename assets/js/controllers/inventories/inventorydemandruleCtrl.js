app.controller('inventorydemandruleCtrl', inventorydemandruleCtrl);
function inventorydemandruleCtrl($scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("inventorydemandruleCtrl");
    var idr = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.translate = function () {
        $scope.trSupplyStore = $translate.instant('main.SUPPLYSTORE');
        $scope.trStores = $translate.instant('main.STORE');
        $scope.trStoreGroups = $translate.instant('main.STOREGROUP');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trCommands = $translate.instant('main.COMMANDS');        
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.translate();
    $scope.newDealItem = function () {
        location.href = '#/app/inventory/inventorydemandrule/edit/new';
    };
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorydemandrule/edit/' + $scope.SelectedItem;
    };
    idr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            Restangular.all('inventorydemandrule').getList({
                pageNo: params.page(),
                pageSize: params.count(),
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Error!", response.data.ExceptionMessage);
            });
        }
    });
    $scope.coppyDeal = function (itemID) {
        Restangular.one('inventorydemandrule/copydemandrule').get({ idr: itemID }).then(function (restresult) {
            $scope.Showspinner = true;
            location.href = '#/app/inventory/inventorydemandrule/edit/' + restresult.idr
            idr.tableParams.reload();
        }, function (response) {
            $scope.Showspinner = false;
            toaster.pop('warning', "Error!", response.data.Message);
        });
    };
    $scope.storegroups = [];
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorydemandruleCtrl");
    });
};
