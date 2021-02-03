app.controller('customerconsuptionreportCtrl', customerconsuptionreportCtrl);
function customerconsuptionreportCtrl($scope, $rootScope, $modal, $filter, SweetAlert, Restangular, toaster, $window, $stateParams, $timeout, $location, $translate, userService, ngnotifyService, $http, NG_SETTING, $element) {
    $rootScope.uService.EnterController("customerconsuptionreportCtrl");
    //userService.userAuthorizated();
    $scope.item = {};
    $scope.setCustomerCreatedFilter = function (data) {
        $scope.item.CustomerCreatedFilter = data;
    };
    $scope.setSpecialDateFilter = function (data) {
        $scope.item.SpecialDateFilter = data;
    };
    $scope.setSpecialDateType = function (data) {
        $scope.item.SpecialDateTypeID = data;
    };
    $scope.setStore = function (data) {
        $scope.item.StoreID = data;
    };
    if (userService.userIsInRole("Admin") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("LC") || userService.userIsInRole("AREAMANAGER") || userService.userIsInRole("ACCOUNTING") || userService.userIsInRole("PH") || userService.userIsInRole("MarketingDepartment") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("OperationDepartment") || userService.userIsInRole("FinanceDepartment")) {
        $scope.StoreID = '';
        $scope.ShowStores = true;
    } else {
        $scope.StoreID = $rootScope.user.StoreID;
    }
    $scope.SetStoreID = function (FromValue) {
        $scope.StoreID = FromValue;
        $scope.selectedStore = $filter('filter')($scope.stores, { id: FromValue });
    };

    $scope.setOrderType = function (data) {
        $scope.item.OrderTypeID = data;
    };
    $scope.setOrderSource = function (data) {
        $scope.item.OrderSourceID = data;
    };
    $scope.setGenderType = function (data) {
        $scope.item.GenderTypeID = data;
    };
    $scope.OrdersFromDate = function (item) {
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
            $scope.item.OrdersFromDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.OrdersToDate = function (item) {
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
            $scope.item.OrdersToDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.CustomerCreatedFrom = function (item) {
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
            $scope.item.CustomerCreatedFrom = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.CustomerCreatedTo = function (item) {
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
            $scope.item.CustomerCreatedTo = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.SpecialDateFrom = function (item) {
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
            $scope.item.SpecialDateFrom = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.SpecialDateTo = function (item) {
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
            $scope.item.SpecialDateTo = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.getData = function (data) {
        $scope.isWaiting = true;
        var getdata = {};
        getdata.OrdersFromDate = data.OrdersFromDate;
        getdata.OrdersToDate = data.OrdersToDate;
        getdata.CustomerCreatedFilter = (data.CustomerCreatedFilter) ? data.CustomerCreatedFrom : false;
        getdata.CustomerCreatedFrom = (data.CustomerCreatedFrom) ? data.CustomerCreatedFrom : ''
        getdata.CustomerCreatedTo = (data.CustomerCreatedTo) ? data.CustomerCreatedTo : ''
        getdata.StoreID = /*(data.StoreID) ? data.StoreID : '';*/  (data.StoreID) ? data.StoreID : $rootScope.user.StoreID;
        getdata.OrderTypeID = (data.OrderTypeID) ? data.OrderTypeID : -1;
        getdata.OrderSourceID = (data.OrderSourceID) ? data.OrderSourceID : '';
        getdata.ProductID = (data.ProductID) ? data.ProductID : '';
        getdata.GenderTypeID = (data.GenderTypeID) ? data.GenderTypeID : -1;
        getdata.MinAmout = (data.MinAmout) ? data.MinAmout : 0;
        getdata.MaxAmount = (data.MaxAmount) ? data.MaxAmount : 0;
        getdata.MinOrdersCount = (data.MinOrdersCount) ? data.MinOrdersCount : 0;
        getdata.MaxOrdersCount = (data.MaxOrdersCount) ? data.MaxOrdersCount : 0;
        getdata.MinInacativeDays = (data.MinInacativeDays) ? data.MinInacativeDays : 0;
        getdata.MaxInacativeDays = (data.MaxInacativeDays) ? data.MaxInacativeDays : 0;
        getdata.SpecialDateFilter = (data.SpecialDateFilter) ? data.SpecialDateFilter : false;
        getdata.SpecialDateTypeID = (data.SpecialDateTypeID) ? data.SpecialDateTypeID : -1;
        getdata.SpecialDateFrom = (data.SpecialDateFrom) ? data.SpecialDateFrom : '';
        getdata.SpecialDateTo = (data.SpecialDateTo) ? data.SpecialDateTo : '';
        $http({
            method: 'POST',
            url: NG_SETTING.apiServiceBaseUri + '/api/extendedreports/customerconsuptionxls',
            data: getdata,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // this is the default
            responseType: 'arraybuffer',
            headers: {
                'Content-type': 'application/json'
            },
        }).success(function (data, status, headers) {
            $scope.isWaiting = false;
            headers = headers();
            var filename = 'customerconsuption'//headers['x-filename'];
            var contentType = headers['content-type'];
            var linkElement = document.createElement('a');
            try {
                var blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                var url = window.URL.createObjectURL(blob);

                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", filename);

                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);
            } catch (ex) {
                console.log(ex);
            }
        }).error(function (data) {
            $scope.isWaiting = false;
            console.log(data);
        });
    };

    $scope.GetSoreID = function (data) {
        $scope.StoreID = data;
        $scope.selectedStore = $filter('filter')($scope.user.userstores, { id: data });
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
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.specialdatetypes = [];
    $scope.loadEntities('enums/specialdatetype', 'specialdatetypes');
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.gendertypes = [];
    $scope.loadEntities('enums/gendertype', 'gendertypes');
    $scope.products = [];
    $scope.loadEntities('product', 'products');

    //if ($rootScope.user.userstores && $rootScope.user.userstores.length > 1) {
    //    $scope.selectStore = true;
    //} else {
    //    $scope.loadEntitiesCache($rootScope.user.StoreID);
    //}


    $scope.Back = function () {
        $window.history.back();
    };


    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("customerconsuptionreportCtrl");
    });
};