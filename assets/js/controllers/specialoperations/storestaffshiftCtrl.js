app.controller('storestaffshiftCtrl', storestaffshiftCtrl);
function storestaffshiftCtrl($rootScope, $scope, Restangular, ngTableParams, toaster, $translate, $element, $modal, $filter, userService, SweetAlert) {
    $rootScope.uService.EnterController("storestaffshiftCtrl");
    var sss = this;
    userService.userAuthorizated();
    $scope.translate = function () {
        $scope.trShiftDate = $translate.instant('main.DATE');
        $scope.trStore = $translate.instant('main.STORE');
        $scope.trCommands = $translate.instant('main.COMMANDS');
    };
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.SelectItem = function (id) {
        $scope.SelectedItem = id;
        location.href = '#/app/specialoperations/storestaffshiftedit/' + $scope.SelectedItem;
    };
    $scope.BuildSearchString = function (src) {
        var result = [];
        if (userService.userIsInRole("STOREMANAGER")) {
            result.push("StoreID =" + $rootScope.user.StoreID);
        }
        return result;
    };
    sss.tableParams = new ngTableParams({
        page: 1,
        count: 10,
    },
        {
            getData: function ($defer, params) {
                Restangular.all('storestaffshift').getList({
                    pageNo: params.page(),
                    pageSize: params.count(),
                    sort: params.orderBy(),
                    search: $scope.BuildSearchString(),
                }).then(function (items) {
                    params.total(items.paging.totalRecordCount);
                    $defer.resolve(items);
                }, function (response) {
                    toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
                });
            }
        });
    $scope.NewStoreStaffShift = function () {
        var item = {};
        item.StoreID = $rootScope.user.StoreID;
        item.ShiftDate = new Date();
        Restangular.restangularizeElement('', item, 'storestaffshift')
        item.post().then(function (resp) {
            location.href = '#/app/specialoperations/storestaffshiftedit/' + resp.id;
        }); 
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("storestaffshiftCtrl");
    });
};
