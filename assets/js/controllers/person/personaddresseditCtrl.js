'use strict';
app.controller('personaddresseditCtrl', personaddresseditCtrl);
function personaddresseditCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $translate, $window, $rootScope, $stateParams, $location, userService, $element, ngnotifyService) {
    $("#search").focus();
    $rootScope.uService.EnterController("personaddresseditCtrl");
    var pae = this;
    userService.userAuthorizated();
    $scope.PersonDeliveryID = $stateParams.id;
    $scope.item = {};
    $scope.StreetAddress = {};
    $scope.FormatedAddress = {};
    $scope.item.AddressID = null;
    $scope.Address = {};
    $scope.BottonDblcilik = function () { };
    if ($stateParams.id != 'new') {
        Restangular.one('person_deliveryaddress', $stateParams.id).get()
            .then(function (restresult) {
                angular.copy(restresult.PersonID, $scope.item['PersonID']);
                $scope.PersonID = angular.copy(restresult.PersonID);
                angular.copy(restresult.plain(), $scope.original);
                angular.copy(restresult.plain(), $scope.item);
                Restangular.one('address_streetaddress', restresult.AddressID).get()
                    .then(function (rresult) {
                        angular.copy(rresult.plain(), $scope.Address);
                        angular.copy(rresult.plain(), $scope.StreetAddress);
                        $scope.FormatedAddress = angular.copy($scope.DisplayStreetAddress());
                    }, function (rresult) { toaster.pop('error', "Error", rresult.data.ExceptionMessage); });
            },
           function (restresult) {
               toaster.pop('error', "Error", $translate.instant('Server.ServerError'));
               swal("Error!",$translate.instant('Server.DataError'), "Warning");
           }
           );
    } else {
        $scope.PersonID = $rootScope.PersonID;
        $scope.item.isActive = true;
        $scope.Address.AddressTypeID = 0;
        $scope.FormatedAddress = '';
    }
    $scope.DisplayStreetAddress = function () {
        return $scope.StreetAddress ? $scope.StreetAddress.StreetAddress : '';
    };

    $scope.isActives = [
        {
            name : 'Active',
            Value : true
        },
        {
            name : 'Passive',
            Value : false
        }
    ];
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.CheckPersonPhones = function (value) {
        $scope.CheckPersonPhone = value;
    };
    $scope.Person = [];
    $scope.GetPerson = function () {
        Restangular.one('person', $scope.PersonID).get()
      .then(function (restresult) {
          angular.copy(restresult.plain(), $scope.Person);
          if (restresult.PersonPhones && restresult.PersonPhones.length == 0) {
              $scope.CheckPersonPhones(false);
          } else {
              $scope.CheckPersonPhones(true);
          }
      },
      function (restresult) {
          toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
      })
    };
    $scope.GetPerson();
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
    $scope.HomeOrder = function (person, OrderType) {
        if ($scope.CheckPersonPhone == false) {
            toaster.pop('warning', $translate.instant('personfile.PhoneNumberShouldNotBeBlank'), "error");
            return;
        }
        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER")|| userService.userIsInRole("CCBACKOFFICE")|| userService.userIsInRole("CCSIKAYET")) {
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
                                  return;                                  
                              } else {
                                  //TODO Swet Alert
                              }
                          } else {
                              toaster.pop('warning', $translate.instant('personfile.Youcannotenterorderheaddress'));
                          }
                      }
                  }, function (response) {
                      toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                  });
        }
    };
    $scope.GetAddressType = function (data) {
        Restangular.one('enums/addresstype', '').get().then
       (function (restresult) {
           for (var i = 0; i < restresult.length; i++) {
               if (restresult[i].EnumValue == data.AddressTypeID) {
                   angular.copy(restresult[i].Name, $scope.AddressTypeName);
                   break;
               }
           }
       },
      function (restresult) {
          toaster.pop('warning', $translate.instant('orderfile.Cancelled'));
      }
      )
    };
    $scope.SaveDeliveryAddress = function (AID, data, path) {
        $scope.item.PersonID = $scope.PersonID;
        delete $scope.item.Person;
        $scope.item.AddressID = AID;
        $scope.item.notes = $scope.Address.Notes;
        delete $scope.item.Address;
        Restangular.restangularizeElement('', $scope.item, 'person_deliveryaddress');
        if ($scope.item.restangularized && $scope.item.id) {
            $scope.item.put().then(function (resp) {
                toaster.pop('success', $translate.instant('orderfile.Updated'),  $translate.instant('orderfile.Updated'));
                if (path == 'Order' && resp.id) {
                    $scope.HomeOrder(data, 2)
                }
            });
        }
        else {
            $scope.item.post().then(function (resp) {
                $scope.item.id = resp.id;
                toaster.pop('success', $translate.instant('orderfile.Saved'),  $translate.instant('orderfile.Saved'));
                if (path == 'Order' && resp.id) {
                    $scope.HomeOrder(data, 2)
                }
            });
        }
    };
    $scope.SaveData = function (data, path) {
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.loadEntitiesPaging = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                angular.copy(result.plain(), $scope[Container]);
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.addresstypes = [];
    $scope.loadEntities('enums/addresstype', 'addresstypes');
    $scope.addresssources = [];
    $scope.loadEntities('enums/datasource', 'addresssources');
    $scope.saveItem = function (data) {
        _update(data, this.item);
        $scope.saveData(this.item);
        return this.item;
    }
    function _update(srcObj, destObj) {
        for (var key in srcObj) {
            if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
            if (!destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
                destObj[key] = (srcObj[key] != undefined) ? srcObj[key] : '';
            }
        }
    }
    $scope.cancelremove = function (index) {
        if (pae.tableParams.data[index].fromServer) {
            pae.tableParams.data[index].remove();
        }
        pae.tableParams.data.splice(index, 1);
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
    $scope.$on('$destroy', function () {
        $scope.Person = [];
        $scope.Departments = [];
        $scope.addresstypes = [];
        $scope.addresssources = [];
        $element.remove();
        $rootScope.uService.ExitController("personaddresseditCtrl");
    });
};
