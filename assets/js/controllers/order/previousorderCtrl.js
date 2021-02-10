app.controller('previousorderCtrl', previousorderCtrl);
function previousorderCtrl($rootScope, $scope, $modalInstance, $filter, $translate, storeID, personID, $log, $window, Restangular) {
    $rootScope.uService.EnterController("previousorderCtrl");
var person = personID;
    var store = storeID;
    $scope.result = [];
    Restangular.one('rop6dataprovider/getdata').get({
        StoreID: storeID,
        ObjectID: personID
    }).then(function (result) {
        $scope.orders = result.plain().join("<br>");
    }, function (response) {
        toaster.pop('error', $translate.instant('Server.Serverconnectionerror'), "Warning!");
    });
    $scope.ok = function () {
        $modalInstance.close('return');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("previousorderCtrl");
    });
};
