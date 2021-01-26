app.controller('yemeksepetimergeCtrl', yemeksepetimergeCtrl);
function yemeksepetimergeCtrl($rootScope , $scope, $filter, $modal, SweetAlert, $modal, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("yemeksepetimergeCtrl");
    userService.userAuthorizated();
    $scope.ysitem = {};
    $scope.ropngitem = [];
    $scope.personAddresses = [];
    $scope.selectedPersonAndAddress = {};
    $scope.getYSorder = function () {
        Restangular.one('yemeksepetiorder', $stateParams.id).get().then(function (result) {
            $scope.ysitem.name = result.YemekSepetiRawOrder.CustomerName;
            $scope.ysitem.PersonPhone = result.YemekSepetiRawOrder.CustomerPhone;
            $scope.ysitem.Adress = result.YemekSepetiRawOrder.Address  +'---('+ result.YemekSepetiRawOrder.AddressDescription +')---';
            $scope.ysitem.RestaurantName = result.YemekSepetiRawOrder.RestaurantName;
            $scope.ysitem.City = result.YemekSepetiRawOrder.City;
            $scope.ysitem.Region = result.YemekSepetiRawOrder.Region;
            $scope.yemeksepetiItem = result.YemekSepetiRawOrder;
        }, function (response) {
            return null;
        });
    };
    $scope.getYSorder();
    $scope.GetSearchString = function (data, type) {
        if (type == 'all') {
            var SearchFilter = (data.name && data.name.length > 0) ? "name like  '" + data.name + "%'" : "";
            if (data.PersonPhone && data.PersonPhone.length > 0) {
                SearchFilter = SearchFilter + ((SearchFilter.length > 0) ? " and " : "");
                SearchFilter = SearchFilter + "Number like'" + data.PersonPhone + "%'"
            }
        }
        if (type == 'name') {
            var SearchFilter = (data.name && data.name.length > 0) ? "name like  '" + data.name + "%'" : "";
        }
        if (type == 'phone') {
            var SearchFilter = (data.PersonPhone && data.PersonPhone.length > 0) ? "Number like'" + data.PersonPhone + "%'" : "";
        }
        return SearchFilter;
    };
    $scope.search = function (ysdata) {
        if ($scope.selectedPersonAndAddress && $scope.selectedPersonAndAddress.Person)
            $scope.selectedPersonAndAddress = {};
        if ($scope.personAddresses && $scope.personAddresses.length > 0)
            $scope.personAddresses = [];
        if (ysdata) {
            if (!ysdata.name && (ysdata.name == 'undefined' || ysdata.name == '')) {
                $scope.ropngitem = [];
                return;
            }
            if (!ysdata.PersonPhone && (ysdata.PersonPhone == '' || ysdata.PersonPhone == 'undefined')) {
                $scope.ropngitem = [];
                return;
            }
            Restangular.all('person').getList({
                search: $scope.GetSearchString(ysdata, 'all'),
            }).then(function (result) {
                angular.copy(result, $scope.ropngitem);
            }, function (response) {
                return null;
            });
        }
    };
    $scope.searchByName = function (ysdata) {
        if ($scope.selectedPersonAndAddress && $scope.selectedPersonAndAddress.Person)
            $scope.selectedPersonAndAddress = {};
        if ($scope.personAddresses && $scope.personAddresses.length > 0)
            $scope.personAddresses = [];
        if (ysdata) {
            if (!ysdata.name && (ysdata.name == 'undefined' || ysdata.name == '')) {
                $scope.ropngitem = [];
                return;
            }
            Restangular.all('person').getList({
                search: $scope.GetSearchString(ysdata, 'name'),
            }).then(function (result) {
                if ($scope.personAddresses && $scope.personAddresses.length > 0)
                    $scope.ropngitem = [];
                angular.copy(result, $scope.ropngitem);
            }, function (response) {
                return null;
            });
        }
    };
    $scope.searchByPhone = function (ysdata) {
        if ($scope.selectedPersonAndAddress && $scope.selectedPersonAndAddress.Person)
            $scope.selectedPersonAndAddress = {};
        if ($scope.personAddresses && $scope.personAddresses.length > 0)
            $scope.personAddresses = [];
        if (ysdata) {
            if (!ysdata.PersonPhone && (ysdata.PersonPhone == 'undefined' || ysdata.PersonPhone == '')) {
                $scope.ropngitem = [];
                return;
            }
            Restangular.all('person').getList({
                search: $scope.GetSearchString(ysdata, 'phone'),
            }).then(function (result) {
                if ($scope.personAddresses && $scope.personAddresses.length > 0)
                    $scope.ropngitem = [];
                angular.copy(result, $scope.ropngitem);
            }, function (response) {
                return null;
            });
        }
    };
    $scope.filterAddress = function (address) {
        if (userService.userIsInRole("Admin") || userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER") || !($rootScope.user.StoreID)) {
            $scope.personAddresses = angular.copy(address);
        } else {
            var selectedaddress = [];
            for (var i = 0; i < address.length; i++) {
                if (address[i].Store && $rootScope.user.StoreID == address[i].Store.id) {
                    selectedaddress.push(address[i]);
                }
            }
            $scope.personAddresses = angular.copy(selectedaddress);
        }
    };
    $scope.getPersonAddress = function (person) {
        $scope.slectedPerson = null;
        $scope.slectedPerson = angular.copy(person);
        if (person && person.id) {
            Restangular.all('person_deliveryaddress').getList({
                search: "PersonID='" + person.id + "'"
            }).then(function (result) {
                $scope.slectedPerson = person;
                $scope.filterAddress(result);
                //$scope.personAddresses = angular.copy(result);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        } else {
            $scope.personAddresses = null;
        }
    };
    $scope.setPersonAndAddress = function (address) {
        $scope.slectedAddress = angular.copy(address);
        $scope.selectedPersonAndAddress.address = angular.copy(address.Address.StreetAddress + ' No:' + address.Address.AddressNo + ' Apartment:' + address.Address.AppartmentNo + ' Door:' + address.Address.Floor);
        $scope.selectedPersonAndAddress.Person = angular.copy($scope.slectedPerson.name);
        $scope.selectedPersonAndAddress.Phone = angular.copy($scope.slectedPerson.PersonPhones);
    };
    $scope.newRegisterPerson = function (item) {
        if ($scope.ysitem.Adress) {
            item.ysaddress = $scope.ysitem.Adress;
            item.ysstore = $scope.ysitem.RestaurantName;
            item.City = $scope.ysitem.City;
            item.Region = $scope.ysitem.Region;
        }
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/yemeksepeti/newregisterperson.html',
            controller: 'newregisterpersonCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (value) {
            var data = { name: value.name, PersonPhone: value.number };
            $scope.search(data);
            Restangular.all('person_deliveryaddress').getList({
                search: "PersonID='" + value.personID + "'"
            }).then(function (result) {
                $scope.personAddresses = angular.copy(result);
            });
            Restangular.one('person', value.personID).get().then(function (result) {
                $scope.selectedPersonAndAddress.Person = angular.copy(result.name);
                $scope.selectedPersonAndAddress.Phone = angular.copy(result.PersonPhones);
            });
            $scope.selectedPersonAndAddress.address = angular.copy(value.streetAddress.StreetAddress + ' No:' + value.AddressNo + ' Apartment:' + value.AppartmentNo + ' Door:' + value.Floor);
            $scope.ysitem.Adress = angular.copy(value.streetAddress.StreetAddress + ' No:' + value.AddressNo + ' Apartment:' + value.AppartmentNo + ' Door:' + value.Floor);
        })
    };
    $scope.addNewAddress = function () {
        $scope.slectedPerson.ysaddress = $scope.ysitem.Adress;
        $scope.slectedPerson.ysstore = $scope.ysitem.RestaurantName;
        $scope.slectedPerson.City = $scope.ysitem.City;
        $scope.slectedPerson.Region = $scope.ysitem.Region;
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/yemeksepeti/addnewaddress.html',
            controller: 'addnewaddressCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return $scope.slectedPerson;
                },
            }
        });
        modalInstance.result.then(function (value) {
            var data = { name: value.name, PersonPhone: value.number };
            $scope.search(data);
            Restangular.all('person_deliveryaddress').getList({
                search: "PersonID='" + value.personID + "'"
            }).then(function (result) {
                $scope.personAddresses = angular.copy(result);
            });
            Restangular.one('person', value.personID).get().then(function (result) {
                $scope.selectedPersonAndAddress.Person = angular.copy(result.name);
                $scope.selectedPersonAndAddress.Phone = angular.copy(result.PersonPhones);
            });
            $scope.selectedPersonAndAddress.address = angular.copy(value.streetAddress.StreetAddress + ' No:' + value.AddressNo + ' Apartment:' + value.AppartmentNo + ' Door:' + value.Floor);
            $scope.ysitem.Adress = angular.copy(value.streetAddress.StreetAddress + ' No:' + value.AddressNo + ' Apartment:' + value.AppartmentNo + ' Door:' + value.Floor);
        })
    };
    $scope.mergePerson = function () {
        var data = { YemekSepetiCustomerID: $scope.yemeksepetiItem.CustomerId, YemekSepetiAddressID: $scope.yemeksepetiItem.AddressId, Person_DeliveryAddressID: $scope.slectedAddress.id }
        Restangular.restangularizeElement('', data, 'yemeksepeticustomermap');
        data.post().then(function (resp) {
            toaster.pop('success',  $translate.instant('yemeksepetifile.TwinningSaved '));
              $location.path('/app/mainscreen');
        }, function (resp) {
            toaster.pop('error',  $translate.instant('yemeksepetifile.TwinningSaved '), resp.data.ExceptionMessage);
        });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("yemeksepetimergeCtrl");
    });
};