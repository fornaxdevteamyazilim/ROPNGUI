app.controller('clockinoutCtrl', clockinoutCtrl);
function clockinoutCtrl($rootScope, $scope, Restangular, toaster, $window, $location, $translate, userService, localStorageService, NG_SETTING, $element, $http) {
    if (!userService.getCurrentUser())
        $location.path('/login/signin');
    $scope.statusmessage = userService.getCurrentUser().ShiftActive ? $translate.instant('clockiout.Fingerreading') : $translate.instant('clockiout.Fingerentry');
    var fp = userService.getCurrentUser().isFingerPrintExist;
    $scope.statusmessage = $scope.statusmessage + (!fp ?  $translate.instant('clockiout.FINGERPRINTSFIRST') : '');
    var ac = userService.getCurrentUser().ShiftActive ? 'ClockOut' : 'ClockIn';
    $scope.data = { Action: ac, Client: localStorageService.get('ClientName') };
    $scope.ClientMessages = [];
    var idListener = $rootScope.$on('Identification', function (event, data) {
        $scope.data.FMD = data.FMD;
        $scope.processaction($scope.data);
    });
    var mcListener = $rootScope.$on('MagneticCardIdentification', function (event, data) {
        $scope.data.CardData = data.CardData;
        $scope.processCardAction($scope.data);
    });
    $scope.processaction = function (data) {
        //post data to api/clockinout/do
        data.SotreID = localStorageService.get('StoreID');
        data.Client = localStorageService.get('ClientName');
        data.NGUserID = userService.getCurrentUser().id;
        Restangular.all('clockinout/do').post(
            data
        ).then(function (result) {
            $scope.data = result;
            toaster.pop('success', "Clock In/Out", 'Request Recieved.');
            if ($scope.data.Action == 'ClockOut') {
                $location.path('/login/logout/logout');
            }
            else {
                userService.refreshUserData(false);
            }
            
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.processCardAction = function (data) {
        //post data to api/clockinout/do
        data.SotreID = localStorageService.get('StoreID');
        data.Client = localStorageService.get('ClientName');
        data.NGUserID = userService.getCurrentUser().id;
        Restangular.all('clockinout/magneticcard').post(
            data
        ).then(function (result) {
            $scope.data = result;
            toaster.pop('success', "Clock In/Out", 'Request Recieved.');
            if ($scope.data.Action == 'ClockOut') {
                $location.path('/login/logout/logout');
            }
            else {
                userService.refreshUserData(false);
            }
            
        }, function (response) {
            toaster.pop('error', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    };
    $scope.Back = function () {
        userService.refreshUserData(false);
        $location.path('/app/mainscreen');
        //$window.history.back();
    };
    $scope.gotoLogin = function () {
        $location.path('/login/logout/logout');
    }
    var DeregisterClientMessage = $scope.$on('ClientMessage', function (event, data) {
        //data.id = $scope.ClientMessages.length;
        var ClientName = localStorageService.get('ClientName');
        if (!data.StationID || ClientName == data.StationID)
            $scope.ClientMessages.push(data);
    });
    $scope.StartEnroll = function () {
        //var deferred = $q.defer();
        var cUser = userService.getCurrentUser();
        var ClientName = localStorageService.get('ClientName');
        var data = {
            NGUserID: cUser.id,
            StoreID: cUser.StoreID,
            StationID: ClientName,
            isSuccessed: false
        }
          // $http.post(NG_SETTING.apiServiceBaseUri + '/api/FingerPrint/startEnroll', data, {
        $http.post('http://192.168.9.40:9065/api/FingerPrint/startEnroll', data, {
                'Content-Type': 'application/json'
        }).success(function (response) {
            toaster.pop('success', $translate.instant('clockiout.Started'),$translate.instant('clockiout.FingerPrint') );
            //deferred.resolve(response);
        }).error(function (err, status) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            //deferred.reject(err);
        });
        //return deferred.promise;
    };

    $scope.$on('$destroy', function () {
        $element.remove();
        DeregisterClientMessage();
        idListener(); 
        mcListener();       
    });
}