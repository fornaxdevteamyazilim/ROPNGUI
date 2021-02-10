app.controller('newregisterpersonCtrl', newregisterpersonCtrl);
function newregisterpersonCtrl($rootScope, $scope, $modalInstance, $translate, $filter, item, $modal, $log, $window, Restangular, SweetAlert, toaster,$translate) {
    $rootScope.uService.EnterController("newregisterpersonCtrl");
    $scope.item = {};
    $scope.item.name = item.name;
    $scope.item.number = item.PersonPhone;
    $scope.item.ysaddress = item.ysaddress;
    $scope.item.ysstore = item.ysstore;
    $scope.item.Landmark = item.ysaddress;
    $scope.item.ysaddress = item.ysaddress + '[' + item.ysstore + ']';
    $scope.item.Region = item.Region;
    $scope.item.City = item.City;
    $scope.item.GenderTypeID = 2;
    $scope.StreetAddressSelector = function (StreetAddressID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/streetaddress/StreetAddressSelector.html',
            controller: 'StreetAddressSelectorCtrl',
            size: '',
            backdrop: '',
            resolve: {
                StreetAddressID: function () {
                    return StreetAddressID;
                },
                InfoNotes: function () {
                    return item.ysaddress;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.item.streetAddress = { StreetAddress: selectedItem.name + "/" + selectedItem.Quarter, StreetAddressID: selectedItem.id };
        });
    };   
    $scope.saveItem = function (item) {
        var data = {};
        data.name= item.name;
        data.PersonPhone  = item.number;
        data.GenderTypeID = item.GenderTypeID||2;
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                $scope.item.personID = resp.id;
                toaster.pop("success",$translate.instant('personfile.DataUpdated '), $translate.instant('yemeksepetifile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'person')
            if (data.GenderTypeID != "1" && data.GenderTypeID != "0" && data.GenderTypeID != "2") {
                toaster.pop('warning',  $translate.instant('personfile.SelectGender '));
            } else if (!data.PersonPhone) {
                toaster.pop('warning',  $translate.instant('personfile.EnterPhoneNumber '));
            } else if (!$scope.item.streetAddress || !$scope.item.streetAddress.StreetAddressID) {
                toaster.pop('warning',  $translate.instant('yemeksepetifile.Selectaddress '));
            } else {
                data.post().then(function (resp) {
                    toaster.pop("success", $translate.instant('personfile.DataSaved'), $translate.instant('yemeksepetifile.Saved'));
                    $scope.item.personID = resp.id;
                    var phone = ({ PersonID: resp.id, Number: data.PersonPhone })
                    $scope.SavePhoneNumber(phone);
                });
            }
        }
    };
    $scope.SavePhoneNumber = function (data) {
        Restangular.restangularizeElement('', data, 'personphone')
        data.post().then(function (resp) {
            $scope.SaveData(data.PersonID)
        });
    };
    $scope.SaveData = function (PersonID) {
        if ($scope.item.streetAddress) {
            var data = $scope.item;
            data.StreetAddressID = $scope.item.streetAddress.StreetAddressID;
            data.StreetAddress = $scope.item.streetAddress.StreetAddress;
            Restangular.restangularizeElement('', data, 'address_streetaddress');
            if (data.streetAddress.restangularized && data.id) {
                data.put().then(function (resp) {
                    $scope.SaveDeliveryAddress(resp.id, PersonID);
                });
            }
            else {
                Restangular.restangularizeElement('', data, 'address_streetaddress');
                data.post().then(function (resp) {
                    $scope.SaveDeliveryAddress(resp.id, PersonID);

                });
            }
        }
    };
    $scope.SaveDeliveryAddress = function (AID, personID) {
        var personAddress = {};
        personAddress.PersonID = personID;
        personAddress.AddressID = AID;
        Restangular.restangularizeElement('', personAddress, 'person_deliveryaddress');
        if (personAddress.restangularized && personAddress.id) {
            personAddress.put().then(function (resp) {
                toaster.pop('success', $translate.instant('yemeksepetifile.Updated'), $translate.instant('yemeksepetifile.Updated'));
                $scope.ok();
            });
        }
        else {
            personAddress.post().then(function (resp) {
                toaster.pop('success',$translate.instant('yemeksepetifile.Saved'), $translate.instant('yemeksepetifile.Saved'));
                $scope.ok();
            });
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
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                angular.copy(result.plain(), $scope[Container]);
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.addresstypes = [];
    $scope.loadEntities('enums/addresstype', 'addresstypes');
    $scope.gendertypes = [];
    $scope.loadEntities('enums/gendertype', 'gendertypes');
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("newregisterpersonCtrl");
    });
};
