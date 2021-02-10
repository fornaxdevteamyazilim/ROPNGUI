app.controller('materialslipCtrl', materialslipCtrl);
function materialslipCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $translate, $filter, ngnotifyService, $element, $location, userService) {
    $rootScope.uService.EnterController("materialslipCtrl");
    var ms = this;
    ms.search = '';
    $scope.SelectItem = {};
    userService.userAuthorizated();
    $scope.translate = function () {
        $scope.trNumber = $translate.instant('main.NUMBER');
        $scope.trSlipDateTime = $translate.instant('main.SLIPDATETIME');
        $scope.trCreateDate = $translate.instant('main.REGISTRATIONDATE');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trNewItem = $translate.instant('main.ADDNEWSLIP');
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trProductCount = $translate.instant('main.PRODUCTCOUNT');
        $scope.trAccountintMaterialSlipType = $translate.instant('main.ACCOUNTINGMATERIALSLIPTYPE');
        $scope.send = $translate.instant('main.SEND');
        $scope.selectstore = $translate.instant('main.SELECTSTORE');
        $scope.startdate = $translate.instant('main.STARTDATE');
        $scope.enddate = $translate.instant('main.ENDDATE');
        $scope.showlist = $translate.instant('main.GETLIST');
        $scope.sendnetsis = $translate.instant('main.SENDNETSIS');
        $scope.sendnetsisall = $translate.instant('main.SENDNETSISALL');
        $scope.creatslip = $translate.instant('main.CREATEMATERIALSLIP');
        $scope.sendcreatnetsis = $translate.instant('main.SENDCREATNETSISALL');
        $scope.delete = $translate.instant('main.DELETE');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    $scope.GetList = function () {
        ms.tableParams.reload();
    };
    $scope.SendNetsisMaterialSlip = function () {
        $scope.isSpinner = true;
        for (var i = 0; i < ms.tableParams.data.length; i++) {
            if (ms.tableParams.data[i].isSelected == true) {
                Restangular.one('netsis/SendMaterialSlip').get({
                    AccountingMaterialSlipID: ms.tableParams.data[i].id,
                }).then(function (result) {
                    $scope.isSpinner = false;
                    ms.tableParams.reload();
                    toaster.pop('success',translate.instant('accounting.ReceiptTransferred') , '');
                }, function (response) {
                    $scope.isSpinner = false;
                    ms.tableParams.reload();
                    toaster.pop('Warning', $translate.instant('accounting.ThereProblem'), response.data.ExceptionMessage);
                });
            }
            //if (i = ms.tableParams.data.length)
            //    $scope.isSpinner = false;
        }
    };
    $scope.SendNetsisMaterialSlips = function (item) {
        $scope.isSpinner = true;
        if (item && item.StoreID && item.StartDate && item.EndDate) {
            Restangular.one('netsis/SendMaterialSlips').get({
                StoreID: item.StoreID,
                FromDate: item.StartDate,
                ToDate: item.EndDate
            }).then(function (result) {
                ms.tableParams.reload();
                toaster.pop('success',translate.instant('accounting.ReceiptTransferred'), '');
                $scope.isSpinner = false
            }, function (response) {
                toaster.pop('Warning', $translate.instant('accounting.ThereProblem'), response.data.ExceptionMessage);
                $scope.isSpinner = false
            });
        } else {
            toaster.pop('Warning', $translate.instant('accounting.REQUIREDFIELDS'));
            $scope.isSpinner = false
        }
    };
    $scope.CreatMaterialSlips = function (item) {
        $scope.isSpinner = true;
        if (item && item.StoreID && item.StartDate && item.EndDate) {
            Restangular.one('netsis/CreateMaterialSlips').get({
                StoreID: item.StoreID,
                FromDate: item.StartDate,
                ToDate: item.EndDate
            }).then(function (result) {
                ms.tableParams.reload();
                toaster.pop('success', $translate.instant('accounting.PlugsCreated'), '');
                $scope.isSpinner = false
            }, function (response) {
                toaster.pop('Warning', $translate.instant('accounting.ThereProblem'), response.data.ExceptionMessage);
                $scope.isSpinner = false
            });
        } else {
            toaster.pop('Warning',$translate.instant('accounting.REQUIREDFIELDS'));
            $scope.isSpinner = false
        }
    };
    $scope.CreatSendNetsisMaterialSlips = function (item) {
        $scope.isSpinner = true;
        if (item && item.StoreID && item.StartDate && item.EndDate) {
            Restangular.one('netsis/CreateMaterialSlips').get({
                StoreID: item.StoreID,
                FromDate: item.StartDate,
                ToDate: item.EndDate,
                SendAfterCreate: true
            }).then(function (result) {
                ms.tableParams.reload();
                toaster.pop('success', $translate.instant('accounting.CreatedTransferred'), '');
                $scope.isSpinner = false
            }, function (response) {
                toaster.pop('Warning', $translate.instant('accounting.ThereProblem'), response.data.ExceptionMessage);
                $scope.isSpinner = false
            });
        } else {
            toaster.pop('Warning', $translate.instant('accounting.REQUIREDFIELDS'));
            $scope.isSpinner = false
        }
    };
    $scope.DeleteMaterialSlips = function () {
        SweetAlert.swal({
            title:  $translate.instant('invantories.Sure') ,
            text:  $translate.instant('invantories.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('invantories.confirmButtonText'),
            cancelButtonText:   $translate.instant('invantories.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                var deletedata = [];
                for (var i = 0; i < ms.tableParams.data.length; i++) {
                    if (ms.tableParams.data[i].isSelected == true) {
                        deletedata.push(ms.tableParams.data[i]);
                    }
                }
                if (deletedata && deletedata.length) {
                    for (var j = 0; j < deletedata.length; j++) {
                        deletedata[j].remove().then(function () {
                            toaster.pop("error",$translate.instant('invantories.Deleted'),  $translate.instant('invantories.RecordDeleted'));
                            $scope.isSpinner = false;
                            ms.tableParams.reload();
                        });
                    }
                }
            } else {
                $scope.isSpinner = false;
                ms.tableParams.reload();
                SweetAlert.swal( $translate.instant('invantories.Cancelled'), $translate.instant('invantories.DeletionCanceled'), "error");
            }
        });
        $scope.isSpinner = true;

    };
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/accountingintegration/materialslip/edit/' + $scope.SelectedItem;
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (ms.search && ms.search.length > 0)
            result.push("Number like'%" + ms.search + "%'");
        if ($scope.SelectItem.StartDate)
            result.push("FromDate=" + $scope.StartDate.StartDate);
        if ($scope.SelectItem.EndDate)
            result.push("ToDate=" + $scope.SelectItem.EndDate);
        if ($scope.SelectItem.StoreID)
            result.push("StoreID=" + $scope.SelectItem.StoreID);
        return result;
    };
    ms.tableParams = new ngTableParams({
        page: 1,
        count: 10
    }, {
            getData: function ($defer, params) {
                Restangular.all('AccountingMaterialSlip').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.BuildSearchString(),
                    sort: '-SlipDate'
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    var deregistration1 = $scope.$watch(angular.bind(ms, function () {
        return ms.search;
    }), function (value) {
        ms.tableParams.reload();
    });
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
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.accountintmaterialsliptype = [];
    $scope.loadEntities('enums/accountintmaterialsliptype', 'accountintmaterialsliptype');
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
            $scope.SelectItem.StartDate = $filter('date')(data, 'yyyy-MM-dd');
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
            $scope.SelectItem.EndDate = $filter('date')(data, 'yyyy-MM-dd');
        })
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("materialslipCtrl");
    });
};
