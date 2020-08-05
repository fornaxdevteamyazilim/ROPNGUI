app.controller('orderpersonaddresseditCtrl', orderpersonaddresseditCtrl);
function orderpersonaddresseditCtrl($scope, $translate, $modalInstance, $filter, $log, $window, AddressID, Restangular, SweetAlert, toaster, $rootScope) {
    $rootScope.uService.EnterController("orderpersonaddresseditCtrl");
    $scope.item = {};
    if (AddressID) {
        Restangular.one('address_streetaddress', AddressID).get().then(function (restresult) {
            $scope.Address = Restangular.copy(restresult);
            $scope.item = restresult.StreetAddress;
        },
           function (restresult) {
               toaster.pop('error', "Error", 'Server Error!');
               swal("Error!", "Data Error!", "Warning");
           }
           );
    }
    $scope.SaveData = function (data) {
            Restangular.restangularizeElement('', data, 'address_streetaddress');
            data.put().then(function (resp) {
                toaster.pop('success', "Address Changed.", "Recording Took Place.");
                var adderssdata =  $scope.item + 'Door : ' + resp.Floor + ', Apartment No. : ' + resp.AppartmentNo + ', Address No. : ' + resp.AddressNo; 
                $scope.ok(adderssdata);
            },
            function (resp) {
                toaster.pop('error', "Address Cannot Changed !", "error");
            });
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
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
                toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
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
