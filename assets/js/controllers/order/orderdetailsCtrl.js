app.controller('orderdetailsCtrl', orderdetailsCtrl);
function orderdetailsCtrl($scope, $rootScope, $log, $translate, $http, $modal, $interval, $filter, Restangular, $q, $stateParams, NG_SETTING, ngTableParams, SweetAlert, toaster, $window, $location, userService, ngnotifyService, $element, $translate) {
    $rootScope.uService.EnterController("orderdetailsCtrl");
    userService.userAuthorizated();
    $scope.StoreData = {};
    if ($rootScope.user.UserRole.Name == 'Alonet') {
        $scope.buttonpanel = false;
    } else {
        $scope.ButtonPanel = true;
    }
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.userRestrictions = $rootScope.user.restrictions;
    $scope.translate = function (StoreOrderTypes) {
        $scope.orderdetails = $translate.instant('main.ORDERDETAILSS');
        $scope.ordernumber = $translate.instant('main.ORDERNUMBER');
        $scope.ordertype = $translate.instant('main.ORDERTYPE');
        $scope.orderno = $translate.instant('main.ORDERNO');
        $scope.back = $translate.instant('main.BACK');
        $scope.ordersource = $translate.instant('main.ORDERSOURCE');
        $scope.personname = $translate.instant('main.PERSONNAME');
        $scope.address = $translate.instant('main.ADDRESS');
        $scope.addressnote = $translate.instant('main.ADDRESSNOTE');
        $scope.personnote = $translate.instant('main.PERSONNOTE');
        $scope.companyname = $translate.instant('main.COMPANYNAME');
        $scope.amount = $translate.instant('main.AMOUNT');
        $scope.orderstate = $translate.instant('main.ORDERSTATE');
        $scope.paymenttype = $translate.instant('main.PAYMENTTYPE');
        $scope.paymentstatus = $translate.instant('main.PAYMENTSTATUS');
        $scope.paymentnote = $translate.instant('main.PAYMENTNOTE');
        $scope.ordernote = $translate.instant('main.ORDERNOTE');
        $scope.orderdate = $translate.instant('main.ORDERDATE');
        $scope.deliverydate = $translate.instant('main.DELIVERYDATE');
        $scope.agent = $translate.instant('main.AGENT');
        $scope.reprint = $translate.instant('main.REPRINT');
        $scope.changetoorder = $translate.instant('main.CHANGETOORDER');
        $scope.sendtofiyuu = $translate.instant('main.SENDTOFIYUU');
        $scope.sendgifpromotions = $translate.instant('main.SENDGIFTPROMOTIONS');
        $scope.canceltoorder = $translate.instant('main.CANCELTOORDER');
        $scope.addpromotion = $translate.instant('main.ADDPROMOTION');
        $scope.deleteysmaping = $translate.instant('main.DELETEYSMAPING');
        $scope.acceptorder = $translate.instant('main.ACCEPTORDER');
        $scope.refreshorder = $translate.instant('main.REFRESHORDER');
        $scope.changetopaymenttype = $translate.instant('main.CHANGETOPAYMENTTYPE');
        $scope.refuseorder = $translate.instant('main.REFUSEDORDER');
        $scope.chooseorderstate = $translate.instant('main.CHOOSEORDERSTATE');
        $scope.sendordertofiyuu = $translate.instant('main.SENDORDERTOFIYUU');
        $scope.reverttoprevstate = $translate.instant('main.REVERTTOPREVSTATE');
        $scope.updateorderpaymentstatus = $translate.instant('main.UPDATEORDERPAYMENTSTATUS');
        $scope.updateorderstatusadmin = $translate.instant('main.UPDATEORDERSTATUSADMIN');
        $scope.updatecode = $translate.instant('main.UPDATECODE');
        $scope.orderitemdetails = $translate.instant('main.ORDERITEMDETAILS');
        $scope.satates = $translate.instant('main.SATATES');
        $scope.promotions = $translate.instant('main.PROMOTIONS');
        $scope.state = $translate.instant('main.STATE');
        $scope.time = $translate.instant('main.TIME');
        $scope.user = $translate.instant('main.USER');
        $scope.driver = $translate.instant('main.DRIVER');
        $scope.reason = $translate.instant('main.REASON');
        $scope.promotionname = $translate.instant('main.PROMOTIONNAME');
        $scope.promotioncode = $translate.instant('main.PROMOTIONCODE');
        $scope.payment = $translate.instant('main.PAYMENT');
        $scope.paymenttype = $translate.instant('main.PAYMENTTYPE');
        $scope.date = $translate.instant('main.DATE');
        $scope.amount = $translate.instant('main.AMOUNT');
        $scope.store = $translate.instant('main.STORE');
        $scope.storetype = $translate.instant('main.STORETYPE');
        $scope.storephone = $translate.instant('main.STOREPHONE');
        $scope.servicestime = $translate.instant('main.SERVICESTIME');
        $scope.storenote = $translate.instant('main.STORENOTE');
        $scope.storedetails = $translate.instant('main.STOREDETAILS');
        $scope.closeorderpayment = $translate.instant('main.CLOSEORDERPAYMENT');
        $scope.refreshorderamount = $translate.instant('main.REFRESHORDERAMOUNT');
        $scope.repeatorder = $translate.instant('main.REPEATORDER');
        $scope.isChargedd = $translate.instant('main.ISCHARGEDD');
        $scope.open = $translate.instant('main.OPEN');
        $scope.close = $translate.instant('main.CLOSE');
        $scope.efaturadetails = $translate.instant('main.EFATURADETAILS');
        $scope.invoiceid = $translate.instant('main.ORDERINVOICEID');
        $scope.phonenumber = $translate.instant('main.PHONENUMBER');
        $scope.taxnumber = $translate.instant('main.TAXNUMBER');
        $scope.taxoffice = $translate.instant('main.TAXOFFICE');
        $scope.title = $translate.instant('main.TITLE');
        $scope.duration = $translate.instant('main.DURATION');
        $scope.durationn = $translate.instant('main.DURATIONN');
        $scope.product = $translate.instant('main.PRODUCT');
        $scope.productOption = $translate.instant('main.PRODUCTOPTION');
        $scope.productPrice = $translate.instant('main.PRODUCTPRICE');
        $scope.addDate = $translate.instant('main.ADDDATE');
        $scope.totalAmount = $translate.instant('main.TOTALAMOUNT');
        $scope.landmark = $translate.instant('main.LANDMARK');
        $scope.addressType = $translate.instant('main.ADDRESSTYPE');
        $scope.Floor = $translate.instant('main.FLOOR');
        $scope.AddressNo = $translate.instant('main.*ADDRESSNO');
        $scope.AppartmentNo = $translate.instant('main.*APERTMENTNO');
        $scope.AppartmentName = $translate.instant('main.APPARTMENTNAME');
        $scope.OperationDate = $translate.instant('main.OPERATIONDATE');
        $scope.LastStateDate = $translate.instant('main.LASTSTATEDATE');
        $scope.quantity = $translate.instant('main.QUANTITY');
        
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectPromotions = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/selectPromotion.html',
            controller: 'orderpromotionsCtrl',
            size: '',
            backdrop: '',
            resolve: {
                Order: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (data) {
            if (data) {
                $scope.RefreshOrder($stateParams.id)
                $scope.getOrder();
            }
        })
    };
    $scope.RemovePromotion = function (OrderID) {
        Restangular.all("orderpromotion").getList({
            search: "OrderID='" + OrderID + "'"
        }).then(function (result) {
            $scope.DeletePromotion(result[0].id);
        },
            function (response) {
                toaster.pop('error', $translate.instant('Server.Serverconnectionerror'), response.data.ExceptionMessage);
            });
    };
    $scope.DeletePromotion = function (ID) {
        Restangular.one("orderpromotion", ID).remove().then(function () {
            toaster.pop("error", $translate.instant('orderfile.Deleted'), $translate.instant('orderfile.PromotionDeleted'));
            $scope.getOrder();
            $scope.RefreshOrder($stateParams.id)
        });
    };
    var states = [];
    $scope.orders = [];
    $scope.getOrder = function () {
        if ($stateParams.id != 'new') {
            Restangular.one('order', $stateParams.id).get().then
                (function (restresult) {
                    $scope.item = Restangular.copy(restresult);
                    $scope.item = restresult.plain();
                    $scope.item.Address;
                    var Ad = $('#form1').dxForm('instance');
                    Ad.updateData($scope.item.Address);
                    states = $scope.item.states;
                    var statex = $('#gridContainerstate').dxDataGrid('instance');
                    statex.option("dataSource", states);
                     $scope.orderdxget();
                    $scope.GetStore(restresult.StoreID)
                    for (var i = 0; i < restresult.states.length; i++) {
                        if (restresult.states[i].OrderStateID == 0)
                            if (restresult.states[i].User) {
                                $scope.User = restresult.states[i].User;
                            }
                    }
                },
                    function (restresult) {
                        toaster.pop('warning', $translate.instant('orderfile.Cancelled'), restresult.data.ExceptionMessage);
                    }
                )
        }
    };
    var order = [];
    $scope.getOrder();
    $scope.GetStore = function (StoreID) {
        Restangular.one('store', StoreID).get().then
            (function (restresult) {
                angular.copy(restresult, $scope.StoreData);
            })
    };
    $scope.orderdxget = function () {
        Restangular.all("orderitem").getList({
            search: "OrderID='" + $stateParams.id + "'"
        }).then(function (result) {
            $scope.orderItems = angular.copy(result);
            $("#treeViewContainer").dxTreeList("instance").option("dataSource", result);
        },
            function (response) {
                toaster.pop('error', $translate.instant('Server.Serverconnectionerror'), response.data.ExceptionMessage);
            });
    };
    var params = {
        search: "OrderID='" + $stateParams.id + "'"
    };
    $http.get(NG_SETTING.apiServiceBaseUri + "/api/orderitem", { params: params })
    .then(function (result) {
        $scope.orderItems = angular.copy(result);
        var dataGrid = $("#treeViewContainer").dxTreeList("instance");
        dataGrid.option("dataSource", result);
    }, function (response) {
        return $q.reject("Data Loading Error");
    });
    $scope.dataGridOptionsorder = {
        dataSource: order,
        showRowLines: true,
        showBorders: true,
        columnAutoWidth: true,
        allowColumnResizing: true,
        showColumnLines: true,
        rowAlternationEnabled: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        //selectedRowKeys: [1, 29, 42],
        autoExpandAll: true,
        wordWrapEnabled: true,
        remoteOperations: { grouping: true },
        //keyExpr: 'id',
        //displayExpr: 'caption',
        parentIdExpr: 'ParentItemID',
        virtualModeEnabled: true,
        autoExpandAll:true,   
        columns: [
            { name: "Product", dataField: "Product", caption: $scope.product,minWidth:200,
            cellTemplate(container, options) {
                const productname = options.data.Product;
                const pnotes = options.data.Notes;
                if (pnotes) {
                  container
                    .append($('<span>', { class: 'name', text: productname }))
                    .append('<br>')
                    .append($('<span>', { class: 'name', text: pnotes }).css("font-style", "italic"));
                    //.append($('<span>', { class: 'name', text: pnotes }).css("color", "blue").css("font-style", "italic"));
                }
                else 
                {
                    container
                    .append($('<span>', { class: 'name', text: productname }));
                }
        }
    },
            { name: "Quantity", dataField: "Quantity", caption: $scope.quantity,format: { type: "fixedPoint", precision: 2 } },
            // { name: "ProductOption", dataField: "ProductOption", caption: $scope.productOption },
            { name: "ProductPrice", dataField: "ProductPrice",caption: $scope.productPrice,format: { type: "fixedPoint", precision: 2 }},
            { name: "TotalAmount", dataField: "TotalAmount", caption:  $scope.totalAmount, summaryType: "count", format: "#,##0.00₺" },
            { name: "AddDate", dataField: "AddDate", caption:  $scope.addDate ,dataType: "date", format: " HH:mm:ss" },            
        ],
        summary: {
            totalItems: [
                { column: "TotalAmount", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
                //{ name: "UnitCustom", showInColumn: "UnitCustom", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}" },
            ],
            groupItems: [
                //{ name: "UnitCustom", showInColumn: "UnitCustom", summaryType: "custom", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
                { column: "TotalAmount", showInColumn: "Total", summaryType: "sum", valueFormat: { type: "fixedPoint", precision: 2 }, displayFormat: "{0}", alignByColumn: true },
            ],
        },
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
            OrderDate: $filter('date')(order.OrderDate, 'yyyy-MM-dd HH:mm'),
            DeliveryDate: $filter('date')(order.DeliveryDate, 'yyyy-MM-dd HH:mm'),
            OperationDate: order.OperationDate,
            OrderNote: order.OrderNote,
            PaymentNote: order.PaymentNote,
            StoreTableID: order.StoreTableID,
        }
    };
    $scope.item = {};
    $scope.item.Address = {};
    $scope.OrderAddress = {
        formData: {},
        colCount: 2,
        items: [{
            itemType: "group", items: [
                { dataField: "StreetAddress", label: { text: $scope.address }, editorType: "dxTextArea", editorOptions: { height: 90 }},
                { dataField: "Landmark", label: { text: $scope.landmark }, editorType: "dxTextArea", editorOptions: { height: 90}},
            ]},
        { itemType: "group", items: [
                { dataField: "Notes", label: { text: $scope.addressnote }, editorType: "dxTextArea", editorOptions: { height: 90 }},
                { dataField: "PaymentNote", label: { text: $scope.paymentnote }, editorType: "dxTextArea", editorOptions: { height: 90}},
            ]}
        ],
        readOnly: true,
        //disabled:true,
        labelLocation: 'top'
    };
    $scope.dataGridOptionsstate = {
        dataSource: states,
        showBorders: true,
        allowColumnResizing: true,
        columnAutoWidth: true,
        showColumnLines: true,
        showRowLines: true,
        rowAlternationEnabled: true,
        //keyExpr: "id",
        showBorders: true,
        hoverStateEnabled: true,
        allowColumnReordering: true,
        //filterRow: { visible: true },
        // headerFilter: { visible: true },
        // searchPanel: { visible: true },
        columns: [
            { name: "OrderStateName", dataField: "OrderStateName", caption:  $scope.state},
            { name: "OrderStateDate", dataField: "OrderStateDate", caption:  $scope.time, dataType: "date", format: " HH:mm:ss" },
            { name: "Duration", dataField: "Duration", caption: $scope.duration,width:96},
            { name: "UpdateUserName", dataField: "UpdateUserName", caption: $scope.user },
            { name: "Driver", dataField: "Driver", caption: $scope.driver },
            { name: "Reason", dataField: "OrderReason", caption:   $scope.reason },
            { name: "Store", dataField: "Store", caption:   $scope.store },
        ],
    };
    $scope.AwaitingCCAutorization = function (item) {
        if (item.OrderStateID == 20) {
            swal({
                title: $translate.instant('yemeksepetifile.Areyousureyouwanttoconfirmtheorder'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: $translate.instant('yemeksepetifile.Yes'),
                closeOnConfirm: false
            }, function () {
                Restangular.one('order', item.id).get().then
                    (function (restresult) {
                        var ordertosave = $scope.CopyOrder(restresult);
                        ordertosave.OrderStateID = 13;
                        Restangular.restangularizeElement('', ordertosave, 'order');
                        if (ordertosave.restangularized && ordertosave.id) {
                            ordertosave.put().then(function (resp) {
                                $scope.getOrder();
                                swal($translate.instant('orderfile.Updated'), $translate.instant('yemeksepetifile.OrderConfirmed'), "success");
                            }, function (response) {
                                toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                            });
                        }
                    })
            });
        } else {
            toaster.pop('warning', $translate.instant('yemeksepetifile.OrderCannotBeChanged'), "");
        }
    };
    $scope.RePrintOrder = function (OrderID) {
        Restangular.all('ordertools/PrintLabels').getList({
            OrderID: OrderID
        }).then(function (_orderItems) {
            toaster.pop('success', $translate.instant('yemeksepetifile.PrintedAgain'));
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    };
    $scope.SendToFiyuu = function (OrderID) {
        Restangular.all('ordertools/sendToFiyuu').getList({
            OrderID: OrderID
        }).then(function (_orderItems) {
            toaster.pop('success', $translate.instant('yemeksepetifile.OrderFiyuutransmissioninitiated'));
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response);
        });
    };
    $scope.Date = $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss dd-MM-yyyy')
    $scope.SendToFiyuu = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('ordertools/sendToFiyuu').get({
            OrderID: OrderID,
        }).then(function (result) {
            toaster.pop("success", $translate.instant('yemeksepetifile.TransmittedtoFiyuu'));
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "Error!", response.data.Message);
            $scope.isSpinner = false;
        });
    }
    $scope.SendGiftPromotions = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('ordertools/sendgiftpromotioncodes').get({
            OrderID: OrderID,
        }).then(function (result) {
            toaster.pop("success", $translate.instant('yemeksepetifile.Giftcodesforwarded'));
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "Error!", response.data.Message);
            $scope.isSpinner = false;
        });
    }
    $scope.OrderChange = function (item) {
        if (item.PaymentStatusID == 0) {
            if (item.OrderStateID == 2) {
                if ($rootScope.user.restrictions && $rootScope.user.restrictions.changeorder == 'Enable') { //callcenter=false !callcenter=ture
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable') {
                        if (item.OrderTypeID == 0)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Masa Sipariş
                        if (item.OrderTypeID == 1 && !item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Gel-Al Sipariş (Hızlı Sipariş) 
                        if (item.OrderTypeID == 1 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Gel-Al Sipariş
                        if (item.OrderTypeID == 2 || item.OrderTypeID == 7)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Adrese Sipaiş
                        if (item.OrderTypeID == 4 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id;      //Personel Yemeği Sipariş
                    }
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + item.id;
                } else {
                    toaster.pop('warning', $translate.instant('orderfile.ChangeOrderStatus'), "");
                }
            } else {
                if (item.OrderStateID == 5 && $rootScope.user.restrictions.changeorder == 'Enable') {
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable') {
                        if (item.OrderTypeID == 0)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Masa Sipariş
                        if (item.OrderTypeID == 1 && !item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Gel-Al Sipariş (Hızlı Sipariş) 
                        if (item.OrderTypeID == 1 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Gel-Al Sipariş
                        if (item.OrderTypeID == 2 || item.OrderTypeID == 7)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Adrese Sipaiş
                        if (item.OrderTypeID == 4 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id;      //Personel Yemeği Sipariş
                    }
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + item.id;
                }
                if (item.OrderStateID == 5 || item.OrderStateID == 6 || item.OrderStateID == 7 || item.OrderStateID == 10 || item.OrderStateID == 9 || item.OrderStateID == 8) {
                    if ($rootScope.user.restrictions.changeorder != 'Enable')
                        toaster.pop('warning', $translate.instant('orderfile.OrderCannotBeChanged'), "");
                } else {
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable') {
                        if (item.OrderTypeID == 0)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Masa                              
                        if (item.OrderTypeID == 1 && !item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id; //Gel-Al Sipariş (Hızlı Sipariş) 
                        if (item.OrderTypeID == 1 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Gel-Al Sipariş
                        if (item.OrderTypeID == 2 || item.OrderTypeID == 7)
                            location.href = '#/app/orders/orderStore/' + item.id;      //Adrese Sipaiş
                        if (item.OrderTypeID == 4 && item.persons[0].PersonID)
                            location.href = '#/app/orders/orderStoreTable/' + item.id;      //Personel Yemeği Sipariş
                    }
                    if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                        location.href = '#/app/orders/order/' + item.id;
                }
            }
        } else {
            toaster.pop('warning', $translate.instant('orderfile.OrderCannotBeChanged'), "");
        }
    };
    $scope.UpdateOrderStatusAdmin = function (itemID) {
        SweetAlert.swal({
            title: $translate.instant('yemeksepetifile.CANCELORDER'),
            text: $translate.instant('yemeksepetifile.Areyousureyouwantcanceltheorder'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('yemeksepetifile.YesCanceled'),
            cancelButtonText: $translate.instant('yemeksepetifile.NoDontCancel'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                Restangular.all('ordertools/updateorderstatus').getList(
                    {
                        OrderID: itemID,
                        newSatus: 7,
                        OrderReasonID: '100592257695',
                        OrderNote: $translate.instant('yemeksepetifile.AuthorizedUserCanceled')
                    }
                ).then(function (result) {
                    $scope.getOrder();
                    toaster.pop('success', $translate.instant('yemeksepetifile.OrderStatusUpdated'), "");
                });
            }
        });
    };
    $scope.UpdateOrderStatus = function (item) {
        SweetAlert.swal({
            title: $translate.instant('yemeksepetifile.CANCELORDER'),
            text: $translate.instant('yemeksepetifile.Areyousureyouwantcanceltheorder'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('yemeksepetifile.YesCanceled'),
            cancelButtonText: $translate.instant('yemeksepetifile.NoDontCancel'),
            closeOnConfirm: true,
            closeOnCancel: true
        }, function (isConfirm) {
            if (isConfirm) {
                item.root = "orderdetail";
                var modalInstance = $modal.open({
                    templateUrl: 'assets/views/order/changeorderstate.html',
                    controller: 'changeorderstateCtrl',
                    size: '',
                    backdrop: '',
                    resolve: {
                        item: function () {
                            return item;
                        },
                    }
                });
                modalInstance.result.then(function (value) {
                    if (value == 'result') {
                        $scope.getOrder();
                    }
                })
            }
        });
    };
    $scope.UpdateOrderPaymentStatusChoose = function (OrderID) {
        Restangular.one("ordertools/updateorderpaymentstatus").get({
            OrderID: OrderID,
            newSatus: 1
        }).then(function () {
            toaster.pop('success', $translate.instant('yemeksepetifile.PaymentOfOrderClosed'), "");
            $scope.getOrder();
        }, function (response) {
            toaster.pop('error', "Response", response.data.ExceptionMessage);
        });
    };
    $scope.RevertToPrevState = function (OrderID) {
        Restangular.one("ordertools/reverttoprevstate").get({
            OrderID: OrderID
        }).then(function () {
            toaster.pop('success', $translate.instant('yemeksepetifile.OrderRestoredToPreviousState'), "");
            $scope.getOrder();
        }, function (response) {
            toaster.pop('error', "Response", response.data.ExceptionMessage);
        });
    };
    $scope.RefreshOrder = function (OrderID) {
        Restangular.one("ordertools/RefreshOrder").get({
            OrderID: OrderID,
        }).then(function () {
            toaster.pop('success', $translate.instant('yemeksepetifile.OrderAmountUpdated'), "");
            $scope.getOrder();
        }, function (response) {
            toaster.pop('error', "Response", response.data.ExceptionMessage);
        });
    };
    $scope.UpdateOrderStateChoose = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/changeorderstate2.html',
            controller: 'changeorderstate2Ctrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
        })
    };
    $scope.UpdateCode = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/updatecode.html',
            controller: 'updatecodeCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
        })
    };
    $scope.CheckCode = function (item, root) {
        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCBACKOFFICE") || userService.userIsInRole("CMRESTORANHATTI") || userService.userIsInRole("CCMANAGER")|| userService.userIsInRole("Rest.Manager(sifre)") || userService.userIsInRole("REST. MANAGER")|| userService.userIsInRole("REST. SHIFT MANAGER") || userService.userIsInRole("REST. ASSIST. MANAGER")) {
            if (root == 'CancelOrder')
                $scope.UpdateOrderStatus(item)
                if (root == 'OrderPaymentDeteails')
                $scope.OrderPaymentDeteails(item)
                if (root == 'ChangeOrderPayment')
                $scope.ChangeOrderPayment(item)
        } else {
            if ($rootScope.user.restrictions.authorized == "Enable") {
                var modalInstance = $modal.open({
                    templateUrl: 'assets/views/mainscreen/loginpassword.html',
                    controller: 'loginpasswordCtrl',
                    size: '',
                    backdrop: '',
                });
                modalInstance.result.then(function (password) {
                    if (password != "cancel") {
                        userService.cardLogin(password, true).then(function (response) {
                            userService.stopTimeout();
                            if (root == 'ChangeOrderDriver')
                                $scope.ChangeOrderDriver(item)
                            if (root == 'OrderPaymentDeteails')
                                $scope.OrderPaymentDeteails(item)
                            if (root == 'ChangeOrderPayment')
                                $scope.ChangeOrderPayment(item)
                            if (root == 'CancelOrder')
                                $scope.UpdateOrderStatus(item)
                        }, function (err) {
                            if (err) {
                                toaster.pop('warrning', $translate.instant('yemeksepetifile.PasswordErroneous'), err.error_description);
                                return 'No'
                            }
                            else {
                                //toaster
                                $scope.message = $translate.instant('yemeksepetifile.Unknownerror');
                                return 'No'
                            }
                        });

                    }
                })
            } else {
                toaster.pop("warning", $translate.instant('yemeksepetifile.YOUARENOTAUTHORIZEDFORTHISPROCEDURE'));
                return 'No';
            }
        }
    };
    $scope.OrderPaymentDeteails = function (item) {
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
            $scope.getOrder();
        })
    };
    $scope.ChangeOrderDriver = function (states) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/dispatch/changeorderdriver.html',
            controller: 'changeorderdriverCtrl',
            size: '',
            backdrop: '',
            resolve: {
                OrderStates: function () {
                    return states;
                },
            }
        });
        modalInstance.result.then(function (item) {
            if (item == 'Yes') {
                if ($stateParams.id != 'new') {
                    Restangular.one('order', $stateParams.id).get().then
                        (function (restresult) {
                            angular.copy(restresult, $scope.orders);
                            angular.copy(restresult, $scope.item);
                            $scope.LoadOrderItems();
                            $scope.getOrder();
                        },
                            function (restresult) {
                                toaster.pop('warning', $translate.instant('orderfile.Cancelled'), restresult.data.ExceptionMessage);
                            }
                        )
                }
            }
        })
    };
    $scope.ChangeOrderPayment = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/orderpaymenttypes.html',
            controller: 'orderpaymenttypesCtrl',
            size: '',
            backdrop: '',
            resolve: {
                item: function () {
                    return item;
                },
            }
        });
        modalInstance.result.then(function (item) {
            if (item == 'OK') {
                $scope.LoadOrderItems();
                $scope.getOrder();
            }
        })
    };
    $scope.repeatOrder = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('ordertools/repeatorder').get({
            OrderID: OrderID,
            AddressID: '',
        }).then(function (result) {
            if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable')
                location.href = '#/app/orders/orderStore/' + result.id;
            if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage != 'Enable')
                location.href = '#/app/orders/order/' + result.id;
            toaster.pop("success", $translate.instant('orderfile.OrderCreated'));
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "error!", response.data.ExceptionMessage);
            $scope.isSpinner = false;
        });
    };
     $scope.DeleteYSMaping = function (OrderID) {
        $scope.isSpinner = true;
        Restangular.one('aggregator/deletecustomermap').get({
            OrderID: OrderID,
        }).then(function (result) {
            toaster.pop("success", $translate.instant('orderfile.YSOrderCustomerMappingDeleted'));
            $scope.isSpinner = false;
        }, function (response) {
            toaster.pop('error', "error!", response.data.Message);
            $scope.isSpinner = false;
        });
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("orderdetailsCtrl");
    });
};