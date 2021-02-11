app.controller('changeorderstate2Ctrl', changeorderstate2Ctrl);
function changeorderstate2Ctrl($rootScope, $scope, $translate, $modalInstance, item, Restangular, toaster, $window) {
    $rootScope.uService.EnterController("changeorderstate2Ctrl");
    $scope.OrderNo = item.id;
    $scope.OrderNumber = item.OrderNumber;
    $scope.SaveData = function (data) {
             Restangular.all('ordertools/updateorderstatus').getList(
          {
              OrderID: item.id,
              newSatus: data.OrderStateID,
          }
      ).then(function (result) {
          $scope.UpdateOrderStatusresult = result;
          $scope.ok();
          toaster.pop('success', $translate.instant('orderfile.StatusOrderChanged'), 'Success');
      }, function (response) {
          toaster.pop('error', $translate.instant('Server.ServerError'), response);
      });
    };
    $scope.ShowObject = function (Container, idName, idvalue, resName) {
        for (var i = 0; i < $scope[Container].length; i++) {
            if ($scope[Container][i][idName] == idvalue)
                return $scope[Container][i][resName];
        }
        return idvalue || 'Not set';
    };
    $scope.loadEntities = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({
                pageNo: 1,
                pageSize: 1000,
            }).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.states = [];
    $scope.loadEntities('enums/orderstate', 'states');
    $scope.ok = function () {
        $modalInstance.close('result');
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("changeorderstate2Ctrl");
    });
};
