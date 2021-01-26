app.controller('inventorydeliveryinvoiceCtrl', inventorydeliveryinvoiceCtrl);
function inventorydeliveryinvoiceCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, $filter, ngnotifyService, $element) {
    $rootScope.uService.EnterController("inventorydeliveryinvoiceCtrl");
    var idi = this;
    idi.search = '';
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/inventory/inventorydeliveryinvoice/edit/' + $scope.SelectedItem;
    };
    if (!$rootScope.ReportParameters.StartDate && !$rootScope.ReportParameters.EndDate) {
        $rootScope.ReportParameters.StartDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        $rootScope.ReportParameters.EndDate = moment().add(1, 'days').format('YYYY-MM-DD');
    }
    $scope.translate = function () {
        $scope.trDateTime = $translate.instant('main.DATETIME');
        $scope.trDocumentNumber = $translate.instant('main.DOCUMENTNUMBER');
        $scope.trPaymentTerm = $translate.instant('main.PAYMENTTERM');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trNotes = $translate.instant('main.NOTE');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trVAT = $translate.instant('main.VAT');
        $scope.trDiscount = $translate.instant('main.DISCOUNT');
        $scope.trVATDiscount = $translate.instant('main.VATDISCOUNT%');
        $scope.trPaymentTerm = $translate.instant('main.PAYMENTTERM');
        $scope.trIntegrationId = $translate.instant('main.INTEGRATIONID');
        $scope.trisAccounted = $translate.instant('main.ISACCOUNT');
        $scope.trGrandTotal = $translate.instant('main.GRANDTOTAL');
        $scope.addnewdelivery = $translate.instant('main.ADDNEWDELIVERY');
        $scope.showinvoices = $translate.instant('main.SHOWINVOICES');
        $scope.seacrhbydocumentnumber = $translate.instant('main.SEARCHBYDOCUMENTNUMBER');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.LoadCompanies = function () {
        idi.tableParams.reload();
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!idi.tableParams.data[idi.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(idi.tableParams.data.length - 1, 1);
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning',$translate.instant('invantories.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    idi.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },{
        getData: function ($defer, params) {
            if ($rootScope.user.StoreID && $rootScope.ReportParameters.StartDate && $rootScope.ReportParameters.EndDate) {
                Restangular.all('inventorydeliveryinvoice').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort:'-InvoiceDate'
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        }
    });
    $scope.ChangeCompany = function (CompanyID) {
        $scope.CompanyID = CompanyID;
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
    $scope.companies = [];
    $scope.loadEntitiesCache('cache/company', 'companies');
    $scope.cancelremove = function (index) {
        if (idi.tableParams.data[index].fromServer) {
            idi.tableParams.data[index].remove();
        }
        idi.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(idi, function () {
        return idi.search;
    }), function (value) {
        idi.tableParams.reload();
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
        $rootScope.uService.ExitController("inventorydeliveryinvoiceCtrl");
    });
};
