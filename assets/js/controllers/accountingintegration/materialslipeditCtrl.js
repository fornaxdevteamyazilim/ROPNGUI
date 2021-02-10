app.controller('incomeslipeditCtrl', incomeslipeditCtrl);
function incomeslipeditCtrl($scope, $filter, SweetAlert, Restangular, ngTableParams, $modal, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("incomeslipeditCtrl");
    userService.userAuthorizated();
    var mse = this;
    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trSlipDate = $translate.instant('main.SLIPDATETIME');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trinventory = $translate.instant('main.INVENTORY');
        $scope.trTransactionType = $translate.instant('main.TRANSACTIONTYPE');
        $scope.trTransactionDate = $translate.instant('main.TRANSACTIONDATE');
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trRepository = $translate.instant('main.REPOSITORY');
        $scope.trUnitCount = $translate.instant('main.UNITCOUNT');
        $scope.trUnitPrice = $translate.instant('main.UNITPRICE');
        $scope.trRatio = $translate.instant('main.RATIO');
        $scope.trGroupRatio = $translate.instant('main.GROUPRATIO');        
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.AccountingMaterialSlipID  = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('AccountingMaterialSlip', $stateParams.id).
            get().then(function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
                if($scope.item.Items.length > 0) 
                    mse.tableParams.reload();
            })
    else {
        $scope.item = {};
    }
    mse.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
            getData: function ($defer, params) {
                if ($scope.item.Items && $scope.item.Items.length > 0) {
                    $defer.resolve($scope.item.Items);
                } else {
                    $scope.item.Items = [];
                    $defer.resolve($scope.item.Items);
                }
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
    $scope.repository = [];
    $scope.loadEntitiesCache('cache/repository', 'repository');
    $scope.inventories = [];
    $scope.loadEntitiesCache('cache/inventory', 'inventories');
    $scope.inventoryunits = [];
    $scope.loadEntitiesCache('cache/inventoryunit', 'inventoryunits');
    $scope.storepaymenttypes = [];
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("incomeslipeditCtrl");
    });
};