app.factory('PaymentRestangular', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl('http://192.168.9.40:9065/api/');
    });
});


app.controller('orderCtrl', orderCtrl);
function orderCtrl($scope, $log, $filter, $timeout, $translate, $modal, SweetAlert, Restangular, PaymentRestangular, ngTableParams, $document, toaster, $window, $stateParams, $rootScope, $location, $anchorScroll, $compile, callsService, userService, $element, ngnotifyService, $localStorage, localStorageService) {
    var or = this;
    $rootScope.uService.EnterController("orderCtrl");
    $scope.Categories = [];
    $scope.StoreData = {};
    $scope.isReason = false;
    $scope.isVisibleDeliverDate = false;
    $scope.OrderID = "";
    $scope._order = {};
    $scope.item = {};
    $scope.FormatedAddress = {};
    $scope._order.Address = {};
    $scope.$storage = $localStorage.$default({
        customerItems: []
    });
    //$scope.orderItems = [];
    //$scope.$storage.customerData.items = $scope.orderItems;
    //$scope.order = Order;
    if ($rootScope.user && $rootScope.user.Store && $rootScope.user.Store.MemberID && $rootScope.user.Store.MemberID == 111679600561) {
        $scope.PaymentButtonAktif = false;
    } else {
        $scope.PaymentButtonAktif = true;
    }
    $scope.BottonDblcilik = function () { };
    $scope.translate = function () {
        $scope.trProductName = $translate.instant('main.PRODUCTNAME');
        $scope.trPrice = $translate.instant('main.PRICE');
        $scope.searchbyproduct = $translate.instant('main.SEARCHBYPRODUCT');
        $scope.products = $translate.instant('main.PRODUCTS');
        $scope.searchbyproductname = $translate.instant('main.SEARCHBYPRODUCTNAME');
        $scope.searching = $translate.instant('main.SEARCHING');
        $scope.person = $translate.instant('main.PERSON');
        $scope.phone = $translate.instant('main.PHONE');
        $scope.store = $translate.instant('main.STORE');
        $scope.storenumber = $translate.instant('main.STORENUMBER');
        $scope.ordertype = $translate.instant('main.ORDERTYPE');
        $scope.ordernumber = $translate.instant('main.ORDERNUMBER');
        $scope.vat = $translate.instant('main.VAT');
        $scope.amount = $translate.instant('main.AMOUNT');
        $scope.orderstate = $translate.instant('main.ORDERSTATE');
        $scope.orderdate = $translate.instant('main.ORDERDATE');
        $scope.deliverydate = $translate.instant('main.DELIVERYDATE');
        $scope.ordernote = $translate.instant('main.ORDERNOTE');
        $scope.address = $translate.instant('main.ADDRESS');
        $scope.storenotes = $translate.instant('main.STORENOTES');
        $scope.rejectorder = $translate.instant('main.REJECTORDER');
        $scope.grand = $translate.instant('main.GRAND');
        $scope.grandtotal = $translate.instant('main.GRANDTOTAL');
        $scope.saveorder = $translate.instant('main.SAVEORDER');
        $scope.payment = $translate.instant('main.PAYMENT');
        $scope.orderpromotions = $translate.instant('main.ORDERPROMOTIONS');
        $scope.adddiscount = $translate.instant('main.ADDDISCOUNT');
        $scope.pleaseselect = $translate.instant('main.PLEASESELECTT');
        $scope.discountedtotal = $translate.instant('main.DISCOUNTEDTOTAL');
        $scope.exit = $translate.instant('main.EXIT');
        $scope.ordercontent = $translate.instant('main.ORDERCONTENT');
        $scope.yemeksepetiorderdetail = $translate.instant('main.YSORDERDETAİL');
        $scope.addressinformation = $translate.instant('main.ADDRESSINFORMATION');
        $scope.orderdetails = $translate.instant('main.ORDERDETAILS');
        $scope.servicetim = $translate.instant('main.SERVICETIM');
        $scope.paymentstatus = $translate.instant('main.PAYMENTSTATUS');
        $scope.personname = $translate.instant('main.PERSON');
        $scope.tablename = $translate.instant('main.TABLENAME');
        $scope.alias = $translate.instant('main.ALIAS');
        $scope.addpromotion = $translate.instant('main.ADDPROMOTION');

    };
    $scope.translate();
    angular.module('whiteframeBasicUsage', ['ngMaterial']);
    //**************** MarketingPermission ******************//
    //$scope.getMarketingPermission = function () {
    //    if ($scope._order.OrderTypeID == 2 ||$scope._order.OrderTypeID == 7) {
    //        Restangular.all('MarketingPermission').getList({
    //            pageNo: 1,
    //            pageSize: 10,
    //            search: "PersonID='" + $scope._order.persons[0].PersonID + "'"
    //        }).then(function (result) {
    //            if (result.length > 0) {
    //                $scope.MarketingPermission = true;
    //            } else {
    //                $scope.MarketingPermission = false;
    //            }
    //        });
    //    }
    //}
    //**************** MarketingPermission ******************//


    $scope.isorderpayeds = function (OrderID) {
        Restangular.one('ordertools/isorderpayed').get({
            OrderID: $stateParams.id
        }).then(function (result) {
            $scope.isorderpayed = result;
        }, function (response) {
            toaster.pop('warning', response.data.ExceptionMessage);
        });
    };
    $scope.isorderpayeds();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.CallReason = function (type, root) {
        if ($rootScope.user && $rootScope.user.UserRole) {
            if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER") || userService.userIsInRole("CMRESTORANHATTI") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("Driver")) {
                Restangular.all('callreason').getList({
                    pageNo: 1,
                    pageSize: 1000,
                    search: "CallReasonType='" + type + "'"
                }).then(function (result) {
                    if (root == 'change') {
                        callsService.SetCurrentCallType(result[0].id, $scope._order.StoreID);
                    }
                    if (root == 'new') {
                        callsService.SetCurrentCallType(result[1].id, $scope._order.StoreID);
                    }
                    if (root == 'cancel') {
                        callsService.SetCurrentCallType(result[1].id, $scope._order.StoreID);
                    }
                });
            }
        }
    };
    $scope.ClearCallerID = function () {
        if ($rootScope.user && $rootScope.user.UserRole) {
            if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER")) {
                $rootScope.searchPhone = null;
            }
        }
    };
    $scope.Back = function () {
        $window.history.back();
    };
    var changePersonListemer = $scope.$on('ChangePerson', function (event, OrderItemID) {
        var item = {};
        for (var i = 0; i < $scope.orderItems.length; i++) {
            if ($scope.orderItems[i].id == OrderItemID) {
                angular.copy($scope.CurrentPersonID, $scope.orderItems[i].OrderPersonID);
                angular.copy($scope.orderItems[i], item);
                Restangular.restangularizeElement('', item, 'orderitem');
                item.put().then(function (resp) {
                    $scope.LoadOrderItems();
                },
                    function (resp) {
                        toaster.pop('error', $translate.instant('orderfile.Personupdatefailed'), resp.data.ExceptionMessage);
                    });
            }
        }
    });
    var ChangeSplitListener = $scope.$on('ChangeSplit', function (event, OrderItemID) {
        var item = {};
        for (var i = 0; i < $scope.orderItems.length; i++) {
            if ($scope.orderItems[i].id == OrderItemID) {
                angular.copy($scope.CurrentSplitID, $scope.orderItems[i].OrderSplitID);
                angular.copy($scope.orderItems[i], item);
                Restangular.restangularizeElement('', item, 'orderitem');
                item.put().then(function (resp) {
                    $scope.LoadOrderItems();
                },
                    function (resp) {
                        toaster.pop('error', $translate.instant('orderfile.Ordersectionupdatefailed'), resp.data.ExceptionMessage);
                    });
            }
        }
    });
    var LoadOrderItemsListener = $scope.$on('LoadOrderItems', function () {
        $scope.LoadOrderItems();
    });
    var RemoveItemListener = $scope.$on('RemoveItem', function (event, data) {
        $scope.RemoveItem(data.id);
    });
    var TreatListener = $scope.$on('Treat', function (event, data) {
        $scope.Treat(data.id);
    });
    var EditItemListener = $scope.$on('EditItem', function (event, data) {
        $scope.open(data.ObjectID, data.OrderID, data.OrderItemID, $scope.CurrentPersonID, $scope.CurrentSplitID);
    });
    $rootScope.$on('YSOrderDetailListener', function (event, data) {
        $rootScope.OrderSourceYS = true;
        $rootScope.YemekSepetiRawOrder = data;
    });
    $scope.SetCurrentPerson = function (PersonID) {
        angular.copy(PersonID, $scope.CurrentPersonID);
    };
    $scope.SetCurrentSplit = function (SplitID) {
        angular.copy(SplitID, $scope.CurrentSplitID);
    };
    $scope.open = function (ObjectID, OrderID, OrderItemID, CurrentPersonID, CurrentSplitID) {
        var oi = (OrderItemID) ? OrderItemID : "";
        var modalInstance = $modal.open({
            template:
                '<div class="panel-body">' +
                //PH
                '<h2 class="col-lg-12 col-md-12 col-sm-12 col-xs-12 center text-white text-capitalize" style="background-color:#b30000; color:item;"> {{:: item.name}} <button class="btn btn-o pull-right ti-close" ng-click="cancel()"></button></h2>' +
                //LC
                //'<h2 class="col-lg-12 col-md-12 col-sm-12 col-xs-12 center text-white text-capitalize" style="background-color:#FF6600; color:item;"> {{:: item.name}} <button class="btn btn-o pull-right ti-close" ng-click="cancel()"></button></h2>' +   
                '<orderable ng-if="OrderID" item="' + ObjectID + '" order="OrderID" orderitem="' + oi + '"class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></orderable>' +
                '</div>' +
                ' <div class="panel center">' +
                '</div>',
            controller: 'orderproductitemsCtrl',
            size: 'lg',
            backdrop: '',
            //backdrop: 'static',
            resolve: {
                ObjectID: function () {
                    return ObjectID;
                },
                OrderID: function () {
                    return OrderID;
                },
                CurrentPersonID: function () {
                    return CurrentPersonID;
                },
                CurrentSplitID: function () {
                    return CurrentSplitID;
                }
            }
        });
        modalInstance.result.then(function (selectedItem) {
            angular.copy(selectedItem, $scope.result);
            $scope.$emit('LoadOrderItems', "Update");
        }, function () {
        });
    };    
    $scope.LoadOrderItems = function () {
        Restangular.all('orderitem').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "OrderID='" + (($scope._order) ? $scope._order.id : "") + "'"
        }).then(function (_orderItems) {
            $scope.orderItems = angular.copy($scope.UpdateOrderItemPersonsAndSplits(_orderItems));
            $scope.GetPromotion();
            

            $scope.UpdateCustomerDisplayData();
        }, function (response) {
            toaster.pop('error', $translate.instant('orderfile.Ingredientupdatefailed'), response.data.ExceptionMessage);
        });
    };
    $scope.UpdateCustomerDisplayData = function () {
        $scope.$storage.customerItems = $scope.orderItems;
        $scope.$storage.orderPromotions = $scope.Promotion;
        $scope.$storage.orderTotal = $scope._order.Amount;
        $scope.$storage.orderDescription = $scope._order.Description;
    }
    $scope.Treat = function (data) {
        Restangular.all('orderitemtools/compliment').post({
            OrderItemID: data
        }).then(function (res) {
            $scope.LoadOrderItems();
            toaster.pop('success', $translate.instant('orderfile.Cateringproduct'), '');
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.Uploaderror'), response.data.ExceptionMessage);
        });
    };
    $scope.UpdateOrderItemPersonsAndSplits = function (items) {
        for (var i = 0; i < items.length; i++) {
            items[i].PersonIndex = $scope.GetPersonIndex(items[i].OrderPersonID);
            items[i].SplitIndex = $scope.GetSplitIndex(items[i].OrderSplitID);
        }
        return items;
    }
    $scope.GetPersonIndex = function (PersonID) {
        for (var i = 0; i < $scope._order.persons.length; i++) {
            if ($scope._order.persons[i].id == PersonID)
                return $scope._order.persons[i].PersonIndex;
        }
        return 0;
    }
    $scope.GetSplitIndex = function (SplitID) {
        for (var i = 0; i < $scope._order.splits.length; i++) {
            if ($scope._order.splits[i].id == SplitID)
                return $scope._order.splits[i].SplitIndex;
        }
        return 0;
    }
    $scope.UpdateOrderTotal = function (itemList) {
        $scope._order.Amount = 0;
        if (itemList)
            for (var i = 0; i < itemList.length; i++) {
                $scope._order.Amount += $scope.CalcOrderItemAmount(itemList[i]);
            }
        //$scope._order.VAT = $scope._order.Amount * 0.08;
        $scope.CalculatePromotion($scope._order.Amount);
    };
    $scope.CalculateItemAmountWithsubItems = function () {
        for (var i = 0; i < $scope.orderItems.length; i++) {
            $scope.orderItems[i]['TotalAmount'] = angular.copy($scope.CalcOrderItemAmount($scope.orderItems[i]));
            // $scope.orderItems[i]['TotalAmount'] = $scope.CalcOrderItemAmount($scope.orderItems[i]);

        }
    };
    $scope.CalcOrderItemAmount = function (orderItem) {
        var result = 0.0;
        result = orderItem.Amount;
        if (angular.isArray(orderItem.items))
            for (var a = 0; a < orderItem.items.length; a++) {
                result += $scope.CalcOrderItemAmount(orderItem.items[a]);
            }
        return result;
    };
    $scope.RemoveItem = function (OrderItemID) {
        Restangular.one("OrderableItem", OrderItemID).remove().then(function () {
            toaster.pop("error", $translate.instant('orderfile.OrderContentsDeleted'), $translate.instant('orderfile.OrderContentsDeleted'));
            $scope.LoadOrderItems();
        }, function (response) {
            toaster.pop('error', $translate.instant('orderfile.Deletionerror'), response.data.ExceptionMessage);
        });
    };
    $scope.DisplayStreetAddress = function (address) {
        return address ? address.StreetAddress + 'Door : ' + address.Floor + ', Apartment No : ' + address.AppartmentNo + ', Address No : ' + address.AddressNo : '';
    };
    $scope.ProductSerchOpen = function (item) {
        $scope.open(item.id, $scope._order.id, item.OrderItemID, $scope.CurrentPersonID, $scope.CurrentSplitID);
    };
    $scope.GetPruductList = function (OrderID) {
        or.tableParams = new ngTableParams({ page: 1, count: 10 },
            {
                getData: function ($defer, params) {
                    Restangular.all('orderableitem/productlist').getList({
                        calcParameters: "OrderID='" + OrderID + "'"
                    }).then(function (items) {
                        params.total(items.paging);
                        $defer.resolve($filter('orderBy')(items, params.orderBy()));
                    }, function (response) {
                        toaster.pop('error', $translate.instant('orderfile.Loadingproductlistfailed'), response.data.ExceptionMessage);
                    });
                }
            });
    };
    $scope.LoadOrder = function (OrderID) {
        Restangular.one('order', OrderID).get().then
            (function (restresult) {
                $scope._order = angular.copy(restresult);
                $scope.FormatedAddress = $scope.DisplayStreetAddress(restresult.Address);
                $scope.CurrentPersonID = restresult.persons[0].id;
                $scope.CurrentSplitID = restresult.splits[0].id;
                $scope.LoadOrderItems();
                $scope.ShowCategories(restresult.id);
                if ($rootScope.user.restrictions && $rootScope.user.restrictions.storeorderpage == 'Enable') { //for Restoran
                    if (restresult.OrderTypeID == 0)
                        location.href = '#/app/orders/orderStoreTable/' + restresult.id; //Masa Sipariş
                    if (restresult.OrderTypeID == 1 && !restresult.persons[0].PersonID)
                        location.href = '#/app/orders/orderStoreTable/' + restresult.id; //Gel-Al Sipariş (Hızlı Sipariş) 
                    if (restresult.OrderTypeID == 1 && restresult.persons[0].PersonID)
                        location.href = '#/app/orders/orderStore/' + restresult.id;      //Gel-Al Sipariş
                    if (restresult.OrderTypeID == 2)
                        location.href = '#/app/orders/orderStore/' + restresult.id;      //Adrese Sipaiş
                    if (restresult.OrderTypeID == 4)
                        location.href = '#/app/orders/orderStoreTable/' + restresult.id; //Personel Yemeği Sipariş 
                    if (restresult.OrderTypeID == 5)
                        location.href = '#/app/orders/orderStoreTable/' + restresult.id; //PickUp Siparişi
                    if (restresult.OrderTypeID == 6 && !restresult.persons[0].PersonID)
                        location.href = '#/app/orders/orderStoreTable/' + restresult.id; //Mall Siparişi
                    if (restresult.OrderTypeID == 7)
                        location.href = '#/app/orders/orderStore/' + restresult.id;      //Adrese Sipaiş - Getir
                    if (restresult.OrderTypeID == 10)
                        location.href = '#/app/orders/orderStoreTable/' + restresult.id; // (Hızlı Sipariş) 
                    if (restresult.OrderTypeID == 11)
                        location.href = '#/app/orders/orderStoreTable/' + restresult.id; // (migros Sipariş) 
                }
                if ($rootScope.user.restrictions.storeorderpage != 'Enable') //for Callcenter
                    location.href = '#/app/orders/order/' + restresult.id;
                $rootScope.preventNavigation();
                $scope.loadPaymenttypes();
                $scope.AddItemOrder(restresult);
                $scope.GetPruductList(restresult.id);
                $scope.isorderpayeds();
                $scope.GetStore();
                if (restresult.Address && restresult.Address.StreetAddressID && restresult.Address.StreetAddressID > 0) {
                    $scope.GetStoreStreetAddress(restresult.Address.StreetAddressID);
                }
                //$scope.getMarketingPermission();
            }, function (restresult) {
                toaster.pop('Warning', $translate.instant('orderfile.Orderfailedtoload'), restresult.data.ExceptionMessage);
            })
    };
    $scope.GetStoreStreetAddress = function (StreetAddressID) {
        Restangular.all('storestreetaddress').getList({
            pageNo: 1,
            pageSize: 1000,
            Search: "StreetAddressID='" + StreetAddressID + "'",
        }).then(function (result) {
            if (result[0].WDT > 0) {
                $scope.WDT = "This Address'" + result[0].WDT + "min Has Warranty..'"
            } else {
                $scope.WDT = "";
            }
        }, function (response) {
            toaster.pop('Warning', $translate.instant('orderfile.Faileduploadaddress'), response.data.ExceptionMessage);
        });
    };
    $scope.ShowCategories = function (OrderID) {
        Restangular.all('OrderableItem').getList({
            pageNo: 1,
            pageSize: 1000,
            CalcParameters: ["OrderID='" + OrderID + "'"],
            Search: ["ItemID='0'"],
        }).then(function (result) {
            if (result.length > 0) {
                angular.copy(result[0].Options[0].Items, $scope.Categories);
            }

        }, function (response) {
            toaster.pop('Warning', $translate.instant('orderfile.IngredientCouldload'), response.data.ExceptionMessage);
        });
    };
    $scope.CategoryClick = function (catID) {
        var newElement = angular.element("<orderable item='" + catID + "' order=" + $scope.OrderID + " class='col-lg-12 col-md-12 col-sm-12 col-xs-12'></orderable>");
        $compile(newElement)($scope);
        $('#orderables').replaceWith(newElement);
    };
    if ($stateParams.id == 'new') {
        location.href = '#/app/orders/person/list';
    }
    else {
        $scope.OrderID = $stateParams.id;
        $scope.LoadOrder($stateParams.id);
    }
    or.search = '';
    $scope.SavePaymentType = function () {
        var payment = {
            Amount: $scope._order.Amount,
            OrderID: $scope._order.id,
            PaymentDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
            PaymentTypeID: $scope._order.PaymentTypeID,
            PostName: localStorageService.get('ClientName')
        };
        Restangular.restangularizeElement('', payment, 'orderpayment');
        payment.post().then(function (resp) {
            Restangular.one('ordertools/updateorderascharged').get({ OrderID: resp.OrderID }).then
                (function (restresult) {
                    Restangular.all('ordertools/updateorderstatus').getList(
                        {
                            OrderID: resp.OrderID,
                            newSatus: 10,
                        }).then(function (result) {
                        }, function (response) {
                            toaster.pop('error', $translate.instant('orderfile.PAYMENTNOTAVAILABLE'), response.data.ExceptionMessage);
                        });
                }, function (restresult) {
                    toaster.pop('warning', $translate.instant('orderfile.PAYMENTACCEPTED'), restresult.data.ExceptionMessage);
                })
        }, function (resp) {
            toaster.pop('error', $translate.instant('orderfile.NEWPAYMENTSAVED'), resp.data.ExceptionMessage);
        });
    };
    $scope.SaveECRPaymentType = function (PaymentType) {
        if (PaymentType.PaymentType.PaymentTypeID == 0) {
            var Type = 1
        }
        if (PaymentType.PaymentType.PaymentTypeID == 1) {
            var Type = 2
        }
        if (PaymentType.PaymentType.PaymentTypeID == 3) {
            var Type = 3
        }
        if (PaymentType.PaymentType.PaymentTypeID == 4) {
            var Type = 8
        }
        PaymentRestangular.one('ecrprofilo/addprintrequest').withHttpConfig({ timeout: 200000 }).get({
            OrderID: $scope._order.id,
            RequestType: Type,
            Kasa: $rootScope.user.ClientName
        }).then(function (result) {
            if (result == true) {
                var res = result;
            }
        }, function (response) {
            toaster.pop('error', $translate.instant('orderfile.PAYMENTAPPROVED'), response.data);
        });
    };
    $scope.CopyOrder = function (order) {
        if ($rootScope.OrderSourceYS == true) {
            return {
                id: $scope._order.id,
                DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id,
                OrderNumber: $scope._order.OrderNumber,
                StoreID: $scope._order.StoreID,
                AddressID: $scope._order.AddressID,
                OrderTypeID: $scope._order.OrderTypeID,
                VAT: $scope._order.VAT,
                Amount: $scope._order.Amount,
                PaymentTypeID: $scope._order.PaymentTypeID,
                PaymentStatusID: $scope._order.PaymentStatusID,
                OrderStateID: $scope._order.OrderStateID,
                OrderDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                DeliveryDate: $scope._order.DeliveryDate,
                OperationDate: order.OperationDate,
                OrderNote: $scope._order.OrderNote,
                PaymentNote: $scope._order.PaymentNote,
                StoreTableID: $scope._order.StoreTableID,
                Alias: $scope._order.Alias,
                OrderSourceID: 112097290014
            }
        } else {
            return {
                id: $scope._order.id,
                DepartmentID: $rootScope.user.UserRole.OrderSource.Department.id,
                OrderNumber: $scope._order.OrderNumber,
                StoreID: $scope._order.StoreID,
                AddressID: $scope._order.AddressID,
                OrderTypeID: $scope._order.OrderTypeID,
                VAT: $scope._order.VAT,
                Amount: $scope._order.Amount,
                PaymentTypeID: $scope._order.PaymentTypeID,
                PaymentStatusID: $scope._order.PaymentStatusID,
                OrderStateID: $scope._order.OrderStateID,
                OrderDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                DeliveryDate: $scope._order.DeliveryDate,
                OperationDate: order.OperationDate,
                OrderNote: $scope._order.OrderNote,
                PaymentNote: $scope._order.PaymentNote,
                StoreTableID: $scope._order.StoreTableID,
                Alias: $scope._order.Alias
            }
        }
    };
    //$scope.SaveData = function (order) {
    //    if ($rootScope.user.UserRole.MemberID == "106851154380") {
    //        if ($scope.MarketingPermission == true || $scope._order.OrderTypeID == 1) { 
    //            $scope.SaveOrder(order);
    //        }
    //        if ($scope.MarketingPermission == false) {
    //            var modalInstance = $modal.open({
    //                templateUrl: 'assets/views/order/marketingpermission.html',
    //                controller: 'marketingpermissionCtrl',
    //                size: 'xl',
    //                backdrop: '',
    //                resolve: {
    //                    order: function () {
    //                        return $scope._order;
    //                    }
    //                }
    //            });
    //            modalInstance.result.then(function (item) {
    //                if (item == true) {
    //                    $scope.MarketingPermission = true;
    //                }
    //                $scope.SaveOrder(order);
    //            })
    //        }
    //    } else {
    //        $scope.SaveOrder(order);
    //    }
    //};
    $scope.SaveOrder = function (PaymentType) {
        $scope.isReason = true;
        if (PaymentType && PaymentType.PaymentTypeID) {
            $scope._order.PaymentTypeID = PaymentType.id;
        }
        if ($scope._order.PaymentTypeID == null && $scope._order.OrderTypeID != 0 && $scope._order.OrderTypeID != 1 && $scope._order.OrderTypeID != 4) {
            toaster.pop('Warning', $translate.instant('orderfile.PaymentType'), $translate.instant('orderfile.SELECTPAYMENTTYPE'));
        } else {
            if ($scope._order.OrderStateID == 2) { //Sipariş Değişikliği
                $scope._order.OrderStateID = 3;
                var ordertosave = $scope.CopyOrder($scope._order);
                Restangular.restangularizeElement('', ordertosave, 'order');
                ordertosave.put().then(function (result) {
                    event.preventDefault();
                    $rootScope.searchName = '';
                    if ($scope._order.OrderTypeID == 2 || $scope._order.OrderTypeID == 7|| $scope._order.OrderTypeID == 11) {
                        swal({
                            title: "Order ID :'" + result.id + "' Store :'" + result.Store + "' Date:'" + $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss') + "'" + $scope.WDT,
                            text: "Save Order",
                            type: "success",
                        });
                    }
                    $rootScope.allowNavigation();
                    $scope.CallReason(2, 'change');
                    $scope.ClearCallerID();
                    if ($scope._order.OrderTypeID == 0) {
                        $location.path('/app/orders/tablePlan');
                    }
                    //if ($scope._order.OrderTypeID == 0 && $rootScope.user.UserRole.MemberID == 106851154380) {
                    //    $location.path('/app/orders/tablePlantwo');
                    //}
                    // if ($scope._order.OrderTypeID == 10) {
                    //     $location.path('/app/mainscreen');
                    // }
                    else {
                        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER"))
                            $location.path('/app/orders/personpage/list');
                        if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                            $location.path('/app/mainscreen');
                        userService.landingPage(false);
                    }
                }, function (result) {
                    toaster.pop('Warning', $translate.instant('orderfile.OrderFailed'), result.data.ExceptionMessage);
                });
            } else { //Yeni sipariş
                $scope._order.OrderStateID = 1;
                var ordertosave = $scope.CopyOrder($scope._order);
                Restangular.restangularizeElement('', ordertosave, 'order');
                ordertosave.put().then(function (result) {
                    event.preventDefault();
                    if ($rootScope.OrderSourceYS == true) {
                        $rootScope.OrderSourceYS = false;
                        var yemeksepetiordermapdetail = {
                            id: $rootScope.YemekSepetiRawOrder.id,
                            OrderID: $scope._order.id,
                            StoreID: $scope._order.StoreID,
                            YemekSepetiOrderID: $rootScope.YemekSepetiRawOrder.YemekSepetiOrderID,
                            YemekSepetiOrderStateID: 5,
                            OrderDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                            MapDate: $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss'),
                            Notes: 'Everything is OK'
                        };
                        Restangular.restangularizeElement('', yemeksepetiordermapdetail, 'yemeksepetiordermap');
                        yemeksepetiordermapdetail.put().then(function (result) { }, function (result) {
                            var data = result;
                            toaster.pop('success', $translate.instant('orderfile.Cateringproduct'), '');
                        });
                    }
                    $rootScope.searchName = '';
                    if ($scope._order.OrderTypeID == 0) {
                        $location.path('/app/orders/tablePlan');
                    }
                    //if ($scope._order.OrderTypeID == 0 && $rootScope.user.UserRole.MemberID == 106851154380) {
                    //    $location.path('/app/orders/tablePlantwo');
                    //}
                    //if ($scope._order.OrderTypeID == 0 && $rootScope.user.UserRole.MemberID == 106851154380) {
                    //    $location.path('/app/mainscreen');
                    //}
                    if ($scope._order.OrderTypeID == 1) {
                        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER"))
                            $location.path('/app/orders/personpage/list');
                        if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                            $location.path('/app/mainscreen');
                        userService.landingPage(false);
                    }
                    if ($scope._order.OrderTypeID == 2) {
                        swal({
                            title: "Order ID :'" + result.id + "' Store :'" + result.Store + "' Date :'" + $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss') + "'" + $scope.WDT,
                            text: "Order Saved",
                            type: "success",
                        });
                        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER"))
                            $location.path('/app/orders/personpage/list');
                        if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                            $location.path('/app/mainscreen');
                    }
                    if ($scope._order.OrderTypeID == 3) {
                        if (userService.getUseOKC($rootScope.user.StoreID)) {
                            $scope.SaveECRPaymentType(PaymentType);
                            $location.path('/app/mainscreen');
                        } else {
                            $scope.SavePaymentType();
                            $location.path('/app/mainscreen');
                        }
                    }
                    if ($scope._order.OrderTypeID == 4) {
                        //if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                        $location.path('/app/orders/takeaway');
                    }
                    if ($scope._order.OrderTypeID == 5) {
                        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER"))
                            $location.path('/app/orders/personpage/list');
                        if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                            $location.path('/app/mainscreen');
                    }
                    if ($scope._order.OrderTypeID == 6) {
                        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER"))
                            $location.path('/app/orders/personpage/list');
                        if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                            $location.path('/app/mainscreen');
                    }
                    if ($scope._order.OrderTypeID == 7) {
                        swal({
                            title: "Order ID :'" + result.id + "' Store :'" + result.Store + "' Date :'" + $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss') + "'" + $scope.WDT,
                            text: "Order Saved",
                            type: "success",
                        });
                        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER"))
                            $location.path('/app/orders/getirpersonpage/list');
                        if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                            $location.path('/app/mainscreen');
                    }
                    if ($scope._order.OrderTypeID == 10) {
                        if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                            $scope.isorderpayeds();
                        $location.path('/app/mainscreen');
                    }
                    if ($scope._order.OrderTypeID == 11) {
                        swal({
                            title: "Order ID :'" + result.id + "' Store :'" + result.Store + "' Date :'" + $filter('date')(ngnotifyService.ServerTime(), 'HH:mm:ss') + "'" + $scope.WDT,
                            text: "Order Saved",
                            type: "success",
                        });
                        if (userService.userIsInRole("CALLCENTER") || userService.userIsInRole("CCMANAGER"))
                            $location.path('/app/orders/migrospersonpage/list');
                        if (userService.userIsInRole("STORETEST") || userService.userIsInRole("STOREMANAGER") || userService.userIsInRole("STOREASSISTANTMANAGER") || userService.userIsInRole("STORESHIFTMANAGER") || userService.userIsInRole("STOREUSER") || userService.userIsInRole("STORE") || userService.userIsInRole("Admin") || userService.userIsInRole("PHAdmin") || userService.userIsInRole("Driver"))
                            $location.path('/app/mainscreen');
                    }
                    $rootScope.allowNavigation();
                    $scope.CallReason(1, 'new');
                    $scope.ClearCallerID();
                    userService.landingPage(false);
                }, function (restresult) {
                    toaster.pop('Warning', $translate.instant('orderfile.OrderFailed'), restresult.data.ExceptionMessage);
                });
            }
        }
        $scope.clearCustomerDislpay();
    };
    $scope.clearCustomerDislpay = function () {
        $scope.$storage.customerItems = [];
        $scope.$storage.orderTotal = 0;
        $scope.$storage.orderPromotions = [];
        $scope.$storage.orderDescription = null;
    }
    $scope.AddItemOrder = function (data) {
        if (data.OrderStateID != 0) {
            $scope._order.OrderStateID = 2;
            var ordertosave = $scope.CopyOrder($scope._order);
            Restangular.restangularizeElement('', ordertosave, 'order');
            ordertosave.put().then(function (result) {
                toaster.pop('success', $translate.instant('orderfile.OrderChange'), $translate.instant('orderfile.OrderStateSetChanging'));
            }, function (response) {
                toaster.pop('error', $translate.instant('orderfile.UnablechangeOrder'), response.data.ExceptionMessage);
                $rootScope.allowNavigation();
                $window.history.back();
                //userService.landingPage(false);
            });
        }
    };

    $scope.OrderInvoice;
    $scope.CreateOrderInvoice = function () {
        if (!$scope.OrderInvoice) {
            Restangular.all('OrderInvoice').post(
                {
                    OrderID: $scope._order.id
                }
            ).then(function (result) {
                toaster.pop('success', $translate.instant('orderfile.EInvoice'), $translate.instant('orderfile.EInvoiceinformationuploaded'));
                $scope.OrderInvoice = result;
                //$scope.ok();
            }, function (response) {
                toaster.pop('error', $translate.instant('orderfile.EInvoicefailedload'), response.data.ExceptionMessage);
            });
        }
    }
    $scope.SaveOrderInvoice = function () {
        if ($scope.OrderInvoice.restangularized && $scope.OrderInvoice.id) {
            $scope.OrderInvoice.put().then(function (resp) {
                toaster.pop('success', $translate.instant('orderfile.EInvoice'), $translate.instant('orderfile.EInvoiceinformationupdated'));
            });
        }
        else {
            Restangular.all('OrderInvoice').post(
                {
                    OrderID: $scope._order.id
                }
            ).then(function (result) {
                toaster.pop('success', $translate.instant('orderfile.EInvoiceinformation'), $translate.instant('orderfile.EInvoiceinformationsaved'));
                $scope.OrderInvoice = result;
                //$scope.ok();
            }, function (response) {
                toaster.pop('error', $translate.instant('orderfile.EInvoiceinformationnotsaved'), response.data.ExceptionMessage);
            });
        }
        if (!$scope.OrderInvoice) {

        }
    }
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
                pageSize: 1000,
                CalcFilter: "OrderID='" + $scope._order.id + "'",
            }).then(function (result) {
                angular.copy(result, $scope[Container]);
            }, function (response) {
                toaster.pop('Warning', $translate.instant('orderfile.Optionscouldloaded'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntities2 = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('orderfile.Optionscouldloaded'), response);
            });
        }
    };
    $scope.loadEntities3 = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: "NoteTypeID = 2",
            }).then(function (result) {
                angular.copy(result, $scope[Container]);
            }, function (response) {
                toaster.pop('Warning', "Error", response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntities4 = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
                search: "NoteTypeID = 0",
            }).then(function (result) {
                angular.copy(result, $scope[Container]);
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.Serverconnectionerror'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.paymenttypes = [];
    $scope.loadPaymenttypes = function () {
        if (!$scope.paymenttypes.length) {
            Restangular.all('cache/storepaymenttype').getList({
                StoreID: $scope._order.StoreID,
                OrderID: $scope._order.id,
            }).then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].isActiveValue == true) {
                        $scope.paymenttypes.push(result[i]);
                    }
                }
            }, function (response) {
                toaster.pop('error', $translate.instant('orderfile.Paymenttypesfailedtoload'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntities2('cache/store', 'stores');
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.orderstates = [];
    $scope.loadEntities('enums/orderstate', 'orderstates');
    $scope.predefinedpaymentnote = [];
    $scope.loadEntities3('predefinednote', 'predefinedpaymentnote');
    $scope.predefinedordernote = [];
    $scope.loadEntities4('predefinednote', 'predefinedordernote');
    $scope.selectedNote = function (root, data) {
        if (data) {
            if (root == 'paymentNote') {
                $scope._order.PaymentNote = ($scope._order.PaymentNote) ? $scope._order.PaymentNote + data : data;
            }
            if (root == 'orderNote') {
                $scope._order.OrderNote = ($scope._order.OrderNote) ? $scope._order.OrderNote + data : data;
            }
        }
    };
    $scope.GetStore = function () {
        Restangular.one('store', $scope._order.StoreID).get().then
            (function (restresult) {
                angular.copy(restresult, $scope.StoreData);
            })
    };
    $scope.datepopup = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/orderDate.html',
            controller: 'orderDateCtrl',
            size: '',
            backdrop: '',
            resolve: {
                DateTime: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            $scope.isVisibleDeliverDate = true;
            $scope._order.DeliveryDate = angular.copy(item);
            $scope._order.DeliveryDate = item;
        })
    };
    $scope.selectPerson = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/selectPerson.html',
            controller: 'selectPersonCtrl',
            size: '',
            backdrop: '',
            resolve: {
                searchname: function () {
                    return item;
                },
                searchphone: function () {
                    return item;
                }
            }
        });
        modalInstance.result.then(function (item) {
            var orderperson = $filter('filter')($scope._order.persons, { id: $scope.CurrentPersonID })[0];
            angular.copy(item.id, orderperson.PersonID);
            angular.copy(item, orderperson.Person);
            Restangular.restangularizeElement('', orderperson, 'orderperson');
            orderperson.put().then(function (resp) {
                toaster.pop("success", $translate.instant('orderfile.PersonAssigned'));
                angular.copy(resp, orderperson);
            },
                function (resp) {
                    toaster.pop('error', $translate.instant('orderfile.Cannotassignperson'), resp.data.ExceptionMessage);
                });
        });
    };
    $scope.orderInfo = function () {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/previousorder.html',
            controller: 'previousorderCtrl',
            size: '',
            backdrop: '',
            resolve: {
                storeID: function () {
                    return $scope._order.StoreID;
                },
                personID: function () {
                    return $scope._order.persons[0].PersonID;
                }
            }
        });
        modalInstance.result.then(function (item) {
        });
    };

    $scope.OrderPaymentDeteails = function (item, rootemsg) {
        if ($rootScope.user && $rootScope.user.Store && $rootScope.user.Store.MemberID && $rootScope.user.Store.MemberID == 900000000001) {
            if ((item.OrderTypeID == 4) || (item.Amount == 0)) {
                $scope.SaveOrder();
            } else {
                item.items = $scope.orderItems;
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
                modalInstance.result.then(function (item, type) {
                    if (item.msg == 'ECRPayment' || item.msg == 'OtherPayment')
                        if ($scope._order.OrderTypeID == 0 || $scope._order.OrderTypeID == 1 || $scope._order.OrderTypeID == 5 || $scope._order.OrderTypeID == 6 || $scope._order.OrderTypeID == 10) {
                            $scope._order.PaymentTypeID = angular.copy(item.PaymentTypeID);
                            $scope.SaveOrder();
                        }
                })
            }
        } else {
            if ((item.OrderTypeID == 0 && rootemsg == 'save') || (item.OrderTypeID == 1 && rootemsg == 'save') || (item.OrderTypeID == 4) || (item.Amount == 0)) {
                $scope.SaveOrder();
            } else {
                item.items = $scope.orderItems;
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
                modalInstance.result.then(function (item, type) {
                    if (item.msg == 'ECRPayment' || item.msg == 'OtherPayment')
                        if ($scope._order.OrderTypeID == 0 || $scope._order.OrderTypeID == 1 || $scope._order.OrderTypeID == 5 || $scope._order.OrderTypeID == 6 || $scope._order.OrderTypeID == 10) {
                            $scope._order.PaymentTypeID = angular.copy(item.PaymentTypeID);
                            $scope.SaveOrder();
                        }
                })
            }
        }
    };
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
            $scope.GetPromotion(data.OrderID);
            $('#orderables').append('');
        })
    };
    $scope.Promotion = [];
    $scope.OrderPromotion = [];
    $scope.GetPromotion = function (data) {
        Restangular.all('orderpromotion').getList({
            pageNo: 1,
            pageSize: 1000,
            search: "OrderID='" + $scope.OrderID + "'"
        }).then(function (result) {
            $scope.Promotion = result;
            $scope.OrderPromotion = result;
            $scope.UpdateOrderTotal($scope.orderItems);
            $scope.CalculateItemAmountWithsubItems();
        }, function (response) {
            toaster.pop('error', $translate.instant('orderfile.OrderPromotionsFailedLoad'), response.data.ExceptionMessage);
        });
    };
    $scope.GetPromotion();
    $scope.CalculatePromotion = function (data) {
        if ($scope.Promotion.length > 0) {
            var orderPromotionAmount = 0;
            for (var i = 0; i < $scope.Promotion.length; i++) {
                orderPromotionAmount += $scope.Promotion[i].Amount;
            }
            $scope._order.Amount += orderPromotionAmount;
        } else {
            $scope._order.Amount = angular.copy(data);
        }
        if ($scope._order.Amount < 0) {
            $scope._order.Amount = 0;
        }
    };
    $scope.RemovePromotion = function (PromotionID) {
        Restangular.all("orderpromotion").getList({
            search: "OrderID='" + PromotionID + "'"
        }).then(function (result) {
            $scope.DeletePromotion(result[0].id);
        },
            function (response) {
                toaster.pop('error', $translate.instant('orderfile.Promotionsloaded'), response.data.ExceptionMessage);
            });
    };
    $scope.DeletePromotion = function (ID) {
        Restangular.one("orderpromotion", ID).remove().then(function () {
            toaster.pop("error", $translate.instant('orderfile.Deleted'), $translate.instant('orderfile.PromotionDeleted'));
            $scope.GetPromotion();
        });
    };
    $scope.ChangeOrderState = function (item) {
        //$rootScope.allowNavigation(); 
        item.root = "order";
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
            event.preventDefault();
            $scope.clearCustomerDislpay();
            if (value == 'result') {
                $rootScope.allowNavigation();
                $scope.CallReason(2, 'cancel');
                $scope.ClearCallerID();
                $window.history.back();
            }
        })
    };
    $scope.ShowMap = function (item) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/showmap.html',
        });
        modalInstance.result.then(function (value) {
        })
    };
    $scope.PersonAddressEdit = function (AddressID) {
        var modalInstance = $modal.open({
            templateUrl: 'assets/views/order/orderpersonaddressedit.html',
            controller: 'orderpersonaddresseditCtrl',
            size: 'lg',
            backdrop: '',
            resolve: {
                AddressID: function () {
                    return AddressID;
                },
            }
        });
        modalInstance.result.then(function (value) {
            $scope.FormatedAddress = value;
        })
    };
    $scope.$on('$destroy', function () {
        if ($rootScope.PersonID) {
            $rootScope.PersonID = null;
        }
        if ($rootScope.OrderSourceYS == true) {
            $rootScope.OrderSourceYS = null;
            $rootScope.YemekSepetiRawOrder = null;
        }
        $scope.clearCustomerDislpay();
        tranlatelistener();
        changePersonListemer();
        ChangeSplitListener();
        LoadOrderItemsListener();
        RemoveItemListener();
        TreatListener();
        EditItemListener();
        //YSorderDetailListener();
        $element.remove();
        $rootScope.uService.ExitController("orderCtrl");
    });


    //function close_toggle() {
    //    if ($(window).width() <= 768) {
    //        $('.nav a').on('click', function () {
    //            $(".navbar-toggle").click();
    //        });
    //    }
    //    else {
    //        $('.nav a').off('click');
    //    }
    //}
    //close_toggle();

    $("#toggle").click(function (event) {
        event.preventDefault();
        if ($(this).hasClass("isDown")) {
            $(".navbar-fixed-top").animate({ "margin-top": "-62px" }, "fast");
            $("#content").animate({ "margin-top": "5px" }, "fast");
            $(this).removeClass("isDown");
        } else {
            $(".navbar-fixed-top").animate({ "margin-top": "0px" }, "fast");
            $("#content").animate({ "margin-top": "80px" }, "fast");
            $(this).addClass("isDown");
        }
        return false;
    });
};
app.controller('orderItemDiscountCtrl', orderItemDiscountCtrl);
function orderItemDiscountCtrl($rootScope, $scope, $translate, $modalInstance, $modal, ngTableParams, Order, SweetAlert, toaster, Restangular, $filter, $log, $window, $element) {
    var od = this;
    $rootScope.uService.EnterController("orderItemDiscountCtrl");
    angular.copy(Order, $scope.orders);
    $scope.ok = function (data) {
        $modalInstance.close(data);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.orders = [];
    $scope.GetOrder = function (data) {
        Restangular.one('order', $scope.order.id).get({
        }).then
            (function (result) {
                angular.copy(result, $scope.orders);
            },
                function (response) {
                    toaster.pop('error', $translate.instant('orderfile.Orderfailedtoload'), response.data.ExceptionMessage);
                });
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("orderItemDiscountCtrl");
    });
};
app.controller('orderDateCtrl', orderDateCtrl);
function orderDateCtrl($rootScope, $scope, $translate, $modalInstance, $filter, DateTime, $log, toaster, $window, ngnotifyService) {
    $rootScope.uService.EnterController("orderDateCtrl");
    $scope.DateTime = $filter('date')(ngnotifyService, 'yyyy-MM-dd HH:mm:ss');
    $scope.hstep = 1;
    $scope.mstep = 3;
    $scope.ismeridian = true;
    $scope.toggleMode = function () {
        $scope.ismeridian = !$scope.ismeridian;
    };
    $scope.today = function () {
        $scope.DateTime = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
    };
    $scope.clear = function () {
        $scope.DateTime = null;
    };
    $scope.ok = function (data) {
        var now = ngnotifyService.ServerTime();
        if (data < now) {
            toaster.pop('warning', $translate.instant('orderfile.InvalidDate'));
        } else {
            $modalInstance.close($scope.Date = $filter('date')(data, 'yyyy-MM-dd HH:mm:ss'));
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("orderDateCtrl");
    });
};
app.controller('selectPersonCtrl', selectPersonCtrl);
function selectPersonCtrl($rootScope, $scope, $translate, $modalInstance, Restangular, ngTableParams, $filter, searchname, toaster, searchphone, $log, $window) {
    $rootScope.uService.EnterController("selectPersonCtrl");
    $scope.SelectedItem = null;
    $scope.ShowDetail = false;
    $scope.searchName = (searchname) ? searchname : '';
    $scope.searchPhone = (searchphone) ? searchphone : ''
    $scope.SelectItem = function (data) {
        angular.copy(data, $scope.person);
        $scope.ok();
    };
    $scope.GetSearchString = function () {
        var SearchFilter = ($scope.searchName && $scope.searchName.length > 0) ? "name  like '%" + $scope.searchName + "%'" : "";
        if ($scope.searchPhone && $scope.searchPhone.length > 0) {
            SearchFilter = SearchFilter + ((SearchFilter.length > 0) ? " and " : "");
            SearchFilter = SearchFilter + "Number  like '%" + $scope.searchPhone + "%'"
        }
        return SearchFilter;
    }
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10
    },
        {
            counts: [],
            getData: function ($defer, params) {
                Restangular.all('person').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.GetSearchString(),
                    sort: params.orderBy()
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $scope.SelectedItem = items.length > 0 ? items[0].id : null;
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.ShowArray = function (emails, prop) {
        var result = _.pluck(emails, prop);
        return result.toString();
    }
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
                pageSize: 1000,
            }).then(function (result) {
                angular.copy(result, $scope[Container]);
                //$scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.Serverconnectionerror'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.personemails = [];
    $scope.loadEntities('personemail', 'personemails');
    $scope.personphones = [];
    $scope.loadEntities('personphone', 'personphones');
    var unbindWatchername = $scope.$watch(angular.bind($scope, function () {
        return $scope.searchName;
    }), function (value) {
        $scope.tableParams.reload();
    });
    var unbindWatcherphone = $scope.$watch(angular.bind($scope, function () {
        return $scope.searchPhone;
    }), function (value) {
        $scope.tableParams.reload();
    });
    $scope.$on('$destroy', function () {
        unbindWatcherphone();
        unbindWatchername();
    });

    $scope.ok = function () {
        $modalInstance.close($scope.person);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("selectPersonCtrl");
    });
};