'use strict';
app.controller('personaddresseslistCtrl', personaddresseslistCtrl);
function personaddresseslistCtrl($scope, $translate, $log, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $rootScope, $location, $stateParams, userService, $element) {
    $rootScope.uService.EnterController("personaddresseslistCtrl");
    var ad = this;
    userService.userAuthorizated();
    $scope.SelectedItem = null;
    ad.search = '';
    $scope.GetParentItemID = function () {
        return $scope.$parent.$parent.item.id;
    }
    $scope.AdAddressPerson = function (id) {
        $rootScope.PersonID = id;
        location.href = '#/app/orders/person/personaddressedit/new';
    };
    $scope.Departments = [];
    $scope.GetDepartments = function () {
        Restangular.all('department').getList({
            pageNo: 1,
            pageSize: 1000,
            //search: "Completed=0"/TODO MemberID
        }).then(function (result) {
            angular.copy(result,$scope.Departments);
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
    $scope.HomeOrder = function (person, OrderType) {
        //OrderTypes: 1=Takeaway,2=HomeDelivery,3=Instore
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
                toaster.pop('error', response.data.ExceptionMessage, "error");
            });
        } else {
            //TODO Swet Alert
        }
    };
    $scope.saveData = function (data) {
        if (data.restangularized) {
            data.put().then(
                function (res) {
                    ad.tableParams.reload();
                    toaster.pop('success', $translate.instant('personfile.Failedupdate'), $translate.instant('personfile.DataUpdateapplyedserver'));
                },
                 function (response) {
                     toaster.pop('error',$translate.instant('personfile.Failedupdate'), response.data.ExceptionMessage);
                 }
                 );
        }
        else {
            Restangular.restangularizeElement('', data, 'person_deliveryaddress')
            data.post().then(
                function (res) {
                    ad.tableParams.reload();
                    toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('personfile.DataSavedserver'));
                },
                 function (response) {
                     toaster.pop('error', $translate.instant('orderfile.NotSaved'), response.data.ExceptionMessage);
                 }
                );
            data.get();
        }
    }
    var tp = {
        page: 1,
        count: 10

    };
    ad.tableParams = new ngTableParams(tp,
    {
        counts: [],
        getData: function ($defer, params) {
            return;
            Restangular.all('person_deliveryaddress').getList({
                pageNo: params.page(),
                pageSize: params.count(),
                search: "PersonID ='" + $scope.GetParentItemID() + "'"
            }).then(function (items) {
                params.total(items.paging.totalRecordCount);
                $scope.SelectedItem = (items[0]) ? items[0].id : null;
                $scope.itemscount = items.length;
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
    $scope.addresssources = [];
    $scope.loadEntities('enums/datasource', 'addresssources');

    var unbindWatcher = $scope.$watch(angular.bind(ad, function () {
        return ad.search;
    }), function (value) {
        ad.tableParams.reload();
    });
    $scope.$on('$destroy', function() {
        unbindWatcher();
        $element.remove();
        $rootScope.uService.ExitController("personaddresseslistCtrl");
    });
};
