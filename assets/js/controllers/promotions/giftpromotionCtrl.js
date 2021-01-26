'use strict';
app.controller('giftpromotionCtrl', giftpromotionCtrl);
function giftpromotionCtrl($rootScope, $scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $translate, $element) {
    $rootScope.uService.EnterController("giftpromotionCtrl");
    var gpro = this;
    $scope.translate = function () {
        $scope.trPromotionName = $translate.instant('main.PROMOTIONNAME');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
        $scope.trEndDate = $translate.instant('main.ENDDATE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trProduct = $translate.instant('main.PRODUCT');
        $scope.trGiftType = $translate.instant('main.GIFTTYPE');
        $scope.trisActiveValue = $translate.instant('main.ISACTIVE');
        $scope.trMaxCode = $translate.instant('main.MAXCODE');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    gpro.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('giftpromotion').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: (gpro.search) ? "name like '%" + gpro.search + "%'" : ""
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
                gpro.tableParams.reload();
                toaster.pop('success', $translate.instant('difinitions.Updated'),$translate.instant('difinitions.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'promotion')
            data.post().then(function (res) {
                gpro.tableParams.reload();
                toaster.pop('success',$translate.instant('difinitions.Saved'), $translate.instant('difinitions.Saved'));
            });

        }
        data.get();
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
        if (!gpro.tableParams.data[gpro.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(gpro.tableParams.data.length - 1, 1);
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
                if (gpro.tableParams.data[index].fromServer) {
                    gpro.tableParams.data[index].remove();
                }
                gpro.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('difinitions.Attention'),$translate.instant('difinitions.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (gpro.tableParams.data[index].fromServer) {
            gpro.tableParams.data[index].remove();
        }
        gpro.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        gpro.tableParams.data.push({});
    };
    $scope.$watch(angular.bind(gpro, function () {
        return gpro.search;
    }), function (value) {
        gpro.tableParams.reload();
    });
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
    $scope.products = [];
    $scope.loadEntities('product', 'products');
    $scope.gifttypes = [];
    $scope.loadEntities('enums/gifttype', 'gifttypes');


    $scope.StartDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.StartDate = result;
        })
    };
    $scope.EndDatePopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.RegistrationDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.EndDate = result;
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
    var deregistration1 = $scope.$watch(angular.bind(gpro, function () {
        return gpro.search;
    }), function (value) {
        gpro.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("giftpromotionCtrl");
    });
};
