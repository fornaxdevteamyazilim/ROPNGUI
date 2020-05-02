app.controller('ECRsCtrl', ECRsCtrl);
function ECRsCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("ECRsCtrl");
    var ecr = this;
    $scope.OrderSource = [{ id: 'ROPNG', name: 'ROPNG' }, { id: 'ROP6', name: 'ROP6' }]
    $scope.translate = function () {
        $scope.trSerial = $translate.instant('main.SERIAL');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trBrand = $translate.instant('main.BRAND');
        $scope.trOrderSource = $translate.instant('main.ORDERSOURCE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trisInstant = $translate.instant('main.INSTANT');
        $scope.trAlias = $translate.instant('main.ALIAS');


    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    ecr.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Serial: 'asc'
        }
    },
        {
            getData: function ($defer, params) {
                Restangular.all('ECR').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: (ecr.search) ? "Serial like '%" + ecr.search + "%'" : ""
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
                });
            }
        });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                ecr.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'ECR')
            data.post().then(function (res) {
                ecr.tableParams.reload();
                toaster.pop('success', "Kaydedildi.", 'Saved.');
            });
            data.get();
        }
    };
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
        if (!ecr.tableParams.data[ecr.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ecr.tableParams.data.length - 1, 1);
            toaster.pop('warning', "İptal edildi !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "İptal edildi !", 'Edit cancelled !');
        }
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
                if (ecr.tableParams.data[index].fromServer) {
                    ecr.tableParams.data[index].remove();
                }
                ecr.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ecr.tableParams.data[index].fromServer) {
            ecr.tableParams.data[index].remove();
        }
        ecr.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ecr.tableParams.data.push({});
    };
    var deregistration1 = $scope.$watch(angular.bind(ecr, function () {
        return ecr.search;
    }), function (value) {
        ecr.tableParams.reload();
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
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
            });
        }
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
    $scope.brands = [];
    $scope.loadEntities('brand', 'brands');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("ECRsCtrl");
    });
};
