app.controller('AutomaticorderitemsettingCtrl', AutomaticorderitemsettingCtrl);
function AutomaticorderitemsettingCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("AutomaticorderitemsettingCtrl");
    var ps = this;
    $scope.translate = function () {
        $scope.trSettingName = $translate.instant('main.SETTINGNAME');
        $scope.trisActive = $translate.instant('main.ISACTIVE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trStartDate = $translate.instant('main.STARTDATE');
         $scope.trQuantityLimit = $translate.instant('main.QUANTITYLIMIT');
         $scope.trStoreBasedQuantityLimit = $translate.instant('main.STOREBASEDQUANTITYLIMIT');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    ps.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('AutomaticOrderItemSetting').getList({
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
                ps.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'AutomaticOrderItemSetting')
            data.post().then(function (res) {
                ps.tableParams.reload();
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
        if (!ps.tableParams.data[ps.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(ps.tableParams.data.length - 1, 1);
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
                if (ps.tableParams.data[index].fromServer) {
                    ps.tableParams.data[index].remove();
                }
                ps.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (ps.tableParams.data[index].fromServer) {
            ps.tableParams.data[index].remove();
        }
        ps.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        ps.tableParams.data.push({});
    };

    $scope.datepopupStartDate = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/Tools/date.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.StartDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.StartDate = result;
        })
    };

    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("AutomaticorderitemsettingCtrl");
    });
};
