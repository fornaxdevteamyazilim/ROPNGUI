'use strict';
app.controller('personlistCtrl', personlistCtrl);
function personlistCtrl($scope, $log, SweetAlert, Restangular, $modal, ngTableParams, toaster, $window, $rootScope, $location, $translate, callsService, localStorageService, userService, $element) {
    $("#searchbyphone").focus();
    $rootScope.uService.EnterController("personlistCtrl");
    var vm = this;
    $scope.isWaiting = true;
    userService.userAuthorizated();
    $scope.dbClick = function () {
        //$scope.isWaiting = false;
    };
    if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER")) {
        $rootScope.user.UserExtensionNumber = callsService.currentExtension = localStorageService.get('ExtensionNumber');
        $rootScope.user.ClientName = localStorageService.get('ClientName');
        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER")) {
            if (!$rootScope.user.UserExtensionNumber) {
                var modalInstance = $modal.open({
                    templateUrl: 'assets/views/mainscreen/acentextension.html',
                    controller: 'acentextensionCtrl',
                    size: '',
                    backdrop: '',
                    resolve: {
                        ObjectPath: function () {
                        }
                    }
                });
                modalInstance.result.then(function (password) {
                })
            }
            if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER")) {
                if (!$rootScope.user.UserExtensionNumber || !$rootScope.user.ClientName) {
                    var modalInstance = $modal.open({
                        templateUrl: 'assets/views/mainscreen/acentextension.html',
                        controller: 'acentextensionCtrl',
                        size: '',
                        backdrop: '',
                        resolve: {
                            ObjectPath: function () {
                            }
                        }
                    });
                    modalInstance.result.then(function (password) {
                    })
                }
            }
        }
    }
    $scope.GetAddress = function (PersonID) {
        $rootScope.PersonID = null;
        $rootScope.PersonID = PersonID;
        $scope.$broadcast('GetPersonDetails', PersonID);
    };
    var deregistration = $scope.$on('pbxCallDisconnect', function () {
        $rootScope.searchPhone = '';
        vm.searchPhone = '';
    });
    $scope.SelectedItem = null;
    $scope.ShowDetail = false;
    vm.searchName = ($rootScope.searchName) ? $rootScope.searchName : '';
    vm.searchPhone = ($rootScope.searchPhone) ? $rootScope.searchPhone : '';
    $scope.SelectItem = function (id) {
        if ($scope.SelectedItem == id)
            $scope.ShowDetail = !$scope.ShowDetail;
        else
            $scope.ShowDetail = true;
        $scope.SelectedItem = id;

    };
    //$scope.user = $rootScope.user;
    $scope.GoPersonEdit = function (ItemID) {
        location.href = '#/app/orders/person/edit/' + ItemID;
    };
    $scope.translate = function () {
        $scope.trNameSurname = $translate.instant('main.NAMESURNAME');
        $scope.trEmail = $translate.instant('main.EMAILS');
        $scope.trPhone = $translate.instant('main.PHONES');
        $scope.searchbyname = $translate.instant('main.SEARCHBYNAME');
        $scope.searching = $translate.instant('main.SEARCHING');
        $scope.searchadress = $translate.instant('main.SEARCHADDRESS');

    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    var deregistration1 = $scope.$on('pbxCallRing', function (event, data) {// ON LANGUAGE CHANGED
        $rootScope.searchPhone = angular.copy(data.CallerID);
        vm.searchPhone = angular.copy(data.CallerID);
    });
    if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER")) {
        var GetCurrentCall = callsService.GetCurrentCall();
        if (GetCurrentCall && GetCurrentCall.CallerID) {
            $rootScope.searchPhone = angular.copy(GetCurrentCall.CallerID);
            vm.searchPhone = angular.copy(GetCurrentCall.CallerID);
        }
    }
    var deregistration2 = $scope.$on('pbxCallConnect', function (event, data) {// ON LANGUAGE CHANGED
        if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER")) {
            $rootScope.searchPhone = angular.copy(data.CallerID);
            vm.searchPhone = angular.copy(data.CallerID);
        }
    });
    $scope.Departments = [];
    $scope.GetDepartments = function () {
        Restangular.all('department').getList({
            pageNo: 1,
            pageSize: 1000,
            //search: "Completed=0"/TODO MemberID
        }).then(function (result) {
            angular.copy(result, $scope.Departments);
        }, function (response) {
            return null;
        });
    };
    //$scope.GetDepartments();
    $scope.GetDepartment = function () {
        if ($rootScope.user.UserRole && $rootScope.user.UserRole.OrderSource && $rootScope.user.UserRole.OrderSource.Department) {
            return $rootScope.user.UserRole.OrderSource.Department;
        }
        else {
            $scope.GetDepartments();
            if (!$scope.Departments || $scope.Departments.length == 0) {
                //sweet lalr
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
                        toaster.pop('error', $translate.instant('orderfile.NoDepartment'), "error");
                    });
            }
        }
    };
    $scope.TakeOrder = function (personID, OrderType, PersonPhones) {
        if ($scope.isWaiting == true) {
            $scope.isWaiting = false;
        if (PersonPhones && PersonPhones.length < 1) {
            toaster.pop('warning', $translate.instant('personfile.PhoneNumberShouldNotBeBlank'), "error");
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
                order.OrderTypeID = OrderType==1?OrderType:($rootScope.OrderType ? $rootScope.OrderType : OrderType);
                // order.PaymentTypeID = 0;
                order.StoreID = $rootScope.user.StoreID;
                order.DepartmentID = $rootScope.user.UserRole.OrderSource.Department.id;
                Restangular.restangularizeElement('', order, 'order');
                order.post().then(function (resp) {
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                        location.href = '#/app/orders/orderStore/' + resp.id;
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + resp.id;
                    toaster.pop("success", $translate.instant('personfile.OrderCreated'));
                },
                function (resp) {
                    $scope.isWaiting = false;
                    toaster.pop('error', resp.data.ExceptionMessage, "error");
                });
            } else {
                //TODO Swet Alert
            }
        }
    }
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

    $scope.SearchAddressSelector = function (StreetAddressID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/streetaddress/SearchAddressSelector.html',
            controller: 'SearchAddressSelectorCtrl',
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


    $scope.SelcetStore = function (personID, OrderType) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/selectstore.html',
            controller: 'selectstoreCtrl',
            size: '',
            backdrop: '',
            resolve: {
            }
        });
        modalInstance.result.then(function (item) {
            var data = $scope.GetDepartment();
            if (data != null) {
                //$scope.SelcetStore(personID, OrderType);
                //OrderTypes: 1=Takeaway,2=HomeDelivery,0=Instore
                var order = {}
                var orderperson = { PersonID: personID }
                var pesons = [orderperson];
                order.persons = pesons; //.push(orderperson);
                order.OrderTypeID = $rootScope.OrderType ? $rootScope.OrderType : OrderType;
                order.StoreID = item;
                order.DepartmentID = $rootScope.user.UserRole.OrderSource.Department.id;
                Restangular.restangularizeElement('', order, 'order');
                order.post().then(function (resp) {
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                        location.href = '#/app/orders/orderStore/' + resp.id;
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + resp.id;
                    toaster.pop("success", $translate.instant('personfile.OrderCreated'));
                },
                function (resp) {
                    toaster.pop('error',  resp.data.ExceptionMessage, $translate.instant('personfile.CannotCreateNewOrder'));
                });
            } else {
                //TODO Swet Alert
            }
        })
    };
    $scope.GetSearchString = function () {
        if (vm.searchName && vm.searchName.length > 0) {
            $rootScope.searchName = vm.searchName;
        }
        var SearchFilter = (vm.searchName && vm.searchName.length > 0) ? "name like  '%" + vm.searchName + "%'" : "";
        if (vm.searchPhone && vm.searchPhone.length > 0) {
            SearchFilter = SearchFilter + ((SearchFilter.length > 0) ? " and " : "");
            SearchFilter = SearchFilter + "Number like '%" + vm.searchPhone + "%'"
        }
        var data = SearchFilter.substring(12);
        var leng = data.length - 2;
        $scope.SerchValue = data.substring(0, leng);
        return SearchFilter;
    };
    $scope.PhoneLenght = function (data) {
        if (vm.searchPhone && vm.searchPhone.length < 10) {
            toaster.pop('warning',  $translate.instant('personfile.PhoneNumberMustBe11Characters '), 'Warning !');
        } else {
            location.href = data;
        }
    };
    vm.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },
      {
          counts: [],
          getData: function ($defer, params) {
              if (vm.searchName == '' && vm.searchPhone == '') {
                  $defer.resolve(null);
                  return;
              }
              if (vm.searchPhone && vm.searchPhone.length && vm.searchPhone.length < 9) {
                  $scope.isPhoneLength(true);
                  $defer.resolve(null);
                  return;
              }
              Restangular.all('person').getList({
                  pageNo: params.page(),
                  pageSize: params.count(),
                  search: $scope.GetSearchString(),
                  sort: params.orderBy()
              }).then(function (items) {
                  params.total(items.paging.totalRecordCount);
                  $scope.SelectedItem = items.length > 0 ? items[0].id : null;
                  $defer.resolve(items);
                  $scope.UpdateNumbers(items);
                  $scope.isSearching(false);
                  $scope.isPhoneLength(false);
              }, function (response) {
                  toaster.pop('error', $translate.instant('Server.ServerError'), response);
                  SweetAlert.swal($translate.instant('Server.ServerError'), angular.toJson(response, false), "error");
              });
          }
      });
    $scope.UpdateNumbers = function (items) {
        for (var i = 0; i < items.length; i++) {
            items[i].FormatedPhones = $scope.ShowArray(items[i].PersonPhones, 'Number');
        }
    };
    $scope.isPhoneLength = function (value) {
        $scope.Text = value
    };
    $scope.isSearching = function (value) {
        $scope.isSearch = value;
    };
    $scope.isSearching(false);
    var emailresult = [];
    $scope.ShowArrayEmail = function (emails, prop) {
        var result = _.pluck(emails, prop);
        return result.toString();
    };
    $scope.ShowArray = function (number, prop) {
        var result = _.pluck(number, prop);
        var PhoneNumber = [];
        var formattedNumber;
        for (var i = 0; i < result.length; i++) {
            var phone = result[i];
            var area = phone.substring(0, 3);
            var front = phone.substring(3, 6);
            var end = phone.substring(6, 10);
            if (front) {
                formattedNumber = ("(" + area + ") " + front);
            }
            if (end) {
                formattedNumber += ("-" + end);
            }
            PhoneNumber.push(formattedNumber);
        }
        return PhoneNumber;
    };
    $scope.FormKeyPress = function (event) {
        if (event.keyCode === 13) {
            $scope.isSearching(true);
            vm.tableParams.reload();
        }
    };
    $scope.Addresses = function () {
        $location.href = '#/app/orders/person/edit/' + $scope.SelectedItem;
    };
    var unbindWatcher = $scope.$watch(angular.bind(vm, function () {
        return vm.searchName;
    }), function (value) {
        if (vm.searchName.length < 3) {
            $scope.$broadcast('PersonNull');
        }
        if (!vm.searchName && vm.searchName.length < 1) {
            $rootScope.searchName = '';
            vm.tableParams.reload();
        }
    });
    var unbindWatcher2 = $scope.$watch(angular.bind(vm, function () {
        return vm.searchPhone;
    }), function (value) {
        vm.tableParams.reload();
        if (value && value.length > 7) {
            $rootScope.searchPhone = value;
        }
        if (!vm.searchPhone && vm.searchPhone.length < 1) {
            $rootScope.searchPhone = null;
            $scope.$broadcast('PersonNull');
        }
    });
    //**********//********** // ********** // ********** // ********** // **********// NEW PERSON //**********//********** // ********** // ********** // ********** //
    $scope.newPerson = function (data) {
        var item = {};        
        if ($rootScope.searchName) {
            item.searchName = $rootScope.searchName;
        }
        if ($rootScope.searchPhone) {
            item.searchPhone = $rootScope.searchPhone;
        }
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/person/newperson.html',
            controller: 'newpersonCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            if (item && item != 'cancel') {
                vm.searchPhone = item.toString();
                vm.tableParams.reload();
            }
        });
};
//**********//********** // ********** // ********** // ********** // **********// NEW PERSON //**********//********** // ********** // ********** // ********** //


    //**********//********** // ********** // ********** // ********** // **********// NEW PERSON - GETIR //**********//********** // ********** // ********** // ********** //
    $scope.newPersonGetir = function (data) {
        var item = {};
        if ($rootScope.searchName) {
            item.searchName = $rootScope.searchName;
        }
        if ($rootScope.searchPhone) {
            item.searchPhone = $rootScope.searchPhone;
        }
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/person/newpersongetir.html',
            controller: 'newpersonGetirCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            if (item && item != 'cancel') {
                vm.searchPhone = item.toString();
                vm.tableParams.reload();
            }
        });
    };
//**********//********** // ********** // ********** // ********** // **********// NEW PERSON - GETIR //**********//********** // ********** // ********** // ********** //

//**********//********** // ********** // ********** // ********** // **********// NEW PERSON //**********//********** // ********** // ********** // ********** //


    //**********//********** // ********** // ********** // ********** // **********// NEW PERSON - MİGROS //**********//********** // ********** // ********** // ********** //
    $scope.newPersonMigros = function (data) {
        var item = {};
        if ($rootScope.searchName) {
            item.searchName = $rootScope.searchName;
        }
        if ($rootScope.searchPhone) {
            item.searchPhone = $rootScope.searchPhone;
        }
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/person/newpersonMigros.html',
            controller: 'newpersonMigrosCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            if (item && item != 'cancel') {
                vm.searchPhone = item.toString();
                vm.tableParams.reload();
            }
        });
    };
//**********//********** // ********** // ********** // ********** // **********// NEW PERSON - MİGROS //**********//********** // ********** // ********** // ********** //

$scope.$on('$destroy', function () {
    unbindWatcher();
    unbindWatcher2();
    deregistration2();
    deregistration1();
    deregistration();
    tranlatelistener();
    $element.remove();
    $rootScope.uService.ExitController("personlistCtrl");
});
};
app.controller('personlistaddresslistCtrl', personlistaddresslistCtrl);
function personlistaddresslistCtrl($scope, $log, $filter, SweetAlert, Restangular, $modal, ngTableParams, toaster, $window, $rootScope, $location, $translate, callsService, localStorageService, userService, $element, ngnotifyService) {
    $rootScope.uService.EnterController("personlistaddresslistCtrl");
    var plal = this;
    $scope.isWaiting = true;
    $scope.dbClick = function () {
        //$scope.isWaiting = false;
    };
    $scope.translate = function () {
        $scope.trOrderNo = $translate.instant('main.ORDERNO');
        $scope.trOrderNumber = $translate.instant('main.ORDERNUMBER');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trOrderSource = $translate.instant('main.ORDERSOURCE');
        $scope.trAddressType = $translate.instant('main.ADDRESSTYPE');
        $scope.trOrderType = $translate.instant('main.ORDERTYPE');
        $scope.trVAT = $translate.instant('main.VAT');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trOrderState = $translate.instant('main.ORDERSTATE');
        $scope.trOrderDate = $translate.instant('main.ORDERDATE');
        $scope.trStreetAddressName = $translate.instant('main.ADDRESS');
        $scope.trAddressNo = $translate.instant('main.ADDRESSNO');
        $scope.trEnterance = $translate.instant('main.ENTERANCE');
        $scope.trFloor = $translate.instant('main.FLOOR');
        $scope.trNote = $translate.instant('main.NOTE');
        $scope.trUserName = $translate.instant('main.USERNAME');
        $scope.trAppartmentNo = $translate.instant('main.APPARTMENTNO');
        $scope.trAppartmentName = $translate.instant('main.APPARTMENTNAME');
        $scope.trCompanyName = $translate.instant('main.COMPANYNAME');
        $scope.personinfo = $translate.instant('main.PERSONINFO');
        $scope.namesurname = $translate.instant('main.NAMESURNAME');
        $scope.gender = $translate.instant('main.GENDER');
        $scope.AvailableBonus = $translate.instant('main.AVAILABLEBONUS');
        $scope.marketingquestion = $translate.instant('main.MARKETINGQUESTION');
        $scope.email = $translate.instant('main.EMAIL');
        $scope.phone = $translate.instant('main.PHONE');
        $scope.personedit = $translate.instant('main.PERSONEDIT');
        $scope.hiddencustomernote = $translate.instant('main.HIDDENCUSTOMERNOTE');
        $scope.complaint = $translate.instant('main.COMPLAINT');
        $scope.addressinfo = $translate.instant('main.ADDRESSINFO');
        $scope.addnew = $translate.instant('main.ADDNEW');
        $scope.pleasewait = $translate.instant('main.PLEASEWAIT');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.previousorders = $translate.instant('main.PREVIOUSORDERS');
        $scope.surveyperson = $translate.instant('main.SURVEYPERSON');
        $scope.orderdetails = $translate.instant('main.ORDERDETAILS');
        $scope.trLandmark = $translate.instant('main.LANDMARK');
        $scope.customerspecialnotes = $translate.instant('main.CUSTOMERSPECIALNOTES');

    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.Departments = [];
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
                //sweet lalr
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
                        toaster.pop('error', $translate.instant('orderfile.NoDepartment'), "error");
                    });
            }
        }
    };
    $scope.ComplaintPerson = function () {
        $location.path('app/complaints/complaints/edit/new');
    };
    $scope.GoPersonEdit = function () {
        if ($rootScope.PersonID) {
            location.href = '#/app/orders/person/edit/' + $rootScope.PersonID;
        }
    };
    $scope.GoGetirPersonEdit = function () {
        if ($rootScope.PersonID) {
            location.href = '#/app/orders/getirpersonpage/edit/' + $rootScope.PersonID;
        }
    };
    $scope.GoMigrosPersonEdit = function () {
        if ($rootScope.PersonID) {
            location.href = '#/app/orders/migrospersonpage/edit/' + $rootScope.PersonID;
        }
    };
    $scope.CheckOrderStore = function (item, OrderTyprID) {
        if ($scope.isWaiting == true) {
            $scope.isWaiting = false;
        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CCSIKAYET")) {
            $scope.HomeOrder(item, OrderTyprID);
        } else {
            Restangular.all('ordertools/checkorderstore').post(
                    {
                        AddressID: item.Address.id,
                        DeliveryDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                    }
                ).then(function (result) {
                    if (result.length < 1) {
                        toaster.pop('warning',  $translate.instant('personfile.THISADDRESSNOTTHERESTAURANTADDRESSES '));
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].id == $rootScope.user.StoreID) {
                                return $scope.HomeOrder(item, OrderTyprID);
                                break;
                            } else {
                                toaster.pop('warning', $translate.instant('personfile.THISADDRESSNOTTHERESTAURANTADDRESSES '));
                            }
                        }
                    }

                }, function (response) {
                    $scope.isWaiting = false;
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
        }
    }
    };
    $scope.HomeOrder = function (person, OrderType) {
        if ($scope.CheckPersonPhone == false) {
            toaster.pop('warning', $translate.instant('personfile.PhoneNumberShouldNotBeBlank'), "error");
            return;
        }
        var data = $scope.GetDepartment();
        if (data != null) {
            var order = {}
            var orderperson = { PersonID: person.PersonID };
            var pesons = [orderperson];
            order.persons = pesons; //.push(orderperson);
            order.OrderTypeID = $rootScope.OrderType ? $rootScope.OrderType : OrderType;
            order.AddressID = person.AddressID;
            order.StoreID = $rootScope.user.StoreID;
            order.DepartmentID = $rootScope.user.UserRole.OrderSource.Department.id;
            Restangular.restangularizeElement('', order, 'order');
            order.post().then(function (resp) {
                if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                    location.href = '#/app/orders/orderStore/' + resp.id;
                if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                    location.href = '#/app/orders/order/' + resp.id;
                toaster.pop("success", $translate.instant('personfile.OrderCreated'));
            },
            function (resp) {
                toaster.pop('error', resp.data.ExceptionMessage, "error");
            });
        } else {
            //TODO Swet Alert
        }
    };

    $scope.CheckMigrosOrderStore = function (item, OrderTypeID) {
        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CCSIKAYET")) {
            $scope.HomeMigrosOrder(item, OrderTypeID);
        } else {
            Restangular.all('ordertools/checkorderstore').post(
                {
                    AddressID: item.Address.id,
                    DeliveryDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                    OrderSourceID: '300224877062',
                }
            ).then(function (result) {
                if (result.length < 1) {
                    toaster.pop('warning', "BU ADRES RESTORAN ADRESLERİ İÇERİSİNDE DEĞİLDİR !");
                }
                else {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].id == $rootScope.user.StoreID) {
                            return $scope.HomeMigrosOrder(item, OrderTypeID);
                            break;
                        } else {
                            toaster.pop('warning', "BU ADRES RESTORAN ADRESLERİ İÇERİSİNDE DEĞİLDİR !");
                        }
                    }
                }

            }, function (response) {
                toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
            });
        }
    };
    $scope.HomeMigrosOrder = function (person, OrderType) {
        if ($scope.CheckPersonPhone == false) {
            toaster.pop('warning', "Telefon Numarası Boş Geçilemez !", "error");
            return;
        }
        var data = $scope.GetDepartment();
        if (data != null) {
            var order = {}
            var orderperson = { PersonID: person.PersonID };
            var pesons = [orderperson];
            order.persons = pesons;
            order.OrderTypeID = OrderType;
            order.AddressID = person.AddressID;
            order.StoreID = $rootScope.user.StoreID;
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
    };

    $scope.PersonAddresses = [];
    $scope.GetPersonAddressList = function (PersonID) {
        if (PersonID) {
            $scope.PersonAddresses = [];
            Restangular.all('person_deliveryaddress').getList({
                pageNo: 1,
                pageSize: 20,
                search: "PersonID='" + PersonID + "'"
            }).then(function (result) {
                if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER") && !userService.userIsInRole("Alonet") && !userService.userIsInRole("CCSIKAYET")) {
                     for (var i = 0; i < result.length; i++) {                         
                         if (result[i].Store && result[i].Store.id == $rootScope.user.Store.id)
                            $scope.PersonAddresses.push(result[i])
                     }
                     for (var i = 0; i < result.length; i++) {
                         if (!result[i].Store || result[i].Store.id != $rootScope.user.Store.id)
                             $scope.PersonAddresses.push(result[i])
                     }
                } else {
                    $scope.PersonAddresses = angular.copy(result);
                }
                $scope.isWait(false);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        } else {
            $scope.PersonAddresses = null;
        }
    };
    
    $scope.PersonOrders = [];
    $scope.GetPersonOrders = function (PersonID) {
        if (PersonID) {
            $scope.isPersonOrderButton(true);
            Restangular.all('order').getList({
                pageNo: 1,
                pageSize: 7,
                sort: "-OrderDate",
                search: "OrderPersons.PersonID='" + PersonID + "'"
            }).then(function (result) {
                $scope.PersonOrders = angular.copy(result);
                $scope.isPersonOrderButton(false);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        } else {
            $scope.PersonOrders = null;
        }
    };
    var deregistration = $scope.$on('PersonNull', function (event) {
        $scope.GetPersonAddressList();
        $scope.GetPersonOrders();
        $scope.GetPerson();
        $scope.ShowMarketinPermission = false;
    });
    var deregistration1 = $scope.$on('GetPersonDetails', function (event, PersonID) {
        $scope.isWait(true);
        $scope.isPersonOrderButton(true);
        $scope.ShowPersonButon = true;
        $rootScope.PersonID = PersonID;
        $scope.GetPersonOrders(PersonID);
        $scope.GetPersonAddressList(PersonID);
        $scope.GetPerson(PersonID);
        $scope.GetMarketingPermission(PersonID);
    });
    var deregistration2 = $scope.$on('GetLoyalty', function (event, Loyalty) {
        $scope.isWait(true);
        $scope.isPersonOrderButton(true);
        $scope.ShowPersonButon = true;
        $rootScope.Loyalty = Loyalty;
        $scope.GetPerson(Loyalty);
       
    });
    $scope.TestMarketingArray = true;
    $scope.ChangeTestMarketingArray = function (value) {
        $scope.TestMarketingArray = value;
    };
    $scope.CheckPersonPhones = function (value) {
        $scope.CheckPersonPhone = value;
    };
    $scope.GetMarketingPermission = function (PersonID) {
        Restangular.all('MarketingPermission').getList({
            pageNo: 1,
            pageSize: 10,
            search: "PersonID='" + PersonID + "'"
        }).then(function (result) {
            $scope.ShowMarketinPermission = true;
            $scope.MPSMS = {};
            $scope.MPEMAIL = {};
            $scope.MPKVKK = {};
            for (var i = 0; i < result.length; i++) {
                if (result[i].MarketingPermissionType == 0)
                    $scope.MPSMS = result[i];
                if (result[i].MarketingPermissionType == 1)
                    $scope.MPEMAIL = result[i];
                if (result[i].MarketingPermissionType == 2)
                    $scope.MPKVKK = result[i];
            }
        });
    };
    $scope.SaveMarketingPermission = function (Data, Type, Value) {
        var data = Data;
        data.MarketingPermissionType = Type;
        data.Approved = Value;
        Restangular.restangularizeElement('', data, 'MarketingPermission');
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                toaster.pop('success',$translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            data.PersonID = $scope.Person.id;
            data.post().then(function (resp) {
                toaster.pop('success', $translate.instant('orderfile.Saved'),$translate.instant('orderfile.Saved'));
            });
        }
    };
    $scope.StoreSurveyPerson = function () {
        var item = $rootScope.PersonID;
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/person/surveypopup.html',
            controller: 'surveypopupCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                }
            }
        });
    };
    $scope.Person = [];
    $scope.Bonus={};
    $scope.Person.Loyalty =[];
    $scope.GetPerson = function (PersonID) {
        if (PersonID) {
            Restangular.one('person', PersonID).get()
               .then(function (restresult) {
                   $scope.Person = restresult;
                   $scope.Bonus=(restresult.Loyalty)?restresult.Loyalty.Bonus:{};
                   $scope.Person.Loyalty = restresult.plain(); 
                   if (restresult.PersonPhones && restresult.PersonPhones.length == 0) {
                       $scope.CheckPersonPhones(false);
                   } else {
                       $scope.CheckPersonPhones(true);
                   }
               },
               function (restresult) {
                   toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
               })
        } else {
            $scope.Person = null;
        }
    };
    $scope.migrosOrder = function (OrderSourceID) {
        var data = $scope.GetDepartment();
        if (data != null) {
            var order = {
                persons: [],
                OrderTypeID: 2,
                StoreID: $rootScope.user.StoreID,
                OrderSourceID: '300224877062'
            }
            Restangular.restangularizeElement('', order, 'order');
            order.post().then(function (resp) {
                location.href = '#/app/orders/orderStoreTable/' + resp.id;
            },
                function (resp) {
                    toaster.pop('error', resp.data.ExceptionMessage, "Yeni Sipariş Oluşturulamadı !");
                });
        } else {
        }
    };
    $scope.isWait = function (value) {
        $scope.wait = value;
    };
    $scope.isPersonOrderButton = function (value) {
        $scope.ShowPersonOrderButton = value;
    };
    $scope.AdAddressPerson = function (id) {
        location.href = '#/app/orders/person/personaddressedit/new';
    };
    $scope.ComplaintOrder = function (item) {
        $location.path('app/complaints/complaints/edit/new');
        $rootScope.Order = item;
    };
    $scope.AdAddressPersonMigros = function (id) {
        location.href = '#/app/orders/person/migrospersonaddressedit/new';
    };
    $scope.OrderDetails = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/person/personorderitems.html',
            controller: 'personorderitemsCtrl',
            size: '',
            backdrop: '',
            resolve: {
                Order: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
        })
    };
    $scope.$on('$destroy', function () {
        tranlatelistener();
        deregistration();
        deregistration1();
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("personlistaddresslistCtrl");
    });
};
app.controller('personorderitemsCtrl', personorderitemsCtrl);
function personorderitemsCtrl($rootScope, $scope, $modalInstance, Order, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $translate, $window) {
    $rootScope.uService.EnterController("personorderitemsCtrl");
    $scope.OrderNumber = Order.id;
    $scope.item = [];
    $scope.item = Order;
    $scope.repeatOrder = function () {
        $scope.isSpinner = true;
        Restangular.one('ordertools/repeatorder').get({
            OrderID: Order.id,
            AddressID:'',
        }).then(function (result) {
            if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                location.href = '#/app/orders/orderStore/' + result.id;
            if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                location.href = '#/app/orders/order/' + result.id;
            $scope.ok();
            toaster.pop("success", $translate.instant('personfile.OrderCreated'));
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "Error!", response.data.ExceptionMessage);
            $scope.isSpinner = false;
        });
    };
    $scope.ok = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("personorderitemsCtrl");
    });
};

