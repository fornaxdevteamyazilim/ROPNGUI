app.controller('marketingpermissionCtrl', marketingpermissionCtrl);
function marketingpermissionCtrl($rootScope, $scope, $modalInstance, order, Restangular, toaster, $window, $translate, $filter) {
    $rootScope.uService.EnterController("marketingpermissionCtrl");
    $scope.translate = function () {
        $scope.donotforgettoaskmarkettingquestion = $translate.instant('main.DONOTFORGETTOASKMARKETTINGQUESTION');
        $scope.ok = $translate.instant('main.OK');
    };
    $scope.translate();
    Restangular.all('MarketingPermission').getList({
        pageNo: 1,
        pageSize: 10,
        search: "PersonID='" + order.persons[0].PersonID + "'"
    }).then(function (result) {
        $scope.MPSMS = {};
        $scope.MPEMAIL = {};
        for (var i = 0; i < result.length; i++) {
            if (result[i].MarketingPermissionType == 0)
                $scope.MPSMS = result[i];
            if (result[i].MarketingPermissionType == 1)
                $scope.MPEMAIL = result[i];
        }
    });
    $scope.SaveMarketingPermission = function (Data, Type, Value) {
        var data = Data;
        data.MarketingPermissionType = Type;
        data.Approved = Value;
        Restangular.restangularizeElement('', data, 'MarketingPermission');
        if (data.restangularized && data.id) {
            data.put().then(function (resp) {
                $scope.succesMarPer = true;
                toaster.pop('success', $translate.instant('orderfile.Updated'),$translate.instant('orderfile.Updated'));
            });
        }
        else {
            data.PersonID = order.persons[0].PersonID;
            data.post().then(function (resp) {
                $scope.succesMarPer = true;
                toaster.pop('success', $translate.instant('orderfile.Saved'), $translate.instant('orderfile.Saved'));
            });
        }
    };
    $scope.ok = function () {
        $modalInstance.close($scope.succesMarPer);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("marketingpermissionCtrl");
    });
};
