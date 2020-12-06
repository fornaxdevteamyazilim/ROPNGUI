
app.controller('productwastelistCtrl', productwastelistCtrl);
function productwastelistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, $filter, ngnotifyService, userService, $element) {
    $rootScope.uService.EnterController("productwastelistCtrl");
    var pw = this;
    pw.search = '';
    userService.userAuthorizated();
    $scope.SelectItem = function (pw) {
        $scope.SelectedItem = pw;
        location.href = '#/app/inventory/productwaste/edit/' + $scope.SelectedItem;
    };
    if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.translate = function () {
        $scope.trDate = $translate.instant('main.DATE');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trRepository = $translate.instant('main.REPOSITORY');
        $scope.trOrderSource = $translate.instant('main.ORDERSOURCE');
        $scope.addnewproductwaste = $translate.instant('main.ADDNEWPRODUCTWASTE');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showwastes = $translate.instant('main.SHOWWASTES');
        $scope.edit = $translate.instant('main.EDIT');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.BuildSearchString = function (src) {
        var result = [];
        if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && $scope.StoreID) {
            result.push("OperationDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push(($scope.StoreID) ? "Repository.StoreID='" + $scope.StoreID + "'" : "Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        else if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && !$scope.StoreID) {
            result.push("OperationDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push("Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        return result;
    };
    $scope.productwaste = [];
    $scope.loadproductwaste = function () {
        if (!$scope.productwaste.length) {
            Restangular.all('productwaste').getList({
                pageNo: 1,
                pageSize: 1000,
                search: $scope.BuildSearchString()
            }).then(function (result) {
                $scope.productwaste = result;
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadproductwaste();
    $scope.LoadStores = function () {
        pw.tableParams.reload();
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!pw.tableParams.data[pw.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pw.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    pw.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },{
         getData: function ($defer, params) {
             if ($scope.StoreID || $rootScope.user.StoreID && $rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate) {
                 Restangular.all('productwaste').getList({
                     pageNo: params.page(),
                     pageSize: params.count(),
                     search: $scope.BuildSearchString(),
                     sort: '-OperationDate'
                 }).then(function (items) {
                     params.total(items.paging.totalRecordCount);
                     $defer.resolve(items);
                 }, function (response) {
                     toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                 });
             }
         }
     });
    $scope.ChangeStore = function (StoreID) {
        $scope.StoreID = StoreID;
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: filter,
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
    $scope.cancelremove = function (index) {
        if (pw.tableParams.data[index].fromServer) {
            pw.tableParams.data[index].remove();
        }
        pw.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(pw, function () {
        return pw.search;
    }), function (value) {
        pw.tableParams.reload();
    });
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
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("productwastelistCtrl");
    });
};