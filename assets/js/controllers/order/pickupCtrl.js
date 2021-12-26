app.controller('pickupCtrl', pickupCtrl);
function pickupCtrl($scope, $log, $modal, Restangular, $filter, SweetAlert, ngTableParams, toaster, $window, $rootScope, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("pickupCtrl");
    $scope.ShowObject = true;
    userService.userAuthorizated();
    $scope.Person = {};
    $scope.translate = function () {
        $scope.trOrderNo = $translate.instant('main.ORDERNO');
        $scope.trOrderNumber = $translate.instant('main.ORDERNUMBER');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trPerson = $translate.instant('main.PERSON');
        $scope.trPersonName = $translate.instant('main.PERSONNAME');
        $scope.trPhone = $translate.instant('main.PHONE');
        $scope.trAddressType = $translate.instant('main.ADDRESSTYPE');
        $scope.trOrderType = $translate.instant('main.ORDERTYPE');
        $scope.trVAT = $translate.instant('main.VAT');
        $scope.trAmount = $translate.instant('main.AMOUNT');
        $scope.trOrderState = $translate.instant('main.ORDERSTATE');
        $scope.trOrderDate = $translate.instant('main.ORDERDATE');
        $scope.selectorderstatus = $translate.instant('main.SELECTORDERSTATUS');
        $scope.allorder = $translate.instant('main.ALLORDER');
        $scope.trORDERALIAS = $translate.instant('main.ORDERALIAS');
        $scope.ordersinstore = $translate.instant('main.ORDERSINSTORE');
        $scope.neworder = $translate.instant('main.NEWORDER');
        $scope.preparingdorder = $translate.instant('main.PREPARINGDORDER');
        $scope.preparedorder = $translate.instant('main.PREPAREDOREDER');
        $scope.outorder = $translate.instant('main.OUTORDER');
        $scope.cancell = $translate.instant('main.CANCELL');
        $scope.rejected = $translate.instant('main.REJECTED');
        $scope.awaitingauthorization = $translate.instant('main.AWAITINGAUTORIZATION');
        $scope.deliveredorder = $translate.instant('main.DELIVEREDORDER');
        $scope.closedorder = $translate.instant('main.CLOSEDORDER');
        $scope.openorder = $translate.instant('main.OPENORDER');
        $scope.tableorders = $translate.instant('main.TABLEORDERS');
        $scope.takeawayorders = $translate.instant('main.TAKEAWAYORDERS');
        $scope.PICKUPTXT = $translate.instant('main.PICKUP');
        $scope.hdorders = $translate.instant('main.HDORDERS');
        $scope.trPaymenttype = $translate.instant('main.PAYMENTTYPE');
        $scope.trPaymentStatus = $translate.instant('main.PAYMENTSTATUS');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trDriverName = $translate.instant('main.DRIVERNAME');
        $scope.trPromotion = $translate.instant('main.PROMOTION');
        $scope.hnrorders = $translate.instant('main.HNRORDERS');
        $scope.stafforders = $translate.instant('main.STAFFORDERS');
        $scope.orderdetails = $translate.instant('main.ORDERDETAILS');

    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
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
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
            OrderSourceID: order.OrderSourceID,

        }
    };
    $scope.SaveOpenOrders = function (data) {
        swal({
            title: "Mark order as delivered?",
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
          toaster.pop('success',$translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
          $scope.loadOrders();
      }, function (response) {
          toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
        result.push("(OrderTypeID in (5))");
        //result.push("OrderSourceID='" + $scope.OrderSourceID + "'");
        return result;
    };
    $scope.orders = [];
    $scope.loadOrders = function (data) {
        $scope.ShowObject = true;
        Restangular.all('order').getList({
            pageNo: 1,
            pageSize: 1000,
            //sort: "substring(OrderNumber,1,1)",
            //sort: "cast(SUBSTRING(OrderNumber,4,len(OrderNumber)-1)as int)",
            sort: "-convert(int,SUBSTRING(OrderNumber,CHARINDEX('-',OrderNumber,0)+1,len(OrderNumber)-1))",
            search: $scope.BuildSearchString(),
            //search: $scope.OrderSourceID
        }).then(function (result) {
            $scope.ShowObject = false;
            angular.copy(result, $scope.orders);
            angular.forEach($scope.orders, function (ord) {
                ord.OrderDateTXT = $filter('date')(ord.OrderDate, 'dd-MM-yyyy / HH:mm:ss');
                ord.AmountTXT = $filter('number')(ord.Amount, 2);
            })
            $scope.$broadcast('$$rebind::refresh');
        }, function (response) {
            $scope.ShowObject = false;
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
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
    $scope.GetOrderSource = function (data) {
        $scope.OrderSourceID = data;
        $scope.selectedSource = $filter('filter')($scope.ordersources, { id: data });
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
    $scope.takeawayOrder = function (Alias, OrderSourceID) {
        var data = $scope.GetDepartment();
        if (data != null) {
            var order = {
                persons: [],
                OrderTypeID: 5,
                Alias: Alias,
                StoreID: $rootScope.user.StoreID,
                DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id,
                OrderSourceID: $scope.OrderSourceID
            }
            Restangular.restangularizeElement('', order, 'order');
            order.post().then(function (resp) {
                location.href = '#/app/orders/orderStoreTable/' + resp.id;
            },
            function (resp) {
                toaster.pop('error', resp.data.ExceptionMessage, $translate.instant('orderfile.Couldnotcreateneworder'));
            });
        } else {
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
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 10000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ordersources = [];
    $scope.loadEntities('ordersource', 'ordersources');

    $scope.$on('$destroy', function () {
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("pickupCtrl");
    });
};
