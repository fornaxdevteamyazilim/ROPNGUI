app.controller('accountbalancereportdeteailCtrl', accountbalancereportdeteailCtrl);
function accountbalancereportdeteailCtrl($scope, $modalInstance, item, $filter, Restangular, ngTableParams, toaster, $window, $translate, $rootScope) {
        $rootScope.uService.EnterController("accountbalancereportdeteailCtrl");
    $scope.person = item;
    $scope.tableParams = new ngTableParams({
        page: 1,
        count: 1000
    },
   {
       getData: function ($defer, params) {
           $scope.isWaiting = true;
           Restangular.all('accounttransaction').getList({
               pageNo: params.page(),
               pageSize: params.count(),
               sort: params.orderBy(),
               search: "ParentID='" +  item.id + "'"
           }).then(function (items) {
               $scope.isWaiting = false;
               params.total(items.paging.totalRecordCount);
               $defer.resolve(items);
           }, function (response) {
               $scope.isWaiting = false;
               toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
           });
       }
   });
    $scope.ok = function () {
        $modalInstance.close('Yes');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('No');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("accountbalancereportdeteailCtrl");
    });
};