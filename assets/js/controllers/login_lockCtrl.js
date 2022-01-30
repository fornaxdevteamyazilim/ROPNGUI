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
function login_lockCtrl($rootScope, $scope, toaster, Restangular, $window, $location, $translate, userService, $element,authService,$timeout) {
    $rootScope.uService.EnterController("login_lockCtrl");
    $scope.message = '';
    var stopTime;  
    var idListener = $rootScope.$on('Identification', function (event,data) {
        userService.fmdLogin(data.FMD).then(function (response) {
            userService.stopTimeout();
            if (response) {
                $rootScope.allowNavigation();
                //$window.history.back();
                $location.path('/app/mainscreen');
            }
        }, function (err) {
            if (err && err.error == 'invalid_grant') {
                $scope.translate = function () {
                    $scope.message = $translate.instant('main.PASSWORDERROR');
                    return 'No'
                };
            }
            else {
                $scope.message = (err && err.error)?err.error:"Unknown error";
                return 'No'
            }
        });
    });
    var mcListener = $rootScope.$on('MSRIdentification', function (event,data) {
        userService.mcardLogin(data.CardData).then(function (response) {
            userService.stopTimeout();
            if (response) {
                $rootScope.allowNavigation();
                //$window.history.back();
                $location.path('/app/mainscreen');
            }
        }, function (err) {
            if (err && err.error == 'invalid_grant') {
                $scope.translate = function () {
                    $scope.message = $translate.instant('main.PASSWORDERROR');
                    return 'No'
                };
            }
            else {
                $scope.message = (err && err.error)?err.error:"Unknown error";
                return 'No'
            }
        });
    });
    stopTime = $timeout(function ()
            {
                $rootScope.preventNavigation();                
            }, 2000);
    $scope.InpuntKey = function (password) {
        if (password) {
            userService.cardLogin(password).then(function (response) {
                userService.stopTimeout();
                if (response) {
                    $rootScope.allowNavigation();
                    //$window.history.back();
                    $location.path('/app/mainscreen');                    
                }
            }, function (err) {
                if (err && err.error == 'invalid_grant') {
                    $scope.message = $translate.instant('main.PASSWORDERROR');
                        return 'No'
                    
                }
                else {
                    //toaster
                    $scope.message = (err && err.error)?err.error:"Unknown error";                
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
        mcListener();
        $timeout.cancel(stopTime);
        $rootScope.uService.ExitController("login_lockCtrl");
    });
};