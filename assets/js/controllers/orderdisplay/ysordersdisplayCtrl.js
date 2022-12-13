app.controller('ysordersdisplayCtrl', ysordersdisplayCtrl);
function ysordersdisplayCtrl($rootScope, $scope, $log, $modal, $interval, Restangular, ngTableParams, $timeout, SweetAlert, toaster, $window, $location, $translate, $element, userService) {
    $rootScope.uService.EnterController("ysordersdisplayCtrl");
    userService.userAuthorizated()
    $scope.orders = [];
    var NewYSOrderfresh = (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CCBACKOFFICE")|| userService.userIsInRole("CCSIKAYET")) ?
        $scope.$on('YSOrderUpdate', function (event, data) { $scope.getYSorder(); }) : $scope.$on('YSOrder', function (event, data) { $scope.getYSorder(); });
    $scope.getYSorder = function () {
        Restangular.all('YemekSepetiOrderMap').getList({
            search: $rootScope.user.StoreID ? 'YemekSepetiOrderStateID < 5 and StoreID=' + $rootScope.user.StoreID :'YemekSepetiOrderStateID < 5'
        }).then(function (result) {
            $scope.orders = angular.copy(result);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.getYSorder();
    $scope.checkOrder = function (data) {
        Restangular.one('YemekSepetiOrderMap', data.id).get().then(function (restresult) {
            if (restresult.Reservation && restresult.Reservation.UserID != $rootScope.user.id) {
                toaster.pop('error',  $translate.instant('orderfile.Recordlocked'), restresult.Reservation.NGUser.FullName);
            } else {
                if (data.YemekSepetiOrderStateID == 1) {
                    location.href = '#/app/yemeksepeti/yemeksepetimerge/' + restresult.YemekSepetiOrderID;
                }                
            }
            },
                function (restresult) {
                    toaster.pop('warning', $translate.instant('orderfile.Cancelled'), $translate.instant('difinitions.Editcancelled') );
                    swal("Error!", $translate.instant('Server.DataError'), "Warning");
                });
        
    };
    $scope.rejectOrder = function (order) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/orderdisplay/ysorderrejectreason.html',
            controller: 'ysorderrejectreasonCtrl',
            size: '',
            backdrop: '',
            resolve: {
                order: function () {
                    return order;
                },
            }
        });
        modalInstance.result.then(function (result) {
            if (result == 'OK') {
                $scope.getYSorder();
            }
        })
    };
    $scope.changestore = function (order) {
        order.route = "YemekSepetiOrderMap";
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/orderdisplay/changeysorderstore.html',
            controller: 'changeysorderstoreCtrl',
            size: '',
            backdrop: '',
            resolve: {
                order: function () {
                    return order;
                },
            }
        });
        modalInstance.result.then(function (result) {
            if (result == 'OK') {
                $scope.getYSorder();
                $location.path('app/mainscreen/mainscreen');
            }
        })
    };
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
                toaster.pop('warning',$translate.instant('orderfile.DepartmentsNull '), "error");
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
                        toaster.pop('warning',$translate.instant('orderfile.NoDepartment ') , "error");
                    });
            }
        }
    };
    $scope.HandledYSOrder = function (order, detail) {
        var ysOrder = order;
        var data = $scope.GetDepartment();
        if (data != null) {
            var order = {}
            var orderperson = { PersonID: detail.Person_DeliveryAddress.PersonID };
            var pesons = [orderperson];
            order.persons = pesons; //.push(orderperson);
            order.OrderTypeID = 2;
            order.AddressID = detail.Person_DeliveryAddress.AddressID;
            order.StoreID = $rootScope.user.StoreID;
            order.DepartmentID = $rootScope.user.UserRole.OrderSource.Department.id;
            order.root = 'ysorderdisplay';
            Restangular.restangularizeElement('', order, 'order');
            order.post().then(function (resp) {
                if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                    location.href = '#/app/orders/orderStore/' + resp.id;
                if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                    location.href = '#/app/orders/order/' + resp.id;
                toaster.pop("success",  $translate.instant('personfile.OrderCreated'));
                $rootScope.$emit('YSOrderDetailListener', ysOrder);
            },function (resp) {
                    toaster.pop('error', resp.data.ExceptionMessage, "error");
                });
        } else {
            toaster.pop('warning',$translate.instant('yemeksepetifile.PleaseTryAgain'), "error");
        }
    };
    $scope.SelectPerson = function (order) {
        Restangular.all('yemeksepeticustomermap').getList({
            search: "YemekSepetiCustomerID=" + order.YemekSepetiOrder.YemekSepetiRawOrder.CustomerId + "and YemekSepetiAddressID='" + order.YemekSepetiOrder.YemekSepetiRawOrder.AddressId + "'",
        }).then(function (result) {
            $scope.HandledYSOrder(order, result[0]);
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.ProcessOrder = function (ysom) {
        Restangular.all('YemekSepetiTools/TransferOrder').getList({
            YemekSepetiOrderMapID: ysom.id
        }).then(function (_orderItems) {
            toaster.pop('success', $translate.instant('orderfile.Ordertransferprocessinitiated '));
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    };
    $scope.$on('$destroy', function () {        
        NewYSOrderfresh();
        $element.remove();
        $rootScope.uService.ExitController("ysordersdisplayCtrl");
    });
};
