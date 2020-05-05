﻿app.controller('mallCtrl', mallCtrl);
function mallCtrl($scope, $log, $modal, Restangular, $filter, SweetAlert, ngTableParams, toaster, $window, $rootScope, $location, $translate, userService, $element) {
    $rootScope.uService.EnterController("mallCtrl");
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
        $scope.MALLTXT = $translate.instant('main.MALL');
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
            toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
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
            title: "Sipariş Teslim Edildi mi ?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Evet",
            cancelButtonText: "Hayır",
            closeOnConfirm: true
        }, function () {
            Restangular.all('ordertools/updateorderstatus').getList(
                {
                    OrderID: data.id,
                    newSatus: 10,
                }
            ).then(function (result) {
                toaster.pop('success', "Güncellendi", 'Updated!');
                $scope.loadOrders();
            }, function (response) {
                toaster.pop('error', "Sunucu hatası", response.data.ExceptionMessage);
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
        result.push("(OrderTypeID in (6))");
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
            angular.forEach($scope.orders, function (ord) {
                ord.OrderDateTXT = $filter('date')(ord.OrderDate, 'dd-MM-yyyy / HH:mm:ss');
                ord.AmountTXT = $filter('number')(ord.Amount, 2);
            })
            $scope.$broadcast('$$rebind::refresh');
        }, function (response) {
            $scope.ShowObject = false;
            toaster.pop('Warning', "Sunucu hatası", response.data.ExceptionMessage);
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
    $scope.takeawayOrder = function (Alias) {
        var data = $scope.GetDepartment();
        if (data != null) {
            var order = {
                persons: [],
                OrderTypeID: 6,
                Alias: Alias,
                StoreID: $rootScope.user.StoreID,
                DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id
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
    $scope.$on('$destroy', function () {
        tranlatelistener();
        $element.remove();
        $rootScope.uService.ExitController("mallCtrl");
    });
};
