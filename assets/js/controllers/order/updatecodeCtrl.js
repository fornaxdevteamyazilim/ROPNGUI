app.controller('updatecodeCtrl', updatecodeCtrl);
function updatecodeCtrl($rootScope, $scope, $modalInstance, Restangular, toaster, $window, $translate) {
    $rootScope.uService.EnterController("updatecodeCtrl");
    $scope.SaveData = function (data) {
        Restangular.all('tools/freepdscode').getList(
     {
         Code: $scope.CodeText
     }
 ).then(function (result) {
     $scope.ok();
     toaster.pop('success', "Status Order Changed!!", 'Success');
 }, function (response) {
     toaster.pop('error', "Server Error", response);
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