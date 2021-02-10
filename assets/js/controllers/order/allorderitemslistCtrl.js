(function () {
    'use strict';
    app.controller('allorderitemslistCtrl', allorderitemslistCtrl);
    function allorderitemslistCtrl($scope, $log, $modal, $filter, $translate, Restangular, ngTableParams, toaster,$window, $stateParams, $rootScope) {
        var aoil = this;
        $scope.item = {};
      //  $scope.OrderID = $stateParams.id;
        $scope.SelectedItem = null;
        $scope.GetParentItemID = function () {
            return $scope.$parent.$parent.item.id;
        }
    $scope.SelectItem = function (id) {
        $scope.OrderID = id;
    }
      
        aoil.tableParams = new ngTableParams({
            page: 1,
            count: 10,
        },
        {
            counts:[],
            getData: function ($defer, params) {
                Restangular.all('orderitem').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: "OrderID='" + $scope.GetParentItemID() + "'"
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response);
                });
            }
        });
    };
})();