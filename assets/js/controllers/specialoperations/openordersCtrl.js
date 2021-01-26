app.controller('openordersCtrl', openordersCtrl);
function openordersCtrl($rootScope, $scope, $log, $modal, Restangular, $filter, SweetAlert, ngTableParams, toaster, $window, $location, $translate, ngnotifyService, $element) {
    $rootScope.uService.EnterController("openordersCtrl");
    $scope.ShowObject = true;
    $scope.Person = {};
    $scope.SelectItem = function (itemID) {
        $location.path('app/orders/orderDetail/' + itemID);
    };
    $scope.SaveOpenOrders = function (data, PersonID) {
        $scope.payment = {};
        if (!data.PaymentTypeID) {
            $scope.payment.PaymentTypeID = 108009994516;
            $scope.payment.Amount = data.Amount;
            $scope.payment.OrderID = data.id;
            $scope.payment.OrderPersonID = data.persons[0].id;
            $scope.payment.PaymentDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
        }
        else {
            $scope.payment.Amount = data.Amount;
            $scope.payment.OrderID = data.id;
            $scope.payment.OrderStateID = 10;
            $scope.payment.OrderPersonID = data.persons[0].id;
            $scope.payment.PaymentDate = $filter('date')(ngnotifyService.ServerTime(), 'yyyy-MM-dd HH:mm:ss');
            $scope.payment.PaymentTypeID = data.PaymentTypeID;
        }
        Restangular.restangularizeElement('', $scope.payment, 'orderpayment');
        $scope.payment.post().then(function (resp) {
            $scope.loadOrders();
            toaster.pop('success', $translate.instant('orderfile.BillOff'), 'success!');
        }, function (response) {
            toaster.pop('error',$translate.instant('orderfile.MistakeFailedCloseBill'), "error");
        });
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        result.push("PaymentStatusID = 0 ");
        result.push("StoreID='" + $scope.StoreID + "'");
        result.push("OrderStateID in (1, 2, 3, 4, 5, 6, ,10, 11, 12, 13, 14, 15, 16, 19, 20)");
        return result;
    };
    $scope.orders = [];
    $scope.loadOrders = function () {
        $scope.ShowObject = true;
        Restangular.all('order').getList({
            pageNo: 1,
            pageSize: 1000,
            search: $scope.BuildSearchString()
        }).then(function (result) {
            $scope.ShowObject = false;
            angular.copy(result, $scope.orders);
        }, function (response) {
            $scope.ShowObject = false;
            toaster.pop('Warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.selectStore = function (StoreID) {
        if (StoreID) {
            $scope.StoreID = StoreID;
            $scope.loadOrders();
        }
    };
    $scope.GetDepartments = function () {
        Restangular.all('department').getList({
            pageNo: 1,
            pageSize: 1000,
        }).then(function (result) {
            $scope.Departments = result;
        }, function (response) {
            return null;
        });
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning', $translate.instant('Server.ServerError'), response);
            });
        }
    };
    $scope.stores = [];
    $scope.loadEntitiesCache('cache/store', 'stores');
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("openordersCtrl");
    });
};