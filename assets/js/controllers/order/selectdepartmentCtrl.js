app.controller('selectdepartmentCtrl', selectdepartmentCtrl);
function selectdepartmentCtrl($scope, $modal, $modalInstance, Restangular, $translate,toaster, $window, $rootScope) {
    $rootScope.uService.EnterController("selectdepartmentCtrl");
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length || $scope[Container].length == 0) {
            Restangular.all(EntityType).getList().then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.departments = [];
    $scope.loadEntities('department', 'departments');
    $scope.saveData = function (data) {
        $rootScope.DepartmentID = data;
        $scope.ok();
    };
    $scope.ok = function () {
        if (!$rootScope.DepartmentID || $rootScope.DepartmentID == undefined) {
            $modalInstance.dismiss('cancel');
        } else {
            $modalInstance.close($rootScope.DepartmentID);
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("selectdepartmentCtrl");
    });
};
