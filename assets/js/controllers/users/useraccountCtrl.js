app.controller('useraccountCtrl', useraccountCtrl);
function useraccountCtrl($scope, $modal, $log, Restangular, $stateParams, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element) {
    $rootScope.uService.EnterController("useraccountCtrl");
    var pa = this;
    $scope.ID = $stateParams.id;
    $scope.PersonAccount = [];
    $scope.GetPersonAccount = function () {
        Restangular.all('useraccount').getList({
            pageNo: 1,
            pageSize: 1000,
            search: ($stateParams.id)?"NGUserID='" + $stateParams.id + "'":""
        }).then(function (result) {
            $scope.PersonAccount = result;
        }, function (response) {
            toaster.pop('error', "Sunucu hatası", response);
        });
    };
    $scope.GetPersonAccount();
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                toaster.pop('success', "Güncellendi.", 'Updated.');
            });
        }
        else {
            if (!data.id) {
                data.NguserID = $stateParams.id;
                Restangular.restangularizeElement('', data, 'useraccount')
                data.post().then(function (res) {
                    toaster.pop('success', "Kaydedildi.", 'Saved.');
                });

            } else
                toaster.pop('warning', "Sorry", 'You do not have permittion  !!!');
        }
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
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu hatası", response);
            });
        }
    };
    $scope.accountlimittypes = [];
    $scope.loadEntities('enums/accountlimittype', 'accountlimittypes');
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
                if (pa.tableParams.data[index].fromServer) {
                    pa.tableParams.data[index].remove();
                }
                psd.tableParams.data.splice(index, 1);
                toaster.pop("error", "Dikkat !", "Kayıt Silindi !");
            }
        });
    };
    $scope.addItem = function () {
        pa.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("useraccountCtrl");
    });
};
