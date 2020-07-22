app.controller('yemeksepetistatsCtrl', yemeksepetistatsCtrl);
function yemeksepetistatsCtrl($rootScope, $scope, $log, $modal, $interval, Restangular, ngTableParams, $timeout, SweetAlert, toaster, $window, $location, $translate, $element, userService) {
    $rootScope.uService.EnterController("yemeksepetistatsCtrl");
    userService.userAuthorizated()
    $scope.YemekSepetiStats = {};
    var YSStatsRefresh = $scope.$on('YSStatUpdate', function (event, data) {
        $scope.YemekSepetiStats = data;
    });
    $scope.GetYemekSepetiStats = function (data) {
        Restangular.one('yemeksepeti/statistics').get().then(function (restresult) {
            $scope.YemekSepetiStats = restresult;
        },
            function (restresult) {
                toaster.pop('warning', "Update failed", 'Unable to load YemekSepeti statisticsi');
                //swal("Error!", "Data Error!", "Warning");
            });
    };
    $scope.GoToOrders = function () {
        $location.path('/app/orderdisplay/ysordersdisplay');
    };
    $scope.GetYemekSepetiStats();
    //var interval = $interval(function () {
    //    $scope.GetYemekSepetiStats();
    //}, 30000);
    $scope.$on('$destroy', function () {
        YSStatsRefresh();
        //$timeout.cancel(interval);
        $element.remove();
        $rootScope.uService.ExitController("yemeksepetistatsCtrl");
    });
};
