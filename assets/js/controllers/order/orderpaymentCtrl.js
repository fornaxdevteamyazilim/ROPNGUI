app.factory("PaymentRestangular", function (Restangular) {
  return Restangular.withConfig(function (RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl("http://192.168.9.40:9065/api/");
  });
});

app.controller("orderpaymentCtrl", orderpaymentCtrl);
function orderpaymentCtrl(
  $scope,
  $log,
  $modal,
  $filter,
  $modalInstance,
  Order,
  Restangular,
  PaymentRestangular,
  ngTableParams,
  SweetAlert,
  toaster,
  $window,
  $rootScope,
  $location,
  $translate,
  userService,
  ngnotifyService,
  localStorageService
) {
  $rootScope.uService.EnterController("orderpaymentCtrl");
  $scope.order = Order;
  $scope.order.Amount = parseFloat(
    Math.round($scope.order.Amount * 100) / 100
  ).toFixed(2);
  $scope.FilterAmount = 0;
  $scope.GastropayPayment = null;
  $scope.GastropayEnabled = false;
  $scope.translate = function () {
    $scope.totalamount = $translate.instant("main.TOTALAMOUNT");
    $scope.paymentamount = $translate.instant("main.PAYMENTAMOUNT");
    $scope.paymenttype = $translate.instant("main.PAYMENTTYPE");
    $scope.receivedamount = $translate.instant("main.RECEIVEDAMOUNT");
    $scope.remainingamount = $translate.instant("main.REMAININGAMONUT");
    $scope.newpayment = $translate.instant("main.NEWPAYMENT");
    $scope.person = $translate.instant("main.PERSON");
    $scope.paymentdate = $translate.instant("main.PAYMENTDATE");
    $scope.paidamount = $translate.instant("main.PAIDAMOUNT");
    $scope.delete = $translate.instant("main.DELETE");
  };
  $scope.translate();
  var tranlatelistener = $scope.$on(
    "$translateChangeSuccess",
    function (event, data) {
      $scope.translate();
    }
  );
  $scope.BottonDblcilik = function () {};
  $scope.ok = function (text) {
    if ($scope.order.OrderTypeID != 0) $scope.ReqOrderAmount = null;
    $modalInstance.close(
      (item = {
        msg: text ? text : "OtherPayment",
        ReqOrderAmount: $scope.ReqOrderAmount,
        PaymentTypeID: $scope.currentPayment.PaymentTypeID,
      })
    );
  };
  $scope.cancel = function () {
    if ($rootScope.user.Store.MemberID == "507632258556")
      $scope.cancelBekoECRPayment();
    $modalInstance.close("cancel");
  };
  $scope.currentPayment = {};
  $scope.key = false;
  $scope.storepaymenttypes = [];
  $scope.currentPayment.OrderPersonID = $scope.order.persons[0].id;
  if (userService.getUseOKC($rootScope.user.StoreID)) {
    $scope.ShowObject = false;
  } else {
    $scope.ShowObject = true;
  }
  $scope.currentPayment.OrderID = $scope.order.id;
  $scope.CalcSumOfPayments = function () {
    var result = 0;
    for (var i = 0; i < $scope.order.payments.length; i++) {
      result += parseFloat(
        Math.round($scope.order.payments[i].Amount * 100) / 100
      );
    }
    return result;
  };
  $scope.CalcRequiredAmount = function () {
    var result = $scope.order.Amount - $scope.CalcSumOfPayments();
    result = parseFloat(Math.round(result * 100) / 100).toFixed(2);
    $scope.ReqOrderAmount = result;
    return result;
  };
  $scope.OperationN = function (value) {
    $scope.key = true;
    $scope.currentPayment.Amount = "";
  };
  $scope.NumberValue = function (value) {
    if ($scope.key == true) {
      $scope.currentPayment.Amount =
        $scope.CalcRequiredAmount() / $scope.currentPayment.Amount;
      if ($scope.currentPayment.Amount.length) {
        $scope.key = false;
      }
    } else {
    }
  };
  $scope.CalcSumOpr = function (operation) {
    if (operation == "1/2") {
      var retotal = $scope.CalcRequiredAmount() / 2;
      $scope.currentPayment.Amount = retotal.toFixed(2);
    }
    if (operation == "1/3") {
      var retotal = $scope.CalcRequiredAmount() / 3;
      $scope.currentPayment.Amount = retotal.toFixed(2);
    }
    if (operation == "1/4") {
      var retotal = $scope.CalcRequiredAmount() / 4;
      $scope.currentPayment.Amount = retotal.toFixed(2);
    }
    if (operation == "") {
      $scope.showchange = false;
      $scope.currentPayment.Amount = 0.0;
    }
  };
  $scope.CalcChange = function (Amount) {
    if (Amount >= $scope.currentPayment.Amount) {
      $scope.showchange = true;
      $scope.change = Amount - $scope.currentPayment.Amount;
    } else {
      $scope.showchange = false;
    }
  };
  $scope.PersonTotal = function (PersonID) {
    var peritem = $filter("filter")($scope.order.items, {
      OrderPersonID: PersonID,
    });
    return $scope.ItemTotals(peritem);
  };
  $scope.ItemTotals = function (items) {
    var result = 0;
    for (var i = 0; i < items.length; i++) {
      if (items.length > 0) {
        result += items[i].Amount;
        if (items[i].items.length > 0) {
          result += $scope.ItemTotals(items[i].items);
        }
      }
    }
    return result;
  };
  $scope.NewPayment = function () {
    $scope.isNewPayment = true;
    var np = {
      OrderID: $scope.order.id,
      OrderPersonID: $scope.order.persons[0].id,
      Amount: $scope.CalcRequiredAmount(),
    };
    $scope.currentPayment = np;
  };
  $scope.NewPayment();
  $scope.Recalc = function () {
    if ($scope.isNewPayment) {
      $scope.currentPayment.Amount = $scope.CalcRequiredAmount();
    }
  };
  $scope.Recalc();
  $scope.DeletePayment = function (Payment) {
    Restangular.restangularizeElement("", Payment, "orderpayment");
    Payment.remove();
    for (var i = 0; i < $scope.order.payments.length; i++) {
      if ($scope.order.payments[i].id == Payment.id)
        $scope.order.payments.splice(i, 1);
    }
    $scope.Recalc();
  };
  $scope.SetCurrentOrderPayment = function (existingItem) {
    if ($scope.itemBackup) {
      $scope.currentPayment = $scope.itemBackup;
    }
    $scope.itemBackup = angular.copy(existingItem);
    $scope.currentPayment = existingItem;
    $scope.SetPaymenType(existingItem.PaymentTypeID);
    $scope.isNewPayment = false;
  };
  $scope.SetPaymenType = function (type) {
    $scope.currentPayment.PaymentTypeID = type;
  };
  $scope.SetPerson = function (personId) {
    $scope.currentPayment.OrderPersonID = personId;
    $scope.currentPayment.Amount = $scope.PersonTotal(personId);
  };
  $scope.SavePayment = function (type) {
    $scope.currentPayment.PaymentTypeID = type.id;
    if ($scope.currentPayment.Amount == 0) {
      toaster.pop(
        "error",
        $translate.instant("orderfile.AmountPayable"),
        "error"
      );
    } else {
      $scope.ShowButton = true;
      $scope.currentPayment.PaymentTypeID = type.id;
      $scope.currentPayment.PaymentDate = $filter("date")(
        ngnotifyService.ServerTime(),
        "yyyy-MM-dd HH:mm:ss"
      );
      $scope.currentPayment.PosName=localStorageService.get('ClientName');
      Restangular.restangularizeElement(
        "",
        $scope.currentPayment,
        "orderpayment"
      );
      if ($scope.isNewPayment) {
        $scope.currentPayment.post().then(
          function (resp) {
            //$scope.setBekoECRPayment(type.PaymentType);
            toaster.pop(
              "success",
              $translate.instant("orderfile.PAYMENTSAVED")
            );
            $scope.order.payments.push(resp);
            $scope.Recalc();
            if ($scope.currentPayment.Amount == 0) $scope.ok();
          },
          function (resp) {
            toaster.pop(
              "error",
              $translate.instant("orderfile.NONEWPAYMENTRECORDED"),
              resp.data.ExceptionMessage
            );
          }
        );
      } else {
        $scope.currentPayment.put().then(
          function (resp) {
            //$scope.setBekoECRPayment(type.PaymentType);
            toaster.pop(
              "success",
              $translate.instant("orderfile.PAYMENTUPDATED")
            );
            $scope.Recalc();
            if ($scope.currentPayment.Amount == 0) $scope.ok();
          },
          function (resp) {
            toaster.pop(
              "error",
              $translate.instant("orderfile.NEWPAYMENTCOULDNOTUPDATED"),
              resp.data.ExceptionMessage
            );
          }
        );
      }
    }
  };
  $scope.SaveECRPayment = function (Type) {
    $scope.Showspinner = true;
    PaymentRestangular.one("ecrprofilo/addprintrequest")
      .withHttpConfig({ timeout: 200000 })
      .get({
        OrderID: $scope.order.id,
        RequestType: Type,
        Kasa: $rootScope.user.ClientName,
        Amount: $scope.currentPayment.Amount,
      })
      .then(
        function (result) {
          console.log("Payment Result:" + result);
          if (result == true) {
            Restangular.all("orderpayment")
              .getList({ search: "OrderID='" + Order.id + "'" })
              .then(function (resp) {
                $scope.order.payments = resp;
                if (Type == 8 && result == true) {
                  $scope.ShowObject = true;
                  $scope.Showspinner = false;
                }
                if (Type != 8 && result == true) {
                  $scope.Recalc();
                  $scope.Showspinner = false;
                  if ($scope.currentPayment.Amount == 0)
                    $scope.ok("ECRPayment");
                }
              });
          } else {
            $scope.message = $translate.instant(
              "orderfile.OperationCouldPerformed"
            );
            $scope.Showspinner = false;
          }
        },
        function (response) {
          $scope.message = $translate.instant(
            "orderfile.OperationCouldPerformed"
          );
          toaster.pop(
            "error",
            $translate.instant("orderfile.PAYMENTNOTMADE"),
            response.data.ExceptionMessage
          );
          $scope.Showspinner = false;
        }
      );
  };
  $scope.ShowPerson = function (orderPersonID) {
    var personArray = $filter("filter")($scope.order.persons, {
      id: orderPersonID,
    });
    if (personArray && personArray.length > 0) {
      return "P(" + personArray[0].PersonIndex + ")";
    }
    return "P()";
  };
  $scope.paymenttypes = [];
  $scope.GetPaymentTypes = function () {
    Restangular.all("cache/storepaymenttype")
      .getList({
        StoreID: $rootScope.user.StoreID,
        OrderID: $scope.order.id,
      })
      .then(
        function (result) {
          for (var i = 0; i < result.length; i++) {
            if (result[i].isActiveValue == true) {
              if (result[i].PaymentType.name == "GastroPay") {
                $scope.GastropayPayment = result[i];
                $scope.GastropayEnabled = true;
              }
              $scope.storepaymenttypes.push(result[i]);
            }
          }
          //$scope.getBekoECRPayment();
          var pt = $filter("filter")(result, {
            id: $scope.order.PaymentTypeID,
          });
          if (pt && pt.length > 0) {
            $scope.currentPayment.PaymentTypeID = pt[0].PaymentTypeID;
          } else {
            $scope.currentPayment.PaymentTypeID = result[0].PaymentTypeID;
          }
        },
        function (response) {
          toaster.pop(
            "Warning",
            $translate.instant("Server.ServerError"),
            response
          );
        }
      );
  };
  $scope.GetPaymentTypes();
  $scope.splitAccount = function (item) {
    var modalInstance = $modal.open({
      templateUrl: "assets/views/tableplan/splitaccount.html",
      controller: "splitaccountCtrl",
      size: "lg",
      backdrop: "",
      resolve: {
        Order: function () {
          return $scope.order;
        },
      },
    });
    modalInstance.result.then(function (item) {
      if (item == "OK") {
        Restangular.one("order", $scope.order.id)
          .get()
          .then(function (result) {
            $scope.order = result;
            $scope.CalcRequiredAmount();
            $scope.ok();
          });
      }
    });
  };

  $scope.gastropay = function () {
    var modalInstance = $modal.open({
      templateUrl: "assets/views/order/gastropay.html",
      controller: "gastropayCtrl",
      size: "",
      backdrop: "",
      resolve: {
        Order: function () {
          return $scope.order;
        },
        GastropayPayment:function () {
            return $scope.GastropayPayment;
          },
      },
    });
    modalInstance.result.then(function (item) {
      $scope.CalcRequiredAmount();
      $scope.ok();
      $scope.SavePayment($scope.GastropayPayment);
      location.href = "#/app/orders/takeaway/";
    });
  };

  $scope.OrderInvoice;
  $scope.GetOrderInvoice = function () {
    if (!$scope.OrderInvoice) {
      Restangular.all("OrderInvoice")
        .getList({
          pageNo: 1,
          pageSize: 1000,
          search: "OrderID=" + $scope.order.id,
        })
        .then(
          function (result) {
            $scope.OrderInvoice = result[0];
            return $scope.OrderInvoice;
          },
          function (response) {
            toaster.pop("warning", response.data.ExceptionMessage);
          }
        );
    } else return $scope.OrderInvoice;
  };
  $scope.CreateOrderInvoice = function () {
    if (!$scope.OrderInvoice) {
      Restangular.all("OrderInvoice")
        .post({
          OrderID: $scope.order.id,
        })
        .then(
          function (result) {
            toaster.pop(
              "success",
              $translate.instant("orderfile.Saved"),
              $translate.instant("orderfile.Saved")
            );
            $scope.OrderInvoice = result;
            //$scope.ok();
          },
          function (response) {
            toaster.pop(
              "error",
              $translate.instant("Server.ServerError"),
              response.data.ExceptionMessage
            );
          }
        );
    }
  };
  $scope.SaveOrderInvoice = function () {
    if ($scope.OrderInvoice.restangularized && $scope.OrderInvoice.id) {
      $scope.OrderInvoice.put().then(function (resp) {
        toaster.pop(
          "success",
          $translate.instant("orderfile.Saved"),
          $translate.instant("orderfile.Saved")
        );
      });
    } else {
      Restangular.all("OrderInvoice")
        .post({
          OrderID: $scope.order.id,
        })
        .then(
          function (result) {
            toaster.pop(
              "success",
              $translate.instant("orderfile.Saved"),
              $translate.instant("orderfile.Saved")
            );
            $scope.OrderInvoice = result;
            //$scope.ok();
          },
          function (response) {
            toaster.pop(
              "error",
              $translate.instant("Server.ServerError"),
              response.data.ExceptionMessage
            );
          }
        );
    }
    if (!$scope.OrderInvoice) {
    }
  };
  $scope.GetOrderInvoice();

  //**********//********** // ********** // ********** // ********** // **********// BEKO //**********//********** // ********** // ********** // ********** //
  $scope.getBekoECRPayment = function () {
    if ($rootScope.user.Store.MemberID == "507632258556") {
      var amount = Order.Amount * 100;
      $scope.fiscalId = "AT0000141663";
      $scope.receiptId = null;
      $scope.salesSlip = {
        opType: 8,
        fiscal: $scope.fiscalId,
      };
      chrome.experimental.arcsp.sendJsonToPos(
        JSON.stringify($scope.salesSlip),
        function (pos_result) {
          var result = JSON.parse(pos_result);
          $scope.receiptId = parseInt(result.body["receipt id"]);
          var itemList = [];
          var item1 = {
            name: "GIDA",
            quantity: 10000,
            section: 1,
            price: amount,
            pluId: 0,
          };
          itemList.push(item1);
          var paymentObj = {
            opType: 7,
            fiscal: $scope.fiscalId,
            body: {
              payment_type: 1, //TODO select Payment Type
              payment_amount: amount,
              item_list: itemList,
            },
          };
          chrome.experimental.arcsp.sendJsonToPos(
            JSON.stringify(paymentObj),
            function (pos_result) {}
          ); // sendJsonToPos finish
        }
      );
    }
  };
  $scope.setBekoECRPayment = function (paymentType) {
    if ($rootScope.user.Store.MemberID == "507632258556") {
      var amount = $scope.currentPayment.Amount * 100;
      if (paymentType.PaymentTypeID == 0) {
        var setPaymentTypeID = 1;
      }
      if (paymentType.PaymentTypeID == 1) {
        var setPaymentTypeID = 2;
      }
      var lastPaymentObj = {
        opType: 1,
        fiscal: $scope.fiscalId,
        body: {
          receipt_id: $scope.receiptId,
          payment_type: setPaymentTypeID,
          payment_description: paymentType.name,
          payment_amount: amount,
        },
      };
      chrome.experimental.arcsp.sendJsonToPos(
        JSON.stringify(lastPaymentObj),
        function (pos_result) {}
      );
    }
  };
  $scope.cancelBekoECRPayment = function () {
    var PaymentObj = {
      opType: 3,
      fiscal: $scope.fiscalId,
    };
    chrome.experimental.arcsp.sendJsonToPos(
      JSON.stringify(PaymentObj),
      function (pos_result) {}
    );
  };
  //**********//********** // ********** // ********** // ********** // **********// BEKO //**********//********** // ********** // ********** // ********** //
  $scope.$on("$destroy", function () {
    tranlatelistener();
    $rootScope.uService.ExitController("orderpaymentCtrl");
  });
}

("use strict");
app.controller("orderinvoiceCtrl", orderinvoiceCtrl);
function orderinvoiceCtrl(
  $rootScope,
  $scope,
  $modalInstance,
  $log,
  $filter,
  SweetAlert,
  Restangular,
  ngTableParams,
  toaster,
  $window,
  $translate
) {
  var oin = this;
  $rootScope.uService.EnterController("orderinvoiceCtrl");
  $scope.item = {};
  $scope.saveData = function () {
    if (this.item.restangularized) {
      this.item.put().then(function (res) {
        oin.tableParams.reload();
        toaster.pop(
          "success",
          $translate.instant("orderfile.Updated"),
          $translate.instant("orderfile.Updated")
        );
      });
    } else {
      Restangular.restangularizeElement("", this.item, "OrderInvoice");
      this.item.post().then(function (res) {
        oin.tableParams.reload();
        toaster.pop(
          "success",
          $translate.instant("orderfile.Saved"),
          $translate.instant("orderfile.Saved")
        );
      });
      this.item.get();
    }
  };
  $scope.translate = function () {
    $scope.trTaxOffice = $translate.instant("main.TAXOFFICE");
    $scope.trTaxNumber = $translate.instant("main.TAXNUMBER");
    $scope.trTittle = $translate.instant("main.TITTLE");
    $scope.trAddress = $translate.instant("main.ADDRESS");
    $scope.trCommands = $translate.instant("main.COMMANDS");
    $scope.trNote = $translate.instant("main.NOTE");
    $scope.trPhoneNumber = $translate.instant("main.NUMBER");
    $scope.trOrderID = $translate.instant("main.ORDER");
  };
  $scope.translate();
  var deregistration = $scope.$on(
    "$translateChangeSuccess",
    function (event, data) {
      // ON LANGUAGE CHANGED
      $scope.translate();
    }
  );
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
    if (
      !oin.tableParams.data[oin.tableParams.data.length - 1].restangularized
    ) {
      $scope.cancelremove(oin.tableParams.data.length - 1, 1);
      toaster.pop(
        "warning",
        $translate.instant("orderfile.Cancelled"),
        $translate.instant("difinitions.Insertcancelled")
      );
    } else {
      toaster.pop(
        "warning",
        $translate.instant("orderfile.Cancelled"),
        $translate.instant("difinitions.Editcancelled")
      );
    }
  };

  oin.tableParams = new ngTableParams(
    {
      page: 1,
      count: 10,
      sorting: {},
    },
    {
      getData: function ($defer, params) {
        Restangular.all("OrderInvoice")
          .getList({
            pageNo: params.page(),
            pageSize: params.count(),
            sort: params.orderBy(),
            //search: "OrderID='" + $scope.OrderID + "'"
          })
          .then(
            function (items) {
              params.total(items.paging.totalRecordCount);
              $defer.resolve(items);
            },
            function (response) {
              toaster.pop(
                "warning",
                $translate.instant("Server.ServerError"),
                response.data.ExceptionMessage
              );
            }
          );
      },
    }
  );

  $scope.removeItem = function (index) {
    SweetAlert.swal(
      {
        title: $translate.instant("orderfile.Sure"),
        text: $translate.instant("orderfile.SureRecord"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: $translate.instant("orderfile.confirmButtonText"),
        cancelButtonText: $translate.instant("orderfile.cancelButtonText"),
        closeOnConfirm: true,
        closeOnCancel: true,
      },
      function (isConfirm) {
        if (isConfirm) {
          if (oin.tableParams.data[index].fromServer) {
            oin.tableParams.data[index].remove();
          }
          oin.tableParams.data.splice(index, 1);
          toaster.pop(
            "error",
            $translate.instant("orderfile.Attention"),
            $translate.instant("orderfile.RecordDeleted")
          );
        }
      }
    );
  };
  $scope.cancelremove = function (index) {
    if (oin.tableParams.data[index].fromServer) {
      oin.tableParams.data[index].remove();
    }
    oin.tableParams.data.splice(index, 1);
  };
  $scope.addItem = function () {
    oin.tableParams.data.push({ PersonID: $rootScope.PersonID });
  };
  var unbindWatcher = $scope.$watch(
    angular.bind(oin, function () {
      return $rootScope.PersonID;
    }),
    function (value) {
      oin.tableParams.reload();
    }
  );
  $scope.ok = function () {
    $modalInstance.close("return");
  };
  $scope.cancel = function () {
    $modalInstance.dismiss("cancel");
  };
  $scope.$on("$destroy", function () {
    unbindWatcher();
    deregistration();
    $rootScope.uService.ExitController("orderinvoiceCtrl");
  });
}
