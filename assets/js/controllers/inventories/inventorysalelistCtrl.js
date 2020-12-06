app.controller('inventorysalelistCtrl', inventorysalelistCtrl);
function inventorysalelistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, $filter, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorysalelistCtrl");
    var isl = this;
    isl.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorysale/edit/' + $scope.SelectedItem;
    };
    if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.translate = function () {
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trDocumentNumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trRepository = $translate.instant('main.REPOSITORY');
        $scope.trDocumentType = $translate.instant('main.DOCUMENTTYPE');
        $scope.trGrandTotal = $translate.instant('main.GRANDTOTAL');
        $scope.addnewsale = $translate.instant('main.ADDNEWSALE');
        $scope.search = $translate.instant('main.SEARCH');
        $scope.selectcompany = $translate.instant('main.SELECTCOMPANY');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showvoucher = $translate.instant('main.SHOWVOUCHER');
        $scope.seacrhbydocumentnumber = $translate.instant('main.SEARCHBYDOCUMENTNUMBER');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (isl.search && isl.search.length > 1 && !$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
            result.push("DocumentNumber like'%" + isl.search + "%'");
        }
        if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && $scope.CompanyID) {
            result.push("SaleDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push("CompanyID='" + $scope.CompanyID + "'");
            result.push(($scope.StoreID) ? "Repository.StoreID='" + $scope.StoreID + "'" : "Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        else if ($rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate && !$scope.CompanyID) {
            result.push("SaleDate between'" + $rootScope.ReportParameters.StartDate + "'and'" + $rootScope.ReportParameters.EndDate + "'");
            result.push(($scope.StoreID) ? "Repository.StoreID='" + $scope.StoreID + "'" : "Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        else if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate && $scope.CompanyID) {
            result.push("CompanyID='" + $scope.CompanyID + "'");
            result.push(($scope.StoreID) ? "Repository.StoreID='" + $scope.StoreID + "'" : "Repository.StoreID='" + $rootScope.user.StoreID + "'");
        }
        return result;
    };
    $scope.inventorysale = [];
    $scope.loadinventorysale = function () {
        if (!$scope.inventorysale.length) {
            Restangular.all('inventorysale').getList({
                pageNo: 1,
                pageSize: 1000,
                search: $scope.BuildSearchString()
            }).then(function (result) {
                $scope.inventorysale = result;
            }, function (response) {
                toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadinventorysale();
    $scope.LoadCompanies = function () {
        isl.tableParams.reload();
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!isl.tableParams.data[isl.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(isl.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    isl.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },{
        getData: function ($defer, params) {
            if ($scope.StoreID || $rootScope.user.StoreID && $rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate) {
                Restangular.all('inventorysale').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.BuildSearchString(),
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        }
    });
    $scope.ChangeCompany = function (CompanyID) {
        $scope.CompanyID = CompanyID;
    };
        $scope.ChangeStore = function (StoreID) {
        $scope.StoreID = StoreID;
    };

    $scope.company = [];
    $scope.loadCompany = function () {
        if (!$scope.company.length) {
            Restangular.all('company').getList({
                pageNo: 1,
                pageSize: 1000,
                sort: 'id',
                search: ''
            }).then(function (result) {
                $scope.company = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadCompany();
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
    $scope.companies = [];
    $scope.loadEntitiesCache('cache/company', 'companies');
    $scope.cancelremove = function (index) {
        if (isl.tableParams.data[index].fromServer) {
            isl.tableParams.data[index].remove();
        }
        isl.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(isl, function () {
        return isl.search;
    }), function (value) {
        isl.tableParams.reload();
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
        $rootScope.uService.ExitController("inventorysalelistCtrl");
    });
};
