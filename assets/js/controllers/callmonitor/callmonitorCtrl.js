app.controller('callmonitorCtrl', callmonitorCtrl);
function callmonitorCtrl($rootScope, $scope, $log, $filter, $modal, Restangular, ngTableParams, SweetAlert, toaster, $window, $location, $translate, $timeout, callsService, $element, ngnotifyService) {
    $rootScope.uService.EnterController("callmonitorCtrl");
    var cm = this;
    var stopTime;
    $scope.call = {};
    $scope.SelectedItem = null;
    cm.search = '';
    $scope.translate = function () {
        $scope.trUCID = $translate.instant('main.UCID');
        $scope.trExtension = $translate.instant('main.EXTENSION');
        $scope.trCallerID = $translate.instant('main.CALLERID');
        $scope.trStatus = $translate.instant('main.STATUS');
        $scope.trAddedAt = $translate.instant('main.ADDEDAT');
        $scope.trGetDateSecond = $translate.instant('main.GETDATESECOND');
    };
    $scope.translate();
    callsService.UpdateCalls();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    var deregistration1 = $scope.$on('pbxCallChange', function (event, data) {
        if (data && data.Status) {
            $scope.call = callsService.GetCalls();
        }        
    });
    var deregistration2 = $scope.$on('pbxCallUpdate', function (event, data) {
        if (data && data.Status) {
            $scope.call = angular.copy(data);
        }
    });
    $scope.GetDateScond = function (date) {
        var date1 = moment(date)
        var date2 = moment(ngnotifyService.ServerTime());
        $scope.Date = parseInt((moment.duration(date2.diff(date1)).asSeconds()))
        return $scope.Date;
    };
    $scope.stop = function () {
        $timeout.cancel(stopTime);
    };
    $scope.$on('$destroy', function () {
        deregistration();
        deregistration1();
        deregistration2();
        $element.remove();
        $rootScope.uService.ExitController("callmonitorCtrl");
    });
};
