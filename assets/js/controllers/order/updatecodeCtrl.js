app.controller('updatecodeCtrl', updatecodeCtrl);
function updatecodeCtrl($rootScope, $scope, $modalInstance, $translate, Restangular, toaster, $window) {
    $rootScope.uService.EnterController("updatecodeCtrl");
    $scope.SaveData = function (data) {
        Restangular.all('tools/freepdscode').getList(
     {
         Code: $scope.CodeText
     }
 ).then(function (result) {
     $scope.ok();
     toaster.pop('success', $translate.instant('orderfile.StatusOrderChanged'), 'Success');
 }, function (response) {
     toaster.pop('error', $translate.instant('Server.ServerError'), response);
 });
    };
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("updatecodeCtrl");
    });
};