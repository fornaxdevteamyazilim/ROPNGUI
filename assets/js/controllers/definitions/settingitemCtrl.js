app.controller('settingitemCtrl', settingitemCtrl);
function settingitemCtrl($rootScope, $scope, Restangular, $location, $window, toaster, userService, $filter, $modal, $element) {
    $rootScope.uService.EnterController("settingitemCtrl");
    //userService.userAuthorizated();
    var sti = this;
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.StartNewPeriod = function () {
        $scope.isWaiting = true;
        Restangular.one('inventory/startnewperiod').get({}).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', "Yeni Dönem Aktif!");
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
            });
    };
    $scope.CopyRecipes= function (FromPeriodID, ToPeriodID) {
        $scope.isWaiting = true;
        Restangular.one('inventory/copyrecipes').get({
            FromPeriodID:FromPeriodID,
            ToPeriodID: ToPeriodID,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', "Reçeteler Kopyalandı!");
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
        });
    };
    $scope.UpdateInventoryPrice = function (PeriodID) {
        $scope.isWaiting = true;
        Restangular.one('updateinventoryprices').get({
            PeriodID: PeriodID,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', "Fiyatlar Güncellendi!");
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
        });
    };
    $scope.SaveConsuption = function (StoreID) {
        $scope.isWaiting = true;
        Restangular.one('saveconsuptions').get({
            fromDate:  $scope.StartDate,
            toDate: $scope.EndDate,
            StoreID: (StoreID) ? StoreID : '',
            StoreType: $scope.StoreTypeID
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', "Tüketim Fişleri Güncellendi!");
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
        });
    };

    $scope.SetStoreTypeID = function (FromValue) {
        $scope.StoreTypeID = FromValue;
        $scope.selectedStoreType = $filter('filter')($scope.storetypes, { id: FromValue });
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
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu hatası", response.data.ExceptionMessage);
            });
        }
    };
     $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu Hatası", response);
            });
        }
    };
     $scope.periods = [];
     $scope.loadEntitiesCache('cache/period', 'periods');
     $scope.store = [];
    $scope.loadEntitiesCache('cache/Store', 'store');
    $scope.storetypes = [];
    $scope.loadEntities('enums/storetype', 'storetypes');
    $scope.StoreType = "-1";
    $scope.GetStoreType = function (data) {
        $scope.StoreTypeID = data;
        $scope.selectedType = $filter('filter')($scope.storetypes, { Value: data });
    };
     $scope.GetPeriods = function (data) {
        $scope.PeriodID = data;
        $scope.selectedPeriod = $filter('filter')($scope.periods, { id: data });
     };
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
        $rootScope.uService.ExitController("settingitemCtrl");
    });
};