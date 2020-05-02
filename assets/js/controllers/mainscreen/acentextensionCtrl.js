﻿'use strict';
app.controller('acentextensionCtrl', acentextensionCtrl);
function acentextensionCtrl($scope, $modalInstance, $log, $rootScope, toaster, Restangular, $window, $location, callsService, localStorageService, userService) {
    $rootScope.uService.EnterController("acentextensionCtrl");
    if (!userService.userIsInRole("CALLCENTER") && !userService.userIsInRole("CCMANAGER") && !userService.userIsInRole("Alonet"))
        $scope.ShowClientName = true;
    $scope.ok = function (data) {
        if (data) {
            $rootScope.user.UserExtensionNumber = data.number;
            $rootScope.user.ClientName = data.clientname;
            callsService.SetClientCallerID(data.number);
            if (data.clientname)
            callsService.SetClientName(data.clientname);
            $modalInstance.close();
        }
    };
    $scope.cancel = function (data) {
        callsService.currentExtension = localStorageService.get('ExtensionNumber');
        var ClientName = localStorageService.get('ClientName');
        if (!callsService.currentExtension || !ClientName) {
            $modalInstance.dismiss('cancel');
            userService.userAuthorizated();
        }
        $modalInstance.dismiss('cancel');
    };
    $scope.$on('$destroy', function () {
        $rootScope.uService.ExitController("acentextensionCtrl");
    }); 
};