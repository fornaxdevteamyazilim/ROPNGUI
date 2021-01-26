app.controller('companyeditCtrl', companyeditCtrl);
function companyeditCtrl($rootScope, $scope, $log, $modal, $location, Restangular, $stateParams, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("companyeditCtrl");
    var vm = this;
    $scope.objectType = 'company';
    $scope.SelectedItem = null;
    $scope.translate = function () {
        $scope.trCompanyName = $translate.instant('main.COMPANYNAME');
        $scope.trCompanyNotes = $translate.instant('main.NOTE');
        $scope.trCompanyTaxOffice = $translate.instant('main.TAXOFFICE');
        $scope.trCompanyTaxNumber = $translate.instant('main.TAXNUMBER');
        $scope.trCompanyContactPerson = $translate.instant('main.CONTACTPERSON');
        $scope.trCompanyPhone = $translate.instant('main.PHONE');
        $scope.trCompanyFax = $translate.instant('main.FAX');
        $scope.trCompanyEmail = $translate.instant('main.EMAIL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            }, function (response) {
                toaster.pop('warning',$translate.instant('difinitions.OperationFailed'), response.data.ExceptionMessage);
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'company')
            data.post().then(function (res) {
                toaster.pop('success',  $translate.instant('difinitions.Saved') , $translate.instant('difinitions.Saved'));
            }, function (response) {
                toaster.pop('warning',$translate.instant('difinitions.OperationFailed'), response.data.ExceptionMessage);
            });
        }
    };
    if ($stateParams.id != 'new') {
        Restangular.one('company', $stateParams.id).get().then
            (function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
            },
           function (restresult) {
               toaster.pop('warning',$translate.instant('difinitions.Cancelled'),   $translate.instant('difinitions.Editcancelled'));
               swal("Error!", $translate.instant('Server.DataError'), "Warning");
           }
           )
    }
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title:  $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:   $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal( $translate.instant('difinitions.Deleted'),  $translate.instant('difinitions.RecordDeleted'), "success");
                    $location.path('app/definitions/companies');
                }, function (response) {
                    toaster.pop('warning', $translate.instant('difinitions.OperationFailed') , response.data.ExceptionMessage);
                });
            }
            else {
                SweetAlert.swal($translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.DeletionCanceled') , "error");
            }
        });
    };

    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, params) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');

    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("companyeditCtrl");
    });
};
app.controller('companyaccountCtrl', companyaccountCtrl);
function companyaccountCtrl($rootScope, $scope, $modal, $log, Restangular, $stateParams, ngTableParams, SweetAlert, toaster, $window, $filter, $translate, $element) {
    $rootScope.uService.EnterController("companyaccountCtrl");
    $scope.CompanyAccount = [];
    $scope.GetCompanyAccount = function () {
        Restangular.all('companyaccount').getList({
            pageNo: 1,
            pageSize: 1000,
            search: ($stateParams.id) ? "CompanyID='" + $stateParams.id + "'" : ""
        }).then(function (result) {
            $scope.CompanyAccount = result;
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.GetCompanyAccount();
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                toaster.pop('success',$translate.instant('difinitions.Updated'), $translate.instant('difinitions.Updated'));
            });
        }
        else {
            if (!data.id) {
                data.CompanyID = $stateParams.id;
                Restangular.restangularizeElement('', data, 'companyaccount')
                data.post().then(function (res) {
                    toaster.pop('success', $translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
                });

            } else
                toaster.pop('warning', $translate.instant('difinitions.Authority'), );
        }
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
    $scope.accountlimittypes = [];
    $scope.loadEntities('enums/accountlimittype', 'accountlimittypes');
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("companyaccountCtrl");
    });
};
