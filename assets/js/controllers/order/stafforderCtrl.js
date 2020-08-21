app.controller('stafforderCtrl', stafforderCtrl);
function stafforderCtrl($scope, $log, $modal, Restangular, $filter, SweetAlert, ngTableParams, toaster, $window, $rootScope, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("stafforderCtrl");
    $scope.ShowObject = true;
    userService.userAuthorizated();
    $scope.Person = {};
    $scope.storeUsers =[];
     $scope.BuildSearchString = function () {
        var result = [];
        result.push(" StoreID= '" + $rootScope.user.StoreID + "'");
        result.push(" tt.id= '" + $rootScope.user.id + "'");
        return result;
     };
    Restangular.all('user').getList({
        pageNo: 1,
        pageSize: 10000,
         search: $scope.BuildSearchString()
     }).then(function (result) {
         $scope.storeUsers = result;
     }, function (response) {
         toaster.pop('warning', "Server Error", response.data.ExceptionMessage);
     });
    $scope.OrderPaymentDeteails = function (item) {
        Restangular.all('orderperson').getList({
            pageNo: 1,
            pageSize: 100,
            search: "OrderID='" + item.id + "'"
        }).then(function (result) {
            var modalInstance = $modal.open({
                templateUrl: 'assets/views/order/orderpayments.html',
                controller: 'orderpaymentCtrl',
                size: 'lg',
                backdrop: '',
                resolve: {
                    Order: function () {
                        return item;
                    },
                }
            });
            modalInstance.result.then(function (item) {
                $scope.loadOrders();
            })
        }, function (response) {
            toaster.pop('error', "Server Error", response.data.ExceptionMessage);
        });
    };
    $scope.CopyOrder = function (order) {
        return {
            id: order.id,
            DepartmentID: order.DepartmentID,
            OrderNumber: order.OrderNumber,
            StoreID: order.StoreID,
            AddressID: order.AddressID,
            OrderTypeID: order.OrderTypeID,
            VAT: order.VAT,
            Amount: order.Amount,
            PaymentTypeID: order.PaymentTypeID,
            PaymentStatusID: order.PaymentStatusID,
            OrderStateID: order.OrderStateID,
            OrderDate: $filter('date')(order.OrderDate, 'yyyy-MM-dd HH:mm:ss'),
            DeliveryDate: $filter('date')(order.DeliveryDate, 'yyyy-MM-dd HH:mm:ss'),
            OperationDate: order.OperationDate,
            OrderNote: order.OrderNote,
            PaymentNote: order.PaymentNote,
            StoreTableID: order.StoreTableID,
            Alias: order.Alias,
        }
    };
    $scope.SaveOpenOrders = function (data) {
        swal({
            title: "Have we delivered the order ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes",
            cancelButtonText: "No",
            closeOnConfirm: true
        }, function () {
            Restangular.all('ordertools/updateorderstatus').getList(
          {
              OrderID: data.id,
              newSatus: 10,
          }
      ).then(function (result) {
          toaster.pop('success', "Updated", 'Updated!');
          $scope.loadOrders();
      }, function (response) {
          toaster.pop('error', "Server Error", response.data.ExceptionMessage);
      });
        });
    };
    $scope.SelectItem = function (itemID) {
        $location.path('app/orders/orderDetail/' + itemID);
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        result.push("StoreID='" + $rootScope.user.StoreID + "'");
        result.push("OrderDate >'" + $rootScope.user.Store.OperationDate + "'");        
        result.push("((OrderStateID in (2,3,4,5,11,13,14,19,20)) or (OrderStateID =10 and PaymentStatusID=0))");
        result.push("(OrderTypeID in (4))");
        return result;
    };
    $scope.orders = [];
    $scope.loadOrders = function (data) {
        $scope.ShowObject = true;
        Restangular.all('order').getList({
            pageNo: 1,
            pageSize: 1000,
            sort: "substring(OrderNumber,1,1)",
            sort: "cast(SUBSTRING(OrderNumber,3,len(OrderNumber)-1)as int)",
            search: $scope.BuildSearchString()
        }).then(function (result) {
            $scope.ShowObject = false;
            angular.copy(result, $scope.orders);
        }, function (response) {
            $scope.ShowObject = false;
            toaster.pop('Warning', "Server Error", response.data.ExceptionMessage);
        });
    };
    $scope.loadOrders();
    $scope.GetDepartments = function () {
        Restangular.all('department').getList({
            pageNo: 1,
            pageSize: 1000,
        }).then(function (result) {
            angular.copy(resulti$scope.Departments);
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
                        toaster.pop('error', "No Department", "error");
                    });
            }
        }
    };
    $scope.takeawayOrder = function (userID) {
        var Alias = $filter('filter')($scope.storeUsers, { id: userID })[0];
        var data = $scope.GetDepartment();
        if (data != null) {
            var order = {
                persons: [],
                OrderTypeID: 4,
                Alias: Alias.FullName,
                StoreID: $rootScope.user.StoreID,
                DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id
            }
            Restangular.restangularizeElement('', order, 'order');
            order.post().then(function (resp) {
                location.href = '#/app/orders/orderStoreTable/' + resp.id;
            },
            function (resp) {
                toaster.pop('error', "Could Not Create New Order !", resp.data.ExceptionMessage);
            });
        } else {
        }
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("stafforderCtrl");
    });
};
