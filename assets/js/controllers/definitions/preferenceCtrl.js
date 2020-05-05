app.controller('preferenceCtrl', preferenceCtrl);
function preferenceCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("preferenceCtrl");
    var prf = this;
    $scope.translate = function () {
        $scope.trName = $translate.instant('main.NAME');
        $scope.trPreferenceType = $translate.instant('main.PREFERENCETYPE');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trValues = $translate.instant('main.VALUE');
        $scope.trRegex = $translate.instant('main.REGEX');
        $scope.trDefaultValue = $translate.instant('main.DEFAULTVALUE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var  deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.translate();
    $scope.item = {};
    prf.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('preference').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
             search: (prf.search) ? "name like '%" + prf.search + "%'" : ""
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
                prf.tableParams.reload();
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'preference')
            data.post().then(function (res) {
                prf.tableParams.reload();
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
        if (!prf.tableParams.data[prf.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(prf.tableParams.data.length - 1, 1);
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
                if (prf.tableParams.data[index].fromServer) {
                    prf.tableParams.data[index].remove();
                }
                prf.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (prf.tableParams.data[index].fromServer) {
            prf.tableParams.data[index].remove();
        }
        prf.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        prf.tableParams.data.push({});
    };
    var  deregistration1 = $scope.$watch(angular.bind(prf, function () {
        return prf.search;
    }), function (value) {
        prf.tableParams.reload();
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
    $scope.preferencetypes = [];
    $scope.loadEntities('enums/preferencetype', 'preferencetypes');
    $scope.$on('$destroy', function () {
        deregistration();
         deregistration1();
        $element.remove();
        $rootScope.uService.ExitController("preferenceCtrl");
    });
};