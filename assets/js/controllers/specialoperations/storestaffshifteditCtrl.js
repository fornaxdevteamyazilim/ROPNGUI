'use strict';
app.controller('storestaffshifteditCtrl', storestaffshifteditCtrl);
function storestaffshifteditCtrl($scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element, userService) {
    $rootScope.uService.EnterController("storestaffshifteditCtrl");
    userService.userAuthorizated();
    var ssse = this;
    $scope.item = {};
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.add = $translate.instant('main.ADD');
        $scope.save = $translate.instant('main.SAVE');
        $scope.delete = $translate.instant('main.DELETE');
        $scope.trShiftDate = $translate.instant('main.DATE');
        $scope.trNGUser = $translate.instant('main.NGUSER');
        $scope.trStaffShift = $translate.instant('main.STAFFSHIFT');
        $scope.trStaffType = $translate.instant('main.STAFFTYPE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {
        $scope.translate();
    });
    if ($stateParams.id != 'new') {
        Restangular.one('storestaffshift', $stateParams.id).get().then(function (restresult) {
            $scope.item = Restangular.copy(restresult);
            if ($scope.item.items.length > 0) {
                ssse.tableParams.reload();
            }
        }, function (restresult) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            swal("Error", "Warning");
        })
    }
    else {
        $scope.item = {};
    }
    ssse.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    }, {
            getData: function ($defer, params) {
                Restangular.all('storestaffshiftitem').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search:'StoreStaffShiftID='+ $stateParams.id
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.AddItems = function (item) {
        item.StoreStaffShiftID = $stateParams.id;
        Restangular.restangularizeElement('', item, 'storestaffshiftitem')
        item.post().then(function (resp) {
            ssse.tableParams.reload();
            toaster.pop("success", $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            ssse.tableParams.reload();
        });        
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
                    $location.path('/app/inventory/inventorycount/list');
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
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (ssse.tableParams.data[index].fromServer) {
                    ssse.tableParams.data[index].remove();
                }
                ssse.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
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

    $scope.staffshift = [];
    $scope.loadEntities('staffshift', 'staffshift');
    $scope.stafftype = [];
    $scope.loadEntities('stafftype', 'stafftype');
    $scope.storeUsers = [];
    $scope.BuildSearchString = function () {
        var result = [];
        result.push(" StoreID='" + $rootScope.user.StoreID + "'");
        return result;
    };
    Restangular.all('user').getList({
        pageNo: 1,
        pageSize: 100,
        search: $scope.BuildSearchString()
    }).then(function (result) {
        $scope.storeUsers = result;
    }, function (response) {
        toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
    });
    $scope.isClean = function () {
        return angular.equals($scope.original, $scope.item);
    }
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storestaffshifteditCtrl");
    });
};
