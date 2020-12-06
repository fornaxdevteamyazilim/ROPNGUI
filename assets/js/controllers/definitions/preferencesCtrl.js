app.controller('preferencesCtrl', preferencesCtrl);
function preferencesCtrl($rootScope, $scope, $log, $modal, $filter, SweetAlert, Restangular, ngTableParams, toaster, $window, $stateParams, $location, $translate, $element) {
    $rootScope.uService.EnterController("preferencesCtrl");
    $scope.translate = function () {
        $scope.trPeriodName = $translate.instant('main.MEMBER');
        $scope.trInitialCount = $translate.instant('main.STORE');
        $scope.trFinalCount = $translate.instant('main.USER');
        $scope.trFinalCount = $translate.instant('main.USERUSERROLE');
    }
    $scope.translate();
    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    $scope.item = {};
    $scope.GetPreferencesList = [];
    $scope.GetPreference = function (data) { //function içerisine value yazılacak
        Restangular.one('preferences', data).get().then(function (result) {
            $scope.GetPreferencesList = result;
        }, function (response) {
            toaster.pop('error',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.saveData = function (data) {
        Restangular.restangularizeElement('', data, 'preferences')
        data.post().then(function (res) {
            toaster.pop('success', $translate.instant('difinitions.SuccessfullySaved'));
        }, function (response) {
            toaster.pop('error',$translate.instant('difinitions.CannotSave '), response);
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
                toaster.pop('warning',$translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            });
        }
    };
    $scope.loadEntitiesCache = function (EntityType, Container) {
        if (!$scope[Container].length) {
            Restangular.all(EntityType).getList({}).then(function (result) {
                $scope[Container] = result;
            }, function (response) {
                toaster.pop('Warning',$translate.instant('Server.ServerError'), response);
            });
        }
    };    
    $scope.preferencetypes = [];
    $scope.loadEntities('enums/preferencetype', 'preferencetypes');
    $scope.preference = [];
    $scope.loadEntities('preference', 'preference');
    $scope.GetCombobox = function (data) {
        if (data == 'store') {
            $scope.Show = false;
            $scope.stores = [];
            $scope.loadEntitiesCache('cache/store', 'stores');
        }
        if (data == 'member') {
            $scope.Show = false;
            $scope.stores = [];
            $scope.loadEntities('member', 'stores');
        }
        if (data == 'user') {
            $scope.Show = false;
            $scope.stores = [];
            $scope.loadEntities('user', 'stores');
        }
        if (data == 'nguserrole') {
            $scope.Show = true;
            $scope.stores = [];
            $scope.loadEntities('nguserrole', 'stores');
        }
    };
    $scope.$on('$destroy', function () {
        deregistration();
        $element.remove();
        $rootScope.uService.ExitController("preferencesCtrl");
    });
};