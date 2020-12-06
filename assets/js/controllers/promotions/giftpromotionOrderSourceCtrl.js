'use strict';
app.controller('giftpromotionOrderSourceCtrl', giftpromotionOrderSourceCtrl);
function giftpromotionOrderSourceCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("giftpromotionOrderSourceCtrl");
    var pcos = this;
    $scope.translate = function () {
        $scope.trGiftPromotion = $translate.instant('main.GIFTPROMOTION');
        $scope.trOrderSource = $translate.instant('main.ORDERSOURCE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    pcos.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('giftpromotionordersource').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: (pcos.search) ? "name like '%" + pcos.search + "%'" : ""
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                pcos.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Updated') , $translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'promotioncodesource')
            data.post().then(function (res) {
                pcos.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved') , $translate.instant('difinitions.Updated'));
            });
            data.get();
        }
    }
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 13 && rowform.$visible) {
            rowform.$submit();
            return data;
        }
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!pcos.tableParams.data[pcos.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pcos.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('difinitions.Cancelled'), $translate.instant('difinitions.Insertcancelled'));
        }
    };
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('difinitions.Sure') ,
            text:  $translate.instant('difinitions.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('difinitions.confirmButtonText'),
            cancelButtonText:  $translate.instant('difinitions.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pcos.tableParams.data[index].fromServer) {
                    pcos.tableParams.data[index].remove();
                }
                pcos.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
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
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 100000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
    $scope.giftpromotions = [];
    $scope.loadEntities('giftpromotion', 'giftpromotions');
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');

    $scope.cancelremove = function (index) {
        if (pcos.tableParams.data[index].fromServer) {
            pcos.tableParams.data[index].remove();
        }
        pcos.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pcos.tableParams.data.push({});
    };

    var deregistration1 = $scope.$watch(angular.bind(pcos, function () {
        return pcos.search;
    }), function (value) {
        pcos.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("giftpromotionOrderSourceCtrl");
    });
};
