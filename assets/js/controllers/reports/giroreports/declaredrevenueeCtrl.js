app.controller("declaredrevenueeCtrl", declaredrevenueeCtrl);
function declaredrevenueeCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, ngnotifyService, userService, $element, $timeout, NG_SETTING, $http, $q) {
  $rootScope.uService.EnterController("declaredrevenueeCtrl");
  userService.userAuthorizated();
  var dre = this;
  $scope.item = {};
  $scope.items = [];
  $scope.resdata = {};
  $scope.Back = function () {
    $location.path("app/specialoperations/declaredrevenueelist");
  };
  $scope.translate = function () {
    $scope.trStore = $translate.instant("main.STORE");
    $scope.trOperationDate = $translate.instant("main.OPERATIONDATE");
    $scope.trTotalAmount = $translate.instant("main.TOTALAMOUNT");
    $scope.trTotalCash = $translate.instant("main.TOTALCASH");
    $scope.trNotes = $translate.instant("main.NOTE");
    $scope.trisCharged = $translate.instant("main.STATE");
    $scope.save = $translate.instant("main.SAVE");
    $scope.delete = $translate.instant("main.DELETE");
    $scope.addadnewpaymentitem = $translate.instant("main.ADDNEWPAYMENTITEM");
    $scope.trPaymentType = $translate.instant("main.PAYMENTTYPE");
    $scope.trTotalActualAmount = $translate.instant("main.TOTALACTUALAMOUNT");
    $scope.trTotalDeclaredAmount = $translate.instant("main.TOTALDECLAREDAMOUNT");
    $scope.Approve = $translate.instant("main.APPROVE");
    $scope.trCommands = $translate.instant("main.COMMANDS");
    $scope.Oracle = $translate.instant("main.ORACLE");
    $scope.trReceiptNumber = $translate.instant("main.RECEIPTNUMBER");
    $scope.trDepositedAmount = $translate.instant("main.DEPOSITEDAMOUNT");
    $scope.trATMID = $translate.instant("main.ATMID");
  };
  $scope.translate();
  var deregistration = $scope.$on(
    "$translateChangeSuccess",
    function (event, data) {
      $scope.translate();
    }
  );
  $scope.DeclaredRevenueID = $stateParams.id;
  $scope.foundStore = function (StoreID) {
    for (var i = 0; i < $scope.stores.length; i++) {
      if ($scope.stores[i].id == StoreID) return $scope.stores[i].name;
    }
  };
  if (!userService.userIsInRole("STOREMANAGER")) {
    $scope.hideButton = true;
  }
  //     page: 1,
  //     count: 10,
  // }, {
  //     getData: function ($defer, params) {
  //         if ($scope.item.items && $scope.item.items.length > 0) {
  //             $defer.resolve($scope.item.items);
  //         } else {
  //             $scope.item.items = [];
  //             $defer.resolve($scope.item.items);
  //         }
  //     }
  // });
  /*
    $http.get(NG_SETTING.apiServiceBaseUri + "/api/DeclaredRevenue/"+$stateParams.id)
        .then(function (response) {
            $scope.item=response.data;
            var dataGrid = $('#gridContainer').dxDataGrid('instance');
            dataGrid.option("dataSource", $scope.item.items);
        }, function (result) {
            return $q.reject("Data Loading Error");
        });
        */
  Restangular.one("DeclaredRevenue", $stateParams.id)
    .get()
    .then(
      function (restresult) {
        $scope.item = Restangular.copy(restresult);
        $scope.items = Restangular.copy($scope.item.items);
        var dataGrid = $("#gridContainer").dxDataGrid("instance");
        dataGrid.option("dataSource", $scope.items);
      },
      function (restresult) {
        toaster.pop("error", "Error", $translate.instant("Server.ServerError"));
        swal("Error!", $translate.instant("Server.DataError"), "Warning");
      }
    );
  $scope.dataGridOptions = {
    //dataSource: $scope.item.items,
    showBorders: true,
    allowColumnResizing: true,
    columnAutoWidth: true,
    showColumnLines: true,
    showRowLines: true,
    rowAlternationEnabled: true,
    keyExpr: "id",
    showBorders: true,
    hoverStateEnabled: true,
    allowColumnReordering: true,
    filterRow: { visible: true },
    headerFilter: { visible: true },
    searchPanel: { visible: true },
    showBorders: true,
    //noDataText:  $translate.instant('InventoryRequirmentItem.Calculatingrequirments'),
    paging: {
      enabled: false,
    },
    editing: {
      mode: "cell",
      allowUpdating: true,
    },
    columns: [
      {
        caption: $translate.instant("DeclaredRevenue.PaymentType"),
        dataField: "PaymentType.name",
        dataType: "string",
        allowEditing: false,
        sortIndex: 0,
        sortOrder: "desc",
      },
      {
        caption: $translate.instant("DeclaredRevenue.ActualAmount"),
        dataField: "ActualAmount",
        format: { type: "fixedPoint", precision: 2 },
        visibleIndex: 2,
        allowEditing: false,
      },
      {
        caption: $translate.instant("DeclaredRevenue.DeclaredAmount"),
        dataField: "DeclaredAmount",
        format: { type: "fixedPoint", precision: 2 },
        visibleIndex: 3,
        validationRules: [
          {
            type: "range",
            message: "Gireceğiniz rakamlar  0  ile 2000 arasında olmalıdır",
            min: 0,
          },
        ],
      },
    ],
    summary: {
      totalItems: [
        {
          column: "DeclaredAmount",
          summaryType: "sum",
          valueFormat: { type: "fixedPoint", precision: 2 },
          displayFormat: "{0}",
        },
        {
          column: "ActualAmount",
          summaryType: "sum",
          valueFormat: { type: "fixedPoint", precision: 2 },
          displayFormat: "{0}",
        },
      ],
      groupItems: [
        {
          name: "DeclaredAmount",
          showInColumn: "Total",
          summaryType: "sum",
          valueFormat: { type: "fixedPoint", precision: 2 },
          displayFormat: "{0}",
          alignByColumn: true,
        },
        {
          name: "ActualAmount",
          showInColumn: "Total",
          summaryType: "sum",
          valueFormat: { type: "fixedPoint", precision: 2 },
          displayFormat: "{0}",
          alignByColumn: true,
        },
      ],
    },
    onEditingStart(e) {
      if (e.column.name && e.column.name == "DeclaredAmount")
        e.cancel = !e.data["canEdit"];
    },
    onEditorPreparing: function (e) {
      if (e.parentType === "dataRow" && e.dataField == "DeclaredAmount") {
        e.editorOptions.valueChangeEvent = "keyup";
        // e.editorOptions.onValueChanged = (args) => {
        //   e.setValue(args.value);
        // };
      }
    },
    // onContentReady(e) {
    //     document.querySelector('.dx-datagrid-rowsview').before(document.querySelector('.dx-datagrid-total-footer'));
    //     }
  };
  $scope.transmittedOracle = function () {
    Restangular.one("DeclaredRevenue/send")
      .get({
        id: $stateParams.id,
      })
      .then(
        function (restresult) {
          toaster.pop(
            "success",
            $translate.instant("declaredrevenuelist.transmittedOracle")
          );
        },
        function (response) {
          toaster.pop("warning", "warning...", response.data.ExceptionMessage);
        }
      );
  };
  $scope.EditCountDisabled = function () {
    return $stateParams.id != "new";
  };
  $scope.SaveData = function () {
    $timeout(function () {
      $scope.SaveDataToAPI();
    }, 1000);
  }
  $scope.SaveDataToAPI = function () {
    if ($scope.item.restangularized && $scope.item.id) {
      angular.copy($scope.items, $scope.item.items);
      Restangular.restangularizeElement("", $scope.item, "DeclaredRevenue");
      $scope.item.put().then(
        function (resp) {
          $location.path("app/mainscreen");
          swal(
            $translate.instant("orderfile.Updated"),
            $translate.instant("orderfile.Updated"),
            "success"
          );
        },
        function (response) {
          toaster.pop(
            "error",
            $translate.instant("Server.ServerError"),
            response.data.ExceptionMessage
          );
        }
      );
    } else {
      Restangular.restangularizeElement("", $scope.item, "DeclaredRevenue");
      $scope.item.post().then(
        function (resp) {
          $scope.item.id = resp.id;
          swal(
            $translate.instant("orderfile.Saved"),
            $translate.instant("orderfile.Saved"),
            "success"
          );
          $location.path("app/specialoperations/declaredrevenueelist");
          $scope.item = {};
          $scope.item = Restangular.copy(resp);
          // dre.tableParams.reload();
          $scope.DeclaredRevenueID = $stateParams.id;
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
  $scope.removedata = function (SelectItem) {
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
          $scope.item.remove().then(function () {
            SweetAlert.swal(
              $translate.instant("orderfile.Deleted"),
              $translate.instant("orderfile.RecordDeleted"),
              "success"
            );
            $location.path("app/mainscreen");
          });
        } else {
          SweetAlert.swal(
            $translate.instant("orderfile.Cancelled"),
            $translate.instant("orderfile.DeletionCanceled"),
            "error"
          );
        }
      }
    );
  };
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
          if (dre.tableParams.data[index].fromServer) {
            dre.tableParams.data[index].remove();
          }
          dre.tableParams.data.splice(index, 1);
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
    if (dre.tableParams.data[index].fromServer) {
      dre.tableParams.data[index].remove();
    }
    dre.tableParams.data.splice(index, 1);
  };
  $scope.addItem = function () {
    dre.tableParams.data.push({ DeclaredRevenueID: $scope.DeclaredRevenueID });
  };
  $scope.ShowObject = function (Container, idName, idvalue, resName) {
    for (var i = 0; i < $scope[Container].length; i++) {
      if ($scope[Container][i][idName] == idvalue)
        return $scope[Container][i][resName];
    }
    return idvalue || "Not set";
  };
  $scope.loadEntitiesCache = function (EntityType, Container) {
    if (!$scope[Container].length) {
      Restangular.all(EntityType)
        .getList({})
        .then(
          function (result) {
            $scope[Container] = result;
          },
          function (response) {
            toaster.pop(
              "Warning",
              $translate.instant("Server.ServerError"),
              response
            );
          }
        );
    }
  };
  $scope.stores = [];
  $scope.loadEntitiesCache("cache/store", "stores");
  $scope.storepaymenttypes = [];
  $scope.loadStorePaymentTypes = function (StoreID) {
    Restangular.all("cache/storepaymenttype")
      .getList({
        StoreID: StoreID,
      })
      .then(
        function (result) {
          $scope.storepaymenttypes = result;
        },
        function (response) {
          toaster.pop(
            "Warning",
            $translate.instant("Server.ServerError"),
            response.data.ExceptionMessage
          );
        }
      );
  };
  if ($stateParams.id != "new") {
    Restangular.one("DeclaredRevenue", $stateParams.id)
      .get()
      .then(function (restresult) {
        $scope.item = Restangular.copy(restresult);
        $scope.loadStorePaymentTypes(restresult.StoreID);
        //dre.tableParams.reload();
        if (!userService.userIsInRole("Admin")) {
          $scope.item["StoreName"] = $scope.foundStore($scope.item.StoreID);
          $scope.selectStore = false;
        } else {
          $scope.selectStore = true;
        }
      });
  } else {
    $scope.item = {};
    if (!userService.userIsInRole("Admin")) {
      $scope.item.StoreID = $rootScope.user.StoreID;
      $scope.item["StoreName"] = $rootScope.user.Store.name;
      $scope.selectStore = false;
    } else {
      $scope.selectStore = true;
    }
  }
  $scope.datepopup = function (item) {
    var modalInstance = $modal.open({
      templateUrl: "assets/views/Tools/date.html",
      controller: "dateCtrl",
      size: "",
      backdrop: "",
      resolve: {
        DateTime: function () {
          return item;
        },
      },
    });
    modalInstance.result.then(function (item) {
      $scope.item.OperationDate = item;
    });
  };
  $scope.$on("$destroy", function () {
    deregistration();
    $element.remove();
    $rootScope.uService.ExitController("declaredrevenueeCtrl");
  });
}
