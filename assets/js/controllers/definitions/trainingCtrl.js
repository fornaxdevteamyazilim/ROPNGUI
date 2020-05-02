﻿app.controller('trainingCtrl', trainingCtrl);
function trainingCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("trainingCtrl");
    var trn = this;
    $scope.translate = function () {
        $scope.trTraningType = $translate.instant('main.TRAININGTYPE');
        $scope.trTrainingName = $translate.instant('main.TRAININGNAME');
        $scope.trTraningLocation = $translate.instant('main.TRAININGLOCATION');
        $scope.trDefinedBy = $translate.instant('main.DEFINEDBY');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                trn.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'training')
            data.post().then(function (res) {
                trn.tableParams.reload();
                toaster.pop('success', "Kaydedildi.", 'Saved.');
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
        if (!trn.tableParams.data[trn.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(trn.tableParams.data.length - 1, 1);
            toaster.pop('warning', "İptal edildi !", 'Insert cancelled !');
        } else {
            toaster.pop('warning', "İptal edildi !", 'Edit cancelled !');
        }
    };
    trn.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            Name : 'asc'
        }
    },
    {
        getData: function ($defer, params) {
            Restangular.all('training').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: (trn.search) ? "Name  like '%" + trn.search + "%'" : ""
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
            });
        }
    });
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
                if (trn.tableParams.data[index].fromServer) {
                    trn.tableParams.data[index].remove();
                    $scope.$emit('DeleteUserRoles', "ReloadUserRoles");
                }
                trn.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.addItem = function () {
        trn.tableParams.data.push({});
    };
    $scope.cancelremove = function (index) {
        if (trn.tableParams.data[index].fromServer) {
            trn.tableParams.data[index].remove();
        }
        trn.tableParams.data.splice(index, 1);
    };
    var deregistration1 = $scope.$watch(angular.bind(trn, function () {
        return trn.search;
    }), function (value) {
        trn.tableParams.reload();
    });

    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("trainingCtrl");
    });
};
