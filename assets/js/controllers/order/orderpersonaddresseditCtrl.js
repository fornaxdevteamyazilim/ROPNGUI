app.controller('orderpersonaddresseditCtrl', orderpersonaddresseditCtrl);
function orderpersonaddresseditCtrl($scope, $modalInstance, $filter, $log, $window, AddressID, Restangular, SweetAlert, toaster, $rootScope) {
    $rootScope.uService.EnterController("orderpersonaddresseditCtrl");
    $scope.item = {};
    if (AddressID) {
        Restangular.one('address_streetaddress', AddressID).get().then(function (restresult) {
            $scope.Address = Restangular.copy(restresult);
            $scope.item = restresult.StreetAddress;
        },
           function (restresult) {
               toaster.pop('error', "Error", 'Sunucu Hatası!');
               swal("Error!", "Data Error!", "Warning");
           }
           );
    }
    $scope.SaveData = function (data) {
            Restangular.restangularizeElement('', data, 'address_streetaddress');
            data.put().then(function (resp) {
                toaster.pop('success', "Adres Değiştirildi.", "Kayıt Gerçekleşti.");
                var adderssdata =  $scope.item + 'Kapı : ' + resp.Floor + ', Apartman No : ' + resp.AppartmentNo + ', Adres No : ' + resp.AddressNo; 
                $scope.ok(adderssdata);
            },
            function (resp) {
                toaster.pop('error', "Adres Değiştirilemez !", "error");
            });
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu hatası", response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesPaging = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu hatası", response.data.ExceptionMessage);
            });
        }
    }

    $scope.addresstypes = [];
    $scope.loadEntities('enums/addresstype', 'addresstypes');
    $scope.ok = function (data) {
        $modalInstance.close(data);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("orderpersonaddresseditCtrl");
    });
};
