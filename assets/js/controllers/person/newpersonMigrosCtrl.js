app.controller('newpersonMigrosCtrl', newpersonMigrosCtrl);
function newpersonMigrosCtrl($scope, Restangular, item, $modal, ngTableParams, toaster, $window, $rootScope, $location, $translate, $modalInstance, userService, $filter, ngnotifyService) {
    $rootScope.uService.EnterController("newpersonMigrosCtrl");
    $scope.item = {};
    $scope.original = {};
    $scope.personitem = {};
    $scope.MerketingData = {};
    $scope.MerketingData = {};
    $scope.MPSMS = {};
    $scope.MPEMAIL = {};
    $scope.StreetAddress = {};
    $scope.Address = {};
    $scope.personitem.AddressID = null;
    if (item.PersonID) {
        Restangular.one('person', item.PersonID).get().then(function (restresult) {
            $scope.item = Restangular.copy(restresult);
            $scope.original = Restangular.copy(restresult);
            $scope.newPersonID = restresult.id;
            $scope.ShowAddressPart = false;
            $scope.item.PersonPhone = parseInt(restresult.PersonPhones[0].Number);
            $scope.GetMarketingPermission(restresult.id);
        }, function (restresult) {
            toaster.pop('warning', "Sunucu Hatası", response.data.ExceptionMessage);
        })
    } else {
        $scope.item.name = item.searchName;
        $scope.item.PersonPhone = parseInt(item.searchPhone);
    }
    $scope.translate = function () {
        $scope.phone = $translate.instant('main.PHONE');
        $scope.namesurname = $translate.instant('main.NAMESURNAME');
        $scope.gender = $translate.instant('main.GENDER');
        $scope.marketingquestion = $translate.instant('main.MARKETINGQUESTION');
        $scope.customerspecialnotestitle = $translate.instant('main.CUSTOMERSPECIALNOTESTITLE');
        $scope.customerspecialnotes = $translate.instant('main.CUSTOMERSPECIALNOTES');
        $scope.hiddencustomernote = $translate.instant('main.HIDDENCUSTOMERNOTE');
        $scope.save = $translate.instant('main.SAVE');
    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                toaster.pop("success", "Veri Güncellendi.", "Updated!");
                $scope.newPersonID = resp.id;
                if (data.PersonPhone != $scope.original.PersonPhones[0].Number) {
                    var phone = ({ PersonID: resp.id, Number: data.PersonPhone })
                    $scope.SavePhoneNumber(phone);
                } else {
                    if ($scope.ShowAddressPart == false) {
                        $scope.ok();
                    }
                }
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'person')
            if (data.GenderTypeID != "1" && data.GenderTypeID != "0" && data.GenderTypeID != "2") {
                toaster.pop('warning', "Cinsiyet Seçiniz !");
            } else if (!data.PersonPhone) {
                toaster.pop('warning', "Telefon Numarası Giriniz !");
            } else {
                data.post().then(function (resp) {
                    $scope.item.id = resp.id;
                    $scope.newPersonID = resp.id;
                    $scope.GetMarketingPermission(resp.id);
                    toaster.pop("success", "Veri Kaydedildi.", "Saved!");
                    var phone = ({ PersonID: resp.id, Number: data.PersonPhone })
                    $scope.SavePhoneNumber(phone);
                });
            }
        }
    };
    $scope.SavePhoneNumber = function (data) {
        Restangular.restangularizeElement('', data, 'personphone')
        data.post().then(function (resp) {
            if ($scope.ShowAddressPart == false) {
                $scope.ok();
            }
        });
    };

    $scope.TakeOrder = function (personID, OrderType, PersonPhones) {
        if (PersonPhones && PersonPhones.length < 1) {
            toaster.pop('warning', "Telefon Numarası Boş Geçilemez !", "error");
            return;
        }
        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER")) {
            $scope.SelcetStore(personID, OrderType);
        } else {
            var data = $scope.GetDepartment();
            if (data != null) {
                //$scope.SelcetStore(personID, OrderType);
                //OrderTypes: 1=Takeaway,2=HomeDelivery,3=Instore
                var order = {}
                var orderperson = { PersonID: personID }
                var pesons = [orderperson];
                order.persons = pesons; //.push(orderperson);
                //order.OrderTypeID = $rootScope.OrderType ? $rootScope.OrderType : OrderType;
                order.OrderTypeID = OrderType;
                // order.PaymentTypeID = 0;
                order.StoreID = $rootScope.user.StoreID;
                //order.DepartmentID = $rootScope.user.UserRole.OrderSource.Department.id;
                order.OrderSourceID = '300224877062';
                Restangular.restangularizeElement('', order, 'order');
                order.post().then(function (resp) {
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                        location.href = '#/app/orders/orderStore/' + resp.id;
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + resp.id;
                    toaster.pop("success", "Sipariş Oluşturuldu.");
                },
                    function (resp) {
                        toaster.pop('error', resp.data.ExceptionMessage, "error");
                    });
            } else {
                //TODO Swet Alert
            }
        }
    };


    $scope.GetMarketingPermission = function (newPersonID) {
        Restangular.all('MarketingPermission').getList({
            pageNo: 1,
            pageSize: 10,
            search: "PersonID='" + newPersonID + "'"
        }).then(function (result) {
            for (var i = 0; i < result.length; i++) {
                if (result[i].MarketingPermissionType == 0)
                    $scope.MPSMS = result[i];
                if (result[i].MarketingPermissionType == 1)
                    $scope.MPEMAIL = result[i];
            }
        });
    };
    $scope.SaveMarketingData = function (newPersonID) {
        if ($scope.MerketingData && ($scope.MerketingData.MarketingPermissionType == 0 || $scope.MerketingData.MarketingPermissionType == 1) && ($scope.MerketingData.Approved == true || $scope.MerketingData.Approved == false)) {
            Restangular.restangularizeElement('', $scope.MerketingData, 'MarketingPermission');
            if ($scope.MerketingData.restangularized && $scope.MerketingData.id) {
                $scope.MerketingData.put().then(function (resp) {
                    toaster.pop('success', "Güncellendi.", 'Updated!');
                });
            }
            else {
                $scope.MerketingData.PersonID = newPersonID;
                $scope.MerketingData.post().then(function (resp) {
                    toaster.pop('success', "Kaydedildi.", 'Saved!');
                });
            }
        }
    };
    $scope.SaveMarketingPermission = function (Data, Type, Value) {
        if (Type == 0) {
            $scope.MPSMS.MarketingPermissionType = Type;
            $scope.MPSMS.Approved = Value;
            angular.copy($scope.MPSMS, $scope.MerketingData);
            $scope.SaveMarketingData($scope.newPersonID)
        }
        if (Type == 1) {
            $scope.MPEMAIL.MarketingPermissionType = Type;
            $scope.MPEMAIL.Approved = Value
            angular.copy($scope.MPEMAIL, $scope.MerketingData);
            $scope.SaveMarketingData($scope.newPersonID)
        }
    };

    $scope.isActives = [
        {
            name: 'Aktif',
            Value: true
        },
        {
            name: 'Pasif',
            Value: false
        }
    ];

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
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', "Sunucu Hatası", response);
            });
        }
    };
    $scope.gendertypes = [];
    $scope.loadEntities('enums/gendertype', 'gendertypes');
    $scope.addresstypes = [];
    $scope.loadEntities('enums/addresstype', 'addresstypes');
    $scope.addresssources = [];
    $scope.loadEntities('enums/datasource', 'addresssources');
    //**********//********** // ********** // ********** // ********** // **********// ADDRESS //**********//********** // ********** // ********** // ********** //
    $scope.GetDepartments = function () {
        Restangular.all('department').getList({
            pageNo: 1,
            pageSize: 1000,
        }).then(function (result) {
            angular.copy(result, $scope.Departments);
        }, function (response) {
            return null;
        });
    };
    $scope.GetDepartment = function () {
        if ($rootScope.user.UserRole && $rootScope.user.UserRole.OrderSource && $rootScope.user.UserRole.OrderSource.Department) {
            return $rootScope.user.UserRole.OrderSource.Department;
        }
        else {
            $scope.GetDepartments();
            if (!$scope.Departments || $scope.Departments.length == 0) {
            }
            if ($scope.Departments.length == 1) {
                $rootScope.user.UserRole.OrderSource.Department = $scope.Departments[0];
            }
            else {
                var modalInstance = $modal.open({
                    templateUrl: 'assets/views/order/selectdepartment.html',
                    controller: 'selectdepartmentCtrl',
                    size: '',
                    backdrop: '',
                    resolve: {
                    }
                });
                modalInstance.result.then(function (item) {
                    return $rootScope.user.UserRole.OrderSource.Department;
                },
                    function (resp) {
                        toaster.pop('error', "No Department", "error");
                    });
            }
        }
    };
    $scope.HomeOrder = function (person, OrderType) {
        if ($scope.CheckPersonPhone == false) {
            toaster.pop('warning', "Telefon Numarası Boş Geçilmemeli !", "error");
            return;
        }
        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER")|| userService.userIsInRole("CCSIKAYET")) {
            var data = $scope.GetDepartment();
            if (data != null) {
                var order = {}
                var orderperson = { PersonID: person.PersonID };
                var pesons = [orderperson];
                order.persons = pesons; //.push(orderperson);
                //order.OrderTypeID = $rootScope.OrderType ? $rootScope.OrderType : OrderType;
                order.OrderTypeID = OrderType;
                order.AddressID = person.AddressID;
                order.StoreID = $rootScope.user.StoreID;
                //order.DepartmentID = $rootScope.user.UserRole.OrderSource.Department.id;
                order.OrderSourceID = '300224877062';
                Restangular.restangularizeElement('', order, 'order');
                order.post().then(function (resp) {
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                        location.href = '#/app/orders/orderStore/' + resp.id;
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + resp.id;
                    toaster.pop("success", "Sipariş Oluşturuldu.");
                },
                    function (resp) {
                        toaster.pop('error', resp.data.ExceptionMessage, "error");
                    });
            } else {
                //TODO Swet Alert
            }
        } else {
            Restangular.all('ordertools/checkorderstore').post(
                {
                    AddressID: person.AddressID,
                    DeliveryDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                }).then(function (result) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].id == $rootScope.user.StoreID) {
                            var data = $scope.GetDepartment();
                            if (data != null) {
                                var order = {}
                                var orderperson = { PersonID: person.PersonID };
                                var pesons = [orderperson];
                                order.persons = pesons; //.push(orderperson);
                                //order.OrderTypeID = $rootScope.OrderType ? $rootScope.OrderType : OrderType;
                                order.OrderTypeID = OrderType;
                                order.AddressID = person.AddressID;
                                order.StoreID = $rootScope.user.StoreID;
                                //order.DepartmentID = $rootScope.user.UserRole.OrderSource.Department.id;
                                order.OrderSourceID = '300224877062';
                                Restangular.restangularizeElement('', order, 'order');
                                order.post().then(function (resp) {
                                    $modalInstance.dismiss('cancel');
                                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                                        location.href = '#/app/orders/orderStore/' + resp.id;
                                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                                        location.href = '#/app/orders/order/' + resp.id;
                                    toaster.pop("success", "Sipariş Oluşturuldu.");
                                },
                                    function (resp) {
                                        toaster.pop('error', resp.data.ExceptionMessage, "error");
                                    });
                                return;
                            } else {
                                //TODO Swet Alert
                            }
                        } else {
                            toaster.pop('warning', "Bu adrese sipariş girişi yapamazsınız !");
                        }
                    }
                }, function (response) {
                    toaster.pop('error', "Sunucu Hatası", response.data.ExceptionMessage);
                });
        }
    };
    $scope.SaveDeliveryAddress = function (AID, data, path) {//2
        $scope.personitem.PersonID = $scope.newPersonID;
        delete $scope.personitem.Person;
        $scope.personitem.AddressID = AID;
        $scope.personitem.notes = $scope.Address.Notes;
        delete $scope.personitem.Address;
        Restangular.restangularizeElement('', $scope.personitem, 'person_deliveryaddress');
        if ($scope.personitem.restangularized && $scope.personitem.id) {
            $scope.personitem.put().then(function (resp) {
                toaster.pop('success', "Güncellendi.", 'Updated!');
                if (path == 'Order' && resp.id) {
                    $scope.HomeOrder(data, 2)
                }
            });
        }
        else {
            $scope.personitem.post().then(function (resp) {
                $scope.personitem.id = resp.id;
                $scope.personitem.isActive = resp.isActive;
                toaster.pop('success', "Kaydedildi !", 'Saved!');
                if (path == 'Order' && resp.id) {
                    $scope.HomeOrder(data, 2)
                }
            });
        }
    };
    $scope.SaveAddressData = function (data, path) {//1
        if ($scope.StreetAddress)
            $scope.Address.StreetAddressID = $scope.StreetAddress.StreetAddressID;
        Restangular.restangularizeElement('', $scope.Address, 'address_streetaddress');
        if ($scope.Address.restangularized && $scope.Address.id) {
            $scope.Address.CompanyName = angular.copy(data.CompanyName);
            $scope.Address.put().then(function (resp) {
                $scope.SaveDeliveryAddress(resp.id, data, path);
            });
        }
        else {
            $scope.Address.DataSourceID = 0;
            $scope.Address.CompanyName = angular.copy(data.CompanyName);
            Restangular.restangularizeElement('', $scope.Address, 'address_streetaddress');
            $scope.Address.post().then(function (resp) {
                $scope.SaveDeliveryAddress(resp.id, data, path);

            });
        }
    };
    $scope.DisplayStreetAddress = function () {
        return $scope.StreetAddress ? $scope.StreetAddress.StreetAddress : '';
    };
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
                    return "";
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            $scope.StreetAddress = { StreetAddress: selectedItem.name + "/" + selectedItem.Quarter, StreetAddressID: selectedItem.id };
            $scope.FormatedAddress = angular.copy($scope.DisplayStreetAddress());
        });
    };
    //**********//********** // ********** // ********** // ********** // **********// ADDRESS //**********//********** // ********** // ********** // ********** //
    $scope.ok = function () {
        $modalInstance.close($scope.item.PersonPhone);
    };
    $scope.cancel = function () {
        $modalInstance.close($scope.item.PersonPhone);
    };
    $scope.$on('$destroy', function () {
        tranlatelistener();
        $rootScope.uService.ExitController("newpersonMigrosCtrl");
    });
};