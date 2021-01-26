app.controller('productpricelistCtrl', productpricelistCtrl);
function productpricelistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, $element, userService, $filter, ngnotifyService) {
    $rootScope.uService.EnterController("productpricelistCtrl");
    var ppl = this;
    $scope.objectType = 'productpricelist';
    $scope.SelectedItem = null;
    ppl.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/product/product/productprice/edit/' + $scope.SelectedItem;
    };
    if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.translate = function () {
        $scope.trDate = $translate.instant('main.DATE');
        $scope.trNotes = $translate.instant('main.NOTE');
        $scope.trAutoApply = $translate.instant('main.AUTOAPPLY');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.addnew = $translate.instant('main.ADDNEW');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ppl.tableParams.data[ppl.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ppl.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled') );
        }
    };
    //$scope.BuildSearchString = function (src) {
    //    var result = [];
    //    if (!userService.userIsInRole("Admin")) {
    //        result.push("Repository.StoreID='" + $rootScope.user.StoreID + "'");
    //        return result;
    //    }
    //};
    //        $scope.BuildSearchString = function (src) {
    //    var result = [];
    //    if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && $scope.StoreID) {
    //        result.push("CountDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
    //        result.push(($scope.StoreID) ? "Repository.StoreID='" + $scope.StoreID + "'" : "Repository.StoreID='" + $rootScope.user.StoreID + "'");
    //    }
    //    else if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && !$scope.StoreID) {
    //        result.push("CountDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
    //        result.push("Repository.StoreID='" + $rootScope.user.StoreID + "'");
    //    }
    //    return result;
    //};


    ppl.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },{
        getData: function ($defer, params) {
            //if ($scope.StoreID || $rootScope.user.StoreID && $rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate) {
                $scope.isWaiting = true;
            Restangular.all($scope.objectType).getList({
                pageNo: params.page(),
                pageSize: params.count(),
                //search: $scope.BuildSearchString(),
                //sort: '-CountDate'
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                if (items.length > 0)
                    $scope.SelectedItem = items[0].id;
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response);
                SweetAlert.swal($translate.instant('Server.ServerError'), angular.toJson(response.data.ExceptionMessage, false), "error");
            });
            //}
        }
        });
    $scope.ChangeStore = function (StoreID) {
        $scope.StoreID = StoreID;
    };

    $scope.LoadCounts = function () {
        ppl.tableParams.reload();
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
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
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
    $scope.counttypes = [];
    $scope.loadEntities('enums/inventorycounttype', 'counttypes');
    $scope.cancelremove = function (index) {
        if (ppl.tableParams.data[index].fromServer) {
            ppl.tableParams.data[index].remove();
        }
        ppl.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(ppl, function () {
        return ppl.search;
    }), function (value) {
        ppl.tableParams.reload();
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

    $scope.SelectStartDate = function (item) {
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
            $rootScope.ReportParameters.StartDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.SelectEndDate = function (item) {
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
            $rootScope.ReportParameters.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };


    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("productpricelistCtrl");
    });
};
