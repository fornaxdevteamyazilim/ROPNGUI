'use strict';
app.controller('personeditCtrl', personeditCtrl);
function personeditCtrl($scope, $log, $filter, SweetAlert, Restangular, $modal, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, userService, $element, ngnotifyService) {
    $rootScope.uService.EnterController("personeditCtrl");
    var pe = this;
    userService.userAuthorizated();
    $scope.item = {};
    $scope.original = {};
    $scope.MerketingData = {};
    $scope.MPSMS = {};
    $scope.MPEMAIL = {};
    if ($stateParams.id == "new") {
        $scope.ShowButton = false;
        $rootScope.PersonID = "new";
        $scope.item.GenderTypeID = "2";
    } else {
        $rootScope.PersonID = $stateParams.id;
        $scope.ShowButton = true;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.translate = function () {
        $scope.trOrderNo = $translate.instant('main.ORDERNO');
        $scope.trOrderNumber = $translate.instant('main.ORDERNUMBER');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trVAT = $translate.instant('main.VAT');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trStreetAddressName = $translate.instant('main.ADDRESS');
        $scope.trAddressNo = $translate.instant('main.ADDRESSNO');
        $scope.trEnterance = $translate.instant('main.ENTERANCE');
        $scope.trFloor = $translate.instant('main.FLOOR');
        $scope.trApertmentName = $translate.instant('main.APERTMENTNAME');
        $scope.trAddressDefinition = $translate.instant('main.ADDRESSDEFINITION');
        $scope.trCommands = $translate.instant('main.COMMANDS');
        $scope.trOrderDate = $translate.instant('main.ORDERDATE');
        $scope.back = $translate.instant('main.BACK');
        $scope.phone = $translate.instant('main.PHONE');
        $scope.namesurname = $translate.instant('main.NAMESURNAME');
        $scope.gender = $translate.instant('main.GENDER');
        $scope.takeaway = $translate.instant('main.TAKEAWAY');
        $scope.hiddencustomernote = $translate.instant('main.HIDDENCUSTOMERNOTE');
        $scope.save = $translate.instant('main.SAVE');
        $scope.customerspecialnotestitle = $translate.instant('main.CUSTOMERSPECIALNOTESTITLE');
        $scope.customerspecialnotes = $translate.instant('main.CUSTOMERSPECIALNOTES');
        $scope.marketingquestion = $translate.instant('main.MARKETINGQUESTION');
        $scope.complaint = $translate.instant('main.COMPLAINT');
        $scope.address = $translate.instant('main.ADDRESS');
        $scope.addnew = $translate.instant('main.ADDNEW');
        $scope.homedelivery = $translate.instant('main.HOMEDELIVERY');
        $scope.edit = $translate.instant('main.EDIT');
        $scope.add = $translate.instant('main.ADD');
        $scope.trCompanyTitle = $translate.instant('main.COMPANYTITLE');

    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.OrderDetails = function (item) {
        $location.path('app/orders/orderDetail/' + item.id);
    };
    $scope.Departments = [];
    $scope.GetDepartments = function () {
        Restangular.all('department').getList({
            pageNo: 1,
            pageSize: 1000,
        }).then(function (result) {
            angular.copy(result,$scope.Departments);
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
    $scope.ComplaintPerson = function () {
        $location.path('app/complaints/complaints/edit/new');
    };
    $scope.CheckOrderStore = function (item, OrderTyprID) {
        if (userService.userIsInRole("CALLCENTER")|| userService.userIsInRole("CCSIKAYET") )  {
            $scope.HomeOrder(item, OrderTyprID);
        } else {
            Restangular.all('ordertools/checkorderstore').post(
                    {
                        AddressID: item.Address.id,
                        DeliveryDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                    }
                ).then(function (result) {
                    if (result == Array[0]) {
                        toaster.pop('warning', $translate.instant('personfile.Youcannotenterorderheaddress'));
                    }
                    else {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].id == $rootScope.user.StoreID) {
                                return $scope.HomeOrder(item, OrderTyprID);
                                break;
                            } else {
                                toaster.pop('warning', $translate.instant('personfile.Youcannotenterorderheaddress'));
                            }
                        }
                    }

                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
        }
    };
    $scope.HomeOrder = function (person, OrderType) {
        var data = $scope.GetDepartment();
        if (data != null) {
            var order = {}
            var orderperson = { PersonID: person.PersonID };
            var pesons = [orderperson];
            order.persons = pesons
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
                toaster.pop("success",$translate.instant('personfile.OrderCreated'));
            },
            function (resp) {
                toaster.pop('error', response.data.ExceptionMessage, "error");
            });
        } else {
            //TODO Swet Alert
        }
    };
    $scope.TakeOrder = function (personID, OrderType) {
        if (userService.userIsInRole("CALLCENTER")) {
            $scope.SelcetStore(personID, OrderType);
        } else {
            var data = $scope.GetDepartment();
            if (data != null) {
                var order = {}
                var orderperson = { PersonID: personID }
                var pesons = [orderperson];
                order.persons = pesons; 
                order.OrderTypeID = $rootScope.OrderType ? $rootScope.OrderType : OrderType;
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
                    toaster.pop('error',$translate.instant('personfile.CouldCreateNewOrder'), "error");
                });
            } else {
                //TODO Swet Alert
            }
        }
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
                var order = {}
                var orderperson = { PersonID: personID }
                var pesons = [orderperson];
                order.persons = pesons; 
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
                    toaster.pop('error', response.data.ExceptionMessage, "error");
                });
            } else {
                //TODO Swet Alert
            }
        })
    };
    if ($stateParams.id != 'new') {
        Restangular.one('person', $stateParams.id).get()
           .then(function (restresult) {
               $scope.original = restresult;
               $scope.item = Restangular.copy(restresult);
               $rootScope.PersonID = restresult.id;
           },
           function (restresult) {
               toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
           })
    } else {
        $scope.item.name = $rootScope.searchName;
        $scope.item.PersonPhone = parseInt($rootScope.searchPhone);
    }
    $scope.ChangeGenderType = function (GenderTypeID) {
        $scope.item.GenderTypeID = GenderTypeID;
    };
    $scope.saveData = function (data) {
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                toaster.pop("success", $translate.instant('personfile.DataUpdated '),$translate.instant('orderfile.Updated'));
                $rootScope.PersonID = resp.id;
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'person')
            if (data.GenderTypeID != "1" && data.GenderTypeID != "0" && data.GenderTypeID != "2") {
                toaster.pop('warning',  $translate.instant('personfile.SelectGender '));
            } else if (!data.PersonPhone) {
                toaster.pop('warning',  $translate.instant('personfile.EnterPhoneNumber '));
            } else {
                data.post().then(function (resp) {
                    $scope.ShowButton = true;
                    $scope.item.id = resp.id;
                    $rootScope.PersonID = resp.id;
                    toaster.pop("success", $translate.instant('personfile.DataSaved'), $translate.instant('orderfile.Saved'));
                    var phone = ({ PersonID: resp.id, Number: data.PersonPhone })
                    $scope.SavePhoneNumber(phone);
                });
            }
        }
    };
    $scope.SavePhoneNumber = function (data) {
        Restangular.restangularizeElement('', data, 'personphone')
        data.post().then(function (resp) {
        });
    };
    $scope.AdAddressPerson = function (id) {
        location.href = '#/app/orders/person/personaddressedit/new';
    };
    if ($rootScope.PersonID) {
     pe.ordertableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
            OrderDate: 'descending'
        }
    },
  {
      counts: [],
      getData: function ($defer, params) {
          if ($rootScope.PersonID != 'new')
              Restangular.all('order').getList({
                  pageNo: params.page(),
                  pageSize: params.count(),
                  sort: params.orderBy(),
                  search: ($rootScope.PersonID) ? "OrderPersons.PersonID='" + $rootScope.PersonID + "'" : ""
              }).then(function (items) {
                  params.total(items.paging.totalRecordCount);
                  $defer.resolve(items);
              }, function (response) {
                  toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
              });
      }
  });
    }   
    $scope.DetailOrder = function (item) {
        if (item.id) {
            $location.path('app/orders/orderDetail/' + item.id);
        }
        else {
            toaster.pop('error', $translate.instant('personfile.YouCannotSeeTheDetailOfTheOrderInItsNewStatus'), "error");
        }
    }
    $scope.ComplaintOrder = function (item) {
        $location.path('app/complaints/complaints/edit/new');
        $rootScope.Order = item;

    };
    var tp = {
        page: 1,
        count: 10
    };
    pe.addresstableParams = new ngTableParams(tp,
    {
        counts: [],
        getData: function ($defer, params) {
            if ($stateParams.id != 'new') {
                Restangular.all('person_deliveryaddress').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: "PersonID='" + $rootScope.PersonID + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $scope.SelectedItem = (items[0]) ? items[0].id : null;
                    $scope.itemscount = items.length;
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        }
    });
    $scope.removeItem = function (index) {
        pe.orderitemtableParams.data[index].remove();
        toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
        pe.orderitemtableParams.data.splice(index, 1);

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
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.addresstypes = [];
    $scope.loadEntities('enums/addresstype', 'addresstypes');
    $scope.gendertypes = [];
    $scope.loadEntities('enums/gendertype', 'gendertypes');
    $scope.GetMarketingPermission = function (PersonID) {
        Restangular.all('MarketingPermission').getList({
            pageNo: 1,
            pageSize: 10,
            search: "PersonID='" + PersonID + "'"
        }).then(function (result) {
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
    if ($stateParams.id != "new") {
        $scope.GetMarketingPermission($stateParams.id);
    }
    $scope.SaveMarketingPermission = function (Data, Type, Value) {
        if (Type == 0) {
            $scope.MPSMS.MarketingPermissionType = Type;
            $scope.MPSMS.Approved = Value;
            angular.copy($scope.MPSMS, $scope.MerketingData);
            $scope.SaveMarketingData($rootScope.PersonID)
        }
        if (Type == 1) {
            $scope.MPEMAIL.MarketingPermissionType = Type;
            $scope.MPEMAIL.Approved = Value
            angular.copy($scope.MPEMAIL, $scope.MerketingData);
            $scope.SaveMarketingData($rootScope.PersonID)
        }
        if (Type == 2) {
            $scope.MPKVKK.MarketingPermissionType = Type;
            $scope.MPKVKK.Approved = Value
            angular.copy($scope.MPKVKK, $scope.MerketingData);
            $scope.SaveMarketingData($rootScope.PersonID)
        }
    };
    $scope.SaveMarketingData=function (PersonID) {
        if ($scope.MerketingData && ($scope.MerketingData.MarketingPermissionType == 0 || $scope.MerketingData.MarketingPermissionType == 1) && ($scope.MerketingData.Approved ==true || $scope.MerketingData.Approved == false)) {
        Restangular.restangularizeElement('', $scope.MerketingData, 'MarketingPermission');
        if ($scope.MerketingData.restangularized && $scope.MerketingData.id) {
            $scope.MerketingData.put().then(function (resp) {
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
            });
        }
        else {
            $scope.MerketingData.PersonID = PersonID;
            $scope.MerketingData.post().then(function (resp) {
                toaster.pop('success', $translate.instant('orderfile.Saved'),$translate.instant('orderfile.Saved'));
            });
        }
    }
    };
    $scope.$on('$destroy', function () {
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("personeditCtrl");
    });    
};
app.controller('personphoneCtrl', personphoneCtrl);
function personphoneCtrl($scope, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $element) {
    $rootScope.uService.EnterController("personphoneCtrl");
    var pp = this;
    $scope.item = {};
    tranlatelistener1 = $scope.$on('AddPhoneNumber', function (event, data) {
        $scope.saveData(data);
    });
    $scope.saveData = function (data, index) {
        if (!this.item.Number) {
            toaster.pop('warning', $translate.instant('orderfile.Attention'),  $translate.instant('personfile.EnterPhoneNumber '));
            $scope.cancelremove(index);
        } else {
            if (this.item.restangularized) {
                this.item.put().then(function (res) {
                    pp.tableParams.reload();
                    toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('personfile.DataUpdated '));
                });
            }
            else {
                Restangular.restangularizeElement('', this.item, 'personphone')
                this.item.post().then(function (res) {
                    pp.tableParams.reload();
                    toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('personfile.DataSaved'));
                });
                this.item.get();
            }
        }
    }
    $scope.translate = function () {
        $scope.trNumber = $translate.instant('main.NUMBER');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
        $scope.translate();

    var tranlatelistener1 = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
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
        if (!pp.tableParams.data[pp.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pp.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Addcanceled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled'));
        }
    };
    pp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
                $scope.PersonID = 0;
            }
            Restangular.all('personphone').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "PersonID='" + $scope.PersonID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:    $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:   $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pp.tableParams.data[index].fromServer) {
                    pp.tableParams.data[index].remove();
                }
                pp.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pp.tableParams.data[index].fromServer) {
            pp.tableParams.data[index].remove();
        }
        pp.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pp.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    var unbindWatcher = $scope.$watch(angular.bind(pp, function () {
        return $rootScope.PersonID;
    }), function (value) {
        pp.tableParams.reload();
    });
    $scope.$on('$destroy', function() {
        unbindWatcher();
        //tranlatelistener();
        tranlatelistener1();
        $element.remove();
        $rootScope.uService.ExitController("personphoneCtrl");
    });
};
app.controller('personemailCtrl', personemailCtrl);
function personemailCtrl($scope, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element, $stateParams) {
    $rootScope.uService.EnterController("personemailCtrl");
    var pel = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pel.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Updated'), $translate.instant('personfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'personemail')
            this.item.post().then(function (res) {
                pel.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('personfile.DataSaved'));
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trEmail = $translate.instant('main.EMAILS');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
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
        if (!pel.tableParams.data[pel.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pel.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Editcancelled') );
        }
    };
    pel.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
                $scope.PersonID = 0;
            }
            Restangular.all('personemail').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "PersonID='" + $scope.PersonID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pel.tableParams.data[index].fromServer) {
                    pel.tableParams.data[index].remove();
                }
                pel.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pel.tableParams.data[index].fromServer) {
            pel.tableParams.data[index].remove();
        }
        pel.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pel.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    var unbindWatcher = $scope.$watch(angular.bind(pel, function () {
        return $rootScope.PersonID;
    }), function (value) {
        pel.tableParams.reload();
    });
    $scope.$on('$destroy', function() {
        unbindWatcher();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("personemailCtrl");
    });
};
app.controller('personaccountCtrl', personaccountCtrl);
function personaccountCtrl($scope, $modal, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element, $stateParams) {
    $rootScope.uService.EnterController("personaccountCtrl");
    var pa = this;
    $scope.PersonAccount = [];
    $scope.GetPersonAccount = function () {
        if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
            $scope.PersonID = 0;
        }
        Restangular.all('personaccount').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "PersonID='" + $scope.PersonID + "'"
        }).then(function (result) {
            $scope.PersonAccount = result;
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    };
    $scope.GetPersonAccount();
    $scope.saveData = function (data) {
        data.PersonID = $rootScope.PersonID;
        if (data.restangularized && data.id) {
            data.put().then(function (res) {
                toaster.pop('success', $translate.instant('orderfile.Updated') , $translate.instant('personfile.Updated'));
            });
        }
        else {
            Restangular.restangularizeElement('', data, 'personaccount')
            data.post().then(function (res) {
                toaster.pop('success', $translate.instant('orderfile.Saved') , $translate.instant('personfile.DataSaved'));
            });
        }
    };
    $scope.translate = function () {
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.accountlimittypes = [];
    $scope.loadEntities('enums/accountlimittype', 'accountlimittypes');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
             confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pa.tableParams.data[index].fromServer) {
                    pa.tableParams.data[index].remove();
                }
                psd.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.addItem = function () {
        pa.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    $scope.$on('$destroy', function () {
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("personaccountCtrl");
    });
};
app.controller('PersonSpecialDatesCtrl', PersonSpecialDatesCtrl);
function PersonSpecialDatesCtrl($scope, $modal, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element, ngnotifyService, $stateParams) {
    $rootScope.uService.EnterController("PersonSpecialDatesCtrl");
    var psd = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                psd.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('personfile.DataUpdated '));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'personspecialdate')
            this.item.post().then(function (res) {
                psd.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Saved'),$translate.instant('personfile.DataSaved'));
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trSpecialDate = $translate.instant('main.SPECIALDATES');
        $scope.trSpecialDateType = $translate.instant('main.SPECIALDATETYPE');
        $scope.trSpecialDateNote = $translate.instant('main.NOTE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
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
        if (!psd.tableParams.data[psd.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(psd.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled'));
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        }
    };
    psd.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
                $scope.PersonID = 0;
            }
            Restangular.all('personspecialdate').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "PersonID='" + $scope.PersonID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
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
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.specialdatetypes = [];
    $scope.loadEntities('enums/specialdatetype', 'specialdatetypes');
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
             confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (psd.tableParams.data[index].fromServer) {
                    psd.tableParams.data[index].remove();
                }
                psd.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (psd.tableParams.data[index].fromServer) {
            psd.tableParams.data[index].remove();
        }
        psd.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        psd.tableParams.data.push({ PersonID: $rootScope.PersonID, SpecialDate: ngnotifyService.ServerTime() });
    };
    var unbindWatcher = $scope.$watch(angular.bind(psd, function () {
        return $rootScope.PersonID;
    }), function (value) {
        psd.tableParams.reload();
    });
    $scope.datepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/dateSpecialDay.html',
            controller: 'dateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item.SpecialDate;
                }
            }
        });
        modalInstance.result.then(function (result) {
            item.SpecialDate = result;
        })
    };
    $scope.$on('$destroy', function () {
        unbindWatcher();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("PersonSpecialDatesCtrl");
    });
};
app.controller('PersonInvoiceInfoCtrl', PersonInvoiceInfoCtrl);
function PersonInvoiceInfoCtrl($scope, $modal, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element, $stateParams) {
    $rootScope.uService.EnterController("PersonInvoiceInfoCtrl");
    var pii = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pii.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('personfile.DataUpdated '));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'PersonInvoiceInfo')
            this.item.post().then(function (res) {
                pii.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Saved'),$translate.instant('personfile.DataSaved'));
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trTaxNumber = $translate.instant('main.TAXNUMBER');
        $scope.trTaxOffice = $translate.instant('main.TAXOFFICE');
        $scope.trTitle = $translate.instant('main.TITLE');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
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
        if (!pii.tableParams.data[pii.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pii.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        }
    };
    pii.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
                $scope.PersonID = 0;
            }
            Restangular.all('PersonInvoiceInfo').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "PersonID='" + $scope.PersonID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
             confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pii.tableParams.data[index].fromServer) {
                    pii.tableParams.data[index].remove();
                }
                pii.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pii.tableParams.data[index].fromServer) {
            pii.tableParams.data[index].remove();
        }
        pii.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pii.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    var unbindWatcher = $scope.$watch(angular.bind(pii, function () {
        return $rootScope.PersonID;
    }), function (value) {
        pii.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        unbindWatcher();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("PersonInvoiceInfoCtrl");
    });
};
app.controller('personinvoiceinfoCtrl', personinvoiceinfoCtrl);
function personinvoiceinfoCtrl($scope, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element, $stateParams) {
    $rootScope.uService.EnterController("personinvoiceinfoCtrl");
    var pii = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pii.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('personfile.DataUpdated '));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'personinvoiceinfo')
            this.item.post().then(function (res) {
                pii.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Saved'),$translate.instant('personfile.DataSaved'));
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trTaxOffice = $translate.instant('main.TAXOFFICE');
        $scope.trTaxNumber = $translate.instant('main.TAXNUMBER');
        $scope.trTittle = $translate.instant('main.TITTLE');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
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
        if (!pii.tableParams.data[pii.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pii.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        }
    };
    pii.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
                $scope.PersonID = 0;
            }
            Restangular.all('personinvoiceinfo').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "PersonID='" + $scope.PersonID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
             confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pii.tableParams.data[index].fromServer) {
                    pii.tableParams.data[index].remove();
                }
                pii.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pii.tableParams.data[index].fromServer) {
            pii.tableParams.data[index].remove();
        }
        pii.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pii.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    var unbindWatcher = $scope.$watch(angular.bind(pii, function () {
        return $rootScope.PersonID;
    }), function (value) {
        pii.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        unbindWatcher();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("personinvoiceinfoCtrl");
    });
};
app.controller('personcomplaintsCtrl', personcomplaintsCtrl);
function personcomplaintsCtrl($scope, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element, $stateParams) {
    $rootScope.uService.EnterController("personcomplaintsCtrl");
    var pcomp = this;
    $scope.item = {};
    $scope.translate = function () {
        $scope.trPerson = $translate.instant('main.PERSON');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trComplainStatus = $translate.instant('main.COMPLAINSTATUS');
        $scope.trComplaintType = $translate.instant('main.COMPLAINTTYPE');
        $scope.trComplaintSource = $translate.instant('main.COMPLAINTSOURCE');
        $scope.trComplaintSubject = $translate.instant('main.COMPLAINTSUBJECT');
        $scope.trComplaintReaction = $translate.instant('main.COMPLAINTREACTION');
        $scope.trComplaintConclusion = $translate.instant('main.COMPLAINTCONCLUSION');
        $scope.trIncidentDate = $translate.instant('main.INCIDENTDATE');
        $scope.trComplaintDate = $translate.instant('main.COMPLAINTDATE');
        $scope.trIncidentNotes = $translate.instant('main.INCIDENTNOTES');
        $scope.trComplaintNote = $translate.instant('main.COMPLAINTNOTE');
        $scope.trCustomerReacitonNotes = $translate.instant('main.CUSTOMERREACTIONNOTES');
        $scope.trConclusionNotes = $translate.instant('main.CONCLUSIONNOTES');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    }
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    pcomp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
            if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
                $scope.PersonID = 0;
            }
            Restangular.all('complaint').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "PersonID='" + $scope.PersonID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.$on('$destroy', function () {
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("personcomplaintsCtrl");
    });
};
app.controller('unsupportedaddressessCtrl', unsupportedaddressessCtrl);
function unsupportedaddressessCtrl($scope, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element, $stateParams) {
    $rootScope.uService.EnterController("unsupportedaddressessCtrl");
    var usa = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                usa.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('personfile.DataUpdated '));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'unsupportedaddress')
            this.item.post().then(function (res) {
                usa.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Saved'),$translate.instant('personfile.DataSaved'));
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trTown = $translate.instant('main.TOWN');
        $scope.trSubcity = $translate.instant('main.SUBCITY');
        $scope.trQuarter = $translate.instant('main.QUARTER');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trCommands = $translate.instant('main.COMMANDS');

    }
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
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
        if (!usa.tableParams.data[usa.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(usa.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        }
    };
    usa.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
          if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
                $scope.PersonID = 0;
            }
            Restangular.all('unsupportedaddress').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "PersonID='" + $scope.PersonID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
             confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (usa.tableParams.data[index].fromServer) {
                    usa.tableParams.data[index].remove();
                }
                usa.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (usa.tableParams.data[index].fromServer) {
            usa.tableParams.data[index].remove();
        }
        usa.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        usa.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    var unbindWatcher = $scope.$watch(angular.bind(usa, function () {
        return $rootScope.PersonID;
    }), function (value) {
        usa.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        unbindWatcher();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("unsupportedaddressessCtrl");
    });
};
app.controller('personaccounttransactionsCtrl', personaccounttransactionsCtrl);
function personaccounttransactionsCtrl($scope, $log, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $filter, $translate, $element, $stateParams) {
    $rootScope.uService.EnterController("personaccounttransactionsCtrl");
    var pat = this;
    $scope.item = {};
    $scope.saveData = function () {
        if (this.item.restangularized) {
            this.item.put().then(function (res) {
                pat.tableParams.reload();
                toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('personfile.DataUpdated '));
            });
        }
        else {
            Restangular.restangularizeElement('', this.item, 'accounttransaction')
            this.item.post().then(function (res) {
                pat.tableParams.reload();
                toaster.pop('success',$translate.instant('orderfile.Saved'),$translate.instant('personfile.DataSaved'));
            });
            this.item.get();
        }
    }
    $scope.translate = function () {
        $scope.trTransactionTypeDescription = $translate.instant('main.TRANSACTIONTYPEDESCRIPTION');
        $scope.trPaymentType = $translate.instant('main.PAYMENTTYPE');
        $scope.trDescription = $translate.instant('main.DESCRIPTION');
        $scope.trTransactionDate = $translate.instant('main.TRANSACTIONDATE');
        $scope.trOperationDate = $translate.instant('main.OPERATIONDATE');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
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
        if (!pat.tableParams.data[pat.tableParams.data.length - 1].restangularized) {
            $scope.cancelremove(pat.tableParams.data.length - 1, 1);
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        } else {
            toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('personfile.Insertcancelled') );
        }
    };
    pat.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
    {
        getData: function ($defer, params) {
          if ($scope.PersonID == 'new' && $stateParams.id == 'new') {
                $scope.PersonID = 0;
            }
            Restangular.all('accounttransaction').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                sort: params.orderBy(),
                search: "ParentID='" + $scope.PersonID + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $defer.resolve(items);
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    });
    $scope.removeItem = function (index) {
        SweetAlert.swal({
            title:  $translate.instant('orderfile.Sure') ,
            text:  $translate.instant('orderfile.SureRecord'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
             confirmButtonText:  $translate.instant('orderfile.confirmButtonText'),
            cancelButtonText:  $translate.instant('orderfile.cancelButtonText'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                if (pat.tableParams.data[index].fromServer) {
                    pat.tableParams.data[index].remove();
                }
                pat.tableParams.data.splice(index, 1);
                toaster.pop("error", $translate.instant('orderfile.Attention'),$translate.instant('orderfile.RecordDeleted'));
            }
        });
    };
    $scope.cancelremove = function (index) {
        if (pat.tableParams.data[index].fromServer) {
            pat.tableParams.data[index].remove();
        }
        pat.tableParams.data.splice(index, 1);
    };
    $scope.addItem = function () {
        pat.tableParams.data.push({ PersonID: $rootScope.PersonID });
    };
    var unbindWatcher = $scope.$watch(angular.bind(pat, function () {
        return $rootScope.PersonID;
    }), function (value) {
        pat.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        unbindWatcher();
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("personaccounttransactionsCtrl");
    });
};

