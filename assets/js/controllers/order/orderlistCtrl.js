app.controller('orderlistCtrl', orderlistCtrl);
function orderlistCtrl($scope, $log, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $rootScope, $timeout, $interval, $filter, $location, $translate, userService, $element, ngnotifyService) {
    $rootScope.uService.EnterController("orderlistCtrl");
    var ao = this
    userService.userAuthorizated();
    var OrderRefreshTimeOut;
    $scope.ShowObject = true;
    $scope.OrderStateID = "OrderStateID >0";
    ao.search = '';
    $scope.item = {};
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
        $scope.searchbyordernumberpersonnameorpersonphone = $translate.instant('main.SEARCHBYORDERNUMBERPERSONNAMEORPERSONPHONE');
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
        $scope.delayed = $translate.instant('main.DELAYED');
        $scope.closedorder = $translate.instant('main.CLOSEDORDER');
        $scope.openorder = $translate.instant('main.OPENORDER');
        $scope.tableorders = $translate.instant('main.TABLEORDERS');
        $scope.takeawayorders = $translate.instant('main.TAKEAWAYORDERS');
        $scope.TAKEAWAYTXT = $translate.instant('main.TAKEAWAY');
        $scope.hdorders = $translate.instant('main.HDORDERS');
        $scope.trPaymenttype = $translate.instant('main.PAYMENTTYPE');
        $scope.trPaymentStatus = $translate.instant('main.PAYMENTSTATUS');
        $scope.trAddress = $translate.instant('main.ADDRESS');
        $scope.trDriverName = $translate.instant('main.DRIVERNAME');
        $scope.trPromotion = $translate.instant('main.PROMOTION');
        $scope.hnrorders = $translate.instant('main.HNRORDERS');
        $scope.stafforders = $translate.instant('main.STAFFORDERS');
        $scope.orderdetails = $translate.instant('main.ORDERDETAILS');
        $scope.trOrderSource = $translate.instant('main.ORDERSOURCE');
        $scope.trOrderHour = $translate.instant('main.ORDERHOUR');
        $scope.trisCharged = $translate.instant('main.ISCHARGED');
        $scope.open = $translate.instant('main.OPEN');
        $scope.close = $translate.instant('main.CLOSE');
        $scope.pickuporders = $translate.instant('main.PICKUPORDERS');
        $scope.mallorders = $translate.instant('main.MALLORDERS');
        $scope.trEfatura = $translate.instant('main.EFATURA');
        $scope.notaccepted = $translate.instant('main.NOTACCEPTED');
          $scope.tableorders = $translate.instant('main.TABLEORDERS');


    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectItem = function (item) {
        $location.path('app/orders/orderDetail/' + item.id);
    };
    $scope.ShowOerderItems = function (order) {
        for (var i = 0; i < order.length; i++) {
            if (order[i]) {
                var value = [];
                for (var j = 0; j < order[i].items.length; j++) {
                    value.push(order[i].items[j].Product)
                    for (var k = 0; k < order[i].items[j].items.length; k++) {
                        value.push(order[i].items[j].items[k].Product);
                    }
                }
                order[i]["OrderProducts"] = value;

                order[i].OrderDateTXT = $filter('date')(order[i].OrderDate, 'HH:mm dd.MM.yyyy');
            }
        }
        return order;
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (ao.search && ao.search.length > 1) {
            $scope.hideCombo = true;
            result.push("ExtendedSearch=" + ao.search);
            return result;
        } else {
            if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CMRESTORANHATTI") && !userService.userIsInRole("Admin") && !userService.userIsInRole("CCMANAGER") && !userService.userIsInRole("PHAdmin")) {
                result.push("StoreID='" + $rootScope.user.StoreID + "'");
                result.push("tt.OperationDate ='" + $rootScope.user.Store.OperationDate + "'");
                result.push("OrderDate >'" + $rootScope.user.Store.OperationDate + "'");
                result.push($scope.OrderStateID);
                return result;
            } else {
                $scope.OrderDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd');
                //result.push("OrderDate >'" + $scope.OrderDate + "'");
                if ($rootScope.user.Store)
                    result.push("tt.OperationDate ='" + $rootScope.user.Store.OperationDate + "'");
                result.push($scope.OrderStateID);
                return result;
            }
        }
    };
    ao.tableParams = new ngTableParams({
        page: 1,
        //count: 300,
        count: 10,
        sorting: {
            OrderDate: 'descending'
        }
    }, {
        getData: function ($defer, params) {
            if (!$rootScope.user.Store || $rootScope.user.Store.OperationDate) {
                $scope.ShowObject = true;
                Restangular.all('order').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    search: $scope.BuildSearchString(),
                    sort: params.orderBy()
                }).then(function (items) {
                    var order = $scope.ShowOerderItems(items);
                    params.total(order.paging.totalRecordCount);
                    $defer.resolve(order);
                    $scope.$broadcast('$$rebind::refresh');
                    $scope.ShowObject = false;
                }, function (response) {
                    toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                    $scope.ShowObject = false;
                });
            }
        }
    });
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!Container.length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                Container = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.ordertypes = [];
    $scope.loadEntities('enums/ordertype', 'ordertypes');
    $scope.changeOrderState = function (StateID) {
        if (StateID == "PaymentStatusID=0") {
            $scope.OrderStateID = "((OrderStateID not in (0,7,8,9,10)) or (PaymentStatusID=0 and OrderStateID=10) or (OrderStateID=10 and OrderTypeID=2 and OrderTypeID=7 and isCharged=0))"
        }
        if (StateID == "PaymentStatusID=1") {
            $scope.OrderStateID = "((PaymentStatusID=1 and OrderStateID=10) or (OrderStateID=10 and PaymentStatusID=1 and OrderTypeID=2 and OrderTypeID=7 and isCharged=0))"
        }
        if (StateID != "PaymentStatusID=0" && StateID != "PaymentStatusID=1") {
            $scope.OrderStateID = StateID;
        }
        ao.tableParams.reload();
    };
    var unbindWatcher = $scope.$watch(angular.bind(ao, function () {
        return ao.search;
    }), function (value) {
        ao.tableParams.reload();
    });

    $scope.Back = function () {
        $window.history.back();
    };
    //var OrderRefresh = $scope.$on('OrderChange', function (event, data) {
    //    //if ($scope.AutoRefresh) bu da bir checkbox veya switch e bağlanır.
    //    ao.tableParams.page(1); //bunlar emniyet
    //    ao.tableParams.count(10); //bunlar emniyet...
    //    ao.tableParams.reload();
    //});
    $scope.$on('$destroy', function () {
        tranlatelistener();
        unbindWatcher();
        //OrderRefresh();
        $element.remove();
        $rootScope.uService.ExitController("orderlistCtrl");
    });
};