app.controller('complaintMailCtrl', complaintMailCtrl);
function complaintMailCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("complaintMailCtrl");
    var comp = this;
    $scope.item = {};
    comp.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
        }
    },
 {
     getData: function ($defer, params) {
         Restangular.all('complaint').getList({
             pageNo: params.page(),
             pageSize: params.count(),
             sort: params.orderBy(),
         }).then(function (items) {
             params.total(items.paging.totalRecordCount);
             $defer.resolve(items);
         }, function (response) {
             toaster.pop('warning',$translate.instant('Server.ServerError'), response.response.data.ExceptionMessage);
         });
     }
 });
    $scope.$on('$destroy', function () {
        $element.remove();
        $rootScope.uService.ExitController("complaintactionsCtrl");
    });
};
