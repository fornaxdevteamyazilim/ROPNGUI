app.controller('accounttoolsCtrl', accounttoolsCtrl);
function accounttoolsCtrl($rootScope, $scope,$translate, Restangular, $location, $window, toaster, userService, $filter, $modal, $element, NG_SETTING) {
    $rootScope.uService.EnterController("accounttoolsCtrl");
    //userService.userAuthorizated();
    var sti = this;
    $scope.Back = function () {
        $window.history.back();
    };
 
    if (userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("MarketingDepartment") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment") || userService.userIsInRole("MemberAdmin")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
    };

    $scope.CashDataXml = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/accounttools/cashdata?StoreID=' + $scope.StoreID + '&fromDate=' + $scope.StartDate + '&toDate=' + $scope.EndDate;
    };

    $scope.DeliveriesXml = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/accounttools/deliveries?StoreID=' + $scope.StoreID + '&fromDate=' + $scope.StartDate + '&toDate=' + $scope.EndDate;
    };

    $scope.InventoryDataXml = function () {
        location.href = NG_SETTING.apiServiceBaseUri + '/api/accounttools/inventorydata?StoreID=' + $scope.StoreID + '&fromDate=' + $scope.StartDate + '&toDate=' + $scope.EndDate;
    };

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
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');

    $scope.FromDate = function (item) {
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
            $scope.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.ToDate = function (item) {
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
            $scope.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };


    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("accounttoolsCtrl");
    });
};