app.controller('declaredrevenueeditCtrl', declaredrevenueeditCtrl);
function declaredrevenueeditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, $element, userService) {
    $rootScope.uService.EnterController("declaredrevenueeditCtrl");
    userService.userAuthorizated();
    var dre = this;
    $scope.item = {};
    $scope.resdata = {};
    $scope.Back = function () {
        $location.path('app/specialoperations/declaredrevenueelist');
    };
    $scope.translate = function () {
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trOperationDate = $translate.instant('main.OPERATIONDATE');
        $scope.trTotalAmount = $translate.instant('main.TOTALAMOUNT');
        $scope.trTotalCash = $translate.instant('main.TOTALCASH');
        $scope.trNotes = $translate.instant('main.NOTE');
        $scope.trisCharged = $translate.instant('main.STATE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.addadnewpaymentitem = $translate.instant('main.ADDNEWPAYMENTITEM');
        $scope.trPaymentType = $translate.instant('main.PAYMENTTYPE');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.Approve = $translate.instant('main.APPROVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.DeclaredRevenueID = $stateParams.id;
    $scope.foundStore = function (StoreID) {
        for (var i = 0; i < $scope.stores.length; i++) {
            if ($scope.stores[i].id == StoreID)
                return $scope.stores[i].name;
        }
    };
    if (!userService.userIsInRole("STOREMANAGER")) {
        $scope.hideButton = true;
    }
    dre.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
        getData: function ($defer, params) {
            if ($scope.item.items && $scope.item.items.length > 0) {
                $defer.resolve($scope.item.items);
            } else {
                $scope.item.items = [];
                $defer.resolve($scope.item.items);
            }
        }
    });
    $scope.checkisCharged = function (data) {
        $scope.item.isCharged = true;
        $scope.item.put().then(function (resp) {
            swal($translate.instant('orderfile.Confirmed'), $translate.instant('orderfile.Updated'), "warning");
            $location.path('app/specialoperations/declaredrevenue');
        });
        $scope.item.get();
    };
    $scope.SaveData = function () {
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                $location.path('app/specialoperations/declaredrevenue');
                swal($translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'), "success");
            });
        }
        else {
            Restangular.restangularizeElement('', $scope.item, 'declaredrevenue')
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                swal($translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'), "success");
                $location.path('app/specialoperations/declaredrevenueedit/' + resp.id);
                $scope.item = {};
                $scope.item = Restangular.copy(resp);
                dre.tableParams.reload();
                $scope.DeclaredRevenueID = $stateParams.id;
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
        if (!dre.tableParams.data[dre.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(dre.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled'));
        }
    };
    $scope.removedata = function (SelectItem) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                $scope.item.remove().then(function () {
                    SweetAlert.swal($translate.instant('orderfile.Deleted'),  $translate.instant('orderfile.RecordDeleted'), "success");
                    $location.path('app/specialoperations/declaredrevenue');
                });
            }
            else {
                SweetAlert.swal( $translate.instant('orderfile.Cancelled'), $translate.instant('orderfile.DeletionCanceled'), "error");
            }
        });
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (dre.tableParams.data[index].fromServer) {
                    dre.tableParams.data[index].remove();
                }
                dre.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (dre.tableParams.data[index].fromServer) {
            dre.tableParams.data[index].remove();
        }
        dre.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        dre.tableParams.data.push({ DeclaredRevenueID: $scope.DeclaredRevenueID });
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.storepaymenttypes = [];
    $scope.loadStorePaymentTypes = function (StoreID) {
        Restangular.all('cache/storepaymenttype').getList({
            StoreID: StoreID,
        }).then(function (result) {
            $scope.storepaymenttypes = result;
        }, function (response) {
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    if ($stateParams.id != 'new') {
        Restangular.one('declaredrevenue', $stateParams.id).get().then
            (function (restresult) {
                $scope.item = Restangular.copy(restresult);
                $scope.loadStorePaymentTypes(restresult.StoreID);
                dre.tableParams.reload();
                if (!userService.userIsInRole("Admin")) {
                    $scope.item["StoreName"] = $scope.foundStore($scope.item.StoreID)
                    $scope.selectStore = false;
                } else {
                    $scope.selectStore = true;
                }
            })

    } else {
        $scope.item = {};
        if (!userService.userIsInRole("Admin")) {
            $scope.item.StoreID = $rootScope.user.StoreID;
            $scope.item["StoreName"] = $rootScope.user.Store.name;
            $scope.selectStore = false;
        } else {
            $scope.selectStore = true;
        }
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
            $scope.item.OperationDate = item;
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("declaredrevenueeditCtrl");
    });
};