app.controller('accounttransactiongroupCtrl', accounttransactiongroupCtrl);
function accounttransactiongroupCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("accounttransactiongroupCtrl");
    var atg = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    atg.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        name: 'asc'
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('AccountTransactionGroup').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
             $scope.DriverVehicle = items;
         }, function (response) {
             toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
         });
     }
 });
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(function (res) {
                atg.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'AccountTransactionGroup')
            data.post().then(function (res) {
                atg.tableParams.reload();
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
        if (!atg.tableParams.data[atg.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(atg.tableParams.data.length - 1, 1);
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
                if (atg.tableParams.data[index].fromServer) {
                    atg.tableParams.data[index].remove();
                }
                atg.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (atg.tableParams.data[index].fromServer) {
            atg.tableParams.data[index].remove();
        }
        atg.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        atg.tableParams.data.push({});
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
    var deregistrwatch1 = $scope.$watch(angular.bind(atg, function () {
        return atg.search;
    }), function (value) {
        atg.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        deregistration();
        deregistrwatch1();
        $element.remove();
        $rootScope.uService.ExitController("accounttransactiongroupCtrl");
    });
};