'use strict';
app.controller('fingerprintenrollCtrl', fingerprintenrollCtrl);
function fingerprintenrollCtrl($scope, $log, $modal, $filter, SweetAlert, Restangular, $interval, ngTableParams, toaster, $window, $stateParams, $rootScope, $location, $translate, $timeout, NG_SETTING, ngnotifyService, $element, userService, localStorageService, $http) {
    userService.userAuthorizated();
    $scope.ClientMessages = [];
    $scope.UserList = [];
    $scope.UserID = {};
    //var serviceBase = NG_SETTING.apiServiceBaseUri;
    $scope.translate = function () {
        $scope.trTODAYINCOME = $translate.instant('main.TODAYINCOME');
    };
    $scope.translate();
    var tranlatelistener = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
        $scope.translate();
    });
    var DeregisterClientMessage = $scope.$on('ClientMessage', function (event, data) {
        //data.id = $scope.ClientMessages.length;
        var ClientName = localStorageService.get('ClientName');
        if (!data.StationID || ClientName == data.StationID)
            $scope.ClientMessages.push(data);
    });
    $scope.FillStoreUsers = function () {
        Restangular.all('user').getList({
            pageNo: 1,
            pageSize: 1000,
            search: [("StoreID='" + userService.getCurrentUser().StoreID + "'")]
        }).then(function (items) {
            $scope.UserList=items;
            //$defer.resolve(items);
        }, function (response) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
        });
    }
    $scope.FillStoreUsers();
    $scope.StartEnroll = function () {
        //var deferred = $q.defer();
        var cUser = userService.getCurrentUser();
        var ClientName = localStorageService.get('ClientName');
        var data = {
            NGUserID: $scope.UserID ,//cUser.id,
            StoreID: cUser.StoreID,
            StationID: ClientName,
            isSuccessed:false
        }
        $http.post(NG_SETTING.apiServiceBaseUri + '/api/FingerPrint/startEnroll', data, {
            'Content-Type': 'application/json'
        }).success(function (response) {
            toaster.pop('success',$translate.instant('clockiout.Started'), $translate.instant('clockiout.FingerPrint'));
            //deferred.resolve(response);
        }).error(function (err, status) {
            toaster.pop('warning', $translate.instant('Server.ServerError'), response.data.ExceptionMessage);
            //deferred.reject(err);
        });
        //return deferred.promise;
    };
    $scope.Back = function () {
        $window.history.back();
    };

    $scope.$on('$destroy', function () {
        tranlatelistener();
        DeregisterClientMessage();
        $element.remove();
    });
};
