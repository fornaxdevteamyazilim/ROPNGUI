app.controller('storegroupCtrl', storegroupCtrl);
function storegroupCtrl($rootScope, $scope, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("storegroupCtrl");
    var sg = this;
    $scope.SelectedItem = null;
    $scope.SelectItem = function (id) {
        if ($scope.SelectedItem == id) {
            $scope.ShowDetail = !$scope.ShowDetail;
        }
        else
            $scope.ShowDetail = true;
        if ($scope.ShowDetail)
            $scope.$broadcast('StoreGroup', id);
        $scope.SelectedItem = id;

    };
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trEmail = $translate.instant('main.EMAIL');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trEnableTrendSharing = $translate.instant('main.ENABLETRENDSHARING');
        $scope.trRegionManager = $translate.instant('main.REGIONMANAGER');

    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    sg.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            name: 'asc'
        }
    }, {
        getData: function ($defer, params) {
            Restangular.all('storegroup').getList({
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
                sg.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'storegroup')
            data.post().then(function (res) {
                sg.tableParams.reload();
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
        if (!sg.tableParams.data[sg.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(sg.tableParams.data.length - 1, 1);
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
                if (sg.tableParams.data[index].fromServer) {
                    sg.tableParams.data[index].remove();
                }
                sg.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (sg.tableParams.data[index].fromServer) {
            sg.tableParams.data[index].remove();
        }
        sg.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        sg.tableParams.data.push({});
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storegroupCtrl");
    });
};
