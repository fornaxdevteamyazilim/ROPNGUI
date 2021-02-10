app.controller('incomeslipeditCtrl', incomeslipeditCtrl);
function incomeslipeditCtrl($scope, $filter, SweetAlert, Restangular, ngTableParams, $modal, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, ngnotifyService, $element) {
    $rootScope.uService.EnterController("incomeslipeditCtrl");
    userService.userAuthorizated();
    var ise = this;
    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trSlipDate = $translate.instant('main.SLIPDATETIME');
        $scope.trStore = $translate.instant('main.STORE');       
        $scope.trSave = $translate.instant('main.SAVE');   
        $scope.trPaymentType = $translate.instant('main.PAYMENTTYPE');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.addadnewpaymentitem = $translate.instant('main.ADDNEWPAYMENTITEM');
        $scope.save = $translate.instant('main.SAVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.AccountingIncomeSlipID = $stateParams.id;
    if ($stateParams.id != 'new')
        Restangular.one('AccountingIncomeSlip', $stateParams.id).
            get().then(function (restresult) {
                $scope.original = restresult;
                $scope.item = Restangular.copy(restresult);
                $scope.AccountingIncomeSlipID = restresult.id;
                //$scope.loadStorePaymentTypes(restresult.StoreID);
                ise.tableParams.reload();
            })
    else {
        $scope.item = {};
    }
    ise.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
            getData: function ($defer, params) {
                if ($scope.item.Items && $scope.item.Items.length > 0) {
                    $defer.resolve($scope.item.Items);
                } else {
                    $scope.item.Items = [];
                    $defer.resolve($scope.item.Items);
                }
            }
        });
    $scope.SaveData = function () {
        $scope.item.CreateDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                $location.path('app/accountingintegration/incomeslip/list');
                swal( $translate.instant('accounting.Updated'),$translate.instant('accounting.Updated'), "success");
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'AccountingIncomeSlip')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal($translate.instant('accounting.Saved'),$translate.instant('accounting.Saved'), "success");
                $location.path('app/accountingintegration/incomeslip/edit/' + resp.id);
                $scope.item = {};
                $scope.item = Restangular.copy(resp);
                ise.tableParams.reload();
                $scope.AccountingIncomeSlipID = $stateParams.id;
                //$scope.loadStorePaymentTypes(resp.StoreID);
            });
        }
        $scope.item.get();
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            $scope.addItem();
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!ise.tableParams.data[ise.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ise.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('accounting.Cancelled'), $translate.instant('accounting.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('accounting.Cancelled'), $translate.instant('accounting.Editcancelled'));
        }
    };
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title:  $translate.instant('accounting.Sure') ,
            text:  $translate.instant('accounting.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('accounting.confirmButtonText'),
            cancelButtonText:   $translate.instant('accounting.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal(  $translate.instant('accounting.Deleted'),  $translate.instant('accounting.RecordDeleted'), "success");
                    $location.path('app/accountingintegration/incomeslip/list');
                });
            }
            else {
                SweetAlert.swal(  $translate.instant('accounting.Cancelled'), $translate.instant('accounting.DeletionCanceled'), "error");
            }
        });
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('accounting.Sure') ,
            text:  $translate.instant('accounting.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('accounting.confirmButtonText'),
            cancelButtonText:   $translate.instant('accounting.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ise.tableParams.data[index].fromServer) {
                    ise.tableParams.data[index].remove();
                }
                ise.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('accounting.Attention'),$translate.instant('accounting.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ise.tableParams.data[index].fromServer) {
            ise.tableParams.data[index].remove();
        }
        ise.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ise.tableParams.data.push({ AccountingIncomeSlipID: $scope.AccountingIncomeSlipID });
    };
    if (!$scope.item.SlipDate ) {
        $scope.item.SlipDate  = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
    }
    $scope.datepopup = function (item) {
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
            $scope.item.SlipDate = item;
        })
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
    $scope.paymenttypes = [];
    $scope.loadEntitiesCache('cache/paymenttype', 'paymenttypes');
    //$scope.storepaymenttypes = [];
    //$scope.loadStorePaymentTypes = function (StoreID) {
    //    Restangular.all('cache/storepaymenttype').getList({
    //        StoreID: $scope.item.StoreID,
    //    }).then(function (result) {
    //        $scope.storepaymenttypes = result;
    //    }, function (response) {
    //        toaster.pop('Warning',Server Error, response.data.ExceptionMessage);
    //    });
    //};
    $scope.SendNetsisIncomeSlipt = function () {
        $scope.isSpinner = true;
        Restangular.one('accounting/transferincomeslip').get({
            AccountingIncomeSlipID: $stateParams.id,
        }).then(function (result) {
            $scope.isSpinner = false;
            toaster.pop('success',$translate.instant('accounting.Transferred'), '');
        }, function (response) {
            $scope.isSpinner = false;
            toaster.pop('Warning', $translate.instant('accounting.ThereProblem') , response.data.ExceptionMessage);
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("incomeslipeditCtrl");
    });
};