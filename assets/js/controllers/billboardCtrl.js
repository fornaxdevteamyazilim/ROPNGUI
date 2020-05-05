app.controller('billboardCtrl', billboardCtrl);
function billboardCtrl($rootScope, $scope, Restangular, toaster, $element) {
    $rootScope.uService.EnterController("billboardCtrl");
    $scope.items = [];
    $scope.GetLayout = function () {
        Restangular.all('billboarditem').getList({}
    ).then(function (result) {
        $scope.items = result;
    }, function (response) {
        toaster.pop('error', "Sunucu hatası", response);
    });
    };
    $scope.GetLayout();
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("billboardCtrl");
    });
};