app.controller('declaredrevenuelistCtrl', declaredrevenuelistCtrl);
function declaredrevenuelistCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("declaredrevenuelistCtrl");
    var dr = this;
    userService.userAuthorizated();
    $scope.SelectedItem = null;
    dr.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/specialoperations/declaredrevenueedit/' + $scope.SelectedItem;
    };
    $scope.AddItem = function () {
        location.href = '#/app/specialoperations/declaredrevenueedit/new';
    };
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trOperationDate = $translate.instant('main.OPERATIONDATE');
        $scope.trTotalAmount = $translate.instant('main.TOTALAMOUNT');
        $scope.trTotalCash = $translate.instant('main.TOTALCASH');
        $scope.trNotes = $translate.instant('main.NOTE');
        $scope.trisCharged = $translate.instant('main.STATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (userService.userIsInRole("STOREMANAGER")) {
            result.push("StoreID =" +$rootScope.user.StoreID);
        }
        return result;
    };
    dr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },
    {
        getData: function ($defer, params) {
            Restangular.all('declaredrevenue').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: $scope.BuildSearchString(),
                sort: params.orderBy()
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
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
    $scope.InventorySupplyStates = [];
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("declaredrevenuelistCtrl");
    });
};
