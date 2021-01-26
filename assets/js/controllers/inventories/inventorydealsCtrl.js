app.controller('inventorydealsCtrl', inventorydealsCtrl);
function inventorydealsCtrl($scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("inventorydealsCtrl");
    var id = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.translate = function () {
        $scope.trInventoryUnit = $translate.instant('main.INVENTORYUNIT');
        $scope.trPrice = $translate.instant('main.PRICE');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trInventorySupplyMethod = $translate.instant('main.INVENTORYSUPPLYMETHOD');
        $scope.trMinUnits = $translate.instant('main.MINUNITS');
        $scope.trMaxUnits = $translate.instant('main.MAXUNITS');
        $scope.trDeliveryDays = $translate.instant('main.DELIVERYDAYS');
        $scope.trDiscount = $translate.instant('main.DISCOUNT');
        $scope.trValidFrom = $translate.instant('main.VALIDFROM');
        $scope.trMultipliyer = $translate.instant('main.MULTIPLIER');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trValidTo = $translate.instant('main.VALIDTO');
        $scope.trStoreGroup = $translate.instant('main.STOREGROUP');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.translate();
    $scope.BuildSearchString = function () {
        var result = [];
        if ($scope.item.CompanyID)
            result.push("CompanyID='" + $scope.item.CompanyID + "'");
        if ($scope.item.StoreID)
            result.push("StoreID='" + $scope.item.StoreID + "'");
        if ($scope.item.StoreGroupID)
            result.push("StoreGroupID='" + $scope.item.StoreGroupID + "'");
        if ($scope.item.ValidFrom)
            result.push("ValidFrom='" + $scope.item.ValidFrom + "'");
        return result;
    };
    id.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            Restangular.all('inventorydeal').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.loadData = function () {
        id.tableParams.reload();
    };
    $scope.DateValidFrom = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var data = new Date(item);
            $scope.item.ValidFrom = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.newDealItem = function () {
        location.href = '#/app/inventory/inventorydeals/edit/new';
    };
    $scope.coppyDeal = function (itemID) {
        Restangular.one('inventorydeal/copydeal').get({id:itemID}).then(function (restresult) {
            $scope.Showspinner = true;
            location.href = '#/app/inventory/inventorydeals/edit/' + restresult.id;
            id.tableParams.reload();
        }, function (response) {
            $scope.Showspinner = false;
            toaster.pop('warning', " Error!", response.data.Message);
        });
    };
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorydeals/edit/' + $scope.SelectedItem;
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
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.companies = [];
    $scope.loadEntities('cache/company', 'companies');
    $scope.storegroups = [];
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("inventorydealsCtrl");
    });
};
