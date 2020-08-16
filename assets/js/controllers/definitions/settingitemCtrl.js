app.controller('settingitemCtrl', settingitemCtrl);
function settingitemCtrl($rootScope, $scope, $translate, Restangular,ngnotifyService, $location, $window, toaster, userService, $filter, $modal, $element) {
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
            toaster.pop('success', $translate.instant('difinitions.NewActive '));
            }, function (response) {
                $scope.isWaiting = false;
                toaster.pop('error', $translate.instant('difinitions.OperationPerformed '), response.data.ExceptionMessage);
            });
    };
    $scope.CopyRecipes= function (FromPeriodID, ToPeriodID) {
        $scope.isWaiting = true;
        Restangular.one('inventory/copyrecipes').get({
            FromPeriodID:FromPeriodID,
            ToPeriodID: ToPeriodID,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success',$translate.instant('difinitions.PrescriptionsCopied '));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed '), response.data.ExceptionMessage);
        });
    };
    $scope.UpdateInventoryPrice = function (PeriodID) {
        $scope.isWaiting = true;
        Restangular.one('updateinventoryprices').get({
            PeriodID: PeriodID,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.PricesUpdated '));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error',$translate.instant('difinitions.OperationPerformed ') , response.data.ExceptionMessage);
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
            toaster.pop('success',$translate.instant('difinitions.PrescriptionUpdated '));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed '), response.data.ExceptionMessage);
        });
    };
    
    $scope.clonerestrictions= function (FromRoleName, ToRoleName) {
        $scope.isWaiting = true;
        Restangular.one('tools/clonerestrictions').get({
            FromRoleName:FromRoleName,
            ToRoleName: ToRoleName,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success',$translate.instant('difinitions.Clonerestrictions '));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed '), response.data.ExceptionMessage);
        });
    };
    $scope.correctopdates = function () {
        $scope.isWaiting = true;
             //var data = new Date();
             var fromDate = $filter('date')($scope.DateRange.fromDate.value, 'yyyy-MM-dd');
             var toDate = $filter('date')($scope.DateRange.toDate.value, 'yyyy-MM-dd');
        Restangular.one('tools/correctopdates').get({
            fromDate:fromDate,
            toDate:toDate, 
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.OrderDatesUpdated '));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed '), response.data.ExceptionMessage);
        });        
    };
  
    
    $scope.DateRange = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.fromDate.value"
            },
            value: new Date()
        },
        toDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDate.value"
            },
            value: new Date()
        }
    };
    /* $scope.createprices = function () {
        $scope.isWaiting = true;
        Restangular.one('inventory/createprices').get({
            fromDate:$scope.DateRange.fromDate,
            toDate: $scope.DateRange.toDate          
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', "Sipariş Tarihleri Güncellendi!");
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', "İşleminiz Gerçekleştirilemedi!", response.data.ExceptionMessage);
        });        
    };
    $scope.DateRange = {
        fromDate: {         
            max: new Date(),
            min: new Date(2020, 0, 1),
            displayFormat: 'yyyy.MM.dd',
            bindingOptions: {
                value:new Date(),
            },          
        },
        toDate: {           
            max: new Date(),
            min: new Date(2020, 0, 1),
            displayFormat: 'yyyy.MM.dd',
            bindingOptions: {
                value:new Date(),
            },        
        }
    };
 */
    


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
                toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
            });
        }
    };
     $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Server Error", response);
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