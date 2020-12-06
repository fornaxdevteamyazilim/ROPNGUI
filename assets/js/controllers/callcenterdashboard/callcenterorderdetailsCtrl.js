app.controller('callcenterorderdetailsCtrl', callcenterorderdetailsCtrl);
function callcenterorderdetailsCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("callcenterorderdetailsCtrl");
    var or = this;
    $scope.translate = function () {
        $scope.trOrderNumber = $translate.instant('main.ORDERNUMBER');
        $scope.trPersonName = $translate.instant('main.PERSONNAME');
        $scope.trOrderState = $translate.instant('main.ORDERSTATE');
        $scope.trOrderDate = $translate.instant('main.ORDERDATE');
        $scope.trDeliveryDate = $translate.instant('main.DELIVERYDATE');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    if ($stateParams.id != 'new') {
        $scope.item = {};
        or.tableParams = new ngTableParams({
            page: 1,
            count: 10,
            sorting: {
                OrderDate: 'descending'
            }
        },
         {
             getData: function ($defer, params) {
                 Restangular.all('order').getList({
                     pageNo: params.page(),
                     pageSize: params.count(),
                     search: "OrderStateID in (1,2,3,4,5,6,13) and StoreID='" + $stateParams.id + "'",
                     sort: params.orderBy()
                 }).then(function (items) {
                     params.total(items.paging.totalRecordCount);
                     $defer.resolve(items);
                 }, function (response) {
                     toaster.pop('error', $translate.instant('Server.ServerError'), response);
                     SweetAlert.swal($translate.instant('Server.ServerError'), angular.toJson(response.data.ExceptionMessage, false), "error");
                 });
             }
         });
    };
    $scope.Back = function () {
        $window.history.back();
    };
    $scope.OrderDetails = function (id) {
        location.href = '#/app/orders/orderDetail/' + id;
    }
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("callcenterorderdetailsCtrl");
    });
};
