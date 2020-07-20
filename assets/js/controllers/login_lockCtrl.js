app.directive('autoFocus', function ($timeout) {
    return {
        restrict: 'AC',
        link: function (_scope, _element) {
            $timeout(function () {
                _element[0].focus();
            }, 0);
        }
    };
});
app.controller('login_lockCtrl', login_lockCtrl);
function login_lockCtrl($rootScope, $scope, toaster, Restangular, $window, $location, $translate, userService, $element,authService) {
    $rootScope.uService.EnterController("login_lockCtrl");
    $scope.message = '';
    //authService.logOut(); 
    //$rootScope.preventNavigation();
    //userService.userAuthorizated();
    var idListener = $rootScope.$on('Identification', function (event,data) {
        //var uiFMD = encodeURIComponent(data.FMD);
        userService.fmdLogin(data.FMD).then(function (response) {
            userService.stopTimeout();
            if (response) {
                //$rootScope.allowNavigation();
                $location.path('/app/mainscreen');
            }
        }, function (err) {
            if (err && err.error == 'invalid_grant') {
                $scope.translate = function () {
                    $scope.message = $translate.instant('main.PASSWORDERROR');
                    return 'No'
                };
                $scope.translate();
                var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
                    $scope.translate();
                });
            }
            else {
                //toaster
                $scope.message = "Unknown error";
                return 'No'
            }
        });
    });
    $scope.InpuntKey = function (password) {
        if (password) {
            userService.cardLogin(password).then(function (response) {
                userService.stopTimeout();
                if (response) {
                    //$rootScope.allowNavigation();
                    $location.path('/app/mainscreen');                    
                }
            }, function (err) {
                if (err && err.error == 'invalid_grant') {
                    $scope.translate = function () {
                        $scope.message = $translate.instant('main.PASSWORDERROR');
                        return 'No'
                    };
                    $scope.translate();
                    var deregistration = $scope.$on('$translateChangeSuccess', function (event, data) {// ON LANGUAGE CHANGED
                        $scope.translate();
                    });
                }
                else {
                    //toaster
                    $scope.message = "Unknown error";
                    return 'No'
                }
            });

        }
    };
    $scope.FormKeyPress = function (event) {
        if (event.keyCode === 8) {
            $scope.message = '';
        }
    };
    $scope.$on('$destroy', function () {
        $element.remove();
        idListener();
        $rootScope.uService.ExitController("login_lockCtrl");
    });
};