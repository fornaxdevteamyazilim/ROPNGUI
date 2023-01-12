app.controller('changeorderstateCtrl', changeorderstateCtrl);
function changeorderstateCtrl($rootScope, $scope, $modalInstance, item, Restangular, toaster, $window, $translate, $filter) {
    $rootScope.uService.EnterController("changeorderstateCtrl");
    $scope.OrderNo = item.id;
    $scope.OrderNumber = item.OrderNumber;
    $scope.root = item.root;
    $scope.item = {};
    $scope.order = {};
    $scope.orderreasons = [];
    $scope.YemekSepetiRejectReasons = [];
    $scope.TrendyolRejectReasons = [];
    $scope.MigrosRejectReasons = [];
    $scope.translate = function () {
        $scope.trOrderNumber = $translate.instant('main.ORDERNUMBER');
        $scope.trCancelReason = $translate.instant('main.CANCELREASON');
        $scope.trOrderNote = $translate.instant('main.ORDERNOTE');
        $scope.truseInventory = $translate.instant('main.USEINVENTORY');
        $scope.trnotUseInventory = $translate.instant('main.NOTUSEINVENTORY');
        $scope.trisCustomerInformed = $translate.instant('main.CUSTOMERINFORMATION');
        $scope.trCustomerNotInformed = $translate.instant('main.CUSTOMERNOTINFORMED');
        $scope.trYSCancelReason = $translate.instant('main.YSCANCELREASON');
        $scope.trTrendyolCancelReason = $translate.instant('main.TRENDYOLCANCELREASON');
        $scope.trMigrosCancelReason = $translate.instant('main.MIGROSCANCELREASON');
    };
    if ($rootScope.user.restrictions && $rootScope.user.restrictions.askinventory == 'Disable') {
        $scope.item.value = false;
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    })
    $scope.translate();
    if (item && item.id) {
        if (item.root == "orderdisplay") {
            Restangular.all('orderreason').getList({
                search: "OrderReasonTypeID=0 and isActive=1",
            }).then(function (items) {
                angular.copy(items, $scope.orderreasons);
                $scope.LoadOrder();
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
            Restangular.all('aggregator/OrderCancelOptions').getList({
                OrderID: item.id,
            }).then(function (items) {
                angular.copy(items, $scope.YemekSepetiRejectReasons);
                angular.copy(items, $scope.TrendyolRejectReasons);
                angular.copy(items, $scope.MigrosRejectReasons);
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
            // Restangular.all('YemekSepetiRejectReason').getList({
            //     search: "isActive=1",
            // }).then(function (items) {
            //     angular.copy(items, $scope.YemekSepetiRejectReasons);
            // }, function (response) {
            //     toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            // });
        } else {
            Restangular.all('orderreason').getList({
                search: "isActive=1",
            }).then(function (items) {
                angular.copy(items, $scope.orderreasons);
                $scope.LoadOrder();
            }, function (response) {
                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    }
    $scope.LoadOrder = function () {
        Restangular.one('order', item.id).get().then
            (function (restresult) {
                angular.copy(restresult, $scope.order);
            },
                function (restresult) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), restresult.data.ExceptionMessage);
                })
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
            StoreTableID: order.StoreTableID
        }
    };
    $scope.SaveData = function (data) {
        if (!data.OrderReasonID) {
            toaster.pop('error', $translate.instant('orderfile.ChoosReason'), $translate.instant('orderfile.Seleccancellation'));
        } else if (item.root == 'orderdetail') {
            if (data.value == true) {
                Restangular.all('ordertools/updateorderstatus').getList({
                    OrderID: $scope.order.id,
                    newSatus: 7,
                    OrderReasonID: data.OrderReasonID,
                    OrderNote: data.Note,
                    YemekSepetiRejectReasonID: data.YemekSepetiRejectReasonID,
                    TrendyolRejectReasonID:data.TrendyolRejectReasonID,
                    MigrosRejectReasonID:data.MigrosRejectReasonID,
                    isCustomerInformed: item.isCustomerInformed
                }).then(function (result) {
                    toaster.pop('success', $translate.instant('orderfile.OrderStatusUpdated'));
                    $scope.ok();
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
            if (data.value == false) {
                Restangular.all('ordertools/updateorderstatus').getList({
                    OrderID: $scope.order.id,
                    newSatus: 8,
                    OrderReasonID: data.OrderReasonID,
                    OrderNote: data.Note,
                    YemekSepetiRejectReasonID: data.YemekSepetiRejectReasonID,
                    TrendyolRejectReasonID:data.TrendyolRejectReasonID,
                    MigrosRejectReasonID:data.MigrosRejectReasonID,
                    isCustomerInformed: data.isCustomerInformed
                }).then(function (result) {
                    toaster.pop('success', $translate.instant('orderfile.OrderStatusUpdated'));
                    $scope.ok();
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        } else {
            if (item.root == 'order') {
                var ordertosave = $scope.CopyOrder($scope.order);
                ordertosave.OrderReasonID = data.OrderReasonID;
                ordertosave.OrderNote = data.Note;
                ordertosave.OrderStateID = ($scope.order.OrderStateID == 2) ? 7 : 8;
            }
            if (item.root == 'orderdisplay') {
                Restangular.all('ordertools/updateorderstatus').getList({
                    OrderID: $scope.order.id,
                    newSatus: 14,
                    OrderReasonID: data.OrderReasonID,
                    OrderNote: data.Note,
                    YemekSepetiRejectReasonID: data.YemekSepetiRejectReasonID,
                    TrendyolRejectReasonID:data.TrendyolRejectReasonID,
                    MigrosRejectReasonID:data.MigrosRejectReasonID,
                    isCustomerInformed: data.isCustomerInformed
                }).then(function (result) {
                    toaster.pop('success', $translate.instant('orderfile.OrderDenied'));
                    $scope.ok();
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
            Restangular.restangularizeElement('', ordertosave, 'order');
            if (ordertosave.restangularized && ordertosave.id) {
                ordertosave.put().then(function (resp) {
                    toaster.pop('success', $translate.instant('orderfile.Updated'), $translate.instant('orderfile.Updated'));
                    $scope.ok();
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
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
                OrderID:item.id
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.yemeksepetirejectreasons = [];
    $scope.loadEntities('aggregator/OrderCancelOptions', 'yemeksepetirejectreasons');
    $scope.TrendyolRejectReasons = [];
    $scope.loadEntities('TrendyolRejectReason','TrendyolRejectReasons');
    $scope.MigrosRejectReasons = [];
    $scope.loadEntities('MigrosRejectReason','MigrosRejectReasons');

    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $scope.LoadOrder();
        $rootScope.uService.ExitController("changeorderstateCtrl");
    });
};
