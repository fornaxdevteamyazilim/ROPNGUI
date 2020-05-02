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
                swal("Güncellendi.", "Updated.", "success");
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'AccountingIncomeSlip')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal("Kaydedildi.", "Saved.", "success");
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
            toaster.pop('warning', "İptal edildi !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "İptal edildi !", 'Edit cancelled !');
        }
    };
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title: "EMİN MİSİNİZ ?",
            text: "Kaydı Silmek İstediğinize Emin misiniz ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Evet, Sil !",
            cancelButtonText: "Hayır, Silme !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal("Silindi.", "Kayıt Silindi.", "success");
                    $location.path('app/accountingintegration/incomeslip/list');
                });
            }
            else {
                SweetAlert.swal("İptal edildi !", "Silme İşlemi İptal edildi !", "error");
            }
        });
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title: "EMİN MİSİNİZ ?",
            text: "Kaydı Silmek İstediğinize Emin misiniz ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Evet, Sil !",
            cancelButtonText: "Hayır, Silme !",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ise.tableParams.data[index].fromServer) {
                    ise.tableParams.data[index].remove();
                }
                ise.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
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
                toaster.pop('Warning', "Sunucu Hatası", response);
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
    //        toaster.pop('Warning', "Sunucu hatası", response.data.ExceptionMessage);
    //    });
    //};
    $scope.SendNetsisIncomeSlipt = function () {
        $scope.isSpinner = true;
        Restangular.one('accounting/transferincomeslip').get({
            AccountingIncomeSlipID: $stateParams.id,
        }).then(function (result) {
            $scope.isSpinner = false;
            toaster.pop('success', "Aktarıldı", '');
        }, function (response) {
            $scope.isSpinner = false;
            toaster.pop('Warning', "Sorun Oluştu!", response.data.ExceptionMessage);
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("incomeslipeditCtrl");
    });
};