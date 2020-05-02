app.controller('userstoregroupCtrl', userstoregroupCtrl);
function userstoregroupCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("userstoregroupCtrl");
    var usg = this;
    $scope.translate = function () {
        $scope.trStoreGroup = $translate.instant('main.STOREGROUP');
        $scope.trUser = $translate.instant('main.USER');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    usg.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('userstoregroup').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', "Sunucu Hatası", response);
            });
        }
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                usg.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'userstoregroup')
            data.post().then(function (res) {
                usg.tableParams.reload();
                toaster.pop('success', "Kaydedildi.", 'Saved.');
            });
            data.get();
        }
    };
    $scope.FormKeyPress = function (event, rowform, data, index) {
        if (event.keyCode === 27 && rowform.$visible) {
            $scope.cancelForm(rowform);
        }
    };
    $(document).keypress(function (event, rowform, data, index) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            rowform.$show();
        }
    });
    $(document).keydown(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '40') {
            $scope.selectedRow++;
            usg.tableParams.data[$scope.selectedRow]
            $scope.$apply();
        }
        if (keycode == '38') {
            if ($scope.selectedRow == 0) {
                return;
            }
            $scope.selectedRow--;
            usg.tableParams.data[$scope.selectedRow]
            $scope.$apply();
        }
    });
    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
    };
    $scope.cancelForm = function (rowform) {
        rowform.$cancel();
        if (!usg.tableParams.data[usg.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(usg.tableParams.data.length - 1, 1);
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
                if (usg.tableParams.data[index].fromServer) {
                    usg.tableParams.data[index].remove();
                }
                usg.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (usg.tableParams.data[index].fromServer) {
            usg.tableParams.data[index].remove();
        }
        usg.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        usg.tableParams.data.push({});
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
                pageSize: 10000,
            }).then(function (result) {
                angular.copy(result, $scope[Container]);
            }, function (response) {
                toaster.pop('Warning', "Sunucu bağlantı hatası", "Uyarı!");
            });
        }
    };
    $scope.users = [];
    $scope.loadEntities('user', 'users');
    $scope.storegroups = [];
    $scope.loadEntities('storegroup', 'storegroups');
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("userstoregroupCtrl");
    });
};