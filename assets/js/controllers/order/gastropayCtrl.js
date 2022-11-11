app.controller('gastropayCtrl', gastropayCtrl);
function gastropayCtrl($rootScope, $scope, $modalInstance, $stateParams, Order,GastropayPayment, userService, ngnotifyService, Restangular, toaster, $window, $translate, $filter, $log, $modal,PaymentRestangular, ngTableParams, SweetAlert, $location,) {
    $rootScope.uService.EnterController("gastropayCtrl");
    $scope.order = Order;
    $scope.GastropayPayment=GastropayPayment;
    //$scope.ResultCode = {};
    $scope.SavePayments = function () {
        $scope.Showspinner = true;
        Restangular.one('gastropay/getpaymentresult').get(
            {
                //Result:Result,
                //ResultCode: ResultCode,
                OrderID: $scope.order.id

            }
        ).then(function (result) {
            $scope.Showspinner = false;
            if (result.ResultCode==0){
            toaster.pop('success', $translate.instant('orderfile.PAYMENTSAVED'), $translate.instant('orderfile.PAYMENTSAVED'));
            $scope.ok();
            }
            else {
                toaster.pop('error', $translate.instant('Server.ServerError'), result.ResultMessage);
            }
        }, function (response) {
            $scope.Showspinner = false;
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.GastropayCheck = function () {
        Restangular.one('gastropay/getcode').get({
            OrderID: $scope.order.id
        }).then(function (result) {
            $scope.gastropay = result;
        }, function (response) {
            toaster.pop('warning', response.data.ExceptionMessage);
        });
    };
    $scope.SavePayment = function () {
        $scope.currentPayment.PaymentTypeID = $scope.GastropayPayment.id;
        if ($scope.currentPayment.Amount == 0) {
            toaster.pop('error', $translate.instant('orderfile.AmountPayable'), "error");
        } else {
            $scope.ShowButton = true;
            $scope.currentPayment.PaymentTypeID = $scope.GastropayPayment.id;
            $scope.currentPayment.PaymentDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
            Restangular.restangularizeElement('', $scope.currentPayment, 'orderpayment');
            if ($scope.isNewPayment) {
                $scope.currentPayment.post().then(function (resp) {
                    //$scope.setBekoECRPayment(type.PaymentType);
                    toaster.pop("success",$translate.instant('orderfile.PAYMENTSAVED') );
                    $scope.order.payments.push(resp);
                    //$scope.gastropay(order);
                    $scope.Recalc();
                    if ($scope.currentPayment.Amount == 0)
                        $scope.ok();
                }, function (resp) {
                    toaster.pop('error',$translate.instant('orderfile.NONEWPAYMENTRECORDED') , resp.data.ExceptionMessage);
                });
            } else {
                $scope.currentPayment.put().then(function (resp) {
                    //$scope.setBekoECRPayment(type.PaymentType);
                    toaster.pop("success", $translate.instant('orderfile.PAYMENTUPDATED'));
                    $scope.Recalc();
                    if ($scope.currentPayment.Amount == 0)
                        $scope.ok();
                }, function (resp) {
                    toaster.pop('error', $translate.instant('orderfile.NEWPAYMENTCOULDNOTUPDATED'), resp.data.ExceptionMessage);
                });
            }
        }
    };
    $scope.GastropayCheck();
    // $scope.SavePayment = function (Type) {
    //     $scope.Showspinner = true;
    //     PaymentRestangular.one('gastropay/getpaymentresult').get({
    //         OrderID: $scope.order.id,
    //         RequestType: Type,
    //         // Kasa: $rootScope.user.ClientName,
    //         // Amount: $scope.currentPayment.Amount
    //     }).then(function (result) {
    //         console.log('Payment Result:' + result);
    //         if (result == true) {
    //             Restangular.all('orderpayment').getList({ search: "OrderID='" + Order.id + "'" }).then(function (resp) {
    //                 $scope.order.payments = resp;
    //                 if (Type == 7 && result == true) {
    //                     $scope.ShowObject = true;
    //                     $scope.Showspinner = false;
    //                 }
    //             });
    //         } else {
    //             $scope.message =  $translate.instant('orderfile.OperationCouldPerformed');
    //             $scope.Showspinner = false;
    //         }
    //     }, function (response) {
    //         $scope.message =  $translate.instant('orderfile.OperationCouldPerformed');
    //         toaster.pop('error', $translate.instant('orderfile.PAYMENTNOTMADE') , response.data.ExceptionMessage);
    //         $scope.Showspinner = false;
    //     });
    // };




    $scope.ok = function () {
        $modalInstance.close('ok');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("gastropayCtrl");
    });
};