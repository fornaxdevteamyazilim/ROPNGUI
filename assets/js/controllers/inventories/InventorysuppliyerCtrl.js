app.controller('InventorysuppliyerCtrl', InventorysuppliyerCtrl);
function InventorysuppliyerCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("InventorysuppliyerCtrl");
    var isy = this;
    userService.userAuthorizated();
    $scope.translate = function () {
        $scope.trInventroy = $translate.instant('main.INVENTORY');
        $scope.trCompany = $translate.instant('main.COMPANY');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    var deregistration1 = $scope.$on('StoreIdChanged', function (event, data) {
        isy.tableParams.reload();
    });
    isy.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            if ($stateParams.id != 'new') {
                Restangular.all('Inventorysuppliyer').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: 'InventoryID=' + $stateParams.id,
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
                });
            }
        }
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                isy.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'Inventorysuppliyer')
            data.post().then(function (res) {
                isy.tableParams.reload();
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
        if (!isy.tableParams.data[isy.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(isy.tableParams.data.length - 1, 1);
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
                if (isy.tableParams.data[index].fromServer) {
                    isy.tableParams.data[index].remove();
                }
                isy.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (isy.tableParams.data[index].fromServer) {
            isy.tableParams.data[index].remove();
        }
        isy.tableParams.data.splice(index, 1);
    };
    $scope.addItem2 = function () {
        isy.tableParams.data.push({ InventoryID: $stateParams.id });
    };
    var deregistration2 = $scope.$watch(angular.bind(isy, function () {
        return isy.search;
    }), function (value) {
        isy.tableParams.reload();
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
    $scope.company = [];
    $scope.loadEntities('cache/company', 'company');
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("InventorysuppliyerCtrl");
    });
};
