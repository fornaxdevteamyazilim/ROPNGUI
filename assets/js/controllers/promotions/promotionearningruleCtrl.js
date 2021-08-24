app.controller('promotionearningruleCtrl', promotionearningruleCtrl);
function promotionearningruleCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("promotionearningruleCtrl");
    var per = this;
    $scope.translate = function () {

        $scope.trRulename = $translate.instant('main.RULENAME');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trOrderSource = $translate.instant('main.ORDERSOURCE');
        $scope.trisActiveFilter = $translate.instant('main.ISACTIVEFILTER');
        $scope.trEnabled = $translate.instant('main.ENABLED');
        $scope.trConfirmImmediately = $translate.instant('main.CONFIRMIMMEDIATELY');
        $scope.trisActiveValue = $translate.instant('main.ISACTIVEVALUE');
        $scope.trBonusSetting = $translate.instant('main.BONUSSETTING');
        $scope.trPromotionTransaction = $translate.instant('main.PROMOTIONTRANSACTION');
        $scope.trPromotion = $translate.instant('main.PROMOTION');

      
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    per.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('PromotionEarningRule').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
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
                per.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'PromotionEarningRule')
            data.post().then(function (res) {
                per.tableParams.reload();
                toaster.pop('success', "Kaydedildi.", 'Saved.');
            });
            data.get();
        }
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container, filter) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: filter,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu Hatası", response.data.ExceptionMessage);
            });
        }
    };
    $scope.promotions = [];
    $scope.loadEntities('promotion', 'promotions');
    $scope.BonusSettings = [];
    $scope.loadEntities('promotionsetting', 'BonusSettings');
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');
    $scope.promotiontransactionevents = [];
    $scope.loadEntities('enums/BonusTransactionEvent', 'promotiontransactionevents');
    $scope.filters = [];
    $scope.loadEntities('filter', 'filters');
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
        if (!per.tableParams.data[per.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(per.tableParams.data.length - 1, 1);
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
                if (per.tableParams.data[index].fromServer) {
                    per.tableParams.data[index].remove();
                }
                per.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (per.tableParams.data[index].fromServer) {
            per.tableParams.data[index].remove();
        }
        per.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        per.tableParams.data.push({});
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

    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("promotionearningruleCtrl");
    });
};
