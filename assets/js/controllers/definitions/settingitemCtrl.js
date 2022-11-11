app.controller('settingitemCtrl', settingitemCtrl);
function settingitemCtrl($rootScope, $scope, $translate, Restangular, ngnotifyService, $location, $window, toaster, userService, $filter, $modal, $element) {
    $rootScope.uService.EnterController("settingitemCtrl");
    //userService.userAuthorizated();
    var sti = this;
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.params = userService.getParameter('inventorydeliverylist',
        {
            fromDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd'),
            toDate: moment().add(2, 'days').format('YYYY-MM-DD')
        }
    ).Parameters;
    Date.prototype.addDays = Date.prototype.addDays || function (days) {
        return this.setTime(864E5 * days + this.valueOf()) && this;
    };
    $scope.StartNewPeriod = function () {
        $scope.isWaiting = true;
        Restangular.one('inventory/startnewperiod').get({}).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.NewActive'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
        });
    };
    $scope.CopyRecipes = function (FromPeriodID, ToPeriodID) {
        $scope.isWaiting = true;
        Restangular.one('inventory/copyrecipes').get({
            FromPeriodID: FromPeriodID,
            ToPeriodID: ToPeriodID,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.PrescriptionsCopied'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
        });
    };
    $scope.UpdateInventoryPrice = function (PeriodID) {
        $scope.isWaiting = true;
        Restangular.one('updateinventoryprices').get({
            PeriodID: PeriodID,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.PricesUpdated'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
        });
    };
    $scope.SaveConsuption = function (StoreID) {
        $scope.isWaiting = true;
        Restangular.one('saveconsuptions').get({
            fromDate: $scope.StartDate,
            toDate: $scope.EndDate,
            StoreID: (StoreID) ? StoreID : '',
            StoreType: $scope.StoreTypeID
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.PrescriptionUpdated'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
        });
    };

    $scope.clonerestrictions = function (FromRoleName, ToRoleName) {
        $scope.isWaiting = true;
        Restangular.one('tools/clonerestrictions').get({
            FromRoleName: FromRoleName,
            ToRoleName: ToRoleName,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.Clonerestrictions'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
        });
    };
    $scope.correctopdates = function () {
        $scope.isWaiting = true;
        //var data = new Date();
        var fromDate = $filter('date')($scope.DateRanges.fromDate.value, 'yyyy-MM-dd');
        var toDate = $filter('date')($scope.DateRanges.toDate.value, 'yyyy-MM-dd');
        Restangular.one('tools/correctopdates').get({
            fromDate: fromDate,
            toDate: toDate,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.OrderDatesUpdated'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
        });
    };
    //beyan edilen gelir düzenlemesi başlangıç
    $scope.DeclaredRevenues = function () {
        $scope.isWaiting = true;
        //var data = new Date();
        var FromOpDate = $filter('date')($scope.DateRanges.fromDate.value, 'yyyy-MM-dd');
        var ToOpDate = $filter('date')($scope.DateRanges.toDate.value, 'yyyy-MM-dd');
        Restangular.one('DeclaredRevenue/correct').get({
            FromOpDate: FromOpDate,
            ToOpDate: ToOpDate,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.DeclaredRevenues'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
        });
    };
     //beyan edilen gelir düzenlemesi bitiş

    $scope.SendDeclaredRevenues = function () {
        $scope.isWaiting = true;
        //var data = new Date();
        var FromOpDate = $filter('date')($scope.DateRanges.fromDate.value, 'yyyy-MM-dd');
        var ToOpDate = $filter('date')($scope.DateRanges.toDate.value, 'yyyy-MM-dd');
        Restangular.one('DeclaredRevenue/send').get({
            FromOpDate: FromOpDate,
            ToOpDate: ToOpDate,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.DeclaredRevenues'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
        });
    };
    $scope.DateRanges = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRanges.fromDate.value"
            },
            value: (new Date()).addDays(-1),
            labelLocation: "top", // or "left" | "right"  

        },
        toDate: {
            max: $scope.params.toDate,
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRanges.toDate.value"
            },
            value: (new Date()).addDays(1),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
        }
    };
    $scope.DateRanges = {
        fromDate: {
            max: new Date(),
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRanges.fromDate.value"
            },
            value: (new Date()).addDays(-1),
            labelLocation: "top", // or "left" | "right"  

        },
        toDate: {
            max: $scope.params.toDate,
            min: new Date(2019, 0, 1),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRanges.toDate.value"
            },
            value: (new Date()).addDays(1),
            label: {
                location: "top",
                alignment: "right" // or "left" | "center"
            }
        }
    };
    // $scope.CalculateProductCosts = function () {
    //     $scope.isWaiting = true;
    //     Restangular.one('inventory/CalculateProductCosts').get({
    //         PeriodID:PeriodID
    //     }).then(function (result) {
    //         $scope.isWaiting = false;
    //         toaster.pop('success', $translate.instant('difinitions.CalculateProductCosts '));
    //     }, function (response) {
    //         $scope.isWaiting = false;
    //         toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
    //     });
    // };


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
        toDadte: {
            max: $scope.params.toDadte,
            min: new Date(2019, 0, 3),
            displayFormat: 'dd.MM.yyyy',
            bindingOptions: {
                value: "DateRange.toDadte.value"
            },
            value: new Date()
        }
    };
    $scope.CalculateDailyProductCosts = function () {
        $scope.isWaiting = true;
        var fromDate = $filter('date')($scope.DateRange.fromDate.value, 'yyyy-MM-dd');
        var toDadte = $filter('date')($scope.DateRange.toDadte.value, 'yyyy-MM-dd');
        Restangular.one('inventory/CalculateDailyProductCosts').get({
            fromDate: fromDate,
            toDadte: toDadte,
        }).then(function (result) {
            $scope.isWaiting = false;
            toaster.pop('success', $translate.instant('difinitions.CalculateProductCosts'));
        }, function (response) {
            $scope.isWaiting = false;
            toaster.pop('error', $translate.instant('difinitions.OperationPerformed'), response.data.ExceptionMessage);
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
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